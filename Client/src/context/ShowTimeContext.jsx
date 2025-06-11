import React, { createContext, useEffect, useState } from "react";

export const ShowTimeContext = createContext({
  showtimes: [],
  addShowTime: {},
  updateShowTime: {},
});

export const ShowTimeProvider = ({ children }) => {
  const [showtimes, setShowTimes] = useState(() => {
    try {
      const stored = localStorage.getItem("showtime");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.log("Error parsing from localstorage", e);
      return [];
    }
  });

  useEffect(() => {
    
    localStorage.setItem("showtime", JSON.stringify(showtimes));
  }, [showtimes]);

  const addShowTime = (showtime) => {
    setShowTimes([...showtimes, showtime]);
  };

  const updateShowTime = (updatedShowTime) => {
    setShowTimes(
      showtimes.map((s) => (s.id == updatedShowTime.id ? updatedShowTime : s))
    );
  };

  const archive = (id) => {
    const val = showtimes.filter((item) => item.id !== id);
    val.style.background = "black";
  };

  return (
    <ShowTimeContext.Provider
      value={{ showtimes, addShowTime, updateShowTime, archive }}
    >
      {children}
    </ShowTimeContext.Provider>
  );
};
