import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username", 64).unique().notNullable;
    table.string("email", 255).notNullable;
    table.string("password_hash", 64).notNullable;
    table.boolean("is_admin").defaultTo(false);
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
