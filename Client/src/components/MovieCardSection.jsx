import React, { useEffect, useState } from "react";
import MovieCard1 from "./MovieCard1";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
const baseUrl = import.meta.env.VITE_ROUTE;

const MovieCardSection = ({ title,shows = [] }) => {
  //  const [movies, setMovies] = useState([]);

  // useEffect(() => {
  //   axiosInstance
  //     .get("/get-movies", { withCredentials: true })
  //     .then((res) => {
  //       console.log(res.data);
  //       setMovies(res.data);
  //     })
  //     .catch((err) =>
  //       console.log("Error fetching movies", err.response?.data || err.message)
  //     )
  // },[]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div>
      <div className="card-container mx-[3vw] bg-white h-[35vw]">
        <span className="flex items-center justify-between mt-[4vw] ">
          <p className="text-3xl font-bold">{title}</p>
          <Link to="/movies" className="underline text-gray-500">
            see all
          </Link>
        </span>

        <div className="grid grid-cols-4 gap-[3vw]">
          {/* {movies.map((movie) => (
            <MovieCard1 key={movie.id} movie={movie} />
          ))} */}
          {shows.length > 0 ? (
            shows.map((show) => (
              <MovieCard1
                key={`${show.ID}`}
                showsData={show}
              />
            ))
          ) : (
            <p className="text-gray-500 text-lg col-span-4 mt-4">
              No matching movies found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCardSection;
