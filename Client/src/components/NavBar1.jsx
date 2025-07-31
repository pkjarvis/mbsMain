import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const NavBar1 = (props) => {
  // const [flag, setFlag] = useState(false);

  const { title, selectedCity, setSelectedCity } = props;
  const [flag, setFlag] = useState(selectedCity);

  const username = localStorage.getItem("userName");


  const dropdownRef = useRef(null);

  // const [selectedCity, setSelectedCity] = useState("");
  const cities = [
    { name: "New Delhi", code: "ND" },
    { name: "Pune", code: "PN" },
    { name: "Agra", code: "AGR" },
    { name: "Hyderabad", code: "HYD" },
    { name: "Mumbai", code: "MB" },
  ];
  const navigate = useNavigate("");

  const handleClick = () => {
    setFlag(!flag);
  };

  // useEffect(()=>{
  //   if (!selectedCity?.name) return;

  //   axiosInstance.post("/save-state",{city_name:selectedCity.name},{withCredentials:true}).
  //   then((res)=>console.log(res.data)).
  //   catch(err=>console.log(err));

  //   setFlag(false);

  // },[selectedCity?.name])

  useEffect(() => {
    if (selectedCity?.name) {
      localStorage.setItem("selectedCity", JSON.stringify(selectedCity));
      setFlag(false);
    }
  }, [selectedCity]);

  // Retrieve from localStorage on mount
  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      try {
        const parsed = JSON.parse(storedCity);
        setSelectedCity(parsed);
      } catch (err) {
        console.error("Invalid city JSON in localStorage", err);
      }
    } else {
      setFlag(true);
    }
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current location:", latitude, longitude);

          // You can use reverse geocoding APIs like OpenCage or Google Maps here
          // For demo, set city manually
          setSelectedCity({ name: "New Delhi", code: "ND" });
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Location access denied. Please enable it.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="flex items-center justify-center mt-[2vw]">
      {flag && <div className="fixed inset-0 bg-black opacity-60 z-[5]"></div>}

      <div
        className={`${
          flag === true
            ? "fixed w-[48%] h-[auto] bg-white top-[12vw] p-4 shadow-2xl z-10 "
            : "hidden"
        }`}
      >
        <p className="text-xl font-semibold">Select Location</p>
        <div className="card flex justify-content-center mt-3">
          <Dropdown
            ref={dropdownRef}
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.value);
              setFlag(false);
            }}
            options={cities}
            optionLabel="name"
            placeholder="Select a City"
            className="w-full md:w-14rem"
          />
        </div>
        <span
          className="flex items-center my-3 gap-1 cursor-pointer"
          onClick={getCurrentLocation}
        >
          <img
            src="/assets/location.png"
            alt="Location"
            className="w-[1.2vw] h-[1.2vw]"
          />
          <p className="text-[1vw] font-medium">Use current location</p>
        </span>
        <p className="text-lg font-medium text-center mt-6">Popular cities</p>

        <div className="flex items-center justify-evenly mt-3">
          <span
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              setSelectedCity({ name: "Hyderabad", code: "HYD" });
              setFlag(false);
            }}
          >
            <img
              src="/assets/charMinar.png"
              alt="CharMinar"
              className="w-[88%] h-[8vw]"
            />
            <p className="text-base text-[#6F6F6F]">Hyderabad</p>
          </span>
          <span
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              setSelectedCity({ name: "Agra", code: "AGR" });
              setFlag(false);
            }}
          >
            <img
              src="/assets/TajMahal.png"
              alt="TajMahal"
              className="w-[88%] h-[8vw]"
            />
            <p className="text-base text-[#6F6F6F]">Agra</p>
          </span>
          <span className="flex flex-col items-center cursor-pointer" 
             onClick={() => {
              setSelectedCity({ name: "New Delhi", code: "ND" });
              setFlag(false);
            }}
          >
            <img
              src="/assets/IndiaGate.png"
              alt="IndiaGate"
              className="w-[88%] h-[8vw]"
            />
            <p className="text-base text-[#6F6F6F]">New Delhi</p>
          </span>
          <span className="flex flex-col items-center cursor-pointer" 
             onClick={() => {
              setSelectedCity( { name: "Mumbai", code: "MB" });
              setFlag(false);
            }}
          >
            <img
              src="/assets/MumbaiGate.png"
              alt="CharMinar"
              className="w-[88%] h-[8vw]"
            />
            <p className="text-base text-[#6F6F6F]">Mumbai</p>
          </span>
        </div>
        <p
          className="text-center text-base font-normal text-[#6F6F6F] mt-[0.4vw] cursor-pointer"
          onClick={() => dropdownRef.current?.show()}
        >
          View all cities
        </p>
      </div>

      <div className="nav-container  w-[95%] flex items-center justify-between p-2">
        <Link to="/dashboard">
          <img
            src="/assets/Logo.png"
            alt="WebLogo"
            className="w-[2.6vw] h-[2.6vw]"
          />
        </Link>
        <span className="container-right flex items-center justify-center gap-4">
          
          {/* <Link
            to="/admin-login"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Admin Access
          </Link> */}
          <span
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleClick}
          >
            <p className="text-[#373737] font-normal">{selectedCity?.name}</p>
            <img
              src="/assets/dropDown.png"
              alt="DropDown"
              className={`${
                flag
                  ? "transform rotate-180 duration-200 transition-transform"
                  : "duration-200 transition-transform"
              }w-[1vw] h-[0.7vw]`}
            />
          </span>

          <span className="flex items-center gap-1 cursor-pointer">
            <img
              src="/assets/user.png"
              alt="Profile"
              className="w-[2vw] h-[2vw]"
            />
            <span className="text-[#373737] font-normal">
              {username ? (
                <p onClick={handleProfile}>{title}</p>
              ) : (
                <p onClick={() => navigate("/root")}>Login</p>
              )}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default NavBar1;
