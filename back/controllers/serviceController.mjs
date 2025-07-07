import service from "../models/serviceModel.mjs";
import sequelize from "../dbConnection.mjs";
import AppError from "../utils/appError.mjs";
import { Op } from "sequelize";

export const getAllServices = async (req, res) => {
  try {
    const options = {
      limit: 5,
      where: {},
      order: [],
    };
    if (req.query.status) {
      options.where = { status: req.query.status };
    }

    if (req.query.sortBy) {
      options.order = sequelize.literal(`amount ${req.query.sortBy}`);
    }

    const { count, rows } = await service.findAndCountAll(options);

    res.status(200).json({
      status: "Success",
      message: "Gotten all services successfully",
      data: { count, services: rows },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Failed to get services",
      error: error.message,
    });
  }
};

export const getService = async (req, res) => {
  try {
    const foundService = await service.findByPk(req.params.id);

    if (!foundService) {
      return res.status(404).json({
        status: "fail",
        message: "No service found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Service retrieved successfully",
      data: foundService,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Failed to get service",
      error: error.message,
    });
  }
};

// generate unique service ID
const generateUniqueServiceId = () => {
  return Math.floor(Math.random() * 1000000);
};

export const createService = async (req, res) => {
  try {
    const postService = await service.create(
      {
        id: generateUniqueServiceId(),
        ...req.body,
        createdBy: req.user.id,
      },
      {
        returning: true,
      }
    );

    res.status(201).json({
      status: "success",
      message: "Service created successfully",
      data: postService,
    });

    postService
      ? console.log("Success, service created!")
      : console.log("Failed to create service");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Failed to create service",
      error: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const editService = await service.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.params.id,
          createdBy: req.user.id,
        },
        returning: true,
      }
    );

    if (!editService || editService[0] === 0) {
      return res.status(404).json({
        status: "fail",
        message: `No service data changed, something wrong with controller or service not found`,
      });
    }

    console.log(`Successfully edited service`);
    res.status(200).json({
      status: "Success",
      message: "Edited service successfully",
      data: { affectedRows: editService[0] },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Failed to edit service",
      error: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const foundService = await service.findByPk(serviceId);
    if (!foundService) {
      return res.status(404).json({
        status: "fail",
        message: "No service found with that ID",
      });
    }

    const serviceDates = await sequelize.models.serviceDate.findAll({
      where: { serviceId },
    });

    if (serviceDates.length > 0) {
      return res.status(400).json({
        status: "fail",
        message:
          "Cannot delete service that has scheduled dates. Please delete all dates first.",
      });
    }

    const deleteOneService = await service.destroy({
      where: {
        id: serviceId,
      },
    });

    console.log(`Successfully deleted service`);
    res.status(200).json({
      status: "Success",
      message: "Deleted service successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(400).json({
      status: "fail",
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

export const getAllPublicServices = async (req, res) => {
  try {
    const options = {
      where: {},
      order: [],
    };

    if (req.query.title) {
      options.where.title = {
        [sequelize.Op.iLike]: `%${req.query.title}%`,
      };
    }

    if (req.query.category) {
      options.where.category = req.query.category;
    }

    if (req.query.date) {
      options.include = [
        {
          model: sequelize.models.serviceDate,
          where: {
            date: {
              [sequelize.Op.gte]: new Date(req.query.date),
            },
          },
          required: true,
        },
      ];
    }

    const { count, rows } = await service.findAndCountAll(options);

    res.status(200).json({
      status: "Success",
      message: "Gotten all services successfully",
      data: { count, services: rows },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Failed to get services",
      error: error.message,
    });
  }
};

export const getPublicService = async (req, res, next) => {
  try {
    const foundService = await service.findByPk(req.params.id, {
      include: [
        {
          model: sequelize.models.serviceDate,
          attributes: ["id", "date"],
        },
      ],
    });

    if (!foundService) {
      return next(new AppError("No service found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Service retrieved successfully",
      data: foundService,
    });
  } catch (error) {
    next(error);
  }
};
