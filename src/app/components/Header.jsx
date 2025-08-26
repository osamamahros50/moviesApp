"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
export default function Header() {
  const pathname = usePathname(); //using pathname to highlight the active navigation link
  const [isMenuOpen, setIsMenuOpen] = useState(false); //state for mobile menu
  const [isSearching, setIsSearching] = useState(false); //state for search visibility
  const [searchTerm, setSearchTerm] = useState(""); //state to store the value of search input
  const [suggestions, setSuggestions] = useState([]); //state to store search suggestions results
  const [isLoading, setIsLoading] = useState(false); //state for loading indicator
  //navigation links
  const navlinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "TV Series", path: "/tv-series" },
  ];
  //fetch search suggestions from TMDB based on input
  const fetchSuggestions = async (query) => {
    // clear suggestions if query is empty or spaces
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    // show Loading indicator before fetching api
    try {
      // get TMDB API key from .env.local
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      // build Api url with ended query for save url formating
      const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`;
      //vfetch search results without cache for fetching fresh data
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        // convert response to json
        const data = await response.json();
        // keep only movies and tv services and set the limit to 5 results
        const filteredResults =
          data.results
            .filter(
              (item) => item.media_type === "movie" || item.media_type === "tv"
            )
            .slice(0, 5) || [];
        // update suggestions with filtered results
        setSuggestions(filteredResults);
      } else {
        // clear suggestions if Api call fails
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    } finally {
      //hide loading indicator after fetching api
      setIsLoading(false);
    }
  };
  //handle search button click behavior
  const handleSearchClick = () => {
    // if search is open and suggestions  exist ,close  search and reset
    if (isSearching && suggestions.length > 0) {
      setIsSearching(false);
      setSearchTerm("");
      setSuggestions([]);
    } else if (searchTerm.trim()) {
      // if search term exists, open search and fetch suggestions
      setIsSearching(true);
      fetchSuggestions(searchTerm);
    }
  };
  return (
    <motion.header
      className="bg-transparent text-white w-full py-2 z-50 px-4 md:px-10 xl:px-36 absolute top-0 left-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* desktop design section */}
      <div className="flex  flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* logo section */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-2xl md:text-xl lg:text-3xl font-bold text-yellow-400">
              Rise of Coding
            </span>
            <span className="text-xs lg:text-base text-white">
              Movies and TV Series
            </span>
          </Link>
          {/* mobile menu button */}
          <motion.button
            className="md:hidden text-white hover:text-white/80 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
        {/* search bar */}
        <motion.div className="relative w-full md:w-1/3 md:mx-8 hidden md:block">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Quick Search..."
            className="w-full py-1.5 px-4 lg:py-3  bg-white text-sm text-gray-500 placeholder-gray-500 focus:outline-none rounded-xl border border-t-gray-500 focus:border-white pr-10"
          />
          <button
            onClick={handleSearchClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-default"
          >
            {isLoading ? (
              // show loading spinner during API call
              <div className="w-5 h-5 border-2 border-y-400 border-t-transparent rounded-full animate-spin" />
            ) : isSearching && suggestions.length > 0 ? (
              // show close icon
              <X className="w-5 h-5 text-gray-500" />
            ) : (
              // show search icon
              <Search className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {/* animated suggestion dropdown */}
          <AnimatePresence>
            {isSearching && suggestions.length > 0 && (
              <motion.div
                className="absolute left-0 top-full w-full z-50 mt-2 bg-[#18181b] border border-gray-500 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/*  render suggestion or results found message  */}
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <Link key={item.id}   onClick={() => setIsSearching(false)}  href={`/details?id=${item.id}&media_type=${item.media_type}`}>
                      <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer ">
                        <Image
                          src={
                            item.poster_path
                              ? `https:image.tmdb.org/t/p/w500${item.poster_path}`
                              : "/defult_poster.jpg"
                          }
                          alt=""
                          width={32}
                          height={48}
                          className="w-8 aspect-[2/3] object-cover rounded"
                        />
                        <div className=" flex-1">
                          <h3 className="text-sm text-white line-clamp-2 h-10">
                            {item.title || item.name || "unnamed"}
                          </h3>
                          <p>
                            {(
                              item.release_date ||
                              item.first_air_date ||
                              "unknown"
                            ).split("-")[0] || "N/A"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  // no result found
                  <div className="p-2 text-sm text-gray-500 text-center">
                    No Results Found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {/* navigation links */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navlinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-xs sm:text-base font-medium relative text-white ${
                pathname === link.path ? "text-white" : "hover:text-white/80"
              }`}
            >
              {link.name}
              {/* underline animation for active link */}
              {pathname === link.path && (
                <motion.span
                  className="absolute left-0 -bottom-1 w-full h-0.5 bg-yellow-400 rounded-full"
                  layoutId="underline"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
      {/* mobile menu */}
      {isMenuOpen && (
        <motion.div
          className={`md:hidden backdrop:blur-xs bg-[rgba(24,24,27,0.6)] z-50 absolute left-0 w-full px-4 py-4 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={isMenuOpen ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* mobile search bar */}
          <motion.div className="relative w-full mb-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Quick Search..."
              className="w-full py-2 px-4 bg-white placeholder-gray-500 text-gray-900 rounded-xl border border-gray-500 focus:outline-none focus:border-white pr-10"
            />
            <button
              onClick={handleSearchClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {isLoading ? (
                // show loading spinner during API call
                <div className="w-5 h-5 border-2 border-y-400 border-t-transparent rounded-full animate-spin" />
              ) : isSearching && suggestions.length > 0 ? (
                // show close icon
                <X className="w-5 h-5 text-gray-500" />
              ) : (
                // show search icon
                <Search className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {/* animated suggestion dropdown */}
            <AnimatePresence>
              {isSearching && suggestions.length > 0 && (
                <motion.div
                  className="absolute left-0 top-full w-full z-50 mt-2 bg-[#18181b] border border-gray-500 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/*  render suggestion or results found message  */}
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <Link key={item.id}   onClick={() => setIsSearching(false)}  href={`/details?id=${item.id}&media_type=${item.media_type}`}>
                        <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer ">
                          <Image
                            src={
                              item.poster_path
                                ? `https:image.tmdb.org/t/p/w500${item.poster_path}`
                                : "/defult_poster.jpg"
                            }
                            alt=""
                            width={32}
                            height={48}
                            className="w-8 aspect-[2/3] object-cover rounded"
                          />
                          <div className=" flex-1">
                            <h3 className="text-sm text-white line-clamp-2 h-10">
                              {item.title || item.name || "unnamed"}
                            </h3>
                            <p>
                              {(
                                item.release_date ||
                                item.first_air_date ||
                                "unknown"
                              ).split("-")[0] || "N/A"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    // no result found
                    <div className="p-2 text-sm text-gray-500 text-center">
                      No Results Found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {/* mobile navigation links */}
          <nav className="flex flex-col items-center gap-2">
            {navlinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="block text-white text-base font-medium hover:text-white/80"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
