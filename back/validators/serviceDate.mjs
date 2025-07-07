import { body } from "express-validator";

const validateServiceDate = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Invalid date format")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      if (date < today) {
        throw new Error("Date cannot be in the past");
      }
      return true;
    }),
];

export default validateServiceDate;
