
import React from 'react'
import { BrowserRouter,Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Dashboard from './pages/Dashboard'
import MovieManagement from './pages/MovieManagement'
import Theatres from './pages/Theatres'
import Shows from './pages/Shows'
import AddNewMovie from './pages/AddNewMovie'
import AddNewTheatre from './pages/AddNewTheatre'
import AddNewShowtime from './pages/AddNewShowtime'

function App() {
 

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/movie" element={<MovieManagement/>}/>
          <Route path="/theatre" element={<Theatres/>}/>
          <Route path="/shows" element={<Shows/>}/>
          <Route path="/addnewmovie" element={<AddNewMovie/>}/>
          <Route path="/addnewtheatre" element={<AddNewTheatre/>}/>
          <Route path="/addnewshows" element={<AddNewShowtime/>}/>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
