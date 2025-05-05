const Attendance = require("../../models/Other/attendance.model.js");

// GET attendance records
const getAttendance = async (req, res) => {
    try {
        let record = await Attendance.find(req.body);
        if (!record) {
            return res
                .status(400)
                .json({ success: false, message: "Attendance Not Available" });
        }
        const data = {
            success: true,
            message: "All Attendance Records Loaded!",
            record,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ADD or UPDATE attendance
const addAttendance = async (req, res) => {
    const { enrollmentNo, presentDates, absentDates } = req.body;
    try {
        let existingRecord = await Attendance.findOne({ enrollmentNo });
        if (existingRecord) {
            if (presentDates) {
                existingRecord.presentDates = { ...existingRecord.presentDates, ...presentDates };
            }
            if (absentDates) {
                existingRecord.absentDates = { ...existingRecord.absentDates, ...absentDates };
            }
            await existingRecord.save();
            return res.json({ success: true, message: "Attendance Updated!" });
        } else {
            await Attendance.create(req.body);
            return res.json({ success: true, message: "Attendance Added!" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// DELETE attendance record
const deleteAttendance = async (req, res) => {
    try {
        let record = await Attendance.findByIdAndDelete(req.params.id);
        if (!record) {
            return res
                .status(400)
                .json({ success: false, message: "No Attendance Record Exists!" });
        }
        res.json({ success: true, message: "Attendance Deleted!" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getAttendance, addAttendance, deleteAttendance };
