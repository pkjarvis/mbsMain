import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";

import { isEmailValid } from "../utils/helper.js";
import axiosInstance from "../utils/axiosInstance.js";

const Login = () => {
  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");
    // signup api call

    try {
      // posting login method to axiosInstance
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });

      // handle successful register
      if (response.data && response.data.token) {
        console.log(response);
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminName", response.data.username);
        console.log("1");
        navigate("/dashboard");
        console.log("2");
        return;
      }

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
    } catch (error) {
      // handle error while login
      console.log("Logging error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-[9vw] font-[inter]">
      <div className="w-[22vw] border-1 border-zinc-300  rounded bg-white px-7 py-10 items-center shadow-lg">
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <h4 className="text-2xl mb-7 mx-auto">Login</h4>
          {/* <input
              type="text"
              placeholder="Name"
              className="w-[100%] border-1 border-zinc-300 outline-none px-5 py-2 rounded-sm"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              
            /> */}

          <input
            type="email"
            placeholder="Email"
            className="w-[100%] border-1 border-zinc-300 outline-none px-5 py-2 rounded-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 w-[50%] p-2 rounded-sm text-md font-light items-center  mx-auto cursor-pointer"
          >
            Login
          </button>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/signup" className="font-medium text-primary underline">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
