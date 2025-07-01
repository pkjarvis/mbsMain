import React from "react";
import Blocks from "../components/Blocks";
import GoogleLogo from "../assets/GoogleLogo.png";
import EmailLogo from "../assets/email.png"
const baseUrl=import.meta.env.VITE_ROUTE;

const Root = () => {
  return (
     <div className="container h-[100vh] max-w-[100%] bg-white place-items-center">
        
        <div className="content  h-[90%] pt-12 w-[90%] flex justify-between gap-[9rem] mx-auto my-auto">
          <div className="left w-[50%] flex flex-col gap-7">
            <img src="/assets/Logo.png" alt="Logo" className="w-[4rem]"/>
            <img src="/assets/Welcome.png" alt="Welcome" className="w-[16rem] mx-auto mt-22 mb-6" />
            <Blocks icon={GoogleLogo} name="Google" />
            <a href={baseUrl+"/signup"}><Blocks icon={EmailLogo} name="Email" /></a>
            <p className="text-gray-600 mt-[19rem] mx-auto">I agree to the Terms & Conditions & Privacy Policy</p>
          </div>
          <div className="right w-[50%]">
            <img src="/assets/Bg.png" alt="BackgroundImg" className="w-[100%] h-[100%]"/>
          </div>
        </div>
      </div>
  )
}

export default Root