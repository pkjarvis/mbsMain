import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import ImageContainer from "../components/ImageContainer";

import MovieCard1 from "../components/MovieCard1";
import { Dropdown } from "primereact/dropdown";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AllMovies = () => {
 
 

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

  const navigate = useNavigate();

  const username = localStorage.getItem("userName");
  const token = localStorage.getItem("userToken");

  const [filteredshowtimes, setFilteredShowtimes] = useState([]);
  const [allshowtime, setAllShowtimes] = useState([]);

  const [nowshowing, setNowShowing] = useState([]);
  const [upcoming, setUpComing] = useState([]);

  const toDate = (dateStr) => new Date(new Date(dateStr).toDateString());

  const [selectedCity, setSelectedCity] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/get-showtime", { withCredentials: true })
      .then((res) => {
        console.log("showtime response", res.data);
        const allShowtimes = res.data;
        const uniqueMap = new Map();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        allShowtimes.forEach((item) => {
          const key = `${item.ID}`;
          const movieStartDate = new Date(item?.startDate);
          movieStartDate.setHours(0, 0, 0, 0);

          console.log("movie startdate:", movieStartDate);
          console.log("today", today);

          if (!uniqueMap.has(key) && movieStartDate >= today) {
            uniqueMap.set(key, item);
          }
        });

        const uniqueMovies = Array.from(uniqueMap.values());
        console.log("unique movies is", uniqueMovies);
        setFilteredShowtimes(uniqueMovies);
        setAllShowtimes(uniqueMovies);

        const nowShowingFiltered = uniqueMovies
          .filter((show) => show?.Movie?.status === "Now Showing")
          .reverse();
        const upComingFiltered = uniqueMovies
          .filter((show) => show?.Movie?.status === "Upcoming")
          .reverse();

        //segregate
        setNowShowing(nowShowingFiltered.slice(0, 3));
        setUpComing(upComingFiltered.slice(0, 4));
      })
      .catch((err) => console.log(err));
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCombos = filteredshowtimes.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      item.movie?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      !selectedCity?.name ||
      item?.Theatre?.cityName?.toLowerCase() === selectedCity.name.toLowerCase();
    return matchesSearch && matchesCity;
  });

  console.log("filtered combos:",filteredCombos);

  const filteredCombos1 = filteredshowtimes.filter((item) => {
    const matchesSearch =
    !searchTerm ||
    item?.Movie?.movie?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCity =
    !selectedCity?.name ||
    item?.Theatre?.cityName?.toLowerCase() === selectedCity.name.toLowerCase();

  const matchesGenre =
    !genre || item?.Movie?.genre?.toLowerCase() === genre.name.toLowerCase();

   const matchesLanguage =
    !language ||
    item?.Movie?.language?.some(
      (lang) => lang.name.toLowerCase() === language.name.toLowerCase()
    );
    return (
       matchesCity && matchesGenre && matchesLanguage && matchesSearch
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
          <ImageContainer setSearchTerm={setSearchTerm} filteredShowtime={filteredCombos} />
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
           
            {filteredCombos1.length > 0 ? (
              filteredCombos1.map((show) => <MovieCard1 key={show.ID} showsData={show} />)
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
