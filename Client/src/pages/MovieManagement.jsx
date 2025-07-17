import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddButton from "../components/AddButton";
import MovieCard from "../components/MovieCard";
import MainHeader from "../components/MainHeader";
import { MoviesContext } from "../context/MovieContext";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { replace, useLocation, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";



const baseUrl = import.meta.env.VITE_ROUTE;

const MovieManagement = () => {
  // const {movies}=useContext(MoviesContext);
  // if(!movies.length) return <p>No movies added yet.</p>

  const location = useLocation();
  const navigate = useNavigate();

  // The replace: true option replaces the current entry in the history stack, and state: {} clears the state object.
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
   
  const [showDateWarning, setShowDataWarning] = useState(false); 

  useEffect(()=>{
    if (location.state){
    setShowDataWarning(true);
  }
  },[location])
  

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get movies api call
  useEffect(() => {
    axiosInstance
      .get("/get-movies", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setMovies(res.data);
      })
      .catch((err) =>
        console.log("Error fetching movies", err.response?.data || err.message)
      )
      .finally(() => setLoading(false));
  }, [location]);


  

  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic
  const filteredMovies = movies.filter((movie) =>
    movie.movie.toLowerCase().includes(searchQuery.toLowerCase())
  );

  





  return (
    <div>
      <div>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          theme="colored"
          newestOnTop
          hideProgressBar={true}
          toastClassName={() =>
            "relative flex p-3 rounded-md justify-between items-center text-white bg-[rgba(31,132,90,1)] shadow-lg mt-12"
          }
        />

         {showDateWarning && (
          <Stack
            sx={{
              width: "60%",
              position: "absolute",
              zIndex: "1020",
              marginLeft: "18vw",
              marginTop:"6vw",
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
              {"Update the corresponding showtime if movie is edited or add showtime if movie is just added"}
            </Alert>
          </Stack>
        )}


        <MainHeader
          title="Manage Movies"
          btncontent="+Add New Movie"
          headerlink="Movie Management"
          btnlink="/admin-addnewmovie"
          onSearch={setSearchQuery}
          searchValue={searchQuery}
        />

        {loading ? (
          <p className="text-center mt-8">Loading Movies ...</p>
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map((m) => (
            <MovieCard
              key={m.id}
              id={m.id}
              movie={m.movie}
              description={m.description}
              startDate={m.startDate}
              endDate={m.endDate}
              genre={m.genre}
              language={m.language}
              status={m.status}
              file={m.file}
              setShowDataWarning={setShowDataWarning}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">No movies added yet</p>
        )}

        {/* <MovieCard/> */}
      </div>
    </div>
  );
};

export default MovieManagement;
