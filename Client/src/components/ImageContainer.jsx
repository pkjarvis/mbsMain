import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const ImageContainer = ({ setSearchTerm, filteredShowtime }) => {
  const navigate = useNavigate();
  const [currentmovie, setCurrentMovie] = useState("");

  console.log("filtered showtime passes is:", filteredShowtime);

  const [moviename, setMovieName] = useState("");
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState([]);

  const [containermovie, setContainerMovie] = useState([]);
  const [bgimage, setBgImage] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    setContainerMovie(filteredShowtime);
    setBgImage(filteredShowtime[0]?.Movie?.file);
    setCurrentMovie(filteredShowtime[0]?.Movie);

    const formattedShow = filteredShowtime.map((item) => ({
      name: item.moviename,
      code: item.moviename.substring(0, 3).toUpperCase(),
    }));

    setMovies(formattedShow);
  }, [filteredShowtime]);

  console.log("show movie is:", currentmovie);
  console.log("unique movies from showtime:", movies);

  useEffect(() => {
    console.log("movie name is:", moviename);
    if (moviename) {
      const matched = filteredShowtime.find(
        (item) => item.moviename.toLowerCase() === moviename.name.toLowerCase()
      );
      if (matched) {
        navigate(`/movie/${matched.ID}`, { state: { movie: currentmovie } });
      }
    }
  }, [moviename]);

  const handleClick = (path, movie, index) => {
    setBgImage(path);
    setCurrentMovie(movie);
    setSelectedImageIndex(index);
  };

  const handleSubmit = () => {
    if (!currentmovie) return;

    if (currentmovie) {
      const matched = filteredShowtime.find(
        (item) =>
          item.moviename.toLowerCase() === currentmovie.movie.toLowerCase()
      );

      if (matched) {
        navigate(`/movie/${matched.ID}`, { state: { movie: currentmovie } });
      }
    }
  };

  return (
    <div>
      <div className=" flex items-center w-[40%] h-[12vw] absolute top-[31vw] right-0 overflow-hidden object-fill">
        {containermovie?.slice(0, 3).map((item, index) => (
          <motion.span
            key={index}
            onClick={() => handleClick(item?.Movie?.file, item?.Movie, index)}
            className="max-w-[25%] max-h-[12vw] overflow-hidden object-cover cursor-pointer"
            animate={{
              scale: selectedImageIndex === index ? 1.4 : 1,
              rotateY: selectedImageIndex === index ? 15 : 0,
              boxShadow:
                selectedImageIndex === index
                  ? "0px 0px 25px 5px rgba(255, 105, 180, 0.8)"
                  : "0px 0px 0px 0px rgba(0,0,0,0)",
              zIndex: selectedImageIndex === index ? 999 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            whileHover={{
              scale: selectedImageIndex === index ? 1.45 : 1.1,
              rotate: 2,
            }}
          >
            <motion.img
              src={item.Movie.file}
              alt="Bg-3"
              className={`w-[12vw] h-[12vw] object-fit rounded-xl transition-all duration-300 ${
                selectedImageIndex === index
                  ? "border-[3px] border-[#8B005D]" // dark pink on select
                  : "border-[2px] border-[#D36BA2]" // soft pink border default
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          </motion.span>
        ))}
      </div>

      <div className="bg-white mt-5  w-[100%] h-[70vh] overflow-hidden  ">
        <img src={bgimage} alt="Bg" className="w-[100%] h-[100%]  object-fill"/>
        <div className="card flex justify-content-center absolute right-0 top-[7vw] w-[40%] h-[2vw]  rounded-2xl  px-2 items-center justify-between">
          <Dropdown
            value={moviename}
            onChange={(e) => setMovieName(e.value)}
            options={movies}
            optionLabel="name"
            placeholder="Select a Movie"
            className="w-full md:w-14rem rounded-2xl dropdown-black-border"
            checkmark={true}
            highlightOnSelect={false}
            filter
          />
        </div>

        <span className="flex flex-col absolute top-[17vw] left-[8.4vw] max-w-[18vw] gap-6 z-5 backdrop-blur-[2vw] rounded-2xl  p-2">
          <h1 className="text-white text-4xl font-bold ">
            Redefined Movie Experience!
          </h1>
          <p className="text-white text-xl">At PVR Superplex Mall of India</p>

          <button
            className="bg-[#FF5295] p-2 text-xl w-[90%] h-[3vw] rounded-lg text-white font-semibold text-center cursor-pointer"
            onClick={handleSubmit}
          >
            Book Now
          </button>
        </span>
      </div>
    </div>
  );
};

export default ImageContainer;
