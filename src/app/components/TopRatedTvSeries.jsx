import React from "react";
import Card from "./Card";

// fetch the top rated tv series   from the TMDB API
async function fetchTopRatedTvSeries() {
  // get the api key
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  // make api request to get the top rated tv series
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`
  );
  // return empty array if the request fails
  if (!res.ok) return [];
  // convert the response to json and display only 5 movies
  const data = await res.json();
  const movies = data.results ? data.results.slice(0, 5) : [];
  // return the movies list
  return movies;
}
export default async function TopRatedTvSeries() {
  const series = await fetchTopRatedTvSeries();
  return (
    <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
        Top Rated TV Series
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {series.length > 0 ? (
          series.map((serie) => <Card key={serie.id} media={{ ...serie, media_type: "tv" }} />)
        ) : (
          <p className="text-gray-400">No Top Rated TV Series Found</p>
        )}
      </div>
    </section>
  );
}
