import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const baseUrl=import.meta.env.VITE_ROUTE
import Cookies from 'js-cookie';

const Navbar = (props) => {
  const username = localStorage.getItem("userName");
  useEffect(() => {
    console.log(username);
  }, [username]);

  const [visible,setVisible]=useState(false);

  const handleClick=()=>{
    setVisible(!visible);
  }

  const navigate=useNavigate("");
  const handleLogout=()=>{
    localStorage.clear();
    Cookies.remove('token');
    navigate("/admin");
  }

  return (
    <div>
      <div className="navbar  flex items-center justify-start my-2 ">
        <Link to="/admin-dashboard">
          <img
            src="/assets/Logo.png"
            alt="Logo"
            className="w-12 h-12 mx-6 cursor-pointer"
          />
        </Link>
        
        <input
          type="text"
          placeholder={props.para}
          value={props.searchValue}
          onChange={(e)=>props.onSearch && props.onSearch(e.target.value)}
          className="border-1 rounded-3xl w-[60vw] px-3 py-2 border-gray-400 outline-none"
        ></input>
        <img
          src="/assets/searchIcon.png"
          alt="Icon"
          className="w-[1.2vw] h-[1.2vw] relative ml-[-2rem]"
        />
        <span className="user flex items-center justify-between ml-[21vw] px-4 mr-2">
          <p className="text-gray-700 font-[inter] text-base font-normal leading-1">
            New Delhi
          </p>
          <img
            src="/assets/dropDownIcon.png"
            alt="DropDown"
            className="w-3 h-2 ml-1"
          />
          <span className="flex items-center cursor-pointer" onClick={handleClick}>
            <img
              src="/assets/ei_user.png"
              alt="User"
              className="w-8 h-8 ml-3"
            />
            <p className="text-gray-700 text-base font-[inter] font-normal leading-1 mr-1">
              Hi,<span className="text-md font-normal">{username}</span>{" "}
            </p>
            
            <span className={visible?`top-[2.7vw] right-[7vw]  text-white font-semibold bg-[#FF5295] w-[auto] h-[1.5vw] p-2 absolute text-center flex items-center justify-center rounded-md`:`hidden`} onClick={handleLogout}>Logout</span>
          </span>
        </span>
       
      </div>
    </div>
  );
};

export default Navbar;
