"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Link from "next/link";
import useSWR from "swr";
import TrailerModal from "./TrailerModal";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function Heroslider({ movies }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getMediaTitle = (media) =>
    media.media_type === "movie"
      ? media.title || "untitled"
      : media.name || "untitled";

  const getGenres = (media) => {
    if (media.media_type === "movie" && media.genres?.length > 0) {
      return media.genres.map((genre) => genre.name).join(", ");
    }
    return "";
  };

  const formatDuration = (media) => {
    if (media.media_type === "movie" && media.runtime) {
      const h = Math.floor(media.runtime / 60);
      const m = media.runtime % 60;
      return `${h}h ${m}m`;
    }
    return "";
  };
  const handelButtonClick = (index) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
      setCurrentSlide(index);
    }
  };

  const { data: trailerData } = useSWR(
    selectedMedia
      ? `https://api.themoviedb.org/3/${selectedMedia.media_type}/${selectedMedia.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      : null,
    fetcher
  );

  const trailer = trailerData?.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : null;

  const openModal = (media) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <section className="relative min-h-[300px] sm:min-h-[450px] md:min-h-[600px] lg:min-h-[720px] w-full">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={movies.length > 1}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          setCurrentSlide(swiper.realIndex);
        }}
        className="h-full w-full "
      >
        {movies.map((media) => (
          <SwiperSlide key={media.id}>
            <div className="relative w-full h-[300px] sm:h-[450px] md:h-[600px] lg:h-[720px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280${
                    media.backdrop_path || "/placeholder.jpg"
                  })`,
                }}
              ></div>

              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/90"></div>

              <div className="absolute inset-0 flex items-center sm:items-end p-4 sm:p-8 md:p-16 text-white max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl">
                <div>
                  <Link
                    href={`/details?id=${media.id}&media_type=${media.media_type}`}
                  >
                    <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {getMediaTitle(media)}
                    </h1>
                  </Link>

                  <p className="text-xs sm:text-sm md:text-lg mt-1 sm:mt-3 text-yellow-400 font-semibold">
                    {getGenres(media)}
                  </p>

                  <p className="hidden sm:block text-xs sm:text-sm md:text-base lg:text-lg mt-3 line-clamp-4 sm:leading-5">
                    {media.overview || "No overview available"}
                  </p>

                  <p className="text-xs sm:text-sm md:text-lg mt-3 flex flex-wrap gap-2 items-center">
                    <span>⭐ {media.vote_average.toFixed(1)}</span>
                    {media.media_type === "movie" && (
                      <>
                        <span>|</span>
                        <span>🕒 {formatDuration(media)}</span>
                      </>
                    )}
                  </p>

                  <button
                    onClick={() => openModal(media)}
                    disabled={!media.id}
                    className={`mt-4 sm:mt-6 bg-yellow-400 text-black px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition text-xs sm:text-sm md:text-base ${
                      !media.id
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {movies.length > 1 && (
        <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full border-2 transition-colors ${
                index === currentSlide
                  ? "bg-yellow-400 border-yellow-400"
                  : "bg-transparent border-white"
              }`}
              onClick={() => handelButtonClick(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <TrailerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        trailerUrl={trailerUrl}
        title={selectedMedia ? getMediaTitle(selectedMedia) : "Trailer"}
      />
    </section>
  );
}
