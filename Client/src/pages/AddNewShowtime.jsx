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
  const [showDateWarning, setShowDataWarning] = useState(false);
  const [message, setMessage] = useState("");

  const [today, setToday] = useState("");
  useEffect(() => {
    const currentDate = new Date();
    const formatted = currentDate.toISOString().split("T")[0];
    setToday(formatted);
  }, []);

  const { state } = useLocation();
  const editingNewShowTime = state?.showtime;
  console.log("editingNewShowTime is",editingNewShowTime?.id);

  // movie label options through get movies
  const [movies, setMovies] = useState([]);
  const [allmoviesData, setAllMoviesData] = useState([]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/get-movies", { withCredentials: true })
      .then((res) => {
        const today = new Date();
        // Filter movies where endDate is today or in the future
        const activeMovies = res.data.filter((item) => {
          const endDate = new Date(item.endDate);
          return endDate >= today;
        });

        const formattedMovies = activeMovies.map((item) => ({
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
        const activeTheatres = res.data.filter(
          (item) => item.status === "Active"
        );
        const formattedTheatre = activeTheatres.map((item) => ({
          name: item.theatrename,
          code: item.theatrename.substring(0, 3).toUpperCase(),
        }));
        console.log(res.data);

        setTheatres(formattedTheatre);
      })
      .catch((err) => console.log(err));
  }, []);

  const [movieId, setMovieId] = useState(null);

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
        setMovieId(res.data.movie[0].id);
      })
      .catch((err) => console.log(err));
  }, [moviename]);

  const [currentheatrestatus, setCurrentTheatreStatus] = useState("");
  useEffect(() => {
    if (!theatrename) return;
    axiosInstance
      .get("/get-theatre-byname", {
        params: { theatrename: theatrename?.name },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Theatre by name is", res.data.theatre[0]);
        console.log("status is", res.data.theatre[0].status);
        setCurrentTheatreStatus(res.data.theatre[0].status);
      });
  }, [theatrename]);

  const formattedEndDate = end ? new Date(end).toISOString().split("T")[0] : "";

  // get shows

  // const [usedShowDates, setUsedShowDates] = useState([]);
  const [showtime, setShowTime] = useState([]);

  useEffect(() => {
    if (!moviename) return;

    axiosInstance
      .get("/get-show", {
        params: { movieId },
        withCredentials: true,
      })
      .then((res) => {
        console.log("response is ", res.data);
        const datesUsed = res.data.showtime.map(
          (st) => new Date(st.startDate).toISOString().split("T")[0]
        );
        setShowTime(res.data.showtime);
        // setUsedShowDates(datesUsed); // e.g., ["2025-07-10", "2025-07-11"]
      })
      .catch((err) => console.log(err));
  }, [movieId]);

  const formatToDateString = (inputDate) => {
    const dateObj = new Date(inputDate);
    return isNaN(dateObj) ? null : dateObj.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (
      !editingNewShowTime ||
      movies.length === 0 ||
      theatres.length === 0 ||
      allmoviesData.length === 0
    )
      return;

    const matchedMovie = movies.find(
      (m) => m.name === editingNewShowTime.moviename
    );
    const matchedTheatre = theatres.find(
      (t) => t.name === editingNewShowTime.theatrename
    );

    if (matchedMovie) setMovieName(matchedMovie);
    if (matchedTheatre) setTheatreName(matchedTheatre);

    // setMovieName(editingNewShowTime?.moviename);
    setDateTime(editingNewShowTime?.datetime);
    setDateTime12h(editingNewShowTime?.datetime12h);
    setStartDate(editingNewShowTime?.startDate);
    // setTheatreName(editingNewShowTime?.theatrename);
    setTimeArray(editingNewShowTime?.timearray || []);
    setSelectedCities(editingNewShowTime?.language);
    console.log("editing newshowtime", editingNewShowTime);
  }, [editingNewShowTime, movies, theatres, allmoviesData]);

  // start date
  useEffect(() => {
    const newstart = new Date(start);
    const newStartDate = newstart.getDate();
    const newStartMonth = newstart.getMonth();
    const newend = new Date(end);

    const newcur = new Date(startDate);

    console.log("date", newstart);
    console.log("new", newStartDate);
    console.log("newdate", newStartMonth);

    // const selectedDateStr = formatToDateString(startDate);
    // if (usedShowDates.includes(selectedDateStr)) {
    //   setShowDataWarning(true);
    //   setMessage(`Showtime already added for ${selectedDateStr}`);
    //   setStartDate("");
    //   return;
    // }

    if (newcur > newend || newcur < newstart) {
      // alert(`select showtime between movie startDate ${new Date(start)} and endDate ${new Date(end)}`);
      setShowDataWarning(true);
      setMessage(
        `select showtime between movie startDate ${new Date(
          start
        )} and endDate ${new Date(end)}`
      );

      setStartDate("");
    }
  }, [startDate]);

  const isToday = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  };

  const navigate = useNavigate("");

  function formatTimeTo12Hour(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    return `${hours}:${minutes} ${ampm}`;
  }

  const handleTime = () => {
    if (!datetime || !datetime12h) {
      setShowDataWarning(true);
      setMessage("Pick startdate correct such that no collision occur");
      // alert("Pick startdate correct such that no collision occur");
      return;
    }
    const now = new Date();
    const selected = new Date(datetime12h);

    if (isToday(startDate) && selected < now) {
      setShowDataWarning(true);
      setMessage("Start time cannot be in the past.");
      return;
    }

    if (datetime < datetime12h) {
      setShowDataWarning(true);
      setMessage("Add endtime greater than starttime!");
      // alert("Add endtime greater than starttime!");
      return;
    }

    var val1 = formatTimeTo12Hour(datetime12h);
    var val2 = formatTimeTo12Hour(datetime);

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

      const parseTime = (timeStr) => {
        const [time, meridiem] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (meridiem === "PM" && hours !== 12) hours += 12;
        if (meridiem === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      updated.sort((a, b) => parseTime(a.val1) - parseTime(b.val1));
      return updated;
    });

    setDateTime12h("");
    setDateTime("");
  };

  const handleShowTimeDelete = (id) => {
    setTimeArray((prev) => prev.filter((_, idx) => idx !== id));
  };

  // Adding constraint that can't edit / add shows if theatre is inactive or cur end date is passed.
  useEffect(() => {
    const current = new Date();
    const todayDateOnly = new Date(current.setHours(0, 0, 0, 0));
    const endDateObj = new Date(end);
    const endDateOnly = new Date(endDateObj.setHours(0, 0, 0, 0));

    if (moviename && end && todayDateOnly > endDateOnly) {
      setShowDataWarning(true);
      setMessage("Cannot add/edit showtime. The movie has already ended.");
    }

    // if (theatrename && currentheatrestatus !== "Active") {
    //   console.log("current theatre status",currentheatrestatus);
    //   setShowDataWarning(true);
    //   setMessage("Cannot add showtime. Selected theatre is inactive.");
    // }
  }, [moviename, end, currentheatrestatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newShowTime = {
      id: editingNewShowTime?.id,
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
    navigate("/admin-shows");
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
    const parseToDate = (str) => {
      const [time, meridiem] = str.split(" ");
      const [hoursStr, minutesStr] = time.split(":");
      let hours = parseInt(hoursStr);
      const minutes = parseInt(minutesStr);
      if (meridiem === "PM" && hours !== 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      const d = new Date(start);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const isOverlapping = timearray.some(({ val1, val2 }) => {
      const existingStart = parseToDate(val1);
      const existingEnd = parseToDate(val2);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (!isOverlapping) {
      setShowDataWarning(false);
      setMessage("");
    }

    if (isOverlapping) {
      setShowDataWarning(true);
      setMessage(
        "Time slot overlaps with an existing showtime. Please choose another start time."
      );
      setDateTime("");
    }
  }, [datetime12h, duration]);

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

        {showDateWarning && (
          <Stack
            sx={{
              width: "60%",
              position: "absolute",
              zIndex: "1020",
              marginLeft: "18vw",
            }}
            spacing={2}
          >
            <Alert
              severity="warning"
              variant="filled"
              onClose={() => {
                setShowDataWarning(false);
              }}
            >
              {message}
            </Alert>
          </Stack>
        )}

        <div className="info flex flex-col place-items-center mt-[1.8vw]">
          <div className="flex flex-col justify-between gap-5 ">
            <p className="font-semibold text-base">Basic Info</p>

            <div className="card flex justify-content-center items-center h-[2.4vw] ">
              <Dropdown
                value={moviename}
                onChange={(e) => setMovieName(e.value)}
                options={movies}
                optionLabel="name"
                placeholder="Select a Movie"
                className="w-full md:w-14rem showtime-movie"
                checkmark={true}
                highlightOnSelect={false}
                filter
              />
            </div>

            <div className="card flex justify-content-center h-[2.4vw] items-center ">
              <Dropdown
                value={theatrename}
                onChange={(e) => setTheatreName(e.value)}
                options={theatres}
                optionLabel="name"
                placeholder="Select a Theatre"
                className="w-full md:w-14rem showtime-theatre"
                checkmark={true}
                highlightOnSelect={false}
                filter
              />
            </div>

            <div className="flex items-center justify-between mb-1">
              <input
                type="date"
                value={startDate}
                min={today}
                max={formattedEndDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="outline-none border-1 border-zinc-300 rounded-md p-1 text-center w-[13vw] h-[2.7vw]"
              />

              <div className="card flex justify-content-center h-[2.4vw] items-center w-[13vw]">
                <Dropdown
                  value={selectedCities}
                  onChange={(e) => setSelectedCities(e.value)}
                  options={cities}
                  optionLabel="name"
                  placeholder="Select a Language"
                  className="w-full md:w-14rem showtime-language"
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
                    minDate={isToday(startDate) ? new Date() : null}
                    className="custom-calendar"
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
                    minDate={isToday(startDate) ? new Date() : null}
                    className="custom-calendar"
                  />
                </div>
              </div>
              <div className="flex mt-2 mx-2 gap-1">
                {timearray?.map((item, index) => (
                  <div key={index}>
                    <p
                      key={index}
                      className="text-[0.5vw] font-light h-[0.8vw] w-auto text-[#1F242D] bg-[#E1E4EA] items-center justify-center text-center inline rounded-xl p-1"
                    >
                      {item.val1}-{item.val2}{" "}
                      <span
                        className="text-xs cursor-pointer"
                        onClick={() => handleShowTimeDelete(index)}
                      >
                        x
                      </span>
                    </p>
                  </div>
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
                  className="bg-[#FF5295] cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl"
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
                  className="bg-[#FF5295] cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl"
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
