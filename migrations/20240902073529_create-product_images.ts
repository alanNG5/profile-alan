import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("product_images", (table) => {
    table.increments("id");
    table.integer("product_id").unsigned();
    table.foreign("product_id").references("products.id");
    table.string("image_path", 255);
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("product_images");
}
