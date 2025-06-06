import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLogIn } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseApiURL } from "../baseUrl";

const Login = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Student");
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.login !== "" && data.password !== "") {
      const headers = {
        "Content-Type": "application/json",
      };
      axios
        .post(`${baseApiURL()}/${selected.toLowerCase()}/auth/login`, data, {
          headers: headers,
        })
        .then((response) => {
          navigate(`/${selected.toLowerCase()}`, {
            state: { type: selected, loginid: response.data.loginid },
          });
        })
        .catch((error) => {
          toast.dismiss();
          console.error(error);
          toast.error(error.response.data.message);
        });
    } else {
    }
  };

  return (
    <div
      className="h-screen w-full flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://www.kletech.ac.in/hubballi/images/abt-over-img.jpg')`,
      }}
    >
      {/* Optional overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

      {/* Login box */}
      <div className="relative z-10 w-[40%] bg-white bg-opacity-90 rounded-lg p-8 shadow-lg flex justify-center items-start flex-col">
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p className="text-3xl font-semibold pb-2">
            {selected} Login
          </p>
        </div>
        <form
          className="flex justify-center items-center flex-col w-full mt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-[70%]">
            <label className="mb-1" htmlFor="eno">
              {selected} Login ID
            </label>
            <input
              type="number"
              id="eno"
              required
              className="bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500"
              {...register("loginid")}
            />
          </div>
          <div className="flex flex-col w-[70%] mt-3">
            <label className="mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500"
              {...register("password")}
            />
          </div>
          <button className="bg-blue-500 mt-5 text-white px-6 py-2 text-xl rounded-md hover:bg-blue-700 transition-all flex justify-center items-center">
            Login
            <span className="ml-2">
              <FiLogIn />
            </span>
          </button>
        </form>
      </div>

      {/* Role selection buttons */}
      <div className="absolute top-4 right-4 z-10">
        {["Student", "Faculty", "Admin"].map((role) => (
          <button
            key={role}
            className={`text-blue-500 mr-6 text-base font-semibold hover:text-blue-700 transition-all ${selected === role && "border-b-2 border-green-500"
              }`}
            onClick={() => setSelected(role)}
          >
            {role}
          </button>
        ))}
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;
