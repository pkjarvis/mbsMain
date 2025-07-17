import React, { useEffect, useMemo, useState } from "react";
import NavBar1 from "../components/NavBar1";
import { Dropdown } from "primereact/dropdown";
import Footer from "../components/Footer";
import MainHeader1 from "../components/MainHeader1";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Theatres from "../components/Theatres";
import axiosInstance from "../utils/axiosInstance";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import axios from "axios";

// theatre-> id,theatrename,address,cityName,stateName,status,totalscreens,theatrefile,value

const Showtime = () => {
  const [language, setLanguage] = useState(null);
  // const [showDateWarning, setShowDataWarning] = useState(false);

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

  const [datebooked, setDateBooked] = useState([]);
  const [showtime, setShowTime] = useState([]);
  const [theatrenames, setTheatreNames] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (!movie.id) return;
    axiosInstance
      .get("/get-show", {
        params: { movieId: movie.id },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Current movie showtime", res.data);
        setShowTime(res.data.showtime);
        setDateBooked(res.data.booked);
      })
      .catch((err) =>
        console.log("Error fetching movies", err.response?.data || err.message)
      );

    showtime.map((item) => setTheatreNames(item.Theatre.theatrename));

    // alert("First Select The Date You Want To Watch Show, then showtime  would fetch")
  }, []);

  console.log("Booked ", datebooked);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!movie) return;

    axiosInstance
      .get(
        "/get-movie-byid",
        { params: { movieId: movie.id } },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("response of moviebyid", res.data.movie);
        setStartDate(res.data.movie[0].startDate);
        setEndDate(res.data.movie[0].endDate);
      })
      .catch((err) => console.log(err));
  }, []);

  const curDate = new Date();
  const curweekday = curDate.toLocaleString("en-US", { weekday: "short" });
  let day = curDate.getDate();
  let month = curDate.getMonth() + 1;

  const getDatesBetween = (start, end) => {
    var startDate = new Date(start);
    var endDate = new Date(end);
    const dateList = [];

    const paramStartDate = startDate.getDate();
    const paramEndDate = endDate.getDate();

    if (day >= paramStartDate && day <= paramEndDate) {
      startDate = new Date();
    }
    // console.log("function date",startDate)

    if (paramStartDate > endDate) return;

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

  useEffect(() => {
    console.log("selected", selectedCity.name);
  }, []);

  const datelist = getDatesBetween(startDate, endDate);

  const [curdate, setCurDate] = useState("");
  const handleDateSelection = (par1, par2, par3) => {
    let val = par1 + " " + par2 + " " + par3;
    setCurDate(val);
  };

  function parseCurDateToLocalDateStr(dateStr) {
    const [weekday, day, monthStr] = dateStr.split(" ");

    const monthMap = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };

    const year = new Date().getFullYear();
    const month = monthMap[monthStr.toUpperCase()];
    const dateObj = new Date(year, month, parseInt(day));

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  }

  // Parses backend's startDate to local date string like "2025-07-10"
  function parseBackendStartDateToLocalDateStr(isoString) {
    const dateObj = new Date(isoString); // UTC parsed
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth(); // already 0-indexed
    const day = dateObj.getDate();

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  }

  // Final filtered showtime array based on selected date
  
  const filteredShowtime = useMemo(() => {
    if (!curdate) return [];

    const selectedDateStr = parseCurDateToLocalDateStr(curdate);

    return showtime.filter((show) => {
      if (!show?.startDate || !show?.Theatre?.cityName) return false;

      const showDateStr = parseBackendStartDateToLocalDateStr(show.startDate);

      // Match both date and city (if selected)
      const isSameDate = selectedDateStr === showDateStr;
      const isSameCity = selectedCity?.name
        ? show.Theatre.cityName.trim().toLowerCase() ===
          selectedCity.name.trim().toLowerCase()
        : true;

      return isSameDate && isSameCity;
    });
  }, [curdate, selectedCity, showtime]);


  // console.log("curdate is ",curdate);
  console.log("showtime details", showtime);

  return (
    <div>
      <div className="showtime-container">
        <div className="theatre-container font-[Inter]">
          <NavBar1
            title={username}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
          <span className="flex items-center justify-start mx-[3vw] gap-1 mt-2">
            <Link
              to="/dashboard"
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
                <span key={index} className="inline-block flex-wrap">
                  {lang.name}
                  {index < movie.language.length - 1 && ", "}
                </span>
              ))}
            </p>
            <div className="date-container max-w-[60%] h-[28%]  rounded-xl border-1 border-[#EBEBEB] flex items-center justify-start mt-4 ">
              <div className="flex items-center justify-between gap-4  w-[auto] p-[1vw] overflow-x-scroll ">
                {datelist.map((dateInfo, index) => (
                  <span
                    key={index}
                    className={`bg-[#F5F5F5] flex flex-col w-[4vw] h-[5.2vw] p-2  items-center justify-center rounded-2xl hover:border-1 hover:border-[#FF5295] hover:scale-115 ease-in-out duration-150 ${
                      curdate ===
                      dateInfo.weekday +
                        " " +
                        dateInfo.day +
                        " " +
                        dateInfo.month
                        ? "bg-[#FF5295] hover:border-none"
                        : ""
                    } `}
                    onClick={() =>
                      handleDateSelection(
                        dateInfo.weekday,
                        dateInfo.day,
                        dateInfo.month
                      )
                    }
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
          </div>
        </div>
        {/* Time Slots Section */}
        <div className="time-slots bg-[#F9F9F9] mx-[3vw] flex flex-col mt-[-6vw]">
          {!curdate ? (
            <p className="text-md font-medium text-gray-500 ml-[3vw]">
              Please select a date to see available shows.
            </p>
          ) : filteredShowtime.length > 0 ? (
            filteredShowtime.map((show) => (
              <Theatres
                key={show.id}
                theatre={show.Theatre}
                movies={show.Movie}
                timearray={show.timearray}
                date={curdate}

                // setShowDataWarning={setShowDataWarning}
              />
            ))
          ) : (
            <p className="text-md font-medium text-gray-500 ml-[3vw]">
              No shows available for selected date.
            </p>
          )}
        </div>

        {/* Footer Section */}
        <Footer />
      </div>
    </div>
  );
};

export default Showtime;
