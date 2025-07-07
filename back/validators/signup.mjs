import { body } from "express-validator";
import { getUserByEmail } from "../controllers/userController.mjs";

const validateNewUser = [
  body().notEmpty().withMessage("User body must contain data"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await getUserByEmail(value);
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  body("username").notEmpty().withMessage("Username is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) // Must contain at least one number, one uppercase, one lowercase, and be 8+ characters long
    .withMessage(
      "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
    )
    // Custom validation to check if passwords match,
    .custom(async (value, { req }) => {
      if (value !== req.body.passwordconfirm) {
        throw new Error(
          "Password and password confirmation do not match. Please try again."
        );
      }
      return true;
    }),
];

export default validateNewUser;
