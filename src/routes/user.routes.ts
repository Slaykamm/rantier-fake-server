import { Router } from "express";
import { authenticate } from "../auth/auth";
import {
  getCheckUser,
  getOrCreateUserData,
  getUserAvatar,
  updateUserAvatar,
  updateUserData,
} from "../controllers/user.controller";
import { upload } from "../storage/storage";

const userRouter = Router();

// @ts-ignore
userRouter.get("/", authenticate, getOrCreateUserData);
// @ts-ignore
userRouter.post("/update", authenticate, updateUserData);
// @ts-ignore
userRouter.get("/avatar", authenticate, getUserAvatar);
userRouter.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  // @ts-ignore
  updateUserAvatar
);
userRouter.get("/checkUser", authenticate, getCheckUser);

export default userRouter;
