import { validationResult } from "express-validator";
import AppError from "../utils/appError.mjs";

const validate = (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // create errors string, kad suvienodinti klaidų pranešimus
      const errorsString = errors
        .array()
        .map((error) => error.msg)
        .join("; ");

      throw new AppError(errorsString, 400);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
