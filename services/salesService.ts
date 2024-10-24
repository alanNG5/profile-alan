import { Knex } from "knex";

export class SalesService {
  constructor(private knex: Knex) {}

  async insertSales(
    pid: number,
    accountId: number,
    current_price: number,
    recipient: string,
    contact_no: string,
    shipping_address: string,
    payment_method: string
  ) {
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

      let newSales = await this.knex("sales")
        .insert(newSalesData)
        .returning("id");

      let inventoryCredit = await this.knex("products")
        .decrement("stock_qtn", 1)
        .where("id", pid);
      console.log(inventoryCredit);
      // await this.knex("products")
      //   .update({ stock_qtn: this.knex.raw("?? - 1", ["stock_qtn"]) })
      //   .where("id", pid);

      return {
        message: `New Sales Order No. ${newSales[0].id} is created.`,
      };
    } catch (error) {
      console.error("Error performing transaction: ", error);
    }
  }
}
