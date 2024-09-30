import { Knex } from "knex";
import { hashPassword } from "../utils/hash";

export async function seed(knex: Knex): Promise<void> {
  // await knex("users").del();
  // await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");

  let usersList = [
    {
      username: "controller",
      email: "",
      password: "itisimage",
      is_admin: true,
    },

    {
      username: "client101",
      email: "client101@tecky.com",
      password: "clientserver",
      is_admin: false,
    },

    {
      username: "prudent",
      email: "pd@tecky.com",
      password: "cm0102go",
      is_admin: false,
    },
  ];

  for (let user of usersList) {
    await knex("users").insert({
      username: user.username,
      email: user.email,
      password_hash: await hashPassword(user.password),
      is_admin: user.is_admin,
    });
  }
}
