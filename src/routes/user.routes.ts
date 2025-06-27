import { Router } from "express";
import { authenticate } from "../auth/auth";
import { getOrCreateUserData } from "../controllers/user.controller";

const userRouter = Router();

// @ts-ignore
userRouter.get("/", authenticate, getOrCreateUserData);

export default userRouter;
