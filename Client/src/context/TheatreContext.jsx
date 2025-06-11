import React, { useEffect,createContext, useState } from 'react'

export const TheatreContext=createContext({
    theatres:[],
    addTheatre:()=>{},
    deleteTheatre:()=>{},
    updateTheatre:()=>{},
    
});

export const TheatreProvider = ({children}) => {

  const [theatres,setTheatre]=useState(()=>{
          // doing this such that result get stored 
        try{
          const stored=localStorage.getItem('theatre');
          return stored?JSON.parse(stored):[];
        }catch(err){
          console.log("Error parsing from localstorage",err);
          return [];
        }
    });

      useEffect(()=>{
        // stringify transforms into json string
        localStorage.setItem('theatre',JSON.stringify(theatres))
      },[theatres]);

    const addTheatre=((theatre)=>{
      setTheatre([...theatres,theatre])
    })

    const deleteTheatre=(id)=>{
      setTheatre(theatres.filter(t=>t.id!==id))
    }

    const updateTheatre=(updatedTheatre)=>{
      setTheatre(theatres.map(t=>(t.id===updatedTheatre.id?updatedTheatre:t)));
    }


  return (
    <TheatreContext.Provider value={{theatres,addTheatre,deleteTheatre,updateTheatre}}>
            {children}
    </TheatreContext.Provider>
  )
}

