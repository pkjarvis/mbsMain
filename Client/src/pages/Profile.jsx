import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Cookies from 'js-cookie';


const baseUrl = import.meta.env.VITE_ROUTE;
const Profile = () => {
  const username = localStorage.getItem("userName");
  const emailAddress = localStorage.getItem("email");

  const [name, setName] = useState(username);
  const [selectedCity, setSelectedCity] = useState(false);
  
  const [email, setEmail] = useState(emailAddress);

  useEffect(() => {
    console.log(username);
  }, [username]);

  const navigate = useNavigate("");

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove('token');
    if(!username){
      navigate("/dashboard");
    }else{
      navigate("/root");
    }
    
  };

  const handleSave = ()=>{
    
    axiosInstance.post("/update-profile",{name,email},{withCredentials:true})
    .then(res=>{
      console.log(res.data)
      localStorage.setItem("userName",name);
     })
    .catch(err=>console.log(err))
  }

  

  return (
    <div>
      <div className="profile-container">
        <NavBar1 title={username}  selectedCity={selectedCity}
          setSelectedCity={setSelectedCity} />
        <div className="bg-[#E2E0E0] p-2">
          <div className="flex items-center gap-[3vw] mx-[2.4vw]">
            <a href={baseUrl+"/profile"}>Profile</a>
            <a href={baseUrl+"/history"}>History</a>
          </div>
        </div>
        <div className="bg-[#F1F1F1] mx-[3vw] h-[70vh] pt-[2vw] mt-[1.6vw]">
          <div className="h-[6.4vw] w-[100%] bg-linear-to-r from-[#2D3148] to-[#E54D61] relative ">
            <div className="flex items-center justify-start gap-[2vw] pt-[2vw] mx-[12vw] ">
              <span className="w-[6.4vw] h-[6.2vw] rounded-full bg-[#D9D9D9] flex items-center justify-center ">
                <img
                  src="/assets/camera.png"
                  alt="Camera"
                  className="w-[3vw] h-[3vw] z-10"
                />
              </span>
              <p className="text-xl text-white">Hi,{username}</p>
            </div>
          </div>

          <div className="content-container flex flex-col items-start justify-center mt-[2vw] ml-[22vw]">
            <h2 className="text-2xl font-medium text-center">
              Personal Details
            </h2>
            <span className="flex justify-between items-center gap-[7vw] mt-[1vw]">
              <p className="text-md max-w-[18%]"> Name</p>
              <input
                type="text"
                placeholder="Enter first name here"
                value={name}
                className="w-[30vw] h-[2vw] p-1 bg-white border-1 border-[#CCCCCC] focus:outline-none rounded-md"
                onChange={(e) => setName(e.target.value.toUpperCase())}
              />
            </span>
            
            <span className="flex justify-between items-center gap-[3.7vw] mt-[1vw]">
              <p className="text-md max-w-[18%]">Email Address</p>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                className="w-[30vw] h-[2vw] p-1 bg-white border-1 border-[#CCCCCC] focus:outline-none rounded-md"
                onChange={(e) => setEmail(e.target.value)}
              />
            </span>
          
          </div>

          <div className="flex items-center justify-end mt-[4vw] gap-5 max-w-[68%]">
            <span className="w-[10%] h-[2vw] border-1 border-[#FF1414] rounded-sm flex items-center justify-center p-3 cursor-pointer">
              <p className=" text-md text-[#FF1414]" onClick={handleLogout}>
                Log out
              </p>
            </span>
            <span className="w-[10%] h-[2vw]  bg-[#FF5295] rounded-sm flex items-center justify-center p-3 cursor-pointer" onClick={handleSave}>
              <p className=" text-md text-white">Save</p>
            </span>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;