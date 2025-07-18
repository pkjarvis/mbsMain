import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MainHeader from "../components/MainHeader";
import ShowTimeCard from "../components/ShowTimeCard";
import { ShowTimeContext } from "../context/ShowTimeContext";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
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

  const [showtime, setShowTime] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get movies api call
  useEffect(() => {
      axiosInstance
        .get("/get-showtime", { withCredentials: true })
        .then((res) => {
          console.log("Api response", res.data);
          setShowTime(res.data);
        })
        .catch((err) =>
          console.log(
            "Error fetching movies",err
          )
        )
        .finally(() => setLoading(false));
          
  }, [location]);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic
  const filteredShowtime = Array.isArray(showtime)
    ? showtime.filter(
        (show) =>
          show.moviename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          show.theatrename.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
      {loading ? (
        <p className="text-center mt-8">Loading Showtime ...</p>
      ) : filteredShowtime.length > 0 ? (
        filteredShowtime.map((s) => (
          <ShowTimeCard
            key={s.id}
            id={s.id}
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
    </div>
  );
};

export default Shows;
