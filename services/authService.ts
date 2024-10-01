import { Knex } from "knex";
import { hashPassword, checkPassword } from "../utils/hash";

export class AuthService {
  public constructor(private knex: Knex) {}

  table() {
    return this.knex("users");
  }

  async login(name_input: string, password_input: string) {
    let userInfoQuery = await this.table()
      .select("*")
      .where("username", name_input);

    if (userInfoQuery.length > 0) {
      let pwd_hash_query = userInfoQuery[0].password_hash;

      let compareResult = await checkPassword({
        plainPassword: password_input,
        hashedPassword: pwd_hash_query,
      });

      if (compareResult) {
        console.log(`Login as ${userInfoQuery[0].username}successfully.`);

        return {
          flag: true,
          loginID: userInfoQuery[0].id,
          loginUsername: userInfoQuery[0].username,
          loginRole: userInfoQuery[0].is_admin,
        };
      } else {
        return {
          flag: false,
          message: "Invalid user name or password.",
        };
      }
    } else {
      return {
        flag: false,
        message: "Invalid or missing user name or password.",
      };
    }
  }
}
