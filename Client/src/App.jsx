import React, { useState } from "react";
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
import {MoviesProvider} from "./context/MovieContext";
import { PrimeReactProvider } from "primereact/api";
import { TheatreProvider } from "./context/TheatreContext";
import { ShowTimeProvider } from "./context/ShowTimeContext";

import "primereact/resources/themes/lara-light-cyan/theme.css";

function App() {

// const token=localStorage.getItem("adminToken");
// const name=localStorage.getItem("adminName");
//  useState(()=>{
//   console.log("Protected route for admin use only")
//  },[token,name])



  return (
    <>
      <PrimeReactProvider>
        <BrowserRouter>
          <MoviesProvider>
           <TheatreProvider>
            <ShowTimeProvider>
              <Routes>
                
                <Route path="*" element={<Navigate to="/admin"/>} />
                <Route path="/admin" element={<Root />} />
                <Route path="/admin-signup" element={<SignUp />} />
                <Route path="/admin-login" element={<Login />} />
                <Route path="/admin-logout" element={<Logout />} />
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/admin-movie" element={<MovieManagement />} /> 
                <Route path="/admin-theatre" element={<Theatres />} />
                <Route path="/admin-shows" element={<Shows />} />
                <Route path="/admin-addnewmovie" element={<AddNewMovie />} />
                <Route path="/admin-addnewtheatre" element={<AddNewTheatre />} />
                <Route path="/admin-addnewshows" element={<AddNewShowtime />} />
                
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
