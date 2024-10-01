import expressSession from "express-session";
import dotenv from "dotenv";

dotenv.config();

declare module "express-session" {
  interface SessionData {
    userid?: number;
    username?: string;
    admin_role?: boolean;
  }
}

if (!process.env.SESSION_SECRET) throw Error("Please provide SECRET in .env.");

export let sessionMiddleware = expressSession({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
});
