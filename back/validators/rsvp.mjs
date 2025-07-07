import { body } from "express-validator";
import validate from "./validate.mjs";

// Validate RSVP update (for users)
export const validateRSVPUpdate = [
  body("status")
    .optional()
    .isIn(["cancelled"])
    .withMessage("Status can only be set to 'cancelled'"),
  validate,
];

// Validate RSVP status update (for admins)
export const validateRSVPStatusUpdate = [
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be either 'approved' or 'rejected'"),
  validate,
];
