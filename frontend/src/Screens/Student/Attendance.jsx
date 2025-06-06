import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Heading from "../../components/Heading";
import { baseApiURL } from "../../baseUrl";

const StudentAttendance = () => {
    const userData = useSelector((state) => state.userData);
    const [groupedAttendance, setGroupedAttendance] = useState({});

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
        };

        if (userData.enrollmentNo) {
            axios
                .post(
                    `${baseApiURL()}/attendance/getAttendance`,
                    { enrollmentNo: userData.enrollmentNo },
                    { headers }
                )
                .then((response) => {
                    if (response.data.success && response.data.record) {
                        // Group attendance records by subject
                        const records = response.data.record.records;
                        const grouped = {};

                        records.forEach((entry) => {
                            if (!grouped[entry.subject]) {
                                grouped[entry.subject] = [];
                            }
                            grouped[entry.subject].push({
                                date: new Date(entry.date).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }),
                                status: entry.status,
                            });
                        });

                        setGroupedAttendance(grouped);
                    } else {
                        toast.error(response.data.message || "No attendance found");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Failed to fetch attendance");
                });
        }
    }, [userData.enrollmentNo]);

    const calculatePercentage = (records) => {
        const total = records.length;
        const presentCount = records.filter((entry) => entry.status === "Present").length;
        return ((presentCount / total) * 100).toFixed(2); // 2 decimal places
    };

    return (
        <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
            <Heading title={`Attendance for Semester ${userData.semester}`} />
            <div className="mt-14 w-full flex flex-wrap gap-8">
                {Object.keys(groupedAttendance).length === 0 ? (
                    <p className="text-gray-600">No Attendance Available At The Moment!</p>
                ) : (
                    Object.entries(groupedAttendance).map(([subject, records]) => (
                        <div
                            key={subject}
                            className="w-full md:w-[45%] shadow-md p-6 rounded-md bg-gray-50"
                        >
                            <h3 className="text-xl font-semibold border-b-2 border-blue-400 pb-2 mb-2">
                                {subject}
                            </h3>
                            <p className="text-sm mb-4 text-gray-700">
                                Attendance Percentage:{" "}
                                <span className="font-semibold text-blue-600">
                                    {calculatePercentage(records)}%
                                </span>
                            </p>
                            <ul className="space-y-2">
                                {records.map((entry, index) => (
                                    <li
                                        key={index}
                                        className={`flex justify-between items-center px-3 py-2 rounded ${
                                            entry.status === "Present"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        <span>{entry.date}</span>
                                        <span>{entry.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentAttendance;
