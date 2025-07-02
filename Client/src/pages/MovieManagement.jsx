import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddButton from "../components/AddButton";
import MovieCard from "../components/MovieCard";
import MainHeader from "../components/MainHeader";
import { MoviesContext } from "../context/MovieContext";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { replace, useLocation, useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_ROUTE;

const MovieManagement = () => {
  // const {movies}=useContext(MoviesContext);
  // if(!movies.length) return <p>No movies added yet.</p>

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
  }, []);



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

        <MainHeader
          title="Manage Movies"
          btncontent="+Add New Movie"
          headerlink="Movie Management"
          btnlink={baseUrl + "/admin-addnewmovie"}
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
