import expressSession from "express-session";
// import { env } from "/env";

declare module "express-session" {
  interface SessionData {
    userid?: number;
    username?: string;
  }
}

export let sessionMiddleware = expressSession({
  secret: process.env.SESSION_SECRET || "tecky_nlc_23",
  resave: true,
  saveUninitialized: true,
});
