import argon2 from "argon2";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.mjs";
import { getUserByEmail, getUserByID, createUser } from "./userController.mjs";
import service from "../models/serviceModel.mjs";

//  COOKIES / TOKENS / SIGNUP / LOGIN / LOGOUT

//funkcija, kuri sugeneruoja jwt token, payload user.id
const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

//funkcija, kuri išsiunčia cookie į naršyklę (į front'ą)
const sendTokenCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
};

//1. user signup

export const signup = async (req, res, next) => {
  try {
    const newUser = req.body;
    const hash = await argon2.hash(newUser.password);

    newUser.password = hash;
    console.log(newUser);

    const createdUser = await createUser(newUser);

    if (!createdUser) {
      throw new AppError("User not Created", 400);
    }

    const { id } = createdUser;

    const token = signToken(id);
    console.log(token);

    sendTokenCookie(token, res);

    createdUser.password = undefined;

    res.status(201).json({
      status: "success",
      token: token,
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0]?.path;
      let message = "Validation error";
      if (field === "email") message = "Email already exists";
      else if (field === "username") message = "Username already exists";
      return next(new AppError(message, 400));
    }
    next(error);
  }
};

// user login

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    console.log(user);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken(user.id);
    sendTokenCookie(token, res);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// protect route

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt;

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "You are not logged in. Please log in to get access",
        401
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await getUserByID(decoded.id);
    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token does not longer exists"
      );
    }

    req.user = currentUser;

    next();
  } catch (error) {
    next(error);
  }
};

export const allowAccessTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new AppError(
          "You dont have permissions to performs this actions",
          403
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkServiceOwnership = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;
    const serviceId = req.params.id;

    if (!serviceId) {
      return next(new AppError("service ID is missing in the request.", 400));
    }

    const foundService = await service.findByPk(serviceId);

    if (!foundService) {
      return next(new AppError("No service found with that ID", 404));
    }

    if (req.user.role !== "admin" && foundService.ownerid !== loggedInUserId) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return res.clearCookie("jwt").status(200).json({
    message: "You are logged out",
  });
};
