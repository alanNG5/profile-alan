import express, { Request, Response } from "express";
import { AuthService } from "../services/authService";
import "../utils/session";

class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    let { username, password } = req.body;

    let result = await this.authService.login(username, password);

    if (result.flag) {
      req.session.userid = result.loginID;
      req.session.username = result.loginUsername;
      req.session.admin_role = result.loginAdmin;

      res.status(200);
      res.json({});
    } else {
      res.status(400).json({ error: result.message });
    }
  };

  checkVisitorStatus = (req: Request, res: Response) => {
    if (req.session.username) {
      res.json({
        visitor: req.session.admin_role ? "admin" : "member",
        username: req.session.username,
      });
    } else {
      res.json({ visitor: "guest" });
    }
  };

  logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ error: "Failed to log out" });
      } else {
        res.json({ message: "You are successfully logged out!" });
      }
    });
  };
}

export { AuthController };