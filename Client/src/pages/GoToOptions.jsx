import React from "react";
import { Link } from "react-router-dom";

const GoToOptions = () => {
  return (
    <div className="flex items-center justify-center gap-[5vw] mx-auto my-[40vh]">
      <span className="bg-pink-500 rounded-md p-2">
        <Link to="/admin" className="text-md font-normal text-white ">
          Go to admin side
        </Link>
      </span>
      <span className="bg-pink-500 rounded-md p-2">
        <Link to="/root" className="text-md font-normal text-white">
          Go to user side
        </Link>
      </span>
    </div>
  );
};

export default GoToOptions;
