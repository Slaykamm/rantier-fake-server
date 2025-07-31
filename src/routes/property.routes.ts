import { Router } from "express";
import {
  createProperty,
  getProperty,
  getPropertyById,
  updatePropertyImage,
} from "../controllers/property.controller";
import { authenticate } from "../auth/auth";
import { upload, uploadProperty } from "../storage/storage";

const propertyRouter = Router();

propertyRouter.get("/", authenticate, getProperty);
// @ts-ignore
propertyRouter.get("/:id", authenticate, getPropertyById);

// @ts-ignore
propertyRouter.post("/create", authenticate, createProperty);
propertyRouter.post(
  "/create/image",
  authenticate,
  uploadProperty.single("property"),
  // @ts-ignore
  updatePropertyImage
);

export default propertyRouter;
