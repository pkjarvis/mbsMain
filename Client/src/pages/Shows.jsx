import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MainHeader from "../components/MainHeader";
import ShowTimeCard from "../components/ShowTimeCard";
import { ShowTimeContext } from "../context/ShowTimeContext";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
const baseUrl = import.meta.env.VITE_ROUTE;
// id:Date.now(),
//       theatrename:theatrename,
//       startDate:startDate,
//       moviename:moviename,
//       datetime12h:datetime12h,
//       datetime:datetime,
//       timearray:timearray,
//       selectedCities:selectedCities,

const Shows = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [showtime, setShowTime] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedTheatre, setSelectedTheatre] = useState("");

  // Get movies api call
  useEffect(() => {
    axiosInstance
      .get("/get-showtime", { withCredentials: true })
      .then((res) => {
        console.log("Api response", res.data);
        setShowTime(res.data);
      })
      .catch((err) => console.log("Error fetching movies", err))
      .finally(() => setLoading(false));
  }, [location]);

  const movieOptions = [...new Set(showtime.map((show) => show.moviename))];
  const theatreOptions = [...new Set(showtime.map((show) => show.theatrename))];

  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic
  // const filteredShowtime = Array.isArray(showtime)
  //   ? showtime.filter(
  //       (show) =>
  //         show.moviename.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         show.theatrename.toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  //   : [];
  const filteredShowtime = showtime.filter((show) => {
    const movieMatch = selectedMovie ? show.moviename === selectedMovie : true;
    const theatreMatch = selectedTheatre
      ? show.theatrename === selectedTheatre
      : true;
    
    const searchMatch=show.moviename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          show.theatrename.toLowerCase().includes(searchQuery.toLowerCase());
          
    return movieMatch && theatreMatch && searchMatch;
  });

  const paginatedShows = filteredShowtime.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        newestOnTop
        hideProgressBar={true}
        toastClassName={() =>
          "relative flex p-3 rounded-md justify-between items-center text-white bg-[rgba(31,132,90,1)] shadow-lg mt-12"
        }
      />

      <MainHeader
        title="Schedule Showtimes"
        btncontent="+Add New Showtime"
        headerlink="Showtime Scheduling"
        btnlink="/admin-addnewshows"
        onSearch={setSearchQuery}
        searchValue={searchQuery}
      />

      <Box
        display="flex"
        gap={4}
        mx="auto"
        my={1}
        sx={{ width: "40%", justifyContent: "space-between" }} // Adjust the box width here
      >
        <FormControl sx={{ width: "48%" }}>
          {" "}
          {/* 48% to allow some spacing in 50/50 */}
          <InputLabel>Filter by Movie</InputLabel>
          <Select
            value={selectedMovie}
            label="Filter by Movie"
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {movieOptions.map((movie, index) => (
              <MenuItem key={index} value={movie}>
                {movie}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: "48%" }}>
          <InputLabel>Filter by Theatre</InputLabel>
          <Select
            value={selectedTheatre}
            label="Filter by Theatre"
            onChange={(e) => setSelectedTheatre(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {theatreOptions.map((theatre, index) => (
              <MenuItem key={index} value={theatre}>
                {theatre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <p className="text-center mt-8">Loading Showtime ...</p>
      ) : filteredShowtime.length > 0 ? (
        // filteredShowtime.map((s) => (
        //   <ShowTimeCard
        //     key={s.id}
        //     id={s.id}
        //     startDate={s.startDate}
        //     theatrename={s.theatrename}
        //     moviename={s.moviename}
        //     //  datetime12h={s.datetime12h}
        //     //  datetime={s.datetime}
        //     timearray={s.timearray}
        //     language={s.language}
        //     status={s.status}
        //     archived={s.archived}
        //     file={s.Movie.file}
        //   />
        // ))
        paginatedShows.map((s) => (
          <ShowTimeCard
            key={s.ID}
            id={s.ID}
            startDate={s.startDate}
            theatrename={s.theatrename}
            moviename={s.moviename}
            //  datetime12h={s.datetime12h}
            //  datetime={s.datetime}
            timearray={s.timearray}
            language={s.language}
            status={s.status}
            archived={s.archived}
            file={s.Movie.file}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-8">No showtime added yet</p>
      )}
      <div className="flex justify-center mt-[3vw]">
        <Pagination
          count={Math.ceil(filteredShowtime.length / itemsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          // variant="outlined"
          // shape="rounded"
          // color="secondary" // pink theme
        />
      </div>
    </div>
  );
};

export default Shows;
