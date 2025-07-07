import { body } from "express-validator";
import argon2 from "argon2";
import { getUserByEmail } from "../controllers/userController.mjs";

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .normalizeEmail()
    .custom(async (value) => {
      const user = await getUserByEmail(value);

      if (!user) {
        throw new Error("Invalid username or password");
      }

      return true;
    }),

  body("password")
    .trim()
    .notEmpty()
    .custom(async (value, { req }) => {
      const user = await getUserByEmail(req.body.email);
      if (user) {
        const matchPass = await argon2.verify(user.password, value);
        if (!matchPass) {
          throw new Error("invalid username or password");
        }
      }
      return true;
    }),
];

export default validateLogin;
