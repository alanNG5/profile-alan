import expressSession from "express-session";
import dotenv from "dotenv";

const MemoryStore = require("memorystore")(expressSession);

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
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
});
