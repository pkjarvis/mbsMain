import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import ImageContainer from "../components/ImageContainer";
import MovieCardSection from "../components/MovieCardSection";
import NowShowingTheatre from "../components/NowShowingTheatre";
import Bollywood from "../components/Bollywood";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("userName");
  const token = localStorage.getItem("userToken");

  // useEffect(() => {
  //   if (!username && !token) {
  //     navigate("/root");
  //   }
  // });

  // useEffect(() => {
  //   axiosInstance
  //     .get("/get-movies", { withCredentials: true })
  //     .then((res) => {
  //       console.log(res.data);
  //       setMovies(res.data);
  //     })
  //     .catch((err) =>
  //       console.log("Error fetching movies", err.response?.data || err.message)
  //     );
  // }, []);

  const [filteredshowtimes, setFilteredShowtimes] = useState([]);
  const [allshowtime, setAllShowtimes] = useState([]);

  const [nowshowing,setNowShowing]=useState([]);
  const [upcoming,setUpComing]=useState([]);

  const [selectedCity, setSelectedCity] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/get-showtime", { withCredentials: true })
      .then((res) => {
        console.log("showtime response",res.data);
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
              city:item.Theatre.cityName,
              category:item.Movie?.status || "",
              showId:item.id,
            });
          }
        });
        const uniqueMovies = Array.from(uniqueMap.values());
        setFilteredShowtimes(uniqueMovies);
        setAllShowtimes(uniqueMovies);

        //segregate
        setNowShowing(uniqueMovies.filter(movie=>movie.category==="Now Showing"));
        setUpComing(uniqueMovies.filter(movie=>movie.category==="Upcoming"));


      })
      .catch((err) => console.log(err));
  }, []);


  console.log("filter showtie", allshowtime);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCombos = filteredshowtimes.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      item.movie?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity =
      !selectedCity?.name ||
      item.city?.toLowerCase() === selectedCity.name.toLowerCase();
    return matchesSearch && matchesCity;
  });
  const bollywoodMovies = filteredCombos.slice(0, 3);

  return (
    <div>
      <div>
        <NavBar1
          title={username}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
        
        <section>
          <ImageContainer setSearchTerm={setSearchTerm} />
        </section>
        {/* <section>
          <MovieCardSection
            title="Watch latest movie"  
            movies={upcoming.slice(0, 4)}
          />
        </section> */}
        <section className="mt-[2vw]">
          <NowShowingTheatre  movies={nowshowing.slice(0,3) }/>
        </section>

        <section className="mx-[3vw] bg-white">
          <h1 className="font-bold text-4xl text-black text-center mt-[2.5vw]">
            Book Your Show in 4 Easy Steps
          </h1>
          <p className="text-md text-wrap text-center mb-[3vw] mt-[1vw] max-w-[86%] mx-[28vw] font-light">
            Booking your favorite show is simple and quick! Just follow these
            four steps to secure your seat and enjoy and unforgettable
            experience.
          </p>
          <span className="flex items-center justify-between mt-8 mx-[6vw]">
            <span className="flex flex-col items-center z-10">
              <p className="bg-[#FFE9F3] h-[7vw] w-[7vw] rounded-full flex items-center justify-center">
                <img
                  src="/assets/take.png"
                  alt="Take"
                  className="h-[2.6vw] w-[2.8vw]"
                />
              </p>
              <p className="text-black font-medium text-wrap max-w-[7vw] text-center mt-3">
                Select Movie & Location
              </p>
            </span>

            <span className="flex flex-col items-center z-10">
              <p className="bg-[#FFE9F3] h-[7vw] w-[7vw] rounded-full flex items-center justify-center">
                <img
                  src="/assets/clock.png"
                  alt="Take"
                  className="h-[2.6vw] w-[2.8vw]"
                />
              </p>
              <p className="text-black font-medium text-wrap max-w-[7vw] text-center mt-3">
                Pick Date & Show Timing
              </p>
            </span>

            <span className="flex flex-col items-center z-10">
              <p className="bg-[#FFE9F3] h-[7vw] w-[7vw] rounded-full flex items-center justify-center">
                <img
                  src="/assets/passenger.png"
                  alt="Take"
                  className="h-[2.6vw] w-[2.8vw]"
                />
              </p>
              <p className="text-black font-medium text-wrap max-w-[7vw] text-center mt-3">
                Choose Seats & Tickets
              </p>
            </span>

            <span className="flex flex-col items-center z-10">
              <p className="bg-[#FFE9F3] h-[7vw] w-[7vw] rounded-full flex items-center justify-center">
                <img
                  src="/assets/cash.png"
                  alt="Take"
                  className="h-[2.6vw] w-[2.8vw]"
                />
              </p>
              <p className="text-black font-medium text-wrap max-w-[7vw] text-center mt-3">
                Payment & Confirm Booking
              </p>
            </span>
            <hr className="w-[76%] absolute text-[#FF5295] z-[-10vw] mt-[-2.4vw] h-[1vw]" />
          </span>
        </section>

        <section>
          <Bollywood movies={filteredCombos.slice(0, 4)} />  
        </section>

        <section className="mx-[3vw]  h-[14vw]  my-[4vw]">
          <img
            src="/assets/footerImage.png"
            alt="FooterImg"
            className="w-[100%] h-[100%] object-fit"
          />
        </section>

        <section>
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
