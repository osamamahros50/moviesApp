import React from "react";
import Heroslider from "./Heroslider";

// Fetch the trending movies/TV from TMDB including extra details for each movie
async function fetchTrendingMovies() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
  
  // Fetch trending
  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json();
  const movies = data.results ? data.results.slice(0, 3) : [];

  // Fetch extra details for movies only
  const detailedMovies = await Promise.all(
    movies.map(async (movie) => {
      if (movie.media_type === "movie") {
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
        );
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          return {
            ...movie,
            genres: detailData.genres,
            runtime: detailData.runtime,
          };
        }
      }
    
      return movie;
    })
  );

  return detailedMovies.filter(Boolean);
}

export default async function Herosection() {
  const movies = await fetchTrendingMovies();
  return <Heroslider movies={movies} />;
}
