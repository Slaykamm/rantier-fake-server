import { Router } from "express";
import {
  getProperty,
  getPropertyById,
} from "../controllers/property.controller";

const propertyRouter = Router();

propertyRouter.get("/", getProperty);
propertyRouter.get("/:id", getPropertyById);

export default propertyRouter;
