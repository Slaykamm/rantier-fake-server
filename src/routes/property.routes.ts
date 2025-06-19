import { Router } from "express";
import {
  getProperty,
  getPropertyById,
} from "../controllers/property.controller";
import { authenticate } from "../auth/auth";

const propertyRouter = Router();

propertyRouter.get("/", authenticate, getProperty);
// @ts-ignore
propertyRouter.get("/:id", authenticate, getPropertyById);

export default propertyRouter;
