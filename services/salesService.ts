import { Knex } from "knex";

export class SalesService {
  constructor(private knex: Knex) {}

  async finalConfirmQtnAvailabilityBeforeDeal(pid: number) {
    try {
      return await this.knex
        .select("stock_qtn")
        .from("products")
        .where("id", pid);
    } catch (error) {
      console.error("Error performing quantity checking: ", error);
    }
  }

  async insertSales(
    pid: number,
    accountId: number,
    current_price: number,
    recipient: string,
    contact_no: string,
    shipping_address: string,
    payment_method: string
  ) {
    const trx = await this.knex.transaction();

    try {
      const newSalesData = {
        product_id: pid,
        user_id: accountId,
        selling_price: current_price,
        recipient: recipient,
        contact_no: contact_no,
        shipping_address: shipping_address,
        payment_method: payment_method,
        order_status: "shipment_arranging",
      };

      let newSales = await trx
        .insert(newSalesData)
        .into("sales")
        .returning("id");

      let inventoryDecrement = await trx("products")
        .decrement("stock_qtn", 1)
        .where("id", pid);
      console.log("Sales Credited: ", inventoryDecrement);

      // await trx("products")
      //   .update({ stock_qtn: this.knex.raw("?? - 1", ["stock_qtn"]) })
      //   .where("id", pid);

      await trx.commit();

      return {
        message: `Sales Order No.: ${newSales[0].id} is created for your reference.`,
      };
    } catch (error) {
      await trx.rollback();
      console.error("Error performing transaction: ", error);
    }
  }

  async getSalesRecord(userId: Number) {
    try {
      return await this.knex
        .select(
          "sales.id",
          "products.id as pid",
          "brand",
          "model_name",
          "model_no",
          "selling_price",
          "sales.created_at",
          "order_status"
        )
        .from("sales")
        .innerJoin("products", "sales.product_id", "products.id")
        .where("sales.user_id", userId)
        .orderBy("sales.created_at");
    } catch (error) {
      console.error("Error fetching sales record: ", error);
    }
  }

  async selectAllSales() {
    return await this.knex
      .select(
        "sales.id AS sid",
        "users.id AS uid",
        "username",
        "products.id AS pid",
        "brand",
        "model_name",
        "model_no",
        "selling_price",
        "sales.created_at",
        "order_status",
        "sales.updated_at"
      )
      .from("sales")
      .innerJoin("products", "sales.product_id", "products.id")
      .innerJoin("users", "sales.user_id", "users.id");
  }

  async patchDeliveryStatus(salesOrderChecked: number[], currentTime: string) {
    try {
      return await this.knex("sales")
        .update({ order_status: "delivered", updated_at: currentTime })
        .whereIn("id", salesOrderChecked);
    } catch (error) {
      console.error("Error updating delivery status: ", error);
    }
  }

  async getDeliveryStatusStats() {
    try {
      let today = new Date();
      let thisYear = today.getFullYear();

      let thisMonth = today.getMonth() + 1;
      // 0 as the date inside the Date constructor will return the last day of the previous month
      let previousMonth =
        new Date(thisYear, today.getMonth(), 0).getMonth() + 1;
      let twoMonthsAgo =
        new Date(thisYear, today.getMonth() - 1, 0).getMonth() + 1;

      let recentMonth: number[] = [twoMonthsAgo, previousMonth, thisMonth];
      let recentMonthArr: string[] = [];
      for (let month of recentMonth) {
        recentMonthArr.push(("0" + month).slice(-2));
      }

      let data = await this.knex.raw(
        `WITH Subtotal AS
        (SELECT order_status,
        SUM(CASE WHEN DATE_TRUNC('month', created_at) = '2024-${recentMonthArr[0]}-01' THEN 1 ELSE 0 END) AS "two_months_ago",
        SUM(CASE WHEN DATE_TRUNC('month', created_at) = '2024-${recentMonthArr[1]}-01' THEN 1 ELSE 0 END) AS "last_month",
        SUM(CASE WHEN DATE_TRUNC('month', created_at) = '2024-${recentMonthArr[2]}-01' THEN 1 ELSE 0 END) AS "this_month",
        COUNT(*) AS status_count
        FROM sales
        WHERE created_at >= '${thisYear}-01-01' AND created_at <= '${thisYear}-12-31'
        GROUP BY order_status)
        SELECT * FROM Subtotal
        UNION ALL
        SELECT 'monthly_count' AS order_status,
        SUM("two_months_ago") AS "two_months_ago",
        SUM("last_month") AS "last_month",
        SUM("this_month") AS "this_month",
        SUM(status_count) AS total_count
        FROM Subtotal;`
      );

      return data.rows;
    } catch (error) {
      console.error("Error generating statistics of delivery status: ", error);
    }
  }
}
