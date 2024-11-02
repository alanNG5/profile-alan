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
  if (req.session.admin_role === true) {
    next();
  } else {
    console.log("Unauthorized access attempt.");
    res.status(403).redirect("/");
    // res
    //   .status(401)
    //   .json({ error: "You are not authorized to access this page." });
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