import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.increments("id");
    table.string("brand", 64).notNullable;
    table.string("model_name", 64).notNullable();
    table.string("model_no", 64).notNullable();
    table.integer("current_price", 64);
    table.string("description", 2048);
    table.integer("stock_qtn", 64);
    table.boolean("is_pre_owned").defaultTo(false);
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("products");
}
