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
          const movieStartDate=new Date(item?.startDate);
          movieStartDate.setHours(0, 0, 0, 0);

        console.log("movie startdate:",movieStartDate);
        console.log("today",today);

          if (!uniqueMap.has(key) && movieStartDate>=today) {
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
        setNowShowing(nowShowingFiltered);
        setUpComing(upComingFiltered);

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
      item.Theatre.cityName?.toLowerCase() === selectedCity.name.toLowerCase();
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
          <ImageContainer
            setSearchTerm={setSearchTerm}
            filteredShowtime={filteredCombos}
          />
        </section>
        {/* <section>
          <MovieCardSection
            title="Watch latest movie"  
            movies={upcoming.slice(0, 4)}
          />
        </section> */}
        <section className="mt-[2vw]">
          <NowShowingTheatre
            shows={nowshowing
              .filter(
                (show) =>
                  !selectedCity?.name ||
                  show?.Theatre?.cityName?.toLowerCase() ===
                    selectedCity.name.toLowerCase()
              )
              .slice(0, 3)}
          />
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
            <span className="flex flex-col items-center z-5">
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

            <span className="flex flex-col items-center z-5">
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

            <span className="flex flex-col items-center z-5">
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

            <span className="flex flex-col items-center z-5">
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
          <Bollywood shows={upcoming
              .filter(
                (show) =>
                  !selectedCity?.name ||
                  show?.Theatre?.cityName?.toLowerCase() ===
                    selectedCity.name.toLowerCase()
              )
              .slice(0, 4)} />
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
