import { Router } from "express";
import {
  createProperty,
  deletePropertyById,
  getProperty,
  getPropertyById,
  getPropertyImage,
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
// @ts-ignore
propertyRouter.post("/image", authenticate, getPropertyImage);
propertyRouter.post(
  "/create/image",
  authenticate,
  uploadProperty.single("property"),
  // @ts-ignore
  updatePropertyImage
);
// @ts-ignore
propertyRouter.delete("/:id", authenticate, deletePropertyById);

export default propertyRouter;
