import express, { Request, Response } from "express";
import { AuthService } from "../services/authService";
import "../utils/session";

class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    let { username, password } = req.body;

    let validationResult = await this.authService.login(username, password);

    if (validationResult.flag) {
      req.session.userid = validationResult.loginID;
      req.session.username = validationResult.loginUsername;
      req.session.admin_role = validationResult.loginAdmin;

      res.status(200);
      res.json({
        success: "You have logged in successfully!",
      });
    } else {
      res.status(400).json({ error: validationResult.message });
    }
  };

  checkVisitorStatus = async (req: Request, res: Response) => {
    if (req.session.username) {
      res.json({
        visitor: req.session.admin_role ? "admin" : "member",
        username: req.session.username,
      });
    } else {
      res.json({ visitor: "guest" });
    }
  };

  logout = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ logoutError: "Failed to log out" });
      } else {
        res.json({ logoutMessage: "You have logged out." });
      }
    });
  };

  //   register = async (req: Request, res: Response) => {
}

export { AuthController };