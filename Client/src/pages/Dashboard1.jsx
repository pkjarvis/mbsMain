import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import RegisterPopUp from "../components/RegisterPopUp";
import ImageContainer from "../components/ImageContainer";
import MovieCardSection from "../components/MovieCardSection";
import NowShowingTheatre from "../components/NowShowingTheatre";
import Bollywood from "../components/Bollywood";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { useLocation } from "react-router-dom";

const Dashboard1 = () => {
  const [movies, setMovies] = useState([]);
  const [selectedCity, setSelectedCity] = useState(false);
  const location = useLocation();
  var username = localStorage.getItem("userName");

  useEffect(() => {
    username = localStorage.getItem("userName");
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/get-movies", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setMovies(res.data);
      })
      .catch((err) =>
        console.log("Error fetching movies", err.response?.data || err.message)
      );
  }, []);

  return (
    <div>
      <div>
        <NavBar1
          title={username}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />

        <>
          {/* Backdrop overlay, inset0 make's top,bottom,left,right to 0 . Hence making it entirely cover parent div */}
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
          {/* Popup component */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <RegisterPopUp
              state={location.state}
              //  val={flag} func={setFlag}
            />
          </div>
        </>

        <section>
          <ImageContainer />
        </section>
        <section>
          <MovieCardSection
            title="Watch latest movie"
            movies={movies.slice(0, 4)}
            // imgTitle={"../src/assets/aliceWonderland.png"}
          />
        </section>
        <section>
          <NowShowingTheatre />
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
          <Bollywood movies={movies.slice(0, 4)} />
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

export default Dashboard1;
