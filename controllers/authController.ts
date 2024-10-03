import express, { Request, Response } from "express";
import { AuthService } from "../services/authService";
import "../utils/session";

class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    let { username, password } = req.body;

    let result = await this.authService.login(username, password);

    // console.log("@@@ data from service to controller: ", result);

    if (result.flag) {
      req.session.userid = result.loginID;
      req.session.username = result.loginUsername;
      req.session.admin_role = result.loginAdmin;

      console.log("@@@ session: ", req.session);

      res.status(200);
      // res.json({});
      res.json({
        admin: req.session.admin_role,
        name: req.session.username,
      });
    } else {
      res.status(400).json({ error: result.message });
      // res.json({ role: "guest" });
    }
  };
}

export { AuthController };


// construct router for role?
// userRouter.get("/role", (req, res) => {
//   if (req.session.username) {
//     res.json({ role: "user", username: req.session.username });
//   } else {
//     res.json({ role: "guest" });
//   }
// });
