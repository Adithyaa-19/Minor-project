const mongoose = require("mongoose");

const Attendance = new mongoose.Schema({
    enrollmentNo: {
        type: Number,
        required: true,
    },
    records: [
        {
            subject: { type: String, required: true },
            date: { type: Date, required: true },
            status: { type: String, enum: ['Present', 'Absent'], required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Attendance", Attendance);
