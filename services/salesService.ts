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
      console.log("Inventory Credited: ", inventoryDecrement);

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

  async selectSalesInfoById(salesId: Number) {
    return await this.knex
      .select(
        "users.id AS uid",
        "username",
        "email",
        "users.created_at AS user_created_at",
        "products.id AS pid",
        "brand",
        "model_name",
        "model_no",
        "current_price",
        "sales.id AS sid",
        "selling_price",
        "recipient",
        "contact_no",
        "shipping_address",
        "payment_method",
        "order_status",
        "sales.created_at AS sales_created_at",
        "sales.updated_at AS sales_updated_at"
      )
      .from("sales")
      .leftOuterJoin("products", "sales.product_id", "products.id")
      .leftOuterJoin("users", "sales.user_id", "users.id")
      .where("sales.id", salesId);
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
      let thisdate = new Date().getDate();
      let thisMonth = new Date().getMonth() + 1;
      let thisYear = new Date().getFullYear();

      let today: string = ("0" + thisdate).slice(-2);

      // @ set date as 0 will return the last day of the previous month
      // @ get the index of date of last 2 months; turn it into concrete month; get the corresponding year

      let setPrevMon = new Date().setDate(0);
      let prevMon = new Date(setPrevMon).getMonth() + 1;
      let yrOfPrevMon = new Date(setPrevMon).getFullYear();

      let set2MonAgo = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 2,
        1
      );
      let twoMonAgo = new Date(set2MonAgo).getMonth() + 1;
      let yrOf2MonAgo = new Date(set2MonAgo).getFullYear();

      let yearArr: number[] = [yrOf2MonAgo, yrOfPrevMon, thisYear];
      let recentMonth: number[] = [twoMonAgo, prevMon, thisMonth];
      let recentMonthArr: string[] = [];
      for (let month of recentMonth) {
        recentMonthArr.push(("0" + month).slice(-2));
      }

      let data = await this.knex.raw(
        `WITH Subtotal AS
        (SELECT order_status,
        SUM(CASE WHEN DATE_TRUNC('month', created_at) = '${yearArr[0]}-${recentMonthArr[0]}-01' THEN 1 ELSE 0 END) AS "two_months_ago",
        SUM(CASE WHEN DATE_TRUNC('month', created_at) = '${yearArr[1]}-${recentMonthArr[1]}-01' THEN 1 ELSE 0 END) AS "last_month",
        SUM(CASE WHEN DATE_TRUNC('month', created_at) = '${yearArr[2]}-${recentMonthArr[2]}-01' THEN 1 ELSE 0 END) AS "this_month",
        COUNT(*) AS "status_count" FROM sales WHERE created_at >= '${yearArr[0]}-${recentMonthArr[0]}-01' AND created_at <= '${yearArr[2]}-12-31' GROUP BY order_status) SELECT * FROM Subtotal UNION ALL SELECT 'monthly_count' AS order_status, SUM("two_months_ago") AS "twoMonthsAgo", SUM("last_month") AS "lastMonth", SUM("this_month") AS "thisMonth", SUM("status_count") AS "total_count" FROM Subtotal;`
      );

      return data.rows;
    } catch (error) {
      console.error("Error generating statistics of delivery status: ", error);
    }
  }
}





// `WITH Subtotal AS
// (SELECT order_status,
// SUM(CASE WHEN DATE_TRUNC('month', created_at) = '${yearArr[0]}-${recentMonthArr[0]}-01' THEN 1 ELSE 0 END) AS "two_months_ago",
// SUM(CASE WHEN DATE_TRUNC('month', created_at) = '${yearArr[1]}-${recentMonthArr[1]}-01' THEN 1 ELSE 0 END) AS "last_month",
// SUM(CASE WHEN DATE_TRUNC('month', created_at) = '${yearArr[2]}-${recentMonthArr[2]}-01' THEN 1 ELSE 0 END) AS "this_month",
// COUNT(*) AS status_count
// FROM sales
// WHERE created_at >= '${yearArr[0]}-${recentMonthArr[0]}-01' AND created_at <= '${yearArr[2]}-${recentMonthArr[2]}-${today}'
// GROUP BY order_status)
// SELECT * FROM Subtotal
// UNION ALL
// SELECT 'Monthly Total' AS order_status,
// SUM("two_months_ago") AS "two_months_ago",
// SUM("last_month") AS "last_month",
// SUM("this_month") AS "this_month",
// SUM(status_count) AS total_count
// FROM Subtotal;`
