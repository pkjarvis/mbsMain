import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";

const ImageContainer = () => {
  const [bgimage, setBgImage] = useState("/assets/Bg-1.png");
  const handleClick = (path) => {
    setBgImage(path);
  };
  return (
    <div>
      <div className=" flex items-center w-[40%] h-[12vw] absolute top-[31vw] right-0 overflow-hidden object-fill">
        <span
          onClick={() => handleClick("/assets/Bg-2.png")}
          className="w-[25%] overflow-hidden object-cover"
        >
          <img src="/assets/Bg-2.png" alt="Bg-2" />
        </span>
        <span
          onClick={() => handleClick("/assets/Bg-3.png")}
          className="w-[25%] overflow-hidden object-cover"
        >
          <img src="/assets/Bg-3.png" alt="Bg-3" />
        </span>
        <span
          onClick={() => handleClick("/assets/Bg-4.png")}
          className="w-[25%] overflow-hidden object-cover h-[8.5vw]"
        >
          <img src="/assets/Bg-4.png" alt="Bg-4" />
        </span>
        <span
          onClick={() => handleClick("/assets/Bg-1.png")}
          className="w-[25%] overflow-hidden object-cover h-[6vw]"
        >
          <img src="/assets/Bg-1.png" alt="Bg-4" />
        </span>
      </div>
      <div className="bg-white mt-5  w-[100%] h-[70vh] overflow-hidden ">
        <img src={bgimage} alt="Bg" className="w-[100%] h-[100%] object-fill" />
        <div className="absolute right-0 top-[7vw] w-[35%] h-[2vw] border-1  rounded-2xl bg-white  border-[#d8cfcf] px-2 items-center justify-between overflow-hidden">
          <span className="flex items-center justify-between p-2">
            {/* <p className='text-zinc-400 text-xs'>Search</p> */}
            <input
              type="text"
              placeholder="Search"
              className="outline-none w-[94%]"
            />
            <IoIosSearch className="w-[0.8vw] h-[1.2vw]" />
          </span>
        </div>
        <span className="flex flex-col absolute top-[17vw] left-[8.4vw] max-w-[18vw] gap-6">
          <h1 className="text-white text-4xl font-bold">
            Redefined Movie Experience!
          </h1>
          <p className="text-white text-xl">At PVR Superplex Mall of India</p>
          <button className="bg-[#FF5295] p-2 text-xl w-[90%] h-[3vw] rounded-lg text-white font-semibold text-center cursor-pointer">
            Book Now
          </button>
        </span>
      </div>
    </div>
  );
};

export default ImageContainer;