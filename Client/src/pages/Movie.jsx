import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import MainHeader1 from "../components/MainHeader1";
import MovieCardSection from "../components/MovieCardSection";
import Footer from "../components/Footer";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

const Movie = () => {
  const [visible, setVisible] = useState(false);
  const [star, setStar] = useState(null);
  const [text, setText] = useState("");

  const [selectedCity, setSelectedCity] = useState("");
  const username = localStorage.getItem("userName");

  const [showstartdate, setShowStartDate] = useState();

  const [currentmovieshow, setCurrentMovieShow] = useState([]);

  const navigate = useNavigate("");

  const [showDateWarning, setShowDataWarning] = useState(false);
  const [message, setMessage] = useState("");

  const { state } = useLocation();
  const m = state?.movie;

  const { id } = useParams();
  console.log("Show id is:", id);

  const [movieshow, setMovieShow] = useState([]);

  useEffect(() => {
    if (!id) return;

    axiosInstance
      .get(`/get-showtime/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Fetched showtime by ID:", res.data);
        setMovieShow(res.data);
        setShowStartDate(res.data.startDate);
      })
      .catch((err) => {
        console.error("Failed to fetch showtime by ID:", err);
      });
  }, [id]);

  const [moviereview, setMovieReview] = useState([]);

  useEffect(() => {
    if (!movieshow) return;
    

    axiosInstance
      .get("/get-review-bymovie", {
        params: { movieId: movieshow?.Movie?.ID },
        withCredentials: true,
      })
      .then((res) => {
        console.log("response is", res.data);
        const filteredReviews = res.data.reviews.map((item) => item.star);
        setMovieReview(filteredReviews);
      })
      .catch((err) => console.log(err));

  }, [movieshow]);

  let total = 0;
  for (let i = 0; i < moviereview.length; i++) {
    total += moviereview[i];
  }
  const average =
    moviereview.length > 0 ? (total / moviereview.length).toFixed(1) : 0;

  // useEffect(()=>{

  //   movieshow.filter((show)=>!selectedCity?.name || show?.Theatre?.cityName?.toLowerCase()===selectedCity.name.toLowerCase()).slice(0,4)

  // },[movieshow])

  console.log("Response of movie is:", movieshow.Movie);

  useEffect(() => {
    window.scrollTo(0, 0);
    const review = state?.reviewState;

    if (review) {
      setVisible(review.visible || false);
      setStar(review.star || null);
      setText(review.text || "");
    } else {
      setVisible(false);
    }
  }, []);

  const handleClick = () => {
    if (!username) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const inputTime = showstartdate;
  const inputDate = new Date(inputTime);
  const now = new Date();

  const [movies, setMovies] = useState([]);
  const [allshowtime, setAllShowtimes] = useState([]);

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

  const [userwatchedmovie, setUserWatchedMovie] = useState(false);

  useEffect(() => {
    const currentUserId = parseInt(localStorage.getItem("userId"));
    axiosInstance
      .get("/get-paid-ticket", { withCredentials: true })
      .then((res) => {
        console.log("paid ticket user", res.data.tickets);
        const tickets = res.data.tickets;
        const found = tickets.some(
          (ticket) =>
            ticket.userId === currentUserId &&
            ticket.movieName.toLowerCase() === m.movie.toLowerCase()
        );
        if (found) {
          setUserWatchedMovie(true);
        } else {
          setUserWatchedMovie(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);


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
          const key=`${item.Theatre.ID}-${item.Movie.ID}`;
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
        setAllShowtimes(uniqueMovies);

        // const nowShowingFiltered = uniqueMovies
        //   .filter((show) => show?.Movie?.status === "Now Showing")
        //   .reverse();
        // const upComingFiltered = uniqueMovies
        //   .filter((show) => show?.Movie?.status === "Upcoming")
        //   .reverse();

        // //segregate
        // setNowShowing(nowShowingFiltered.slice(0, 3));
        // setUpComing(upComingFiltered.slice(0,4));
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredMovieShows = allshowtime
    ?.filter((show) => {
      const cityMatch =
        !selectedCity?.name ||
        show?.Theatre?.cityName?.toLowerCase() ===
          selectedCity.name.toLowerCase();

      const genreMatch =
        !movieshow?.Movie?.genre ||
        show?.Movie?.genre === movieshow?.Movie?.genre;

      const notSameShow = show?.ID !== movieshow?.ID;

      return cityMatch && genreMatch && notSameShow;
    })
    .slice(0, 4);

  console.log("filtered movie", filteredMovieShows);

  console.log("movie show", currentmovieshow);

  const handleSubmit = async () => {
    setVisible(false);
    setStar(star);
    setText(text);
    const movieId = movieshow.Movie.ID;

    const username = localStorage.getItem("userName");
    const token = localStorage.getItem("userToken");

    if (!username || !token) {
      navigate("/root", {
        state: {
          from: `/movie/${id}`,
          movie: m,
          reviewState: {
            visible: true,
            star,
            text,
          },
        },
      });
      return;
    }

    if (!userwatchedmovie) {
      setMessage(
        "You haven't purchased ticket for this movie, first watch the movie then give review"
      );
      setShowDataWarning(true);
      return;
    }
    if (inputDate > now) {
      setMessage("You could rate after your showtime ends");
      setShowDataWarning(true);

      return;
    }

    await axiosInstance
      .post("/add-review", { text, star, movieId }, { withCredentials: "true" })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const handleBook = () => {
    navigate("/showtime", { state: { movie: m, showId: id,showID:id } });
  };

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/get-review", { withCredentials: "true" })
      .then((res) => {
        console.log("reviews", res.data.reviews);
        setReviews(res.data.reviews);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredReviews = reviews.filter((r) => r?.movieId === movieshow?.Movie?.ID);
  console.log("filtered reviews is",filteredReviews);

  return (
    <div>
      <div className="movie-container">
        <div
          className={`${
            visible
              ? "star-container flex flex-col bg-white shadow-2xl z-10 w-[26%] rounded-xl absolute top-[15vw] mx-[32vw] p-2"
              : "hidden"
          }`}
        >
          <span className="flex items-center justify-between my-2 mx-[1vw]">
            <p className="font-semibold text-lg">Ratings and Reviews</p>
            <p className="text-3xl cursor-pointer" onClick={handleCancel}>
              x
            </p>
          </span>
          <div className="card flex justify-content-center mx-[1vw]">
            <Rating
              value={star}
              onChange={(e) => setStar(e.value)}
              cancel={false}
            />
          </div>
          <div className="card flex justify-content-center mx-[1vw] mt-4 ">
            <InputTextarea
              value={text}
              placeholder="Write your review here"
              onChange={(e) => setText(e.target.value)}
              rows={5}
              cols={30}
              pt={{
                root: {
                  className: `w-[100%] border-zinc-300 border-0 focus:border-0 [&::placeholder]:text-zinc-300 `,
                },
              }}
            />
          </div>

          <div className="flex items-center justify-end my-2">
            <button
              className="bg-[#FF5295]  text-md w-[23%] h-[2vw] rounded-lg text-white font-semibold text-center cursor-pointer mx-[1vw]"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        {/* Alert message */}
        {showDateWarning && (
          <Stack
            sx={{
              width: "60%",
              position: "absolute",
              zIndex: "1020",
              marginLeft: "20vw",
              marginTop: "4vw",
            }}
            spacing={2}
          >
            <Alert
              severity="warning"
              variant="filled"
              onClose={() => {
                setShowDataWarning(false);
              }}
            >
              {message}
            </Alert>
          </Stack>
        )}
        <div className="theatre-container font-[Inter]">
          <NavBar1
            title={username}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />

          <span className="flex items-center justify-start mx-[3vw] gap-1 mt-2">
            {/* <a href="http://localhost:3000/dashboard" className='cursor-pointer font-light text-zinc-500 '>Home / </a> */}
            <Link
              to="/dashboard"
              className="cursor-pointer font-light text-zinc-500 "
            >
              Home /
            </Link>
            {/* <a href="http://localhost:3000/movie" className='cursor-pointer font-light'>Movie </a> */}
            <Link  className="cursor-pointer font-light">
              Movie
            </Link>
          </span>
        </div>

        <div className="flex items-center justify-start gap-2 h-[35vw] p-2">
          <div className="h-[30vw] w-[28%]  ml-[2.6vw] overflow-hidden">
            <img
              // src="../src/assets/Azaad.png"
              src={movieshow?.Movie?.file}
              alt={movieshow?.moviename}
              className="w-[100%] h-[100%] rounded-xl"
            />
          </div>
          <div className="h-[100%] flex flex-col items-start justify-start mt-[6vw] p-[2vw] max-w-[40%]">
            <h1 className="text-4xl font-bold">{movieshow?.moviename}</h1>
            <span className="flex items-center justify-start gap-2 mt-2">
              <p className="text-zinc-300">{average || 0} ⭐</p>
              {/* <img
                src="/assets/Star.png"
                alt="Star"
                className="w-[1vw] h-[1vw]"
              />
              <img
                src="/assets/Star.png"
                alt="Star"
                className="w-[1vw] h-[1vw]"
              />
              <img
                src="/assets/Star.png"
                alt="Star"
                className="w-[1vw] h-[1vw]"
              />
              <img
                src="/assets/Star.png"
                alt="Star"
                className="w-[1vw] h-[1vw]"
              />
              <img
                src="/assets/Star14.png"
                alt="Star14"
                className="w-[1.16vw] h-[1.18vw]"
              /> */}
            </span>
            <p className="text-[#6F6F6F] mt-[1vw]">
              <span className="text-black ">
                {movieshow?.Movie?.duration}
                {" Minutes"}
              </span>{" "}
              {movieshow?.Movie?.genre}|UA13+|
              {movieshow?.Movie?.language?.map((lang, index) => (
                <span key={index} className="inline-block flex-wrap">
                  {lang.name}
                  {index < movieshow?.Movie?.language.length - 1 && ", "}
                </span>
              ))}
            </p>
            <p className="text-black text-md my-[1vw] font-medium">
              About the movie
            </p>
            <p className="text-normal text-black font-light">
              {movieshow?.Movie?.description}
            </p>
            <button
              className="bg-[#FF5295] p-1 text-xl w-[16vw] h-[3vw] rounded-lg text-white font-semibold text-center cursor-pointer my-[1vw]"
              onClick={handleBook}
            >
              Book
            </button>
          </div>
        </div>
        <h1 className="font-semibold text-2xl mx-[3vw] my-[2vw]">
          Ratings and Review
        </h1>
        <div className="rating-reviews-container bg-[#F7F7F7] mx-[3vw] p-[1.5vw]">
          <div className="content w-[100%] mb-2  bg-[#F7F7F7] flex items-center justify-between">
            <span className="flex items-center justify-start gap-2 mt-2">
              <p className="text-zinc-300 text-2xl mt-2">4.2</p>
              <img
                src="/assets/Star.png"
                alt="Star"
                className="w-[1vw] h-[1vw]"
              />
              <img
                src="/assets/Star.png"
                alt="Star"
                className="w-[1vw] h-[1vw]"
              />
              <img
                src="/assets/Star.png"
                alt="Star"
                className="w-[1vw] h-[1vw]"
              />
              <img
                src="/assets/Star.png"
                alt="Star"
                className="w-[1vw] h-[1vw]"
              />
              <img
                src="/assets/Star14.png"
                alt="Star14"
                className="w-[1.15vw] h-[1.34vw]"
              />
            </span>
            <button
              className={`p-2 flex text-xl w-[10%] h-[2vw] rounded-lg text-white font-semibold text-center cursor-pointer  justify-center items-center ${
                username ? "bg-[#FF5295]" : "bg-[grey]"
              }`}
              onClick={handleClick}
            >
              Rate Now
            </button>
          </div>
          {/* Comment container */}
          <div className="flex items-center  gap-4 w-full overflow-x-auto mt-[1vw]">
            {filteredReviews.length > 0 ? (
              filteredReviews
                .map((item, index) => (
                  <div
                    key={index}
                    className="msg-container w-[23%] bg-white rounded-2xl p-2 flex-shrink-0"
                  >
                    <p className="text-gray-300">
                      <span className="text-black">
                        {item.username || "Jarvis"}
                      </span>{" "}
                      2d ago
                    </p>
                    <hr className="w-[100%] h-[1vw] mt-1 text-[#E8E8E8]" />
                    <p className="text-wrap mt-[-0.6vw] text-sm">
                      "{item.text}"
                    </p>
                    <span className="flex items-center justify-start gap-2 rounded-xl text-white my-1">
                      {/* <img
                      src="../src/assets/thumbsUp.png"
                      alt="ThumbsUp"
                      className="w-4 h-4"
                    /> */}
                      <p className="text-gray-300 text-sm">{item.star} ⭐</p>
                      {/* <img
                      src="../src/assets/thumbsDown.png"
                      alt="ThumbsDown"
                      className="w-4 h-4"
                    />
                    <p className="text-gray-300 text-sm">50</p> */}
                    </span>
                  </div>
                ))
                .sort((a, b) => a.star - b.star)
            ) : (
              <p className="text-sm">No reviews added yet</p>
            )}
          </div>
        </div>

        <MovieCardSection
          title="You might also like"
          shows={filteredMovieShows}
        />
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Movie;
