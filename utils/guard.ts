import { NextFunction, Request, Response } from "express";
import "./session";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (req.session.username) {
    next();
  } else {
    res.status(401).redirect("/");
    // res.status(401).json({ error: "Please login first to continue." });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.admin_role) {
    // console.log("Unauthorized access attempt.");
    res.status(403).redirect("/");
  } else {
    next();
  }
}


// import { Request, Response, NextFunction } from 'express'

// export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
//   if (req.session?.['user']) {
//     next()
//   } else {
//     res.redirect('/login.html')
//   }
// }