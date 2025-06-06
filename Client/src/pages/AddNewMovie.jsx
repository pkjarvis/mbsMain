import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MainHeader from "../components/MainHeader";
import AddButton from "../components/AddButton";


import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AddNewMovie = () => {
  const [movie, setMovie] = useState("");
  const [description,setDescription]=useState("")
   const [startDate, setStartDate] = useState(new Date());



  return (
    <div>
      <div className="add-movie flex flex-col">
        <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
        <span className="flex items-center gap-2 mx-6 ">
          <a href="http://localhost:5173/dashboard">
            <p className="text-zinc-400 font-light text-md">Home /</p>
          </a>
          <a href="http://localhost:5173/movie">
            <p className="text-zinc-400 font-light text-md">
              Movie Management /
            </p>
          </a>
          <p className="font-light text-sm">Add New Movie</p>
        </span>
        <div className="info flex flex-col place-items-center mt-[1.8vw]">
          <div className="flex flex-col justify-between gap-2">
            <p className="font-semibold text-base">Basic Info</p>
            <input
              type="text"
              placeholder="Movie Title"
              required
              className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"
              onChange={(e) => setMovie(e.target.value)}
            />
            <textarea
              type="text"
              placeholder="Movie Description"
              required
              className="w-[30vw] h-[8vw]  border-1 border-gray-300 p-2  rounded-sm mb-1 outline-none "
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center justify-between mb-1">
              {/* <div className="w-[49%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between"> */}
                {/* <p className="text-sm text-gray-500">Genre</p>
                <img
                  src="../src/assets/dropDownIcon.png"
                  alt="DropDown"
                  className="w-3 h-2"
                /> */}
                <select  id="genre" className="w-[48%] border-1 border-gray-300 rounded-sm p-1 flex items-center justify-between outline-none">
                  <option id="thriller" value="thriller">Thriller</option>
                  <option id="adventure" value="adventure">Adventure</option>
                  <option id="comedy" value="comedy">Comedy</option>
                  <option id="horror" value="horror">Horror</option>
                </select>
               
              {/* </div> */}
               <select id="language" className="w-[48%] border-1 border-gray-300 rounded-sm p-1 flex items-center justify-between outline-none">
                  <option id="english" value="english" className="outline-none">English</option>
                  <option id="hindi" value="hindi">Hindi</option>
                  <option id="marathi" value="marathi">Marathi</option>
                  <option id="telugu" value="telugu">Telugu</option>
                </select>
            </div>  

            <div className="flex items-center justify-between mb-1">
              {/* <div className="w-[47%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">Start Date</p>
                <img
                  src="../src/assets/calendar.png"
                  alt="DropDown"
                  className="w-3 h-3"
                />
              </div> */}
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} 
               className="outline-none border-1 border-zinc-300 rounded-sm p-2 text-center" 
             
               />

              

              <div className="w-[47%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">End Date</p>
                <img
                  src="../src/assets/calendar.png"
                  alt="DropDown"
                  className="w-3 h-3"
                />
              </div>
            </div>
            <div className="w-[30vw] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between mb-1">
              <p className="text-sm text-gray-500">Status</p>
              <img
                src="../src/assets/dropDownIcon.png"
                alt="DropDown"
                className="w-3 h-2"
              />
            </div>
            <p className="font-semibold text-zinc-600 text-base mb-1">
              Upload Poster
            </p>
            <div className="w-[6vw] h-[6vw] flex flex-col items-center justify-center gap-4 border-1 border-dashed border-zinc-400 rounded-sm px-auto mb-1">
              <img
                src="../src/assets/Upload.png"
                alt="Upload.png"
                className="w-[1.4vw] h-[1.4vw]"
              />
              <p className=" text-gray-500 text-sm">Upload file here</p>
            </div>
            <div className="buttons flex items-center justify-start gap-5 mb-1 opacity-25">
              <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-sm">
                Add
              </button>
              <button className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-sm text-zinc-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewMovie;
