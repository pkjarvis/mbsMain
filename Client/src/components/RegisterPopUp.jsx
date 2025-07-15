import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterPopUp = () => {
  
  const location=useLocation();

  const navigate=useNavigate("");

  // const handleClick=()=>{
  //   props.func(!props.val);
  // }

  const handleRoute=()=>{
    navigate("/signup",{state:location.state});
  }

  return (
    <div className="flex items-center justify-center z-60 ">
      <div className="pop-up-container flex flex-col bg-white rounded-2xl items-center justify-evenly w-[35%] h-[30vw]  absolute top-[8vw] shadow-2xl cursor-pointer">
        <span className="flex">
          {/* <p className="text-3xl text-black absolute right-9 top-5" onClick={handleClick}>x</p> */}
        </span>
        <div className="w-[34%] h-[2.2vw] ">
          <img src="/assets/Welcome.png" alt="Welcome" />
        </div>
        <div className="w-[100%] flex flex-col items-center justify-center gap-7 ">
          {/* <span className="flex items-center justify-center gap-2 border-1 border-[#898888] rounded-xl w-[75%] h-[4vw] p-[2vw]">
            <img
              src="/assets/GoogleLogo.png"
              alt="Google"
              className="w-[1.4vw] h-[1.2vw]"
            />
            <p className="text-2xl font-medium text-[#626262]">
              Continue with Google
            </p>
          </span> */}
          <span className="flex items-center justify-center gap-2 border-1 border-[#898888] rounded-xl w-[75%] h-[4vw] p-[2vw]" onClick={handleRoute}>
            <img
              src="/assets/email.png"
              alt="Google"
              className="w-[2vw] h-[1.3vw]"
            />
            <p className="text-2xl font-medium text-[#626262]">
              Continue with Email
            </p>
          </span>
        </div>
        <p className="text-normal font-light">OR</p>
        <span className="flex items-center justify-evenly gap-4">
            <img src="/assets/flagImg.png" alt="Flag" className="w-[1vw] h-[1vw]" />
            <p className="text-[#A3A3A3]">+91</p>
            <p className="text-[#A3A3A3] underline text-[1.2vw]">Continue with mobile number</p>
        </span>

        <p className="text-medium font-normal text-[#A3A3A3] font-roboto flex-wrap">
          I agree to the{" "} 
          <span className="underline decoration-solid">
            Terms & Conditions{" "}
          </span>
          &{" "}<span className="underline decoration-solid">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPopUp;