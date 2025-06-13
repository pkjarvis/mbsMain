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

const token=localStorage.getItem("token");
 useState(()=>{
  console.log("Protected route")
 },[token])



  return (
    <>
      <PrimeReactProvider>
        <BrowserRouter>
          <MoviesProvider>
           <TheatreProvider>
            <ShowTimeProvider>
              <Routes>
                
                <Route path="*" element={<Navigate to="/"/>} />
                <Route path="/" element={<Root />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                {token ? <Route path="/logout" element={<Logout />} />:<Route path="/" element={<Root />}/>}
                {token ? <Route path="/dashboard" element={<Dashboard />} /> : <Route path="/" element={<Root />} />}
                {token ? <Route path="/movie" element={<MovieManagement />} /> :  <Route path="/" element={<Root />} />}
                {token ? <Route path="/theatre" element={<Theatres />} />: <Route path="/" element={<Root />} />}
                {token ? <Route path="/shows" element={<Shows />} />: <Route path="/" element={<Root />} />}
                {token ? <Route path="/addnewmovie" element={<AddNewMovie />} />: <Route path="/" element={<Root />} />}
                {token ? <Route path="/addnewtheatre" element={<AddNewTheatre />} />: <Route path="/" element={<Root />} />}
                {token ? <Route path="/addnewshows" element={<AddNewShowtime />} />:  <Route path="/" element={<Root />} />}
                
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
