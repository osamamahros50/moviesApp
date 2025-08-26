import React from "react";
import Card from "./Card";

// fetch the trending movies of the week  from the TMDB API
async function fetchTrendingMovies() {
  // get the api key
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  // make api request to get the trending movies
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
  );
  // return empty array if the request fails
  if (!res.ok) return [];
  // convert the response to json and display only 5 movies starting from index 3
  const data = await res.json();
  const movies = data.results ? data.results.slice(3, 8) : [];
  // return the movies list
  return movies;
}
export default async function TrendingMovies() {
  const movies = await fetchTrendingMovies();
  return (
    <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
        Trending Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => <Card key={movie.id} media={{ ...movie, media_type: "movie" }} />)
        ) : (
          <p className="text-gray-400">No Trending Movies Found</p>
        )}
      </div>
    </section>
  );
}
