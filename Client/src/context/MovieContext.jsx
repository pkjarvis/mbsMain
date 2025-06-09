import React,{ createContext,useEffect,useState} from 'react'

export const MoviesContext=createContext({
    movies:[],
    addMovie:(m)=>{},
});



const MoviesProvider = ({children}) => {
 
  const [movies,setMovies]=useState(()=>{
        // doing this such that result get stored 
      const stored=localStorage.getItem('movies');
      return stored?JSON.parse(stored):[];  // transforms into js object
  });

  const [editMovie,setEditMovie]=useState(null);

  useEffect(()=>{
    // stringify transforms into json string
    localStorage.setItem('movies',JSON.stringify(movies))
  },[movies]);

    const addMovie = (movie)=>{
    setMovies((prev)=>[...prev,movie])
  };

  const deleteMovie = (id)=>{
    setMovies((prev)=>prev.filter(movie=>movie.id!==id));
  };    

   const updateMovie = (updatedMovie) => {
    setMovies((prev) =>
      prev.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie))
    );
  };

 
  return (
    <MoviesContext.Provider value={{movies,addMovie,deleteMovie,updateMovie,editMovie,setEditMovie}}>
        {children}
    </MoviesContext.Provider>
  )
}

export default MoviesProvider