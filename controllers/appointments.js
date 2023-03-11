const Appointment = require("../models/Appointment");
const Hospital = require("../models/Hospital");

// @desc      Get all appointments
// @route     GET /api/v1/appointments
// @access   Public

exports.getAppointments = async (req, res, next) => {
  let query;

  if (req.user.role !== "admin") {
    query = Appointment.find({ user: req.user.id }).populate({
      path: "hospital",
      select: "name province tel",
    });
  } else {
    query = Appointment.find().populate({
      path: "hospital",
      select: "name province tel",
    });
  }

  try {
    const appointments = await query;

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.log(error.stack);
    return res
      .status(500)
      .json({ success: false, error: "Cannot find Appointment" });
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: "hospital",
      select: "name province tel",
    });

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: `No appointment with the id ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Cannot find appointment",
    });
  }
};

exports.addAppointment = async (req, res, next) => {
  try {
    // validate hospital as a input
    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) {
      return res.status(400).json({
        success: false,
        message: `No hospital with the id ${req.params.hospitalId}`,
      });
    }

    // check for existing appointment
    const existingAppointment = await Appointment.find({
      user: req.user.id,
    });
    if (existingAppointment.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with id ${req.user.id} have already booked 3 appointments`,
      });
    }
    req.body.hospital = req.user.id;
    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error.stack);
    return res
      .status(500)
      .json({ success: false, error: "Cannot add Appointment" });
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: `No appointment with the id ${req.params.id}`,
      });
    }

    // checking if the user is the owner of the appointment
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this appointment`,
      });
    }

    const fixedappointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: fixedappointment,
    });
  } catch (error) {
    console.log(error.stack);
    return res
      .status(500)
      .json({ success: false, error: "Cannot update Appointment" });
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: `No appointment with the id ${req.params.id}`,
      });
    }
    // checking if the user is the owner of the appointment
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this appointment`,
      });
    }
    await appointment.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error.stack);
    return res
      .status(500)
      .json({ success: false, error: "Cannot delete Appointment" });
  }
};
