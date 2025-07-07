import UserServiceDate from "../models/userserviceDateModel.mjs";
import serviceDate from "../models/serviceDateModel.mjs";
import AppError from "../utils/appError.mjs";
import sequelize from "../dbConnection.mjs";
import { Op } from "sequelize";

// RSVP to a date (user)
export const createRSVP = async (req, res, next) => {
  try {
    const { serviceDateId } = req.params;
    const userId = req.user.id;

    const dateExists = await serviceDate.findByPk(serviceDateId);
    if (!dateExists) {
      return next(new AppError("No service date found with that ID", 404));
    }
    const existingRSVP = await UserServiceDate.findOne({
      where: {
        userId,
        serviceDateId,
        status: "confirmed",
      },
    });

    if (existingRSVP) {
      return next(new AppError("You have already RSVP'd for this date", 400));
    }
    const newRSVP = await UserServiceDate.create({
      userId,
      serviceDateId,
      status: "confirmed",
    });

    res.status(201).json({
      status: "success",
      message: "RSVP confirmed successfully!",
      data: newRSVP,
    });
  } catch (error) {
    next(error);
  }
};
export const getMyRSVPs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const rsvps = await UserServiceDate.findAll({
      where: {
        userId,
        status: "confirmed",
      },
      include: [
        {
          model: serviceDate,
          include: [
            {
              model: sequelize.models.service,
              attributes: [
                "id",
                "title",
                "description",
                "price",
                "durationMinutes",
                "category",
                "imgURL",
              ],
            },
          ],
        },
      ],
      order: [[serviceDate, "date", "ASC"]],
    });

    res.status(200).json({
      status: "success",
      results: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRSVP = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    const rsvp = await UserServiceDate.findOne({
      where: { id, userId },
    });

    if (!rsvp) {
      return next(new AppError("No RSVP found with that ID", 404));
    }

    if (status !== "cancelled") {
      return next(new AppError("Invalid status update", 400));
    }

    await rsvp.update({ status });

    res.status(200).json({
      status: "success",
      message: "RSVP updated successfully",
      data: rsvp,
    });
  } catch (error) {
    next(error);
  }
};

export const getDateRSVPs = async (req, res, next) => {
  try {
    const { serviceDateId } = req.params;

    const rsvps = await UserServiceDate.findAll({
      where: { serviceDateId },
      include: [
        {
          model: sequelize.models.user,
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      results: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRSVPStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return next(
        new AppError("Invalid status. Must be 'approved' or 'rejected'", 400)
      );
    }

    const rsvp = await UserServiceDate.findByPk(id);
    if (!rsvp) {
      return next(new AppError("No RSVP found with that ID", 404));
    }

    await rsvp.update({ status });

    res.status(200).json({
      status: "success",
      message: `RSVP ${status} successfully`,
      data: rsvp,
    });
  } catch (error) {
    next(error);
  }
};
