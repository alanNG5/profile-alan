import express, { Request, Response } from "express";
import { AuthService } from "../services/authService";
import "../utils/session";

class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    let { name, password } = req.body;
    let result = await this.authService.login(name, password);

    console.log(result);

    if (result.flag) {
      req.session.userid = result.loginID;
      req.session.username = result.loginUsername;
      req.session.admin_role = result.loginRole;

      res.status(200);
      res.json({});
    } else {
      res.status(400).json(result.message);
    }
  };
}

export { AuthController };
