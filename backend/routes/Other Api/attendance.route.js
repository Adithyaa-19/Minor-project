const express = require("express");
const { getAttendance, addAttendance, deleteAttendance } = require("../../controllers/Other/attendance.controller");
const router = express.Router();

router.post("/getAttendance", getAttendance);
router.post("/addAttendance", addAttendance);
router.delete("/deleteAttendance/:id", deleteAttendance);

module.exports = router;
