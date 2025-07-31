import React, { use, useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

import { Chips } from "primereact/chips";
import { FloatLabel } from "primereact/floatlabel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TheatreContext } from "../context/TheatreContext";

import axiosInstance from "../utils/axiosInstance";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

const baseUrl = import.meta.env.VITE_ROUTE;

const AddNewTheatre = () => {
  const [theatrename, setTheatreName] = useState("");
  const [address, setAddress] = useState("");
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [status, setStatus] = useState("");
  const [totalscreens, setTotalScreens] = useState("");

  var [theatrefile, setTheatreFile] = useState("");

  // const [value, setValue] = useState([]); // multi input state

  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [showDateWarning, setShowDataWarning] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { addTheatre, updateTheatre } = useContext(TheatreContext);

  const [rowCount, setRowCount] = useState(0);
  const [colCount, setColCount] = useState(0);
  const [seatPrice, setSeatPrice] = useState(0);

  const handleRowChange = (e) => {
    const val = Math.min(parseInt(e.target.value), 10);
    setRowCount(val);
  };

  const handleColChange = (e) => {
    const val = Math.min(parseInt(e.target.value), 15);
    setColCount(val);
  };

  const handlePriceChange = (e) => {
    const val = Math.min(parseInt(e.target.value), 10000);
    setSeatPrice(val);
  };




  const { state } = useLocation();
  const editingTheatre = state?.theatre;

  // theatrename,address,cityName,stateName,status,totalscreens,theatrefile,value

  useEffect(() => {

    const fetchSeats = async () => {
      try {
        const res = await axiosInstance.get(`/seats?theatreId=${editingTheatre?.id}`); 

        console.log("Response is:",res.data);
         const rawSeats = res?.data?.seats;

      // Get unique row labels (A, B, C...)
      const uniqueRows = Array.from(new Set(rawSeats.map(seat => seat.Row))).sort();
      const rowCount = uniqueRows?.length;

     
      const colCount = res?.data?.seats?.length/rowCount;

      // Extract base price from first seat
      const basePrice = res.data.seats[0]?.Price;

      console.log("Total Rows:", rowCount);
      console.log("Columns per row:", colCount);
      console.log("Base Price:", basePrice);

      setRowCount(rowCount);
      setColCount(colCount);
      setSeatPrice(basePrice);

       

        
      } catch (err) {
        console.error(err);
      }
    };

    fetchSeats();
  }, [editingTheatre]);




  useEffect(() => {
    if (editingTheatre) {
      setAddress(editingTheatre?.address);
      setCityName(editingTheatre?.cityName);
      setStateName(editingTheatre?.stateName);
      setStatus(editingTheatre?.status);
      setTotalScreens(editingTheatre?.totalscreens);
      // setValue(editingTheatre?.value);
      setTheatreFile(editingTheatre?.theatrefile);
      console.log("theatre file is:", editingTheatre?.theatrefile);
      setTheatreName(editingTheatre?.theatrename);
      // setShowDataWarning(true);
      setColCount(editingTheatre?.colCount);
      setRowCount(editingTheatre?.rowCount);
      setSeatPrice(editingTheatre?.seatPrice);
      setMessage("Also edit corresponding showtime of this theatre!");
      
    }

    const bg = document.getElementById("ImageBg");
    if (bg && editingTheatre) {
      bg.style.background = `url(${editingTheatre?.theatrefile})`;
      bg.style.backgroundSize = "cover";
      bg.style.objectFit = "fill";
    }
  }, [editingTheatre]);

  const fileInputRef = useRef("");

  const handleDivChange = () => {
    fileInputRef.current.click();
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    console.log("url is:", json);
    return json;
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    const val = e.target.files[0];
    if (!val) return;

    const imageUrl = await uploadImage(val);
    setTheatreFile(imageUrl?.url);

    const reader = new FileReader();

    // reader.onloadend = () => {
    //   const base64String = reader.result;
    //   setFile(base64String);
    // };

    if (val) {
      reader.readAsDataURL(val);
      console.log("file", val);
      let bg = document.getElementById("ImageBg");
      // let imageUrl = val ? URL.createObjectURL(val) : "";
      // setTheatreFile(imageUrl);
      bg.style.background = `url(${imageUrl?.url})`;
      bg.style.backgroundSize = "cover";
      bg.style.objectFit = "fill";
    }
  };

  const divRef = useRef(null);

  const handleCancel = () => {
    navigate("/admin-theatre");
  };

  const handleRemoveFile = () => {
    setTheatreFile("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const bg = document.getElementById("ImageBg");
    if (bg) {
      bg.style.background = "";
    }
    setFileInputKey(Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !theatrename ||
      !address ||
      !cityName ||
      !stateName ||
      !totalscreens ||
      // !value ||
      !theatrefile ||
      !rowCount || !colCount || !seatPrice
    ) {
      setShowDataWarning(true);
      setMessage("Don't leave us hanging — complete every field to unlock the magic 🪄")
      return;
    }
    const theatreNameRegex = /^[A-Za-z]/;
    if (!theatreNameRegex.test(theatrename)) {
      setShowDataWarning(true);
      setMessage(
        "Theatre name must start with an alphabet (not _, number, or special character)"
      );
      return;
    }
    const newTheatre = {
      id: editingTheatre?.id,
      theatrename,
      address,
      cityName,
      stateName,
      status,
      totalscreens,
      theatrefile: theatrefile || editingTheatre?.theatrefile,
      rowCount: parseInt(rowCount),
      colCount: parseInt(colCount),
      seatPrice: parseInt(seatPrice),
      // value: value,
    };

    if (editingTheatre) {
      // update api call
      await axiosInstance
        .post("/update-theatre", newTheatre, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));

      // updateTheatre(newTheatre);
    } else {
      // backend call to put data to db when user clicks on add new theatre button
      await axiosInstance
        .post("/add-theatre", newTheatre, {
          withCredentials: true,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));

      // addTheatre(newTheatre);
    }

    navigate("/admin-theatre", {
      state: {
        toastMessage: editingTheatre
          ? "Theatre has been updated successfully"
          : "Theatre has been added successfully",
        setShowDataWarning: false,
      },
    });
  };

  const cityStateMap = {
    "New Delhi": "New Delhi",
    Mumbai: "Maharashtra",
    Pune: "Maharashtra",
    Hyderabad: "Telangana",
    Agra: "Uttar Pradesh",
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const handleTotalScrrenChange = (e) => {
    setTotalScreens(e.target.value);
  };

  return (
    <div>
      <div className="theatre-info">
        <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
        <span className="flex items-center gap-2 mx-6 ">
          <Link to="/admin-dashboard">
            <p className="text-zinc-400 font-light text-md">Home /</p>
          </Link>
          <Link to="/admin-theatre">
            <p className="text-zinc-400 font-light text-md">
              Theatre Management /
            </p>
          </Link>
          <p className="font-light text-sm">Add New Theatre</p>
        </span>

        {showDateWarning && (
          <Stack
            sx={{
              width: "60%",
              position: "absolute",
              zIndex: "1020",
              marginLeft: "18vw",
              marginTop: "0.1vw",
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

        <div className="info flex flex-col place-items-center mt-[1vw]">
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
              <Box
                sx={{ "& > :not(style)": { width: "14vw", margin: "0 0" } }}
                noValidate
                autoComplete="off"
              >
                <FormControl
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      // Default border color for outlined input
                      height: "2.2vw",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A1A2A4", // Grey border by default
                        borderWidth: "1px",
                        height: "3rem",
                        alignItems: "center",
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
                    CityName
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={cityName}
                    label="CityName"
                    onChange={(e) => {
                      setCityName(e.target.value);

                      if (e.target.value != "") {
                        const state = e.target.value;
                        setStateName(cityStateMap[state]);
                      }
                    }}
                  >
                    <MenuItem value={"New Delhi"}>New Delhi</MenuItem>
                    <MenuItem value={"Mumbai"}>Mumbai</MenuItem>
                    <MenuItem value={"Pune"}>Pune</MenuItem>
                    <MenuItem value={"Agra"}>Agra</MenuItem>
                    <MenuItem value={"Hyderabad"}>Hyderabad</MenuItem>
                  </Select>
                </FormControl>
              </Box>

             
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
                  // onChange={(e) => setStateName(e.target.value)}
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
              {/*  Status change needs to be removed */}

              <Box
                sx={{ "& > :not(style)": { width: "14vw", margin: "0 0" } }}
                noValidate
                autoComplete="off"
              >
                <FormControl
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      // Default border color for outlined input
                      height: "2.2vw",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A1A2A4", // Grey border by default
                        borderWidth: "1px",
                        height: "3rem",
                        alignItems: "center",
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
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value={"Active"}>Active</MenuItem>
                    <MenuItem value={"Inactive"}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box
                sx={{ "& > :not(style)": { width: "14vw", margin: "0 0" } }}
                noValidate
                autoComplete="off"
              >
                <FormControl
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      // Default border color for outlined input
                      height: "2.2vw",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A1A2A4", // Grey border by default
                        borderWidth: "1px",
                        height: "3rem",
                        alignItems: "center",
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
                    TotalScreens
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={totalscreens}
                    label="TotalScreens"
                    onChange={handleTotalScrrenChange}
                  >
                    <MenuItem value={"1"}>1</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="max-w-[30vw] p-6 bg-white rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                Configure Seat Layout
              </h2>

              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Rows (Max 10)
                </label>
                <input
                  type="number"
                  value={rowCount}
                  onChange={handleRowChange}
                  min={1}
                  max={10}
                  className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Columns (Max 15)
                </label>
                <input
                  type="number"
                  value={colCount}
                  onChange={handleColChange}
                  min={1}
                  max={15}
                  className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Base Seat Price (Max 10000)
                </label>
                <input
                  type="number"
                  value={seatPrice}
                  onChange={handlePriceChange}
                  min={0}
                  max={2000}
                  className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
                    src="/assets/Upload.png"
                    alt="Upload.png"
                    className="w-[1.4vw] h-[1.4vw] hidden"
                  />
                  <p className=" text-gray-500 text-sm hidden">
                    Upload file here
                  </p>
                  <span onClick={handleRemoveFile} className="cursor-pointer">
                    <p className="ml-[6vw] mb-[5.8vw] w-[1vw] h-[1vw] bg-black text-white flex items-center justify-center text-center rounded-xl text-xs font-semibold">
                      x
                    </p>
                  </span>
                </div>
              ) : (
                <div className="item-center mx-auto">
                  <img
                    src="/assets/Upload.png"
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
                key={fileInputKey}
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {(theatrename &&
              address &&
              cityName &&
              stateName &&
              totalscreens &&
              theatrefile && rowCount && colCount && seatPrice) 
              ? (
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
              <div className="buttons flex items-center justify-start gap-5 mb-1 my-2">
                <button
                  className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl opacity-15 "
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
