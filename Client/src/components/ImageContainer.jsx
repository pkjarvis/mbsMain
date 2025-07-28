import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

// import { motion } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className=" flex items-center w-[40%] h-[12vw] absolute top-[29vw] right-0  object-fill">
        {containermovie?.slice(0, 3).map((item, index) => {
          const isSelected = selectedImageIndex === index;

          // Set the display order for animation effect
          const displayIndex =
            selectedImageIndex !== null
              ? selectedImageIndex === index
                ? 0
                : index < selectedImageIndex
                ? index + 1
                : index
              : index;

          return (
            <motion.div
              key={index}
              onClick={() => handleClick(item?.Movie?.file, item?.Movie, index)}
              className="absolute cursor-pointer"
              initial={false}
              animate={{
                x: `${displayIndex * 13}vw`,
                scaleX: isSelected ? 1.5 : 1,
                scaleY: isSelected ? 1.1 : 1,
                zIndex: isSelected ? 10 : 1,
                opacity: isSelected ? 1 : 0.9,
              }}
              transition={{
                duration: 0.6,
                type: "spring",
                damping: 20,
              }}
              whileHover={{
                scale: isSelected ? 1.2 : 1.1,
              }}
            >
              <motion.div
                className={`w-[12vw] h-[12vw] rounded-xl overflow-hidden transition-all duration-500
          ${
            isSelected
              ? "border-[4px] border-[#8B005D] shadow-[0_0_40px_10px_rgba(139,0,93,0.5)]"
              : "border-[2px] border-[#f3a6c4] shadow-md"
          }
        `}
                style={{
                  boxSizing: "border-box",
                }}
              >
                <motion.img
                  src={item.Movie.file}
                  alt="Movie"
                  className="w-full h-full object-cover "
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white mt-5  w-[100%] h-[70vh] overflow-hidden  ">
        <img
          src={bgimage}
          alt="Bg"
          className="w-[100%] h-[100%]  object-fill"
        />
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
