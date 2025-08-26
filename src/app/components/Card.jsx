"use client";

import Image from "next/image";
import Link from "next/link";
import TrailerModal from "./TrailerModal";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch trailer");
    return res.json();
  });

export default function Card({ media }) {
  const {
    id,
    poster_path: posterPath,
    profile_path: profilePath, // لو الشخص
    title,
    name,
    vote_average: voteAverage,
    media_type: mediaType = "movie",
  } = media || {};

  const displayTitle = name || title || "Unknown Title";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: trailerData } = useSWR(
    id && mediaType !== "person"
      ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      : null,
    fetcher
  );

  const trailer =
    trailerData?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    ) ||
    trailerData?.results?.find((video) => video.site === "YouTube");

  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : null;

  const openModal = () => {
    if (trailerUrl) setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex-none w-36 xs:w-40 sm:w-48 md:w-56 lg:w-64 min-w-[140px] max-w-[260px] bg-[#18181b] rounded-xl overflow-hidden shadow-lg snap-start hover:scale-105 transition-transform duration-300">
      <Link href={`/details?id=${id}&media_type=${mediaType}`}>
        <div className="relative aspect-[2/3] group cursor-pointer">
          <Image
            src={
              posterPath
                ? `https://image.tmdb.org/t/p/w500${posterPath}`
                : profilePath
                ? `https://image.tmdb.org/t/p/w500${profilePath}`
                : "/placeholder.jpg"
            }
            alt={displayTitle}
            fill
            className="object-cover rounded-t-xl group-hover:brightness-95 transition-all"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            quality={85}
          />
        </div>
      </Link>

      <div className="p-3 sm:p-4 flex flex-col gap-2">
        {mediaType !== "person" && (
          <p className="text-xs sm:text-sm text-yellow-400 font-semibold">
            ⭐ {voteAverage?.toFixed(1) || "N/A"}
          </p>
        )}

        <Link href={`/details?id=${id}&media_type=${mediaType}`}>
          <h3 className="text-sm sm:text-base md:text-lg text-white line-clamp-2 h-10 sm:h-12 md:h-14 cursor-pointer hover:underline font-semibold">
            {displayTitle}
          </h3>
        </Link>

        {mediaType !== "person" && (
          <button
            onClick={openModal}
            disabled={!trailerUrl}
            className={`flex items-center justify-center gap-2 w-full py-2 sm:py-2.5 bg-[#202020] text-white font-medium border border-gray-700 rounded-full hover:bg-[#2a2a2a] transition-colors text-xs sm:text-sm md:text-base ${
              !trailerUrl ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <Image
              src="/youtype.webp"
              alt="YouTube"
              width={20}
              height={20}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            Trailer
          </button>
        )}
      </div>

      <TrailerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        trailerUrl={trailerUrl}
        title={displayTitle}
      />
    </div>
  );
}
