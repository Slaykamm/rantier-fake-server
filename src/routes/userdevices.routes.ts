import { Router } from "express";
import { authenticate } from "../auth/auth";
import { updateUserDevice } from "../controllers/userdevices.controller";

const userDevicesRouter = Router();

userDevicesRouter.post("/", authenticate, updateUserDevice);

export default userDevicesRouter;
