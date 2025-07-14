import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import ImageContainer from "../components/ImageContainer";

import MovieCard1 from "../components/MovieCard1";
import { Dropdown } from "primereact/dropdown";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AllMovies = () => {
  const username = localStorage.getItem("userName");
  const [selectedCity, setSelectedCity] = useState("");

  const [genre, setGenre] = useState(null);
  const genres = [
    { name: "Horror", code: "HRR" },
    { name: "Comedy", code: "CMD" },
    { name: "Action", code: "ACT" },
    { name: "Adventure", code: "ADV" },
    { name: "Drama", code: "DRA" },
    { name: "Romance", code: "RMC" },
    { name: "Thriller", code: "THR" },
  ];

  const [language, setLanguage] = useState(null);
  const languages = [
    { name: "Hindi", code: "HN" },
    { name: "English", code: "ENG" },
    { name: "Marathi", code: "MTH" },
    { name: "Telugu", code: "TLG" },
    { name: "Malyalam", code: "MLY" },
  ];

  // fetch get api's for movies
  // const [movies, setMovies] = useState([]);
  // // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // polling user side to get latest movie added by admin every 10 seconds
  //   // const interval=setInterval(()=>{
  //   axiosInstance
  //     .get("/get-movies", { withCredentials: true })
  //     .then((res) => {
  //       console.log(res.data);
  //       setMovies(res.data);
  //     })
  //     .catch((err) =>
  //       console.log("Error fetching movies", err.response?.data || err.message)
  //     );
  //   // },2000);

  //   // return ()=>clearInterval(interval);
  // }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredshowtimes, setFilteredShowtimes] = useState([]);
  const [allshowtime, setAllShowtimes] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/get-showtime", { withCredentials: true })
      .then((res) => {
        // console.log("showtime response",res.data);
        const allShowtimes = res.data;
        const uniqueMap = new Map();

        allShowtimes.forEach((item) => {
          const key = `${item.movieId}-${item.theatreId}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
              id: item.movieId,
              movie: item.moviename,
              file: item.Movie?.file || item.movieFile || "",
              genre: item.Movie?.genre || "",
              language: item.Movie?.language || [],
              theatreId: item.theatreId,
              theatrename: item.theatrename,
              theatreAddress: item.Theatre?.address || "",
              state: item.Theatre.stateName,
            });
          }
        });
        const uniqueMovies = Array.from(uniqueMap.values());
        setFilteredShowtimes(uniqueMovies);
        setAllShowtimes(uniqueMovies);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredCombos = filteredshowtimes.filter((item) => {
    const matchesSearch = searchTerm.trim() === "" || item.movie?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      !selectedCity?.name ||
      item.state?.toLowerCase() === selectedCity.name.toLowerCase();
    const genreMatch = genre ? item.genre === genre.name : true;
    const languageMatch = language
      ? item.language?.some((lang) => lang.name === language.name)
      : true;
    // const searchMatch = searchTerm
    //   ? m.movie.toLowerCase().includes(searchTerm.toLowerCase())
    //   : true;

    return (
       matchesCity && genreMatch && languageMatch && matchesSearch
    );
  });


  return (
    <div>
      <div className="all-movies">
        <div className="theatre-container font-[Inter] mb-[-1vw]">
          <NavBar1
            title={username}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
          <span className="flex items-center justify-start mx-[3vw] gap-1 mt-`">
            {/* <a href="http://localhost:3000/dashboard" className='cursor-pointer font-light text-zinc-500 '>Home / </a> */}
            {/* <a href="http://localhost:3000/movie" className='cursor-pointer font-light'>Movie</a> */}
            <Link
              to="/dashboard"
              className="cursor-pointer font-light text-zinc-500 "
            >
              Home /
            </Link>
            <Link to="/movie" className="cursor-pointer font-light">
              Movie
            </Link>
          </span>
        </div>
        <section>
          <ImageContainer setSearchTerm={setSearchTerm} />
        </section>

        <div className="card-container mx-[3vw] bg-white h-[auto]">
          <span className="flex items-center gap-4 mt-[4vw] ">
            <p className="text-3xl font-bold">Movies</p>
            <div className="card flex justify-content-center ">
              <Dropdown
                value={genre}
                onChange={(e) => setGenre(e.value)}
                options={genres}
                optionLabel="name"
                placeholder="Genre"
              />
            </div>
            <div className="card flex justify-content-center ">
              <Dropdown
                value={language}
                onChange={(e) => setLanguage(e.value)}
                options={languages}
                optionLabel="name"
                placeholder="Language"
              />
            </div>
          </span>

          <div className="grid grid-cols-4  gap-[2vw]">
            {/* {movies.length>0?
            (
              movies.map((m)=>(
                <MovieCard
                  key={m.id}
                  movie={m}


                />
              ))
            ):(<p className="text-md ">No movies added</p>)
            
          } */}
            {filteredCombos.length > 0 ? (
              filteredCombos.map((m) => <MovieCard1 key={m.id} movie={m} />)
            ) : (
              <p className="text-gray-500 text-lg col-span-4 mt-4">
                No matching movies found.
              </p>
            )}
            
          </div>
          <div className="  h-[14vw]  my-[4vw]">
            <img
              src="/assets/footerImage.png"
              alt="FooterImg"
              className="w-[100%] h-[100%] object-fit"
            />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AllMovies;
