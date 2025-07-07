import { Router } from "express";
import {
  createProperty,
  getProperty,
  getPropertyById,
} from "../controllers/property.controller";
import { authenticate } from "../auth/auth";

const propertyRouter = Router();

propertyRouter.get("/", authenticate, getProperty);
// @ts-ignore
propertyRouter.get("/:id", authenticate, getPropertyById);

// @ts-ignore
propertyRouter.post("/create", authenticate, createProperty);

export default propertyRouter;
