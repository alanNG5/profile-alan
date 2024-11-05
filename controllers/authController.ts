import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import "../utils/session";

class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    let { username, password } = req.body;

    // const patternName = /[a-zA-Z0-9]{6,14}$/;
    // const patternPwd = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/;

    // if (!patternName.test(username)) {
    //   res.status(400).json({ error: "Input Error for Username." });
    //   return;
    // }

    // if (!patternPwd.test(password)) {
    //   res.status(400).json({ error: "Input Error for Password." });
    //   return;
    // }

    let validationResult = await this.authService.login(username, password);

    if (validationResult.flag) {
      req.session.userid = validationResult.loginID;
      req.session.username = validationResult.loginUsername;
      req.session.admin_role = validationResult.loginAdmin;

      res.status(200).json({
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
        accountId: req.session.userid,
      });
    } else {
      res.json({ visitor: "guest" });
    }
  };

  logout = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ logoutError: "Failed to log out." });
      } else {
        res.json({ logoutMessage: "You have logged out." });
      }
    });
  };

  register = async (req: Request, res: Response) => {
    let { username, email, password } = req.body;
    let registrationResult = await this.authService.register(
      username,
      email,
      password
    );

    if (registrationResult.flag) {
      req.session.userid = registrationResult.loginID;
      req.session.username = registrationResult.loginUsername;
      req.session.admin_role = registrationResult.loginAdmin;

      res.status(201).json({ success: registrationResult.message });
    } else {
      res.status(400).json({ error: registrationResult.message });
    }
  };
}

export { AuthController };
