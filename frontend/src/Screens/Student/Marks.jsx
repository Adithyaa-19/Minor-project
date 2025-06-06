import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Heading from "../../components/Heading";
import { baseApiURL } from "../../baseUrl";

const Marks = () => {
  const userData = useSelector((state) => state.userData);
  const [internal, setInternal] = useState();
  const [external, setExternal] = useState();

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/marks/getMarks`,
        { enrollmentNo: userData.enrollmentNo },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.length !== 0) {
          setInternal(response.data.Mark[0].internal);
          setExternal(response.data.Mark[0].external);
        }
      })
      .catch((error) => {
        toast.dismiss();
        console.log(error);
      });
  }, [userData.enrollmentNo]);

  // Helper to get grade based on mark and total
  const getGrade = (mark, total) => {
    const percentage = (mark / total) * 100;
    if (percentage >= 90) return "S";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    if (percentage >= 40) return "E";
    return "F";
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <Heading title={`Marks of Semester ${userData.semester}`} />
      <div className="mt-14 w-full flex gap-20">
        {internal && (
          <div className="w-1/2 shadow-md p-4">
            <p className="border-b-2 border-red-500 text-2xl font-semibold pb-2">
              Internal Marks (Out of 40)
            </p>
            <div className="mt-5">
              {Object.keys(internal).map((item, index) => {
                const mark = internal[item];
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center w-full text-lg mt-2"
                  >
                    <p className="w-full">{item}</p>
                    <span>{mark}</span>
                  
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {external && (
          <div className="w-1/2 shadow-md p-4">
            <p className="border-b-2 border-red-500 text-2xl font-semibold pb-2">
              External Marks (Out of 60)
            </p>
            <div className="mt-5">
              {Object.keys(external).map((item, index) => {
                const mark = external[item];
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center w-full text-lg mt-2"
                  >
                    <p className="w-full">{item}</p>
                    <span>{mark}</span>
                   
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {internal && external && (
          <div className="w-full shadow-md p-4 mt-10">
            <p className="border-b-2 border-red-500 text-2xl font-semibold pb-2">
              Total Marks (Out of 100)
            </p>
            <div className="mt-5">
              {Object.keys(internal).map((item, index) => {
                const internalMark = parseInt(internal[item]) || 0;
                const externalMark = parseInt(external[item]) || 0;
                const total = internalMark + externalMark;

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center w-full text-lg mt-2"
                  >
                    <p className="w-full">{item}</p>
                    <span>{total}</span>
                    <span className="ml-4 text-gray-600 text-sm">
                      ({getGrade(total, 100)})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {!internal && !external && <p>No Marks Available At The Moment!</p>}
      </div>
    </div>
  );
};

export default Marks;
