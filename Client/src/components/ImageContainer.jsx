import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ImageContainer = ({ setSearchTerm }) => {
  const navigate = useNavigate();

  const [currentmovie, setCurrentMovie] = useState("");

  

  const [moviename, setMovieName] = useState("");
  const [movies, setMovies] = useState("");
  const [movie, setMovie] = useState({});

  const [containermovie, setContainerMovie] = useState();
  const [bgimage, setBgImage] = useState(null);
  // const [bgimage, setBgImage] = useState(currentmovie.file);

  useEffect(() => {
    axiosInstance
      .get("/get-movies", { withCredentials: true })
      .then((res) => {
        const formattedMovies = res.data.map((item) => ({
          name: item.movie,
          code: item.movie.substring(0, 3).toUpperCase(),
        }));

        setMovies(formattedMovies);
        setContainerMovie(res.data);
        if (res.data.length > 0) {
          setCurrentMovie(res.data[0]);
          setBgImage(res.data[0].file);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!moviename) return;

    axiosInstance
      .get("/get-movie-byname", {
        params: { moviename: moviename.name },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Movie is fetched by name", res.data.movie[0]);
        setMovie(res.data.movie[0]);
      })
      .catch((err) => console.log(err));
  }, [moviename]);

  useEffect(() => {
    if (moviename) {
      navigate("/movie", { state: { movie } });
    }
  }, [movie]);

  const handleClick = (path, movie) => {
    setBgImage(path);
    setCurrentMovie(movie);
  };

  const handleSubmit = () => {
    navigate("/movie", { state: { movie: currentmovie } });
  };

  return (
    <div>
      <div className=" flex items-center w-[40%] h-[12vw] absolute top-[31vw] right-0 overflow-hidden object-fill">
        {/* <span
          onClick={() => handleClick("/assets/Bg-2.png")}
          className="w-[25%] overflow-hidden object-cover"
        >
          <img src="/assets/Bg-2.png" alt="Bg-2" />
        </span> */}

        {containermovie?.slice(0, 3).map((item, index) => (
          <span
            key={index}
            onClick={() => handleClick(item.file, item)}
            className="max-w-[25%] max-h-[12vw] overflow-hidden object-cover"
          >
            <img src={item.file} alt="Bg-3" className="w-[12vw] h-[12vw]" />
          </span>
        ))}

      </div>

      <div className="bg-white mt-5  w-[100%] h-[70vh] overflow-hidden ">
        <img src={bgimage} alt="Bg" className="w-[100%] h-[100%] object-fill" />
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

        <span className="flex flex-col absolute top-[17vw] left-[8.4vw] max-w-[18vw] gap-6">
          <h1 className="text-white text-4xl font-bold">
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
