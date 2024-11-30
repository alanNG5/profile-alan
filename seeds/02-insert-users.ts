import { Knex } from "knex";
import { hashPassword } from "../utils/hash";

export async function seed(knex: Knex): Promise<void> {
  let usersList = [
    {
      username: "controller",
      email: "null@impetus.go",
      password: "itisimage8",
      is_admin: true,
    },

    {
      username: "jobseeker",
      email: "watcher@w3.org",
      password: "hired2org",
      is_admin: false,
    },

    {
      username: "client101",
      email: "client101@tecky.com",
      password: "clientserver0",
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
