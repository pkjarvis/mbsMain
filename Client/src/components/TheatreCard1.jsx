import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const TheatreCard1 = ({ movie }) => {
  const [review, setReview] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    axiosInstance
      .get(
        "get-review-bymovie",
        { params: { movieId: movie.id } },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("response is", res.data);
        const filteredReviews = res.data.reviews.map((item) => item.star);
        setReview(filteredReviews);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log("reviews is:", review);

  let total = 0;
  for (let i = 0; i < review.length; i++) {
    total += review[i];
  }
  const average = review.length > 0 ? (total / review.length).toFixed(1) : 0;

  const handleSubmit=()=>{
    navigate("/movie",{state:{movie}});
  };

  return (
    <div className="w-[30%] mt-[2vw]">
      <div className="card-container w-[100%] h-[32vw]">
        <div className="w-[100%%] h-[26vw] rounded-xl overflow-hidden">
          <img
            src={movie.file || "/assets/Chaava.png"}
            alt="Chaava"
            className="scale-122 w-[100%] h-[109%] ease-in-out hover:scale-100 hover:w-[100%] hover:h-[100%] hover:ease-in-out duration-300"
          />
        </div>
        <div className="flex flex-col mt-4">
          <p className="text-md text-black font-semibold">
           {movie.movie || "Alice in Wonderland"}
          </p>
          <span className="flex items-center justify-start gap-2">
            <p className="text-gray-400">{average || 0}</p>
            <img
              src="/assets/Star.png"
              alt="Star"
              className="w-[1vw] h-[1vw]"
            />
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
              src="/assets/Star14.png"
              alt="Star14"
              className="w-[1.16vw] h-[1.18vw]"
            /> */}
          </span>
           <p className="text-[#6F6F6F] font-light mx-2 flex-wrap">
            {movie.genre} | UA13+ |{" "}
            {movie.language?.map((lang, index) => (
              <span key={index} className="inline-block flex-wrap">
                {lang.name}
                {index < movie.language.length - 1 && ", "}
              </span>
            ))}
          </p>
          <button className="bg-[#FF5295] w-[7vw] h-[2vw] text-white font-medium rounded-lg  mt-2 cursor-pointer" onClick={handleSubmit}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheatreCard1;
