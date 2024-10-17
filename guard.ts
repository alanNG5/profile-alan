import { NextFunction, Request, Response } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.role != "admin") {
    next(new HttpError(401, "This API is only for admin"));
  } else {
    next();
  }
}

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.role) {
    next(new HttpError(401, "This API is only for authenticated user"));
  } else {
    next();
  }
}

import { NextFunction, Request, Response } from "express";
import "./session";

export function requireUserLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.username) {
    next();
  } else {
    res.status(401);
    res.json({ error: "This API is only available to the authenticated user" });
  }
}

const isLoggedIn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session?.user) {
    //called Next here
  } else {
    // redirect to index page
  }
};

// admin.html should be inside protected
app.use(isLoggedIn, express.static("protected"));
