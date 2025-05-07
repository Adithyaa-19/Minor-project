const Attendance = require("../../models/Other/attendance.model.js");

// GET attendance records by enrollmentNo
const getAttendance = async (req, res) => {
    try {
        const { enrollmentNo } = req.body;
        const record = await Attendance.findOne({ enrollmentNo });

        if (!record) {
            return res.status(404).json({ success: false, message: "No attendance record found." });
        }

        res.json({ success: true, message: "Attendance records found.", record });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ADD new attendance entry
const addAttendance = async (req, res) => {
    const { enrollmentNo, subject, date, status } = req.body;

    if (!enrollmentNo || !subject || !date || !status) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    try {
        let existing = await Attendance.findOne({ enrollmentNo });

        const newEntry = {
            subject,
            date: new Date(date),
            status
        };

        if (existing) {
            // Avoid duplicate entries for same subject-date
            const alreadyExists = existing.records.some(
                record => record.subject === subject && new Date(record.date).toDateString() === new Date(date).toDateString()
            );

            if (alreadyExists) {
                return res.status(400).json({ success: false, message: "Attendance already recorded for this subject and date." });
            }

            existing.records.push(newEntry);
            await existing.save();
            return res.json({ success: true, message: "Attendance entry added." });
        } else {
            await Attendance.create({
                enrollmentNo,
                records: [newEntry]
            });
            return res.json({ success: true, message: "Attendance record created." });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// DELETE a record by id (optional cleanup)
const deleteAttendance = async (req, res) => {
    try {
        let record = await Attendance.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ success: false, message: "No attendance record found to delete." });
        }
        res.json({ success: true, message: "Attendance record deleted." });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getAttendance, addAttendance, deleteAttendance };
