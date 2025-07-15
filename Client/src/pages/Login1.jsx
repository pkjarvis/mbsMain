import React, { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { isEmailValid } from "../utils/helper.js";
import axiosInstance from "../utils/axiosInstance.js";
import PasswordInput from "../components/PasswordInput.jsx";
import LZString from "lz-string";

const Login1 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const location = useLocation();
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

  try {
    const response = await axiosInstance.post("/user/login", {
      email,
      password,
    });

    if (response.data && response.data.token) {
      console.log("response", response);
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("userName", response.data.username);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("email", response.data.email);

      const redirectPath = location.state?.from;
      const movie = location.state?.movie;
      const reviewState = location.state?.reviewState;

      
      if (redirectPath === "/booking") {
        const compressedState = localStorage.getItem("bookingState");
        console.log(compressedState);
        if (compressedState) {
          const decompressed = LZString.decompress(compressedState);
          const bookingState = JSON.parse(decompressed);

         
          navigate("/booking", { state: bookingState });
          return;
        }
      }

     
      if (redirectPath === "/movie" && movie) {
        navigate("/movie", {
          state: {
            movie: movie,
            reviewState: reviewState,
          },
        });
        return;
      }

      
      navigate("/dashboard");
      return;
    }

    if (response.data && response.data.error) {
      setError(response.data.message);
      return;
    }
  } catch (error) {
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
            className="bg-[#FF5295] text-white  w-[50%] p-2 rounded-sm text-md font-normal items-center  mx-auto cursor-pointer"
            onSubmit={handleLogin}
          >
            Login
          </button>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/signup"
              state={location.state}
              className="font-medium text-primary underline"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login1;
