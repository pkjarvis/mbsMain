import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import MovieManagement from "./pages/MovieManagement";
import Theatres from "./pages/Theatres";
import Shows from "./pages/Shows";
import AddNewMovie from "./pages/AddNewMovie";
import AddNewTheatre from "./pages/AddNewTheatre";
import AddNewShowtime from "./pages/AddNewShowtime";
import SignUp from "./pages/SignUp";
import Root from "./pages/Root";
import LoggedDashboard from "./pages/LoggedDashboard";

import { MoviesProvider } from "./context/MovieContext";
import { PrimeReactProvider } from "primereact/api";
import { TheatreProvider } from "./context/TheatreContext";
import { ShowTimeProvider } from "./context/ShowTimeContext";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import Dashboard1 from "./pages/Dashboard1";
import AllMovies from "./pages/AllMovies";
import Movie from "./pages/Movie";
import Showtime from "./pages/ Showtime";
import ShowBooking from "./pages/ShowBooking";
import Profile from "./pages/Profile";
import SignUp1 from "./pages/SignUp1";
import Login1 from "./pages/Login1";
import Booking from "./pages/Booking";
import History from "./pages/History";
import PaymentStatus from "./pages/PaymentStatus";


function App() {
  const adminToken=localStorage.getItem("adminToken");
  const userToken=localStorage.getItem("userToken");
  // const name=localStorage.getItem("adminName");
   useEffect(()=>{
    console.log("Protected route for admin use only")
   },[adminToken,userToken])

  return (
    <>
      <PrimeReactProvider>
        <BrowserRouter>
          <MoviesProvider>
            <TheatreProvider>
              <ShowTimeProvider>
                <Routes>
                  
                  <Route path="*" element={<Navigate to="/root" />} />
                  {/* user route */}
                   {/* user routes starts here */}

                  <Route path="/root" element={<Dashboard1/>} />
                  <Route path="/dashboard" element={<LoggedDashboard />} />
                  {userToken?<Route path="/movies" element={<AllMovies/>} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/movie" element={<Movie />} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/showtime" element={<Showtime />} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/showbooking" element={<ShowBooking />} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/profile" element={<Profile/>} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/signup" element={<SignUp1/>} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/login" element={<Login1 />} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/booking" element={<Booking/>} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/history" element={<History />} />:<Route path="/root" element={<Dashboard1/>} />}
                  {userToken?<Route path="/payment-status" element={<PaymentStatus />} />:<Route path="/root" element={<Dashboard1/>} />}





                {/* admin route */}
                  <Route path="/admin" element={<Root />} />
                  <Route path="/admin-signup" element={<SignUp />} />
                  <Route path="/admin-login" element={<Login />} />
                  <Route path="/admin-logout" element={<Logout />} />
                  {adminToken?<Route path="/admin-dashboard" element={<Dashboard />} />:<Route path="/admin" element={<Root />} />}
                  {adminToken?<Route path="/admin-movie" element={<MovieManagement />} />:<Route path="/admin" element={<Root />} />}
                  {adminToken?<Route path="/admin-theatre" element={<Theatres />} />:<Route path="/admin" element={<Root />} />}
                  {adminToken?<Route path="/admin-shows" element={<Shows />} />:<Route path="/admin" element={<Root />} />}
                  {adminToken?<Route path="/admin-addnewmovie" element={<AddNewMovie />} />:<Route path="/admin" element={<Root />} />}
                  {adminToken?<Route
                    path="/admin-addnewtheatre"
                    element={<AddNewTheatre />}
                  />:<Route path="/admin" element={<Root />} />}
                  {adminToken?<Route
                    path="/admin-addnewshows"
                    element={<AddNewShowtime />}
                  />:<Route path="/admin" element={<Root />} />}

                 
                </Routes>
              </ShowTimeProvider>
            </TheatreProvider>
          </MoviesProvider>
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  );
}

export default App;
