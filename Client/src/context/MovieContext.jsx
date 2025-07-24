import React,{ createContext,useEffect,useState} from 'react'
import axiosInstance from '../utils/axiosInstance';

export const MoviesContext=createContext({
    movies:[],
    addMovie:()=>{},
    deleteMovie:()=>{},
    updateMovie:()=>{}
    
});



export const MoviesProvider = ({children}) => {
 
  const [movies,setMovies]=useState(()=>{
        // doing this such that result get stored 
      try{
        const stored=localStorage.getItem('movies');
        return stored?JSON.parse(stored):[];
      }catch(err){
        console.log("Error parsing from localstorage",err);
        return [];
      }
  });

 
  useEffect(()=>{
    // stringify transforms into json string
    localStorage.setItem('movies',JSON.stringify(movies))
  },[movies]);

   

  const addMovie = (movie)=>{
    setMovies([...movies,movie]);
  };

  const deleteMovie = (id)=>{
    setMovies(movies.filter(m=>m.id!==id));
  }

  const updateMovie=(updatedMovie)=>{
    setMovies(movies.map(m=>m.id===updatedMovie.ID?updatedMovie:m));
  };




 
  return (
    <MoviesContext.Provider value={{movies,addMovie,deleteMovie,updateMovie}}>
        {children}
    </MoviesContext.Provider>
  )
}

