import React, { useEffect, useRef, useState } from "react";
import NavBar1 from "../components/NavBar1";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Cookies from "js-cookie";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

const baseUrl = import.meta.env.VITE_ROUTE;
const Profile = () => {
  // const username = localStorage.getItem("userName");
  // const emailAddress = localStorage.getItem("email");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [selectedCity, setSelectedCity] = useState(false);

  const [image, setImage] = useState("/assets/camera.png");

  const [showDateWarning, setShowDataWarning] = useState(false);
  const [message, setMessage] = useState("");


  useEffect(() => {
    axiosInstance
      .get("/user-details", { withCredentials: true })
      .then((res) => {
        const { username, email, profilePhoto } = res.data;

        // Save to state
        setName(username);
        setEmail(email);
        setImage(profilePhoto || "/assets/camera.png");

        // Save to localStorage
        localStorage.setItem("userName", username);
        localStorage.setItem("email", email);
        localStorage.setItem(
          "profilePhoto",
          profilePhoto || "/assets/camera.png"
        );
      })
      .catch((err) => {
        console.error("Failed to fetch user details", err);
        // Optionally handle auth error (redirect to login, etc.)
      });
  }, []);

  const navigate = useNavigate("");

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("token");
    if (!name) {
      navigate("/dashboard");
    } else {
      navigate("/root");
    }
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

  const fileInputRef = useRef("");

  const handleDivChange = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const val = e.target.files[0];
    if (!val) return;

    const imageUrl = await uploadImage(val);

    if (imageUrl?.url) {
      setImage(imageUrl?.url);
      localStorage.setItem("profilePhoto", imageUrl.url);
    }
  };

  const handleSave = () => {
    axiosInstance
      .post("/update-profile", { name, image }, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("userName", name);
        localStorage.setItem("profilePhoto", image);
        setShowDataWarning(true);
        setMessage("Profile Updated Successfully !");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="profile-container">
        <NavBar1
          title={name}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
        <div className="bg-[#E2E0E0] p-2">
          <div className="flex items-center gap-[3vw] mx-[2.4vw]">
            <Link to="/profile">Profile</Link>
            <Link to="/history">History</Link>
          </div>
        </div>
        {showDateWarning && (
          <Stack
            sx={{
              width: "60%",
              position: "absolute",
              zIndex: "1020",
              marginLeft: "18vw",
              marginTop: "0.2vw",
            }}
            spacing={2}
          >
            <Alert
              severity="success"
              variant="filled"
              onClose={() => {
                setShowDataWarning(false);
              }}
            >
              {message}
            </Alert>
          </Stack>
        )}
        <div className="bg-[#F1F1F1] mx-[3vw] h-[70vh] pt-[2vw] mt-[1.6vw]">
          <div className="h-[6.4vw] w-[100%] bg-linear-to-r from-[#2D3148] to-[#E54D61] relative ">
            <div className="flex items-center justify-start gap-[2vw] pt-[2vw] mx-[12vw] ">
              <span
                className="w-[6.4vw] h-[6.2vw] rounded-full bg-[#D9D9D9] flex items-center justify-center cursor-pointer"
                onClick={handleDivChange}
              >
                <img
                  src={image}
                  alt="Camera"
                  className="w-[3vw] h-[3vw] z-10"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  id="profilePhotoInput"
                  onChange={handlePhotoChange}
                />
              </span>
              <p className="text-xl text-white">Hi,{name}</p>
            </div>
          </div>

          <div className="content-container flex flex-col items-start justify-center mt-[2vw] ml-[22vw]">
            <h2 className="text-2xl font-medium text-center">
              Personal Details
            </h2>
            <span className="flex justify-between items-center gap-[7vw] mt-[1vw]">
              <p className="text-md max-w-[18%] "> Name</p>
              <input
                type="text"
                placeholder="Enter first name here"
                value={name}
                className="w-[30vw] h-[2vw] p-1 bg-white border-1 border-[#CCCCCC] focus:outline-none rounded-md"
                onChange={(e) => setName(e.target.value.toUpperCase())}
              />
            </span>

            <span className="flex justify-between items-center gap-[3.7vw] mt-[1vw]">
              <p className="text-md max-w-[18%] opacity-15">Email Address</p>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                className="w-[30vw] h-[2vw] p-1 bg-white border-1 border-[#CCCCCC] focus:outline-none rounded-md opacity-45"
                // onChange={(e) => setEmail(e.target.value)}
              />
            </span>
          </div>

          <div className="flex items-center justify-end mt-[4vw] gap-5 max-w-[68%]">
            <span className="w-[10%] h-[2vw] border-1 border-[#FF1414] rounded-sm flex items-center justify-center p-3 cursor-pointer">
              <p className=" text-md text-[#FF1414] " onClick={handleLogout}>
                Log out
              </p>
            </span>
            <span
              className="w-[10%] h-[2vw]  bg-[#FF5295] rounded-sm flex items-center justify-center p-3 cursor-pointer"
              onClick={handleSave}
            >
              <p className=" text-md text-white">Save</p>
            </span>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
