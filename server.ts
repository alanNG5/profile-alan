import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const port = process.env.PORT;

import { routes } from "./routers";
app.use("/", routes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve("public", "admin.html"));
  return;
});

app.use(express.static("public"));
app.use(express.static("uploads"));

app.use((req, res) => {
  res.status(404).sendFile(path.resolve("public", "404.html"));
});

app.listen(port, () => {
  console.log(`App is listening on port of http://localhost:${port}`);
});
