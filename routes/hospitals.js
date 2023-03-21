const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getVacCenters,
} = require("../controllers/hospitals");

const router = express.Router();
const appointmentRouter = require("./appointments");

router.route("/vacCenters").get(getVacCenters);

router.use("/:hospitalId/appointments", appointmentRouter);
router
  .route("/")
  .get(getHospitals)
  .post(protect, authorize("admin"), createHospital);
router
  .route("/:id")
  .get(getHospital)
  .put(protect, authorize("admin"), updateHospital)
  .delete(protect, authorize("admin"), deleteHospital);

module.exports = router;
