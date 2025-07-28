import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AddButton from "../components/AddButton";
import MainHeader from "../components/MainHeader";
import TheatreCard from "../components/TheatreCard";
import { TheatreContext } from "../context/TheatreContext";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

const baseUrl = import.meta.env.VITE_ROUTE;

const Theatres = () => {
  // const {theatres}=useContext(TheatreContext)

  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // The replace: true option replaces the current entry in the history stack, and state: {} clears the state object.
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const [showDateWarning, setShowDataWarning] = useState(false);

  useEffect(() => {
    if (location.state) {
      setShowDataWarning(true);
    }
  }, [location]);

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get movies api call
  useEffect(() => {
    axiosInstance
      .get("/get-theatres", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setTheatres(res.data);
      })
      .catch((err) =>
        console.log("Error fetching movies", err.response?.data || err.message)
      )
      .finally(() => setLoading(false));
  }, [location]);

  // filter logic
  const [searchQuery, setSearchQuery] = useState("");
  const filterTheatres = theatres.filter((theatre) =>
    theatre.theatrename.toLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  const paginatedTheatres = filterTheatres.slice(
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

      {/* {showDateWarning && (
        <Stack
          sx={{
            width: "60%",
            position: "absolute",
            zIndex: "1020",
            marginLeft: "18vw",
            marginTop: "6vw",
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
            {
              "Update the corresponding showtime if theatre is edited or add theatre in showtime if new theatre is added"
            }
          </Alert>
        </Stack>
      )} */}

      <MainHeader
        title="Manage Theatres"
        btncontent="+Add New Theatres"
        headerlink="Theatre Management"
        btnlink="/admin-addnewtheatre"
        onSearch={setSearchQuery}
        searchValue={searchQuery}
      />
      {loading ? (
        <p className="text-center mt-8">Loading Theatres ...</p>
      ) : filterTheatres.length > 0 ? (
        // filterTheatres.map((t) => (
        //   <TheatreCard
        //     key={t.id}
        //     id={t.ID}
        //     theatrename={t.theatrename}
        //     address={t.address}
        //     cityName={t.cityName}
        //     stateName={t.stateName}
        //     status={t.status}
        //     totalscreens={t.totalscreens}
        //     theatrefile={t.theatrefile}
        //     value={t.value}

        //   />
        // ))
        paginatedTheatres.map((t) => (
          <TheatreCard
            key={t.id}
            id={t.ID}
            theatrename={t.theatrename}
            address={t.address}
            cityName={t.cityName}
            stateName={t.stateName}
            status={t.status}
            totalscreens={t.totalscreens}
            theatrefile={t.theatrefile}
            value={t.value}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-8">No theatres added yet</p>
      )}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 bg-white py-2 px-4 rounded shadow ">
        <Pagination
          count={Math.ceil(filterTheatres.length / itemsPerPage)}
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

export default Theatres;
