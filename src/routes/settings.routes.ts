import { Router } from "express";
import { authenticate } from "../auth/auth";
import { getSettings, setSettings } from "../controllers/settings.controller";

const settingsRouter = Router();

settingsRouter.get("/", authenticate, getSettings);
settingsRouter.post("/", authenticate, setSettings);

export default settingsRouter;
