import express from "express";

import {
  getAllServices,
  createService,
  getService,
  updateService,
  deleteService,
  getAllPublicServices,
  getPublicService,
} from "../controllers/serviceController.mjs";

import {
  addServiceDate,
  getServiceDates,
  deleteServiceDate,
} from "../controllers/serviceDateController.mjs";

import {
  protect,
  allowAccessTo,
  checkServiceOwnership,
} from "../controllers/authController.mjs";

import validateNewService from "../validators/newService.mjs";
import validateServiceDate from "../validators/serviceDate.mjs";
import validate from "../validators/validate.mjs";

const serviceRouter = express.Router();

// Public routes
serviceRouter.get("/public", getAllPublicServices);
serviceRouter.get("/public/:id", getPublicService);
serviceRouter.get("/public/:id/dates", getServiceDates);

serviceRouter.use(protect);

// Public routes (but still protected)
serviceRouter.get("/", getAllServices);
serviceRouter.get("/:id", getService);
serviceRouter.get("/:id/dates", getServiceDates);

// Protected routes (only for service owners or admins)
serviceRouter.post("/", validateNewService, validate, createService);
serviceRouter.put(
  "/:id",
  validateNewService,
  validate,
  checkServiceOwnership,
  updateService
);
serviceRouter.delete("/:id", checkServiceOwnership, deleteService);

// Admin only routes
serviceRouter.post(
  "/:id/dates",
  validateServiceDate,
  validate,
  allowAccessTo("admin"),
  addServiceDate
);

serviceRouter.delete(
  "/:id/dates/:dateId",
  allowAccessTo("admin"),
  deleteServiceDate
);

export default serviceRouter;
