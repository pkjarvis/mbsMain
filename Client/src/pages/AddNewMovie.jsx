import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MainHeader from "../components/MainHeader";
import AddButton from "../components/AddButton";

// import DatePicker from "react-datepicker";

const baseUrl = import.meta.env.VITE_ROUTE;

import "react-datepicker/dist/react-datepicker.css";
import { MoviesContext } from "../context/MovieContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { MultiSelect } from "primereact/multiselect";
import axiosInstance from "../utils/axiosInstance";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AddNewMovie = () => {
  const [movie, setMovie] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  var [file, setFile] = useState("");
  const [duration, setDuration] = useState(null);

  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [language, setLanguage] = useState("");
  const cities = [
    { name: "English", code: "ENG" },
    { name: "Hindi", code: "HN" },
    { name: "Marathi", code: "MT" },
    { name: "Telugu", code: "TLG" },
    { name: "Punjabi", code: "PNJ" },
    { name: "Spanish", code: "SPN" },
    { name: "French", code: "FRN" },
    { name: "German", code: "GER" },
  ];

  const { addMovie, updateMovie } = useContext(MoviesContext);

  const { state } = useLocation();
  const editingMovie = state?.movie;

  useEffect(() => {
    if (editingMovie) {
      setMovie(editingMovie.movie);
      setDescription(editingMovie.description);
      setStartDate(editingMovie.startDate);
      setEndDate(editingMovie.endDate);
      setGenre(editingMovie.genre);
      setFile(editingMovie.file);
      setStatus(editingMovie.status);
      setLanguage(editingMovie.language);
      setDuration(editingMovie.duration);
    }

    const bg = document.getElementById("ImageBg");
    if (bg && editingMovie) {
      bg.style.background = `url(${editingMovie.file})`;
      bg.style.backgroundSize = "cover";
      bg.style.objectFit = "fill";
    }
  }, [editingMovie]);

  // handling auto status
  useEffect(() => {
    const currentTime = new Date();
    if (!startDate && !endDate) return;

    const newstart = new Date(startDate);
    const newend = new Date(endDate);

    if (currentTime >= newstart && currentTime <= newend) {
      setStatus("Now Showing");
    } else if (currentTime > newend && currentTime > newstart) {
      setStatus("Expired");
    } else if (currentTime < newstart && currentTime < newend) {
      setStatus("Upcoming");
    } else {
      setStatus("");
    }
  }, [startDate, endDate]);

  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    e.preventDefault();

    const val = e.target.files[0];
    if (!val) return;
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setFile(base64String);
    };

    if (val) {
      reader.readAsDataURL(val);
      console.log("file", val);
      let bg = document.getElementById("ImageBg");
      let imageUrl = val ? URL.createObjectURL(val) : "";
      // let imageUrl=val?convertToBase64(val):"";
      setFile(imageUrl);
      bg.style.background = `url(${imageUrl})`;
      bg.style.backgroundSize = "cover";
      bg.style.objectFit = "fill";
    }
  };

  const handleCancel = () => {
    setMovie("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setGenre("");
    setSelectedCities("");
    setStatus("");
    setFile(null);
    setLanguage("");
    let bg = document.getElementById("ImageBg");
    bg.style.background = "";
  };

  const handleRemoveFile = () => {
    setFile("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Step 2: Clear the background image
    const bg = document.getElementById("ImageBg");
    if (bg) {
      bg.style.background = "";
    }
    setFileInputKey(Date.now());
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMovie = {
      id: editingMovie ? editingMovie.id : Date.now(),
      movie,
      description,
      startDate,
      endDate,
      genre,
      language,
      status,
      file: file || editingMovie?.file,
      duration,
    };

    console.log(newMovie);

    if (startDate > endDate) {
      alert("StartDate should be less than EndDate");
      return;
    }

    if (editingMovie) {
      // update api call
      await axiosInstance
        .post("/update-movie", newMovie, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));

      // updateMovie(newMovie);
    } else {
      // add api call
      await axiosInstance
        .post("/add-movie", newMovie, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));

      // addMovie(newMovie);
    }

    navigate("/admin-movie", {
      state: {
        toastMessage: editingMovie
          ? "Movie has been updated successfully"
          : "Movie has been added successfully",
        setShowDataWarning: false,
      },
    });
  };

  return (
    <div>
      <div className="add-movie flex flex-col">
        <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
        <span className="flex items-center gap-2 mx-6 ">
          <Link to="/admin-dashboard">
            <p className="text-zinc-400 font-light text-md">Home /</p>
          </Link>
          <Link to="/admin-movie">
            <p className="text-zinc-400 font-light text-md">
              Movie Management /
            </p>
          </Link>
          <p className="font-light text-sm">Add New Movie</p>
        </span>
        <div className="info flex flex-col place-items-center mt-[1.8vw]">
          <div className="flex flex-col justify-between gap-3">
            <p className="font-semibold text-base">Basic Info</p>
            {/* <input
              type="text"
              placeholder="Movie Title"
              required
              value={movie}
              className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"
              onChange={(e) => setMovie(e.target.value)}
            /> */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "30vw", margin: "0.2vw 0" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Movie Title"
                variant="outlined"
                value={movie}
                onChange={(e) => setMovie(e.target.value)}
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
            </Box>

            {/* <textarea
              type="text"
              placeholder="Movie Description"
              required
              value={description}
              className="w-[30vw] h-[8vw]  border-1 border-gray-300 p-2  rounded-sm mb-1 outline-none "
              onChange={(e) => setDescription(e.target.value)}
            /> */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "30vw", margin: "0.2vw 0" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Movie Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            </Box>
            <div className="flex items-center justify-between mb-1">
              <select
                id="genre"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-[14vw] h-[2vw] border-1 border-[#A1A2A4] rounded-sm p-1 flex items-center justify-between outline-none"
              >
                <option id="default">Genre</option>
                <option id="thriller">Thriller</option>
                <option id="adventure">Adventure</option>
                <option id="adventure">Action</option>
                <option id="comedy">Comedy</option>
                <option id="horror">Horror</option>
                <option id="drama">Drama</option>
                <option id="mystery">Mystery</option>
                <option id="romance">Romance</option>
                <option id="fantasy">Fantasy</option>
              </select>

              <div className="card flex justify-content-center w-[14vw] h-[2vw]">
                <MultiSelect
                  value={language}
                  onChange={(e) => setLanguage(e.value)}
                  options={cities}
                  optionLabel="name"
                  display="chip"
                  placeholder="Language(s)"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem border-[#A1A2A4]"
                  pt={{
                    root: {
                      onFocus: "outline-none border-none",
                      focus: "outline-none border-none",
                    },
                    input: {
                      onFocus: "outline-none border-zinc-400 border-none",
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-start gap-9 mb-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="outline-none border-1 border-[#A1A2A4] rounded-sm p-1 text-center w-[14vw]"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="outline-none border-1 border-[#A1A2A4] rounded-sm p-1 text-center w-[14vw]"
              />
            </div>

            {/* <select
              id="language"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-[100%] h-[2vw]  border-1 border-[#A1A2A4] rounded-sm p-2 flex items-center justify-between outline-none"
            >
              <option value="">Status</option>
              <option id="nowshowing" className="outline-none">
                Now Showing
              </option>
              <option id="expired">Expired</option>
              <option id="upcoming">Upcoming</option>
            </select> */}

            {/*  Removed Status From the Add movie as not needed  */}
            {/* <Box
              component="form"
              sx={{ "& > :not(style)": { width: "30vw", margin: "0.2vw 0" } }}
              noValidate
              autoComplete="off"
            >
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    // Default border color for outlined input
                    height: "2.2vw",

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
              >
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="Age"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value={"Now Showing"}>Now Showing</MenuItem>
                  <MenuItem value={"Expired"}>Expired</MenuItem>
                  <MenuItem value={"Upcoming"}>Upcoming</MenuItem>
                </Select>
              </FormControl>
            </Box> */}



            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "30vw", margin: "0.2vw 0" } }}
              noValidate
              autoComplete="off"
            >
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    // Default border color for outlined input
                    height: "2.2vw",

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
              >
                <InputLabel id="demo-simple-select-label">
                  Duration (in minutes)
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={duration}
                  label="Duration (in minutes)"
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                  <MenuItem value={50}>Fifty</MenuItem>
                  <MenuItem value={60}>Sixty</MenuItem>
                  <MenuItem value={90}>Ninty</MenuItem>
                  <MenuItem value={120}>One Twenty</MenuItem>
                  <MenuItem value={150}>One Fifty</MenuItem>
                  <MenuItem value={160}>One Sixty</MenuItem>
                  <MenuItem value={180}>One Eighty</MenuItem>
                  <MenuItem value={200}>Two Hundred</MenuItem>
                  <MenuItem value={240}>Two Forty</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <p className="font-semibold text-zinc-600 text-base my-2">
              Upload Poster
            </p>

            <div
              id="ImageBg"
              className="w-[6vw] h-[6vw] flex flex-col items-center justify-center gap-4 border-1 border-dashed border-zinc-400 rounded-sm px-auto mb-1 bg-[url(file)]"
              onClick={handleDivClick}
            >
              {file ? (
                <div>
                  <img
                    src="/assets/Upload.png"
                    alt="Upload.png"
                    className="w-[1.4vw] h-[1.4vw] hidden mx-auto"
                  />
                  <p className=" text-gray-500 text-xs mx-auto hidden">
                    Upload file here
                  </p>
                  <span onClick={handleRemoveFile} className="cursor-pointer">
                    <p className="ml-[6vw] mb-[5.8vw] w-[1vw] h-[1vw] bg-black text-white flex items-center justify-center text-center rounded-xl text-xs font-semibold">
                      x
                    </p>
                  </span>
                </div>
              ) : (
                <div>
                  <img
                    src="/assets/Upload.png"
                    alt="Upload.png"
                    className="w-[1.4vw] h-[1.4vw] mx-auto"
                  />
                  <p className=" text-gray-500 text-xs mx-auto mt-2">
                    Upload file here
                  </p>
                </div>
              )}

              <input
                key={fileInputKey}
                type="file"
                className=" text-gray-500 text-sm mx-auto hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            {movie &&
            description &&
            startDate &&
            endDate &&
            genre &&
            language &&
            status &&
            file ? (
              <div className="buttons flex items-center justify-start gap-5 mb-1">
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
              <div className="buttons flex items-center justify-start gap-5 mb-1 opacity-25">
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

export default AddNewMovie;
