import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { baseApiURL } from "../../baseUrl";

const Attendance = () => {
    const [subject, setSubject] = useState();
    const [branch, setBranch] = useState();
    const [studentData, setStudentData] = useState();
    const [selected, setSelected] = useState({
        branch: "",
        semester: "",
        subject: "",
        date: "",
    });

    const loadStudentDetails = () => {
        const headers = {
            "Content-Type": "application/json",
        };
        axios
            .post(
                `${baseApiURL()}/student/details/getDetails`,
                { branch: selected.branch, semester: selected.semester },
                { headers }
            )
            .then((response) => {
                if (response.data.success) {
                    setStudentData(response.data.user);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message);
            });
    };

    const submitAttendanceHandler = () => {
        let container = document.getElementById("attendanceContainer");
        container.childNodes.forEach((enroll) => {
            const status = document.querySelector(
                `input[name="${enroll.id}-status"]:checked`
            )?.value;

            if (status) {
                const payload = {
                    enrollmentNo: enroll.id,
                    subject: selected.subject,
                    date: selected.date,
                    status: status === "present" ? "Present" : "Absent"
                };

                setStudentAttendanceHandler(payload);
            }
        });
    };

    const setStudentAttendanceHandler = (data) => {
        axios
            .post(`${baseApiURL()}/attendance/addAttendance`, data)
            .then((response) => {
                if (response.data.success) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message);
            });
    };


    const getBranchData = () => {
        axios
            .get(`${baseApiURL()}/branch/getBranch`)
            .then((response) => {
                if (response.data.success) {
                    setBranch(response.data.branches);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message);
            });
    };

    const getSubjectData = () => {
        toast.loading("Loading Subjects");
        axios
            .get(`${baseApiURL()}/subject/getSubject`)
            .then((response) => {
                toast.dismiss();
                if (response.data.success) {
                    setSubject(response.data.subject);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.dismiss();
                toast.error(error.message);
            });
    };

    useEffect(() => {
        getBranchData();
        getSubjectData();
    }, []);

    const resetValueHandler = () => {
        setStudentData();
    };

    return (
        <div className="w-full mx-auto flex justify-center items-start flex-col my-10">
            <div className="relative flex justify-between items-center w-full">
                <Heading title={`Upload Attendance`} />
                {studentData && (
                    <button
                        className="absolute right-2 flex justify-center items-center border-2 border-red-500 px-3 py-2 rounded text-red-500"
                        onClick={resetValueHandler}
                    >
            <span className="mr-2">
              <BiArrowBack className="text-red-500" />
            </span>
                        Close
                    </button>
                )}
            </div>
            {!studentData && (
                <>
                    <div className="mt-10 w-full flex justify-evenly items-center gap-x-6">
                        <div className="w-full">
                            <label htmlFor="branch" className="leading-7 text-base">
                                Select Branch
                            </label>
                            <select
                                id="branch"
                                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full mt-1"
                                value={selected.branch}
                                onChange={(e) =>
                                    setSelected({ ...selected, branch: e.target.value })
                                }
                            >
                                <option defaultValue>-- Select --</option>
                                {branch &&
                                    branch.map((branch) => (
                                        <option value={branch.name} key={branch.name}>
                                            {branch.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label htmlFor="semester" className="leading-7 text-base">
                                Select Semester
                            </label>
                            <select
                                id="semester"
                                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full mt-1"
                                value={selected.semester}
                                onChange={(e) =>
                                    setSelected({ ...selected, semester: e.target.value })
                                }
                            >
                                <option defaultValue>-- Select --</option>
                                {[...Array(8)].map((_, i) => (
                                    <option value={i + 1} key={i + 1}>
                                        {i + 1} Semester
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label htmlFor="subject" className="leading-7 text-base">
                                Select Subject
                            </label>
                            <select
                                id="subject"
                                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full mt-1"
                                value={selected.subject}
                                onChange={(e) =>
                                    setSelected({ ...selected, subject: e.target.value })
                                }
                            >
                                <option defaultValue>-- Select --</option>
                                {subject &&
                                    subject.map((subject) => (
                                        <option value={subject.name} key={subject.name}>
                                            {subject.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="w-full">
                            <label htmlFor="date" className="leading-7 text-base">
                                Select Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                className="px-2 py-3 bg-blue-50 rounded-sm text-base w-full mt-1"
                                value={selected.date}
                                onChange={(e) =>
                                    setSelected({ ...selected, date: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <button
                        className="bg-blue-50 px-4 py-2 mt-8 mx-auto rounded border-2 border-blue-500 text-black"
                        onClick={loadStudentDetails}
                    >
                        Load Student Data
                    </button>
                </>
            )}
            {studentData && studentData.length !== 0 && (
                <>
                    <p className="mt-4 text-lg">
                        Mark Attendance for {selected.branch} Semester {selected.semester} in{" "}
                        {selected.subject} on {selected.date}
                    </p>
                    <div
                        className="w-full flex flex-wrap justify-center items-center mt-8 gap-4"
                        id="attendanceContainer"
                    >
                        {studentData.map((student) => (
                            <div
                                key={student.enrollmentNo}
                                className="w-[40%] flex justify-between items-center border-2 border-blue-500 rounded p-2"
                                id={student.enrollmentNo}
                            >
                                <p className="text-lg px-2 w-1/3 bg-blue-50">
                                    {student.enrollmentNo}
                                </p>
                                <div className="w-2/3 flex justify-around">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`${student.enrollmentNo}-status`}
                                            value="present"
                                            className="mr-1"
                                        />
                                        Present
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`${student.enrollmentNo}-status`}
                                            value="absent"
                                            className="ml-4 mr-1"
                                        />
                                        Absent
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="bg-blue-500 px-6 py-3 mt-8 mx-auto rounded text-white"
                        onClick={submitAttendanceHandler}
                    >
                        Submit Attendance
                    </button>
                </>
            )}
        </div>
    );
};

export default Attendance;
