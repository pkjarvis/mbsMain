import React, { use, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

const AddNewTheatre = () => {
  const [theatrename, setTheatreName] = useState("");
  const [address, setAddress] = useState("");
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [status, setStatus] = useState("");
  const [totalscreens, setTotalScreens] = useState("");
  const [currentmovies, setCurrentMovies] = useState("");
  const [items, setItems] = useState([]);
  const [theatrefile, setTheatreFile] = useState("");

  const fileInputRef = useRef("");

  const handleDivChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const val = e.target.files[0];
    if (val) {
      console.log("file", val);

      let bg = document.getElementById("ImageBg");
      let imageUrl = URL.createObjectURL(val);
      console.log(imageUrl);
      setTheatreFile(imageUrl);
      bg.style.background = `url(${imageUrl})`;
      bg.style.backgroundSize = "cover";
      bg.style.objectFit = "fill";
    }
  };

  const divRef = useRef(null);

  const handleInputChange = () => {
    divRef.current.click();
  };

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
  useEffect(() => {
    console.log(currentmovies, "currebt");
  }, [currentmovies]);

  // const divRef = useRef(null);

  const handleMultipleInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent new line in contentEditable
      const text = e.target.innerText.trim();
      if (text !== "") {
        setItems([...items, text]);
        e.target.innerText = ""; // clear contentEditable div
      }
    }
  };

  const handleDelete = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleChange = (e) => {
    // console.log(e.t)
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
            <input
              type="text"
              placeholder="Theatre Name"
              value={theatrename}
              onChange={(e) => setTheatreName(e.target.value)}
              required
              className="w-[30vw] h-[2vw] text-md  text-zinc-400 border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"
            />
            <textarea
              type="text"
              placeholder="Theatre Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-[30vw] h-[8vw] text-zinc-400  border-1 border-gray-300 p-2  rounded-sm mb-1 outline-none "
            />
            <div className="flex items-center justify-between mb-1">
              <input
                placeholder="City Name"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-[47%] text-sm text-zinc-400 border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between outline-none"
              />
              <input
                placeholder="State Name"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-[47%] border-1 border-gray-300 text-sm text-zinc-400 rounded-sm p-2 flex items-center justify-between outline-none"
              />
            </div>

            <div className="flex items-center justify-between mb-1">
              <input
                placeholder="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-[47%] text-sm text-zinc-400 border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between outline-none"
              />
              <input
                type="number"
                placeholder="Total No. Of Screens"
                value={totalscreens}
                onChange={(e) => setTotalScreens(e.target.value)}
                className="w-[47%] text-sm text-zinc-400  border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between outline-none"
              />
            </div>

            <div>
              <div
                contentEditable="true"
                id="MultiInput"
                className="w-[30vw] min-h-8 text-sm text-zinc-400 border border-gray-300 rounded-sm p-2 flex flex-wrap gap-2 items-center justify-start mb-1 outline-none"
                onKeyDown={handleMultipleInput}
                ref={divRef}
              ></div>

              <div className="flex flex-wrap gap-2 mt-2">
                {items.map((item, index) => (
                  <span
                    key={index}
                    className="w-auto px-2 py-1 flex items-center justify-between border border-gray-300 rounded-xl bg-gray-100"
                  >
                    <h4 className="text-xs text-zinc-700 mr-1">{item}</h4>
                    <span
                      className="remove text-sm text-zinc-600 cursor-pointer"
                      onClick={() => handleDelete(index)}
                    >
                      x
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <p className="font-semibold text-zinc-600 text-base mb-1">
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
            currentmovies &&
            theatrefile ? (
              <div className="buttons flex items-center justify-start gap-5 mb-1 ">
                <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl">
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
                <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl">
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
