import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import { Dropdown } from "primereact/dropdown";
import Footer from "../components/Footer";
import MainHeader1 from "../components/MainHeader1";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Theatres from "../components/Theatres";
import axiosInstance from "../utils/axiosInstance";

// theatre-> id,theatrename,address,cityName,stateName,status,totalscreens,theatrefile,value

const Showtime = () => {
  const [language, setLanguage] = useState(null);
  const languagesArray = [
    { name: "Hindi", code: "HND" },
    { name: "Marathi", code: "MRT" },
    { name: "English", code: "ENG" },
    { name: "Malayalam", code: "MLM" },
    { name: "Telugu", code: "TLG" },
  ];

  const [preferredslot, setPreferredSlot] = useState(null);
  const timeslotArray = [
    { name: "8AM-10AM", code: "T1" },
    { name: "10AM-12AM", code: "T2" },
    { name: "12AM-2PM", code: "T3" },
    { name: "2PM-4PM", code: "T4" },
    { name: "4PM-6PM", code: "T5" },
    { name: "6PM-8PM", code: "T6" },
    { name: "8PM-10PM", code: "T7" },
    { name: "10PM-12PM", code: "T8" },
  ];

  const navigate = useNavigate("");

  const handleClick = () => {
    navigate("/showbooking");
  };
  const username = localStorage.getItem("userName");
  useEffect(() => {
    console.log(username);
  }, [username]);

  const { state } = useLocation();
  const movie = state?.movie;
  console.log("movies", movie);

  const NavigateDashboard = () => {
    navigate("/");
  };

  // api call for get theatre & showtime

  const [theatres, setTheatres] = useState([]);
  const [showtime, setShowTime] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/get-theatres", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setTheatres(res.data);
      })
      .catch((err) =>
        console.log("Error fetching movies", err.response?.data || err.message)
      );
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/get-showtime", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setShowTime(res.data);
      })
      .catch((err) =>
        console.log("Error fetching movies", err.response?.data || err.message)
      );
  }, []);

  const startDate = movie.startDate;
  const endDate = movie.endDate;



  const getDatesBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateList = [];
    
    if(startDate>endDate) return;

    while (startDate <= endDate) {
      const month = startDate
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();
      const day = startDate.getDate();
      const weekday = startDate.toLocaleString("en-US", { weekday: "short" });

      dateList.push({ month, day, weekday });

      startDate.setDate(startDate.getDate() + 1); // Go to next day
    }

    return dateList;
  };

  
  const datelist = getDatesBetween(startDate, endDate);

  return (
    <div>
      <div className="showtime-container">
        <div className="theatre-container font-[Inter]">
          <NavBar1 title={username} />
          <span className="flex items-center justify-start mx-[3vw] gap-1 mt-2">
            <Link
              to="/"
              // href="http://localhost:3000/dashboard"
              className="cursor-pointer font-light text-zinc-500 "
            >
              Home /{" "}
            </Link>
            {/* <a href="http://localhost:3000/movie" className='cursor-pointer font-light text-zinc-500'>Movie /</a>
                <a href="http://localhost:3000/showtime" className='cursor-pointer'> Show Time</a> */}
            <Link
              to="/movie"
              state={{ movie }}
              className="cursor-pointer font-light text-zinc-500"
            >
              Movie /
            </Link>
            <Link to="/showtime" state={{ movie }} className="cursor-pointer ">
              Show Time
            </Link>
          </span>
        </div>

        {/* Header Section */}
        <div className="flex items-center justify-start  h-[30vw] p-2 mt-[3vw]">
          {/* Header Left Section */}
          <div className="h-[30vw] w-[20%] items-start ml-[2.5vw] overflow-hidden">
            <img
              // src="../src/assets/Azaad.png"
              src={movie.file}
              alt={movie.movie}
              className="w-[95%] h-[70%] my-auto"
            />
          </div>
          {/* Header Right Section*/}
          <div className="h-[100%] flex flex-col items-start justify-start p-[2vw] max-w-[50%]">
            <h1 className="text-4xl font-bold">{movie.movie}</h1>
            <p className="text-[#6F6F6F] mt-[1vw]">
              <span className="text-black ">2h 49m</span> {movie.genre} | UA13+
              |{" "}
              {movie.language?.map((lang, index) => (
                <p key={index} className="inline-block flex-wrap">
                  {lang.name}
                  {index < movie.language.length - 1 && ", "}
                </p>
              ))}
            </p>
            <div className="date-container w-[auto] h-[28%]  rounded-xl border-1 border-[#EBEBEB] flex items-center justify-start mt-4">
              <div className="flex items-center justify-between gap-4  w-[auto] p-[1vw]">
                {datelist.map((dateInfo, index) => (
                  <span
                    key={index}
                    className="bg-[#F5F5F5] flex flex-col w-[4.2vw] h-[5.2vw] p-2  items-center justify-center rounded-2xl hover:border-1 hover:border-[#FF5295] hover:scale-115 ease-in-out duration-150"
                  >
                    <p className="text-xl font-light text-black">
                      {dateInfo.month}
                    </p>
                    <p className="text-2xl font-semibold text-black">
                      {dateInfo.day}
                    </p>
                    <p className="text-md font-light text-black">
                      {dateInfo.weekday}
                    </p>
                  </span>
                ))}
    
              </div>
            </div>

            <div className="flex items-center mt-[2vw] gap-[2vw]">
              <div className="card flex justify-content-center">
                <Dropdown
                  value={language}
                  onChange={(e) => setLanguage(e.value)}
                  options={languagesArray}
                  optionLabel="name"
                  placeholder="Language"
                  className="w-full md:w-14rem"
                />
              </div>
              <div className="card flex justify-content-center ">
                <Dropdown
                  value={preferredslot}
                  onChange={(e) => setPreferredSlot(e.value)}
                  options={timeslotArray}
                  optionLabel="name"
                  placeholder="Preffered time slots"
                  className="w-full md:w-14rem"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Time Slots Section */}
        <div className="time-slots bg-[#F9F9F9] mx-[3vw] flex flex-col mt-[-6vw]">
          {theatres.length > 0 ? (
            theatres.map((t) => (
              <Theatres key={t.id} theatre={t} state={movie} />
            ))
          ) : (
            <p className="text-md">No Theatres Added</p>
          )}
        </div>

        {/* Footer Section */}
        <Footer />
      </div>
    </div>
  );
};

export default Showtime;