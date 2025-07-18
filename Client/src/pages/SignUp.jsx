import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { isEmailValid } from "../utils/helper.js";
import axiosInstance from "../utils/axiosInstance.js";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    console.log("No error till part1");

    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    console.log("No error till part2");

    // signup api call

    try {
      // posting login method to axiosInstance
      console.log("No error1");
      const response = await axiosInstance.post("/admin/signup", {
        name: name? name.toUpperCase():"",
        email: email,
        password: password,

      },{
        withCredentials: true
     }
    );
      
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminName", response.data.username);
      localStorage.setItem("adminId", response.data.userId);
     
      navigate("/admin-dashboard");
    } catch (error) {
      // handle error while login
      console.log("Full Error",error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-[9vw] font-[inter]">
      <div className="w-[22vw] border-1 border-zinc-300  rounded bg-white px-7 py-10 items-center shadow-lg">
        <form onSubmit={handleSignup} className="flex flex-col gap-2">
          <h4 className="text-2xl mb-7 mx-auto">Signup</h4>
          <input
            type="text"
            placeholder="Name"
            className="w-[100%] border-1 border-zinc-300 outline-none px-5 py-2 rounded-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            className="bg-[#FF5295] text-white  w-[50%] p-2 rounded-sm text-md font-normal items-center  mx-auto cursor-pointer"
          >
            Create Account
          </button>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/admin-login" className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;