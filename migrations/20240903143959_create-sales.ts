import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sales", (table) => {
    table.increments("id");
    table.integer("product_id").unsigned();
    table.foreign("product_id").references("products.id");
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.integer("selling_price", 64);
    table.string("recipient", 64).notNullable();
    table.string("contact_no", 64).notNullable();
    table.string("shipping_address", 255).notNullable();
    table.enum("payment_method", ["visa", "paypal"]);
    table.enum("order_status", ["shipment_arranging", "delivered"]);
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("sales");
}
