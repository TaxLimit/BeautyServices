import { body } from "express-validator";

const validateNewService = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("durationMinutes")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive number"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isIn(["HairCare", "FacialTreatments", "Waxing", "Massages"])
    .withMessage(
      "Category must be either 'Hair Care' or 'Facial Treatments' or 'Waxing' or 'Massages'"
    ),
  body("imgURL").notEmpty().withMessage("Image URL is required"),
];

export default validateNewService;
