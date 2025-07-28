import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Tooltip from "@mui/material/Tooltip";

const ShowBooking1 = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const [movie, setMovie] = useState(state?.movie);
  const [theatre, setTheatre] = useState(state?.theatreval);
  const [date, setDate] = useState(state?.date);
  const [from, setFrom] = useState(state?.from);
  const [to, setTo] = useState(state?.to);
  const [showId, setShowId] = useState(state?.id);
  const [showID, setShowID] = useState(state?.showID);
  const [storeId, setStoreId] = useState([]);
  var [totalprice, setTotalPrice] = useState(0);

  const [seatLayout, setSeatLayout] = useState([]);

  useEffect(() => {
    if (!theatre?.ID) return;

    axiosInstance
      .get(`/seat-layout?theatreId=${theatre.ID}`)
      .then((res) => {
        setSeatLayout(res.data.layout);
      })
      .catch((err) => {
        console.error("Failed to fetch seat layout:", err);
      });
  }, [theatre]);

  useEffect(() => {
    if (!state) {
      const pending = localStorage.getItem("pendingBooking");
      if (pending) {
        const data = JSON.parse(pending);
        setMovie(data?.movie);
        setTheatre(data?.theatreval);
        setDate(data?.date);
        setFrom(data?.from);
        setTo(data?.to);
        setShowId(data?.id);
        setShowID(data?.showID);
        setStoreId(data?.storeId || []);
        setTotalPrice(data?.totalprice || 0);

        // localStorage.removeItem("pendingBooking");
      }
    }
  }, [state]);

  console.log("theatre from location.state", theatre);
  const username = localStorage.getItem("userName");

  console.log("Id is", showId);
  console.log("Show Id is", showID);

  const [selectedCity, setSelectedCity] = useState("");
  // seat booked logic
  const [soldTickets, setSoldTickets] = useState([]);

  useEffect(() => {
    if (!showId) return;
    axiosInstance
      .get(`/booked-seats?showId=${showId}`, { withCredentials: true })
      .then((res) => {
        const paidSeats = res.data.tickets.flatMap((tx) => tx.tickets); // Flatten all seat arrays
        console.log("Paid Seats:", paidSeats);
        setSoldTickets(paidSeats);
      })
      .catch((err) => console.error("Error fetching paid tickets:", err));
  }, [showId]);

  useEffect(() => {
    // Style sold seats
    soldTickets.forEach((id) => {
      const el = document.getElementById(id);
      const el1 = document.getElementById(id + "text");
      if (el) {
        el.style.setProperty("background-color", "#E5E5E5", "important");
        el.style.setProperty("border", "2px solid #D6D6D6", "important");
        el.style.setProperty("cursor", "not-allowed", "important");
        el.style.zIndex = "1";

        if (el1) {
          el1.style.setProperty("color", "#FFFFFF", "important");
        }
      }
    });

    // Style selected seats (storeId) — ONLY if not sold
    storeId.forEach((id) => {
      // Avoid re-styling sold seats as selected
      if (soldTickets.includes(id)) return;

      const el = document.getElementById(id);
      const el1 = document.getElementById(id + "text");

      if (el) {
        el.style.setProperty("background-color", "#59B200", "important"); // Selected seat color
        el.style.setProperty("cursor", "pointer", "important");
        el.style.setProperty("border", "2px solid #59B200", "important");
        el.style.zIndex = "2";

        if (el1) {
          el1.style.setProperty("color", "#FFFFFF", "important"); // Selected text color
        }
      }
    });
  }, [soldTickets, storeId]);

  const handleMiddleRow = (s, id) => {
    var finalId = `${s}${id}`;

    const paraId = `${s}${id}${"text"}`;

    console.log("final id is:", finalId);
    console.log("para id is:", paraId);
    console.log("sold ticket", soldTickets);

    if (soldTickets.includes(finalId)) {
      console.warn("This seat is already sold:", finalId);
      // alert(`${finalId} seat is already booked!`);
      return;
    }

    var element = document.getElementById(finalId);
    var element1 = document.getElementById(paraId);

    console.log("element", element1);

    const selected = storeId.includes(finalId);

    let newStoreId = [...storeId];
    let newprice = totalprice;

    if (element) {
      if (!selected) {
        newStoreId.push(finalId);
        element.style.setProperty("background-color", "#59B200", "important");
        element1.style.setProperty("color", "#FFFFFF", "important");
        // if (element1) {
        //   element1.classList.remove("text-[#59B200]");
        //   element1.classList.add("text-white");
        // }

        if (
          s === "A" ||
          s == "B" ||
          s === "C" ||
          s === "D" ||
          s === "E" ||
          s === "F"
        ) {
          newprice += 300;
        } else if (s === "M") {
          newprice += 560;
        } else {
          newprice += 320;
        }
      } else {
        newStoreId = newStoreId.filter((item) => item !== finalId);
        element.style.setProperty("background-color", "#F9F9F9", "important");
        element1.style.setProperty("color", "#59B200", "important");
        // if (element1) {
        //   element1.classList.remove("text-[#59B200]");
        //   element1.classList.add("text-white");
        // }
        if (
          s === "A" ||
          s == "B" ||
          s === "C" ||
          s === "D" ||
          s === "E" ||
          s === "F"
        ) {
          newprice -= 300;
        } else if (s === "M") {
          newprice -= 560;
        } else {
          newprice -= 320;
        }
      }
      setStoreId(newStoreId);
      setTotalPrice(newprice);
      console.log("totalprice", totalprice);
    }
  };

  console.log(totalprice);

  const handleSubmit = () => {
    console.log("final values of store id, totalprice", totalprice);
    console.log("final values of store id, totalprice", storeId);
    if (soldTickets.length === 166) {
      alert("All seats booked can't proceed to pay!");
      return;
    }

    if (!username) {
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          movie,
          theatreval: theatre,
          date,
          from,
          to,
          id: showId,
          showID,
          storeId,
          totalprice,
        })
      );
      navigate("/root", { state: { from: "/showbooking" } });
      return;
    }

    navigate("/booking", {
      state: { storeId, totalprice, movie, theatre, date, from, to, showId },
    });
  };

  // const handlePopUP = () => {
  //   navigate("/booking",{state:{totalprice,storeId,movie}});
  // };

  return (
    <div id={showId}>
      <div className="show-booking-container">
        <div className="theatre-container font-[Inter]">
          <NavBar1
            title={username}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
          <span className="flex items-center justify-start mx-[3vw] gap-1 mt-2">
            <Link
              // href="http://localhost:3000/dashboard"
              to="/"
              className="cursor-pointer font-light text-zinc-500 "
            >
              Home /
            </Link>
            <Link
              // href="http://localhost:3000/movie"
              to={`/movie/${showID}`}
              state={{ movie: movie }}
              className="cursor-pointer font-light text-zinc-500"
            >
              Movie /
            </Link>
            <Link
              // href="http://localhost:3000/showtime"
              to="/showtime"
              state={{ movie: movie }}
              className="cursor-pointer text-zinc-500"
            >
              Showtime /
            </Link>
            <Link
              to="/booking"
              state={{ movie: movie }}
              // href="http://localhost:3000/showtime"
              className="cursor-pointer"
            >
              Show Booking
            </Link>
          </span>
        </div>

        <div className="header flex justify-start mx-[3vw] mt-[2vw] gap-4 bg-[#F9F9F9] py-[1.4vw]">
          <img
            src={theatre?.theatrefile || "/assets/pvr.png"}
            alt="PVR"
            className="w-[3vw] h-[3vw] rounded-full"
          />
          <span className="flex flex-col items-start justify-center">
            <h1 className="text-3xl font-bold">{movie?.movie}</h1>
            <p className="font-normal text-[#5E5E5E]">
              {theatre?.theatrename} | {theatre?.address}| {theatre?.cityName} |{" "}
              {theatre?.stateName} | {date}
            </p>
          </span>
        </div>

        <div className="border-1 border-[#D9D9D9] mx-[3vw]">
          <div className="seat-status flex items-center justify-center gap-6  my-[0.5vw]">
            <span className="flex items-center justify-center gap-2">
              <p className="w-[1.3vw] h-[1.3vw] bg-white border-2 border-[#59B200] rounded-md"></p>
              <h3>Available</h3>
            </span>
            <span className="flex items-center justify-center gap-2">
              <p className="w-[1.3vw] h-[1.3vw] bg-[#59B200] border-2 border-[#59B200] rounded-md"></p>
              <h3>Selected</h3>
            </span>
            <span className="flex items-center justify-center gap-2">
              <p className="w-[1.3vw] h-[1.3vw] bg-[#C0C0C0] border-1 border-[#D6D6D6] rounded-md"></p>
              <h3>Sold out</h3>
            </span>
          </div>
        </div>
        {seatLayout.map(({ ID, Row, SeatCount, Price }) => (
          <div key={Row} className="main-content mx-[3vw] p-1">
            <h3 className="text-[#949494] font-normal">Rs.{Price}</h3>
            {/* <hr className="my-2 text-[#D6D6D6]" /> */}
            <div className="flex items-center gap-4 justify-start my-[1.3vw] ml-[8vw]">
              <p className="text-[#949494] font-normal">{Row}</p>

              {Array.from({ length: SeatCount }).map((_, index) => {
                const seatNumber = index + 1;
                const seatId = `${Row}${seatNumber}`;
                const paraId = `${seatId}text`;

                return (
                  <div
                    key={seatId}
                    id={seatId}
                    className={`h-[2.4vw] w-[2.4vw] ml-[1vw] bg-[#F9F9F9] border-2 border-[#59B200] cursor-pointer rounded-md flex items-center justify-center ${
                      seatNumber !== 1 && seatNumber % 5 === 1 ? "ml-[2vw]" : ""
                    }`}
                    onClick={() => handleMiddleRow(Row, seatNumber)}
                  >
                    <p
                      id={paraId}
                      className="text-center text-base text-[#59B200]"
                    >
                      {seatNumber}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex flex-col items-center justify-center">
          <img
            src="/assets/rect2.png"
            alt="Overlayed image"
            className="w-[20%] h-[3vw] z-10 "
          />
          <img
            src="/assets/rect1.jpg"
            alt="Overlayed image"
            className="w-[22%] h-[2vw] mt-[-2vw]"
          />
          <p className="text-center text-md text-zinc-300">Screen</p>
        </div>
      </div>
      <div className="flex items-center justify-around p-[1vw] w-[100%] bg-[#F0F0F0] relative mb-4">
        <p className="font-bold text-xl">{storeId.length} seat selected</p>

        <button
          className="bg-[#FF5295]  text-md w-[12vw] h-[2vw]  rounded-lg text-white font-semibold text-center  mx-[1vw] cursor-pointer"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ShowBooking1;
