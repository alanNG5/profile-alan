import { Knex } from "knex";
import { hashPassword, checkPassword } from "../utils/hash";

export class AuthService {
  public constructor(private knex: Knex) {}

  // table() {
  //     return this.knex("users");
  // }

  async login(username_input: string, password_input: string) {

    let userInfoQuery = await this.knex
      .select("username", "is_admin", "users.id", "password_hash")
      .from("users")
      .where("users.username", username_input);

    if (userInfoQuery.length > 0) {
      let pwd_hash_query = userInfoQuery[0].password_hash;

      let compareResult = await checkPassword({
        plainPassword: password_input,
        hashedPassword: pwd_hash_query,
      });

      if (compareResult) {
        return {
          flag: true,
          loginID: userInfoQuery[0].id,
          loginUsername: userInfoQuery[0].username,
          loginAdmin: userInfoQuery[0].is_admin,
        };
      } else {
        return {
          flag: false,
          message: "Invalid password or username.",
        };
      }
    } else {
      return {
        flag: false,
        message: "Invalid password or username.",
      };
    };
  };

  async register (username_input: string, email_input: string, password_input: string) {

    let queryForUsername = await this.knex
      .select("username")
      .from("users")
      .where("username", username_input);

    let queryForEmail = await this.knex
      .select("email")
      .from("users")
      .where("email", email_input);

    if (queryForUsername.length > 0) {
      return {
        flag: false,
        message: `The username of "${username_input}" is already in use.`,
      };
    } else if (queryForEmail.length > 0) {
      return {
        flag: false,
        message: `The email of "${email_input}" is already registered.`}
    } else {
      await this.knex("users").insert({
        username: username_input,
        email: email_input,
        password_hash: await hashPassword(password_input),
      });

      let instantQuery = await this.knex
        .select("*")
        .from("users")
        .where("username", username_input);

      return {
        flag: true,
        message: `Username, "${username_input}" has been registered successfully.`,

        // return user info for automatic login after registration
        loginID: instantQuery[0].id,
        loginUsername: instantQuery[0].username,
        loginAdmin: instantQuery[0].is_admin,
      };
    };
  };
};
