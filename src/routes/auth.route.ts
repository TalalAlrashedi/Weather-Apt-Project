import { Router, Request, Response, NextFunction } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  authController.signup(req, res).catch(next);
});

router.post("/signin", (req: Request, res: Response, next: NextFunction) => {
  authController.signin(req, res).catch(next);
});

router.post("/signout", (req: Request, res: Response, next: NextFunction) => {
  authController.signout(req, res).catch(next);
});
export default router;
