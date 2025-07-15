import { Router } from "express";
import { authenticate } from "../auth/auth";
import {
  getOrCreateUserData,
  updateUserData,
} from "../controllers/user.controller";

const userRouter = Router();

// @ts-ignore
userRouter.get("/", authenticate, getOrCreateUserData);
// @ts-ignore
userRouter.post("/update", authenticate, updateUserData);

export default userRouter;
