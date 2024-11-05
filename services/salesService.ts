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
      throw error;
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
      throw error;
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
      throw error;
    }
  }
}