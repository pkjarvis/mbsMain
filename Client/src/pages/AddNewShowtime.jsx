import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddButton from "../components/AddButton";

import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { ShowTimeContext } from "../context/ShowTimeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const baseUrl = import.meta.env.VITE_ROUTE;

const AddNewShowtime = () => {
  const { addShowTime, updateShowTime } = useContext(ShowTimeContext);

  const [startDate, setStartDate] = useState("");
  const [moviename, setMovieName] = useState("");
  const [theatrename, setTheatreName] = useState("");
  var [datetime12h, setDateTime12h] = useState(null);
  var [datetime, setDateTime] = useState(null);
  const [timearray, setTimeArray] = useState([]);

  const [selectedCities, setSelectedCities] = useState("");
  const [cities, setCities] = useState([]);

  const [duration, setDuration] = useState(null);
  const [showDateWarning,setShowDataWarning]=useState(false);
  const [message,setMessage]=useState("");


  // movie label options through get movies
  const [movies, setMovies] = useState([]);
  const [allmoviesData, setAllMoviesData] = useState([]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const newstart = new Date(start);
    const newStartDate = newstart.getDate();
    const newStartMonth = newstart.getMonth();
    const newend = new Date(end);

    const newcur = new Date(startDate);

    console.log("date", newstart);
    console.log("new", newStartDate);
    console.log("newdate", newStartMonth);

    if (newcur > newend || newcur < newstart) {
      // alert(`select showtime between movie startDate ${new Date(start)} and endDate ${new Date(end)}`);
      setShowDataWarning(true);
      setMessage(`select showtime between movie startDate ${new Date(start)} and endDate ${new Date(end)}`);
     

      setStartDate("");
    }
  }, [startDate]);

  useEffect(() => {
    axiosInstance
      .get("/get-movies", { withCredentials: true })
      .then((res) => {
        const formattedMovies = res.data.map((item) => ({
          name: item.movie,
          code: item.movie.substring(0, 3).toUpperCase(),
        }));
        console.log(res.data);
        setAllMoviesData(res.data);

        setMovies(formattedMovies);
      })
      .catch((err) => console.log(err));
  }, []);

  // theatre lable options through get theatres
  const [theatres, setTheatres] = useState([]);
  useEffect(() => {
    axiosInstance
      .get("/get-theatres", { withCredentials: true })
      .then((res) => {
        const formattedTheatre = res.data.map((item) => ({
          name: item.theatrename,
          code: item.theatrename.substring(0, 3).toUpperCase(),
        }));
        console.log(res.data);

        setTheatres(formattedTheatre);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!moviename) return;

    axiosInstance
      .get("/get-movie-byname", {
        params: { moviename: moviename.name },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Movie is fetched by name", res.data.movie[0]);
        setCities(res.data.movie[0].language);
        setDuration(res.data.movie[0].duration);
        setStart(res.data.movie[0].startDate);
        setEnd(res.data.movie[0].endDate);
       
      })
      .catch((err) => console.log(err));
  }, [moviename]);

  

  const { state } = useLocation();
  const editingNewShowTime = state?.showtime;

  const navigate = useNavigate("");

  function formatTime(val) {
    const dataObject = new Date(val);
    const hours = dataObject.getHours();
    const minutes = dataObject.getMinutes();

    var res, ans;
    if (hours >= 12 && hours <= 24) {
      res = "PM";
    } else {
      res = "AM";
    }
    ans = `${hours}:${minutes} ${res}`;
    return ans;
  }

 

  const handleTime = () => {
    if (!datetime || !datetime12h) {
      setShowDataWarning(true);
      setMessage("Pick startdate correct such that no collision occur");
      // alert("Pick startdate correct such that no collision occur");
      return;
    }
    if (datetime < datetime12h) {
      setShowDataWarning(true);
      setMessage("Add endtime greater than starttime!")
      // alert("Add endtime greater than starttime!");
      return;
    }

    var val1 = formatTime(datetime12h);
    var val2 = formatTime(datetime);

    if (!val1 || !val2) {
      console.log("Provide values for date time in time format");
      return;
    }

    console.log(val1, val2);
    // setTimeArray((prev) => [...prev, { val1, val2 }]);
    const newEntry = { val1, val2 };

    // Append and sort by val1
    setTimeArray((prev) => {
      const updated = [...prev, newEntry];

      // Custom sort logic for 12-hour format with AM/PM
      updated.sort((a, b) => {
        const parseTime = (t) => {
          const [time, meridiem] = t.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (meridiem === "PM" && hours !== 12) hours += 12;
          if (meridiem === "AM" && hours === 12) hours = 0;
          return hours * 60 + minutes;
        };

        return parseTime(a.val1) - parseTime(b.val1);
      });

      return updated;
    });

    setDateTime12h("");
    setDateTime("");
  };

  useEffect(() => {
    if (editingNewShowTime) {
      setMovieName(editingNewShowTime.moviename);
      setDateTime(editingNewShowTime.datetime);
      setDateTime12h(editingNewShowTime.datetime12h);
      setStartDate(editingNewShowTime.startDate);
      setTheatreName(editingNewShowTime.theatrename);
      setTimeArray(editingNewShowTime.timearray);
      setSelectedCities(editingNewShowTime.language);
    }
  }, [editingNewShowTime]);

  const handleShowTimeDelete = (id) => {
    setTimeArray((prev) => prev.filter((_, idx) => idx !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newShowTime = {
      id: editingNewShowTime ? editingNewShowTime.id : Date.now(),
      theatrename: theatrename.name,
      startDate: startDate,
      moviename: moviename.name,
      timearray: timearray,
      language: selectedCities,
      archived: false,
    };

    if (editingNewShowTime) {
      // api cal to update showtime
      axiosInstance
        .post("/update-showtime", newShowTime, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));

      // updateShowTime(newShowTime);
    } else {
      // backend call to put data to db when user clicks on add new showtime
      axiosInstance
        .post("/add-showtime", newShowTime, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));

      // addShowTime(newShowTime);
    }

    navigate("/admin-shows", {
      state: {
        toastMessage: editingNewShowTime
          ? "Showtime has been updated successfully"
          : "Showtime has been added successfully",
        
      },
    });
  };

  const handleCancel = () => {
    setDateTime("");
    setDateTime12h("");
    setMovieName("");
    setSelectedCities("");
    setStartDate("");
    setTheatreName("");
    setTimeArray([]);
  };

  useEffect(() => {
    console.log(datetime);
  }, [datetime]);

  useEffect(() => {
    console.log("inside use Effect");
    if (!datetime12h || !duration) return;

    const start = new Date(datetime12h);
    const end = new Date(start.getTime() + duration * 60000); // duration in ms

    setDateTime(end);
    console.log(datetime);

    // Check for collision
    const newStart = start;
    const newEnd = end;

    const isOverlapping = timearray.some(({ val1, val2 }) => {
      const [startHour, startMinute] = val1.split(/[: ]/);
      const [endHour, endMinute] = val2.split(/[: ]/);

      const startAMPM = val1.includes("PM") ? 12 : 0;
      const endAMPM = val2.includes("PM") ? 12 : 0;

      const existingStart = new Date(start);
      existingStart.setHours((parseInt(startHour) % 12) + startAMPM);
      existingStart.setMinutes(parseInt(startMinute));

      const existingEnd = new Date(start);
      existingEnd.setHours((parseInt(endHour) % 12) + endAMPM);
      existingEnd.setMinutes(parseInt(endMinute));

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (isOverlapping) {
      setShowDataWarning(true);
      setMessage("Time slot overlaps with an existing showtime. Please choose another start time.");
      // alert(
      //   "Time slot overlaps with an existing showtime. Please choose another start time."
      // );
      setDateTime("");
    }
  }, [datetime12h, duration]);

  // useEffect(()=>{
  //   if( datetime!="" && datetime<datetime12h){
  //     alert("Select endtime greater than starttime");

  //   }
  //   if(datetime12h){
  //     datetime=datetime12h+duration;
  //   }

  // },[timearray,datetime])

  return (
    <div>
      <div className="showtime-container">
        <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
        <span className="flex items-center gap-2 mx-6 ">
          <Link to="/admin-dashboard">
            <p className="text-zinc-400 font-light text-md">Home /</p>
          </Link>
          <Link to="/admin-shows">
            <p className="text-zinc-400 font-light text-md">
              Showtime Scheduling /
            </p>
          </Link>
          <p className="font-light text-sm">Add New Showtime</p>
        </span>



            {
        showDateWarning && (
          <Stack
            sx={{ width: "60%", position: "absolute", zIndex: "1020",marginLeft:"18vw" }}
            spacing={2}
          >
            <Alert 
            severity="warning" variant="filled"
            onClose={() => {setShowDataWarning(false)}}
            >
              {message}
            </Alert>
          </Stack>
        )
      }
       

        <div className="info flex flex-col place-items-center mt-[1.8vw]">
          
          <div className="flex flex-col justify-between gap-5 ">
            <p className="font-semibold text-base">Basic Info</p>
            
            {/* <input
              type="text"
              placeholder="Movie Name"
              value={moviename}
              onChange={(e) => setMovieName(e.target.value)}
              required
              className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"
            /> */}

            {/* <Box
              component="form"
              sx={{ "& > :not(style)": { width: "30vw", margin: "0.2vw 0" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Movie Name"
                variant="outlined"
                value={moviename}
                onChange={(e) => setMovieName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    // Default border color for outlined input
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#A1A2A4", // Grey border by default
                      borderWidth: "1px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#A1A2A4", // Keep grey on hover if not focused
                    },
                    // Styles when the input itself is focused
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000", // Black border when focused
                        borderWidth: "1px", // Keep border width consistent
                      },
                    },
                  },
                  // Target the label component directly
                  "& .MuiInputLabel-root": {
                    color: "#A1A2A4", // Default label color (grey)
                    fontWeight: "normal", // Assuming default is normal, if you want bold when focused
                    "&.Mui-focused": {
                      color: "#000", // Black label when focused
                      fontWeight: "light", // Bold label when focused
                    },
                    // Optional: Keep label black when it has a value (shrunk) and is not focused
                    "&.MuiInputLabel-shrink": {
                      color: "#000", // Black label when shrunk (has value)
                    },
                  },
                }}
              />
            </Box> */}


            <div className="card flex justify-content-center items-center h-[2.4vw]">
              <Dropdown
                value={moviename}
                onChange={(e) => setMovieName(e.value)}
                options={movies}
                optionLabel="name"
                placeholder="Select a Movie"
                className="w-full md:w-14rem"
                checkmark={true}
                highlightOnSelect={false}
                filter
              />
            </div>

            {/* <input
              type="text"
              placeholder="Theatre Name"
              value={theatrename}
              onChange={(e) => setTheatreName(e.target.value)}
              required
              className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"
            /> */}

            {/* <Box
              component="form"
              sx={{ "& > :not(style)": { width: "30vw", margin: "0.2vw 0" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Theatre Name"
                variant="outlined"
                value={theatrename}
                onChange={(e) => setTheatreName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    // Default border color for outlined input
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#A1A2A4", // Grey border by default
                      borderWidth: "1px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#A1A2A4", // Keep grey on hover if not focused
                    },
                    // Styles when the input itself is focused
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000", // Black border when focused
                        borderWidth: "1px", // Keep border width consistent
                      },
                    },
                  },
                  // Target the label component directly
                  "& .MuiInputLabel-root": {
                    color: "#A1A2A4", // Default label color (grey)
                    fontWeight: "normal", // Assuming default is normal, if you want bold when focused
                    "&.Mui-focused": {
                      color: "#000", // Black label when focused
                      fontWeight: "light", // Bold label when focused
                    },
                    // Optional: Keep label black when it has a value (shrunk) and is not focused
                    "&.MuiInputLabel-shrink": {
                      color: "#000", // Black label when shrunk (has value)
                    },
                  },
                }}
              />
            </Box> */}

            <div className="card flex justify-content-center h-[2.4vw] items-center">
              <Dropdown
                value={theatrename}
                onChange={(e) => setTheatreName(e.value)}
                options={theatres}
                optionLabel="name"
                placeholder="Select a Theatre"
                className="w-full md:w-14rem"
                checkmark={true}
                highlightOnSelect={false}
                filter
              />
            </div>

            <div className="flex items-center justify-between mb-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="outline-none border-1 border-zinc-300 rounded-md p-1 text-center w-[13vw] h-[2.6vw]"
              />

              {/* <div className="card flex justify-content-center w-[13vw] h-[2.4vw]">
                <MultiSelect
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={cities}
                  optionLabel="name"
                  display="chip"
                  placeholder="Language(s)"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem hover:border-none"
                  pt={{
                    root: {
                      onFocus: "outline-none border-none hover:border-none",
                      focus: "outline-none border-none",
                      className: "hover:border-none",
                    },
                    input: {
                      onFocus: "outline-none border-zinc-400 border-none",
                    },
                  }}
                />
              </div> */}
              <div className="card flex justify-content-center h-[2.4vw] items-center w-[13vw]">
                <Dropdown
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={cities}
                  optionLabel="name"
                  placeholder="Select a Language"
                  className="w-full md:w-14rem"
                  checkmark={true}
                  highlightOnSelect={false}
                  filter
                />
              </div>
            </div>

            <div className="w-[100%] max-w-[30vw] h-[14vw] border-1 border-gray-300 rounded-sm p-3 flex flex-col mb-2 ">
              <p className="font-semibold text-zinc-600 text-base mb-1">
                Add Showtime
              </p>

              <div className="flex items-center  gap-[4vw] mx-auto">
                <div className="w-[11vw]">
                  <label
                    htmlFor="calendar-12h"
                    className="font-bold block mb-2"
                  >
                    Starttime
                  </label>
                  <Calendar
                    id="calendar-12h"
                    value={datetime12h}
                    onChange={(e) => setDateTime12h(e.value)}
                    showTime
                    hourFormat="12"
                  />
                </div>
                <div className="w-[11vw]">
                  <label
                    htmlFor="calendar-12h"
                    className="font-bold block mb-2"
                  >
                    Endtime
                  </label>
                  <Calendar
                    id="calendar-12h"
                    value={datetime}
                    // onChange={(e) => setDateTime(e.value)}
                    showTime
                    hourFormat="12"
                  />
                </div>
              </div>
              <div className="flex mt-2 mx-2 gap-1">
                {timearray?.map((item, index) => (
                  <p
                    key={index}
                    className="text-[0.5vw] font-light h-[0.8vw] w-auto text-zinc-800 bg-zinc-300 items-center justify-center text-center inline rounded-md"
                  >
                    {item.val1}-{item.val2}{" "}
                    <span
                      className="text-xs cursor-pointer"
                      onClick={() => handleShowTimeDelete(index)}
                    >
                      x
                    </span>
                  </p>
                ))}
              </div>

              <div
                className="btn w-[6.8vw] h-[1.4vw] border-1 border-pink-500 rounded-md flex items-center justify-center gap-2 absolute ml-[19vw] mt-[11vw] p-0.8 cursor-pointer"
                onClick={handleTime}
              >
                <img
                  src="/assets/addButton.png"
                  alt="AddIcon"
                  className="w-[1vw] h-[1vw]"
                />
                <p className="text-xs font-semibold">Add Showtime</p>
              </div>
            </div>
            {startDate &&
            moviename &&
            theatrename &&
            selectedCities &&
            timearray?.length ? (
              <div className="buttons flex items-center justify-start gap-5 mb-1 ">
                <button
                  className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl"
                  onClick={handleSubmit}
                >
                  Add
                </button>
                <button
                  className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-xl text-zinc-700"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="buttons flex items-center justify-start gap-5 mb-1 opacity-15">
                <button
                  className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl"
                  onClick={handleSubmit}
                >
                  Add
                </button>
                <button
                  className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-xl text-zinc-700"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewShowtime;
