const mongoose = require("mongoose");

const Attendance = new mongoose.Schema({
    enrollmentNo: {
        type: Number,
        required: true,
    },
    presentDates: {
        type: {}, // subject: date
    },
    absentDates: {
        type: {}, // subject: date
    },
}, {timestamps: true});

module.exports = mongoose.model("Attendance", Attendance);
