import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("return", (table) => {
    table.increments("id");
    table.integer("sales_order_id").unsigned();
    table.foreign("sales_order_id").references("sales.id");
    table.text("reason_of_return");
    table.enum("request_status", ["pending", "refunded", "rejected"]);
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("return");
}
