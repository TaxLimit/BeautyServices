import express from "express";
import { protect, allowAccessTo } from "../controllers/authController.mjs";
import {
  createRSVP,
  getMyRSVPs,
  updateRSVP,
  getDateRSVPs,
  updateRSVPStatus,
} from "../controllers/rsvpController.mjs";
import {
  validateRSVPUpdate,
  validateRSVPStatusUpdate,
} from "../validators/rsvp.mjs";
import validate from "../validators/validate.mjs";

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.post("/date/:serviceDateId", createRSVP);
router.get("/my-rsvps", getMyRSVPs);
router.patch("/:id", validateRSVPUpdate, validate, updateRSVP);

// Admin routes
router.get("/date/:serviceDateId/rsvps", allowAccessTo("admin"), getDateRSVPs);
router.patch(
  "/:id/status",
  allowAccessTo("admin"),
  validateRSVPStatusUpdate,
  validate,
  updateRSVPStatus
);

export default router;
