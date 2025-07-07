import serviceDate from "../models/serviceDateModel.mjs";
import service from "../models/serviceModel.mjs";
import sequelize from "../dbConnection.mjs";

export const addServiceDate = async (req, res) => {
  try {
    const serviceExists = await service.findByPk(req.params.id);
    if (!serviceExists) {
      return res.status(404).json({
        status: "Fail",
        message: "Service not found",
      });
    }

    const newDate = await serviceDate.create({
      serviceId: req.params.id,
      date: req.body.date,
    });

    res.status(201).json({
      status: "Success",
      message: "Date added successfully",
      data: newDate,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Failed to add date",
      error: error.message,
    });
  }
};

export const getServiceDates = async (req, res) => {
  try {
    const serviceExists = await service.findByPk(req.params.id);
    if (!serviceExists) {
      return res.status(404).json({
        status: "Fail",
        message: "Service not found",
      });
    }

    const dates = await serviceDate.findAll({
      where: {
        serviceId: req.params.id,
      },
      order: [["date", "ASC"]],
    });

    res.status(200).json({
      status: "Success",
      message: "Dates retrieved successfully",
      data: dates,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Failed to get dates",
      error: error.message,
    });
  }
};

export const deleteServiceDate = async (req, res) => {
  try {
    const { id: serviceId, dateId } = req.params;

    const serviceExists = await service.findByPk(serviceId);
    if (!serviceExists) {
      return res.status(404).json({
        status: "Fail",
        message: "Service not found",
      });
    }

    const dateExists = await serviceDate.findByPk(dateId);
    if (!dateExists) {
      return res.status(404).json({
        status: "Fail",
        message: "Date not found",
      });
    }

    if (dateExists.serviceId !== parseInt(serviceId)) {
      return res.status(400).json({
        status: "Fail",
        message: "Date does not belong to this service",
      });
    }

    await sequelize.models.userServiceDate.destroy({
      where: {
        serviceDateId: dateId,
      },
    });
    await dateExists.destroy();

    res.status(200).json({
      status: "Success",
      message: "Date deleted successfully",
    });
  } catch (error) {
    console.error("Delete date error:", error);
    res.status(400).json({
      status: "Fail",
      message: "Failed to delete date",
      error: error.message,
    });
  }
};
