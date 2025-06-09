
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
import SignUp from './pages/SignUp'
import Root from './pages/Root'
import MoviesProvider from './context/MovieContext'
import { PrimeReactProvider } from 'primereact/api';




function App({ Component, pageProps }) {
 
  return (
    <>
      <PrimeReactProvider>
      <BrowserRouter>
      <MoviesProvider>
        <Routes>
          <Route path="/" element={<Root/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/movie" element={<MovieManagement/>}/>
          <Route path="/theatre" element={<Theatres/>}/>
          <Route path="/shows" element={<Shows/>}/>
          <Route path="/addnewmovie" element={<AddNewMovie/>}/>
          <Route path="/addnewtheatre" element={<AddNewTheatre/>}/>
          <Route path="/addnewshows" element={<AddNewShowtime/>}/>

          
        </Routes>
        </MoviesProvider>
      </BrowserRouter>
      </PrimeReactProvider>
    </>
  )
}

export default App
