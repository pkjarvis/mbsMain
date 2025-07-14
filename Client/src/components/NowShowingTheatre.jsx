import React from "react";
import TheatreCard1 from "./TheatreCard1";

const NowShowingTheatre = ({ movies = [] }) => {
  return (
    <div>
      <div className="movie-showing-theatre mx-[3vw] h-[40vw] bg-white">
        <span className="flex items-center justify-between">
          <p className="text-3xl font-bold">Now Showing in Theatres</p>
          <a href="#" className="underline text-gray-500">
            see all{" "}
          </a>
        </span>
        <div className="flex items-center justify-between">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <TheatreCard1
                key={`${movie.id}-${movie.theatreId}`}
                movie={movie}
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

export default NowShowingTheatre;
