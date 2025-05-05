import axios from "axios";
import React, {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {useSelector} from "react-redux";
import Heading from "../../components/Heading";
import {baseApiURL} from "../../baseUrl";

const StudentAttendance = () => {
    const userData = useSelector((state) => state.userData);
    const [attendance, setAttendance] = useState();
    const [absentDates, setAbsentDates] = useState();

    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
        };

        if (userData.enrollmentNo) {
            axios
                .post(
                    `${baseApiURL()}/attendance/getAttendance`,
                    {enrollmentNo: userData.enrollmentNo},
                    {headers}
                )
                .then((response) => {
                    console.log("Attendance response:", response.data);
                    if (response.data.success && response.data.record?.length > 0) {
                        setAttendance(response.data.record[0].presentDates);
                        setAbsentDates(response.data.record[0].absentDates);
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

    return (
        <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
            <Heading title={`Attendance for Semester ${userData.semester}`}/>
            <div className="mt-14 w-full flex gap-10 flex-wrap">
                {/* Present Dates Card */}
                {attendance && Object.keys(attendance).length > 0 && (
                    <div className="w-full md:w-1/2 shadow-md p-6 bg-green-50 rounded-md">
                        <p className="border-b-2 border-green-500 text-2xl font-semibold pb-2 mb-4">
                            Present Dates
                        </p>
                        {Object.entries(attendance).map(([subject, dateString], index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-lg mb-1">{subject}</p>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(dateString)
                                        ? dateString.map((date, i) => (
                                            <span
                                                key={i}
                                                className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                                            >
                          {new Date(date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })}
                        </span>
                                        ))
                                        : (
                                            <span
                                                className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                          {new Date(dateString).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })}
                        </span>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Absent Dates Card */}
                {absentDates && Object.keys(absentDates).length > 0 && (
                    <div className="w-full md:w-1/2 shadow-md p-6 bg-red-50 rounded-md">
                        <p className="border-b-2 border-red-500 text-2xl font-semibold pb-2 mb-4">
                            Absent Dates
                        </p>
                        {Object.entries(absentDates).map(([subject, dateString], index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-lg mb-1">{subject}</p>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(dateString)
                                        ? dateString.map((date, i) => (
                                            <span
                                                key={i}
                                                className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm"
                                            >
                          {new Date(date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })}
                        </span>
                                        ))
                                        : (
                                            <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm">
                          {new Date(dateString).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })}
                        </span>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Fallback */}
                {!attendance && !absentDates && (
                    <p className="text-lg text-gray-600">No Attendance Available At The Moment!</p>
                )}
            </div>
        </div>
    );
};

export default StudentAttendance;
