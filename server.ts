import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { sessionMiddleware } from "./utils/session";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

dotenv.config();
const port = process.env.PORT;

import { routes } from "./routers";
import { requireAdmin } from "./utils/guard";
app.use("/", routes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve("public", "watch_main.html"));
  return;
});

app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      res.set("Cache-Control", "no-store");
    },
  })
);

app.use(express.static("uploads"));

app.use(
  requireAdmin,
  express.static("protected", {
    setHeaders: (res, path) => {
      res.set("Cache-Control", "no-store");
    },
  })
);

app.use((req, res) => {
  res.status(404).sendFile(path.resolve("public", "404.html"));
});

app.listen(port, () => {
  console.log(`App is listening on port of http://localhost:${port}`);
});
