import React, { use, useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

import { Chips } from "primereact/chips";
import { FloatLabel } from "primereact/floatlabel";
import { useLocation, useNavigate } from "react-router-dom";
import { TheatreContext } from "../context/TheatreContext";

import axiosInstance from "../utils/axiosInstance";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const AddNewTheatre = () => {
  const [theatrename, setTheatreName] = useState("");
  const [address, setAddress] = useState("");
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [status, setStatus] = useState("");
  const [totalscreens, setTotalScreens] = useState("");

  const [theatrefile, setTheatreFile] = useState("");

  const [value, setValue] = useState([]); // multi input state

  const navigate = useNavigate("");
  const { addTheatre, updateTheatre } = useContext(TheatreContext);

  const { state } = useLocation();
  const editingTheatre = state?.theatre;

  // theatrename,address,cityName,stateName,status,totalscreens,theatrefile,value

  useEffect(() => {
    if (editingTheatre) {
      setAddress(editingTheatre.address);
      setCityName(editingTheatre.cityName);
      setStateName(editingTheatre.stateName);
      setStatus(editingTheatre.status);
      setTotalScreens(editingTheatre.totalscreens);
      setValue(editingTheatre.value);
      setTheatreFile(editingTheatre.theatrefile);
      setTheatreName(editingTheatre.theatrename);
    }
    const bg = document.getElementById("ImageBg");
    if (bg && editingTheatre) {
      bg.style.background = `url(${editingTheatre.theatrefile})`;
      bg.style.backgroundSize = "cover";
      bg.style.objectFit = "fill";
    }
  }, [editingTheatre]);

  const fileInputRef = useRef("");

  const handleDivChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    const val = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setTheatreFile(base64String);
    };

    if (val) {
      reader.readAsDataURL(val);

      let bg = document.getElementById("ImageBg");
      let imageUrl = val ? URL.createObjectURL(val) : "";
      setTheatreFile(imageUrl);
      bg.style.background = `url(${imageUrl})`;
      bg.style.backgroundSize = "cover";
      bg.style.objectFit = "fill";
    }
  };

  const divRef = useRef(null);

  const handleCancel = () => {
    setTheatreName("");
    setAddress("");
    setCityName("");
    setStateName("");
    setStatus("");
    setTotalScreens("");
    setCurrentMovies("");
    setTheatreFile(null);

    let bg = document.getElementById("ImageBg");
    bg.style.background = "";
  };

  const handleRemoveFile=()=>{
    file="";
    setFile(file);
   
    
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTheatre = {
      id: editingTheatre ? editingTheatre.id : Date.now(),
      theatrename,
      address,
      cityName,
      stateName,
      status,
      totalscreens,
      theatrefile: theatrefile || editingTheatre?.theatrefile,
      value: value,
    };

    if (editingTheatre) {
      // update api call
      await axiosInstance
        .post("/update-theatre", newTheatre, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      updateTheatre(newTheatre);
    } else {
      addTheatre(newTheatre);

      // backend call to put data to db when user clicks on add new theatre button
      await axiosInstance
        .post("/add-theatre", newTheatre, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }

    navigate("/theatre", {
      state: {
        toastMessage: editingTheatre
          ? "Theatre has been updated successfully"
          : "Theatre has been added successfully",
      },
    });
  };

  return (
    <div>
      <div className="theatre-info">
        <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
        <span className="flex items-center gap-2 mx-6 ">
          <a href="http://localhost:5173/dashboard">
            <p className="text-zinc-400 font-light text-md">Home /</p>
          </a>
          <a href="http://localhost:5173/theatre">
            <p className="text-zinc-400 font-light text-md">
              Theatre Management /
            </p>
          </a>
          <p className="font-light text-sm">Add New Theatre</p>
        </span>
        <div className="info flex flex-col place-items-center mt-[1.8vw]">
          <div className="flex flex-col justify-between gap-2">
            <p className="font-semibold text-base">Basic Info</p>
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "30vw", margin: "0.2vw 0" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Theatrename"
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
            </Box>
            {/* <input
              type="text"
              placeholder="Theatre Name"
              value={theatrename}
              onChange={(e) => setTheatreName(e.target.value)}
              required
              className="w-[30vw] h-[2vw] text-md  text-zinc-500 border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none "
            /> */}
            {/* <div className="card flex justify-content-center ">
            <FloatLabel>
                <InputText id="username" value={theatrename} onChange={(e) => setTheatreName(e.target.value)}     
                 className="w-[30vw] h-[2vw] text-md  text-zinc-500"
                 />
                <label htmlFor="username">Username</label>
            </FloatLabel>
            </div> */}
            {/* <textarea
              type="text"
              placeholder="Theatre Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-[30vw] h-[8vw] text-zinc-400  border-1 border-gray-300 p-2  rounded-sm mb-1 outline-none "
            /> */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "30vw", margin: "0.2vw 0" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Theatre Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
              {/* <input
                placeholder="City Name"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-[47%] text-sm text-zinc-400 border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between outline-none"
              /> */}
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "14vw", margin: "0.2vw 0" } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="City Name"
                  variant="outlined"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
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
              {/* <input
                placeholder="State Name"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-[47%] border-1 border-gray-300 text-sm text-zinc-400 rounded-sm p-2 flex items-center justify-between outline-none"
              /> */}
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "14vw", margin: "0.2vw 0" } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="State Name"
                  variant="outlined"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
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
            </div>

            <div className="flex items-center justify-between mb-1">
              {/* <input
                placeholder="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-[47%] text-sm text-zinc-400 border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between outline-none"
              /> */}
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "14vw", margin: "0 0" } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Status"
                  variant="outlined"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
              {/* <input
                type="number"
                placeholder="Total Screen"
                value={totalscreens}
                onChange={(e) => setTotalScreens(e.target.value)}
                className="w-[47%] text-sm text-zinc-400  border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between outline-none"
              /> */}
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "14vw", margin: "0 0" } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Total Screen"
                  variant="outlined"
                  value={totalscreens}
                  onChange={(e) => setTotalScreens(e.target.value)}
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
            </div>

            <div className="border-1 border-zinc-400 rounded-md card p-fluid mt-2 ">
              <FloatLabel>
                <Chips
                  id="username"
                  value={value}
                  onChange={(e) => setValue(e.value)}
                  allowDuplicate={false}
                  pt={{
                    label: { className: "text-sm" },
                    root: {
                     className:
                      "h-[2vw] rounded-md text-zinc-700 p-1 scroll-auto " +
                      "border border-gray-100 " + // Default border color and width (grey)
                      "focus-within:border-black " + // Standard Tailwind for container focus
                      "[&.p-focus]:border-black", // PrimeReact specific class for focus (more reliable)

                    },
                    container: {
                      className: "max-w-[30vw] h-[0.9vw]",
                    },

                    token: {
                      className: "h-[1.2vw]   font-xs p-1",
                    },
                    input: {
                      className: "max-w-[5vw] h-[0.9vw]",
                    },
                  }}
                  
                 
                />
                <label htmlFor="Current Movies" className="max-w-[30vw]">
                  Current Movies
                </label>
              </FloatLabel>
            </div>
            <p className="font-semibold text-zinc-600 text-base my-2">
              Upload Theatre Icon
            </p>

            <div
              id="ImageBg"
              className="w-[6vw] h-[6vw] flex flex-col items-center justify-center gap-4 border-1 border-dashed border-zinc-400 rounded-sm px-auto mb-1"
              onClick={handleDivChange}
            >
              {theatrefile ? (
                <div>
                  <img
                    src="../src/assets/Upload.png"
                    alt="Upload.png"
                    className="w-[1.4vw] h-[1.4vw] hidden"
                  />
                  <p className=" text-gray-500 text-sm hidden">
                    Upload file here
                  </p>
                   <span onClick={handleRemoveFile} className="cursor-pointer">
                    <p className="ml-[6vw] mb-[5.8vw] w-[1vw] h-[1vw] bg-black text-white flex items-center justify-center text-center rounded-xl text-xs font-semibold">x</p>
                  </span>
                </div>
              ) : (
                <div className="item-center mx-auto">
                  <img
                    src="../src/assets/Upload.png"
                    alt="Upload.png"
                    className="w-[1.4vw] h-[1.4vw] mx-auto"
                  />
                  <p className=" text-gray-500 text-xs mt-2 mx-auto text-wrap">
                    Upload file here
                  </p>
                </div>
              )}
              {/* <img src="../src/assets/Upload.png" alt="Upload.png" className='w-[1.4vw] h-[1.4vw]' />
                <p className=' text-gray-500 text-sm'>Upload file here</p> */}
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {theatrename &&
            address &&
            cityName &&
            stateName &&
            status &&
            totalscreens &&
            value &&
            theatrefile ? (
              <div className="buttons flex items-center justify-start gap-5 my-2 ">
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
              <div className="buttons flex items-center justify-start gap-5 mb-1 opacity-15 my-2">
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

export default AddNewTheatre;
