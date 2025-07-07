import express from "express";

import {
  signup,
  login,
  logout,
  protect,
} from "../controllers/authController.mjs";
import validateNewUser from "../validators/signup.mjs";
import validate from "../validators/validate.mjs";
import validateLogin from "../validators/login.mjs";

const userRouter = express.Router();

userRouter.route("/signup").post(validateNewUser, validate, signup);
userRouter.route("/login").post(validateLogin, validate, login);
userRouter.route("/logout").get(protect, logout);

export default userRouter;
