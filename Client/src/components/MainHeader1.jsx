import React from "react";
import NavBar1 from "./NavBar1";
import { Link, useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_ROUTE;

const MainHeader1 = (props) => {
  
  return (
    <div className="theatre-container font-[Inter]">
      <NavBar1 />
      <span className="flex items-center justify-start mx-[3vw] gap-1 mt-2">
        <Link to="/dashboard"
          className="cursor-pointer font-light text-zinc-500 "
         
        >
          Home /{" "}
        </Link>
        <Link
          to="/movie"
          className="cursor-pointer font-light text-zinc-500"
        >
          {props.headerlink}{" "}
        </Link>
        <Link to="/showtime" className="cursor-pointer">
          {" "}
          {props.nextlink}
        </Link>
      </span>
    </div>
  );
};

export default MainHeader1;
