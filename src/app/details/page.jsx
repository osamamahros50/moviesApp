"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import Card from "../components/Card";
import Loading from "./loading";
import TrailerModal from "../components/TrailerModal";

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  });

export default function DetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const mediaType = searchParams.get("media_type") || "movie";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const { data: media } = useSWR(
    id
      ? `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`
      : null,
    fetcher
  );

  const { data: videos } = useSWR(
    id
      ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${apiKey}&language=en-US`
      : null,
    fetcher
  );
  // جلب الـ recommendations
  const { data: recommendations } = useSWR(
    id
      ? `https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${apiKey}&language=en-US`
      : null,
    fetcher
  );

  const recommendedMovies = recommendations?.results || [];

  const trailer = videos?.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : null;

  const openModal = () => trailerUrl && setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getTitle = () =>
    (mediaType === "movie" ? media?.title : media?.name) || "";
  const getData = () =>
    mediaType === "movie" ? media?.release_date : media?.first_air_date || "";
  const getGenres = () =>
    media?.genres?.map((genre) => genre.name).join(", ") || "N/A";
  const getRating = () => media?.vote_average?.toFixed(1) || "N/A";
  const getRuntime = () => {
    if (mediaType === "movie") {
      return media?.runtime
        ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m`
        : "N/A";
    }
    return media?.number_of_seasons
      ? `${media.number_of_seasons} season(s)`
      : "N/A";
  };
  const getDirector = () => {
    if (mediaType === "movie") {
      const director = media?.credits?.crew?.find(
        (member) => member.job === "Director"
      );
      return director ? director.name : "N/A";
    }
    return (
      media?.created_by?.map((creator) => creator.name).join(", ") || "N/A"
    );
  };
  const getCast = () => media?.credits?.cast?.slice(0, 8) || [];

  if (!media) {
    return <Loading />;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* backdrop */}
      <section
        className="relative h-[240px] sm:h-[360px] md:h-[480px] w-full bg-center bg-cover z-0"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${
            media?.backdrop_path || media?.poster_path || ""
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
      </section>

      {/* details */}
      <section className="container mx-auto px-6 sm:px-12 md:px-40 rounded-b-lg z-10 relative mt-[-80px] sm:mt-[-120px] md:mt-[-160px]">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 pt-4 pb-6 sm:pt-6 sm:pb-8">
          {/* poster */}
          <div className="flex-none w-full max-w-[240px] sm:max-w-[300px] mx-auto md:mx-0 flex flex-col items-center">
            <Image
              src={
                media?.poster_path
                  ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                  : "/public/placeholder.jpg"
              }
              alt={getTitle()}
              width={300}
              height={450}
              className="object-cover rounded-lg w-full"
              quality={90}
            />
            <button
              onClick={openModal}
              disabled={!trailerUrl}
              className={`mt-4 w-full bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-500 transition-colors ${
                !trailerUrl ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Watch Trailer
            </button>
          </div>

          {/* info */}
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {getTitle()}
            </h2>
            <div className="flex items-center gap-3 sm:gap-4 mt-2">
              <p className="text-xs sm:text-sm md:text-base text-yellow-400">
                {getGenres()}
              </p>
              <p className="text-xs sm:text-sm md:text-base">
                ⭐ {getRating()}
              </p>
            </div>
            <p className="text-sm sm:text-base md:text-lg mt-4 sm:mt-6 text-gray-300">
              {media.overview || "No overview available"}
            </p>

            <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm md:text-base">
                <span className="font-medium">Duration:</span>
                <span className="text-gray-300 ml-1">{getRuntime()}</span>
              </p>
              <p className="text-xs sm:text-sm md:text-base">
                <span className="font-medium">Release Date:</span>
                <span className="text-gray-300 ml-1">{getData()}</span>
              </p>
              <p className="text-xs sm:text-sm md:text-base">
                <span className="font-medium">
                  {mediaType === "movie" ? "Director:" : "Creator:"}
                </span>
                <span className="text-gray-300 ml-1">{getDirector()}</span>
              </p>
            </div>

            {/* cast */}
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                Cast:
              </h3>
              <div className="flex flex-row overflow-x-auto gap-3 sm:gap-8 mt-3 sm:mt-4 pb-2">
                {getCast().map((actor) => (
                  <div
                    key={actor.id}
                    className="flex-none flex flex-col items-center w-16 sm:w-20"
                  >
                    <Image
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : "/placeholder.jpg"
                      }
                      alt={actor.name}
                      width={64}
                      height={64}
                      quality={90}
                      className="object-cover rounded-full w-16 h-16 sm:w-20 sm:h-20"
                    />
                    <p className="text-xs sm:text-sm md:text-base mt-1 sm:mt-2 line-clamp-2 text-center">
                      {actor.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* recommended movies section */}
      {recommendedMovies.length > 0 && (
        <section className="container mx-auto px-6 sm:px-12 md:px-40 py-6 sm:py-8 ">
          <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-semibold">
            Recommended {mediaType === "movie" ? "Movies" : "Series"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3 sm:gap-6">
            {recommendedMovies.map((movie) => (
              <div key={movie.id} className="flex-none  ">
                <Card
                  key={movie.id}
                  media={{
                    ...movie,
                    media_type: movie.media_type || "movie",
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        trailerUrl={trailerUrl}
        title={getTitle() || "Trailer"}
      />
    </div>
  );
}
