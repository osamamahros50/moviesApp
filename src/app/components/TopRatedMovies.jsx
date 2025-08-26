import React from "react";
import Card from "./Card";

// fetch the top rated movies of the week  from the TMDB API
async function fetchTopRatedMovies() {
  // get the api key
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  // make api request to get the top rated movies
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`
  );
  // return empty array if the request fails
  if (!res.ok) return [];
  // convert the response to json and display only 5 movies
  const data = await res.json();
  const movies = data.results ? data.results.slice(0, 5) : [];
  // return the movies list
  return movies;
}
export default async function TopRatedMovies() {
  const movies = await fetchTopRatedMovies();
  return (
    <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
        Top Rated Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => <Card key={movie.id} media={{ ...movie, media_type: "movie" }} />)
        ) : (
          <p className="text-gray-400">No Top Rated Movies Found</p>
        )}
      </div>
    </section>
  );
}
