import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { sessionMiddleware } from "./utils/session";
import { requireLogin, requireAdmin } from "./utils/guard";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

dotenv.config();
const port = process.env.PORT;

import { routes } from "./routers";
app.use("/", routes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve("public", "watch_main.html"));
  return;
});

// app.get("/watch_main.html", (req: Request, res: Response) => {
//   console.log(
//     req.session.username,
//     req.session.userid,
//     req.session.admin_role,
//     req.session.id
//   );
//   const isLoggedIn = req.session.username ? true : false;
//   res.sendFile(path.resolve("public", "watch_main.html"), {
//     headers: { "X-Is-Logged-In": isLoggedIn },
//   });
//   return;
// });

app.use(express.static("public"));
app.use(express.static("uploads"));
// app.use(requireAdmin, express.static("protected"));

app.use((req, res) => {
  res.status(404).sendFile(path.resolve("public", "404.html"));
});

app.listen(port, () => {
  console.log(`App is listening on port of http://localhost:${port}`);
});
