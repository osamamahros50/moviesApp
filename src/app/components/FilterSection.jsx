"use client";
import React, { useEffect, useState } from "react";
export default function FilterSection({
  genres = [],
  languages = [],
  placeholder,
}) {
  // initialize state  for filter  values
  const [filters, setFilters] = useState({
    genre: "",
    language: "",
    year: "",
    rating: "",
    sortBy: "",
    query: "",
  });
  // sync filter state  with  Url query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters((prev) => ({
      ...prev,
      genre: params.get("genre") || "",
      language: params.get("language") || "",
      year: params.get("year") || "",
      rating: params.get("rating") || "",
      sortBy: params.get("sortBy") || "",
      query: params.get("query") || "",
    }));
  }, []); // empty dependency array to run once on mount

  // handel changes to filter inputs and update  state
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    })); // update the specific filter value
  };
  // handel search button click to update URL with filter values
  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value); // add non-empty filter values to URL params
    });
    params.set("page", "1"); // reset to page 1 for new filter results
    window.history.pushState({}, "", `?${params}`); // update the URL without reloading the page
  };
  // handle reset button click to clear all filters
  const handleReset = () => {
    const defaultFilters = {
      genre: "",
      language: "",
      year: "",
      rating: "",
      sortBy: "",
      query: "",
    };
    setFilters(defaultFilters);
    window.history.pushState({}, "", window.location.pathname);
  };
  // definr static filter options for years ,rating ,and sortBy
  const filterOptions = {
    years: ["2025", "2024", "2020-now", "2010-2019", "2000-2009", "1990-1999"],
    rating: ["9", "8", "7", "6 ", "5", "4", "3", "2", "1"],
    sortBy: [
      { label: "Most Popular", value: "popularity.desc" },
      { label: "Newest", value: "release_date.desc" },
      { label: "Oldest", value: "release_date.asc" },
      { label: "Top Rated", value: "Vote_average.asc" },
    ],
  };
  // create reusable  dropdown  component for filter selections
  function Dropdown({ label, name, options, value, onChange }) {
    return (
      <div>
        <label className="block mb-2 ml-1 text-sm">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="bg-[#252525] rounded-md px3
            py-2  text-white w-full"
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  // render filter UI  With search input and dropdowns
  return (
    <section className="bg-black text-white py-6 mt-20">
      <div className="px-4 md:px-10 xl:px-36 ">
        <div className="mb-6">
          <label className="block mb-2 ml-1 text-sm font-semibold">
            Search
          </label>
          <input
            type="text"
            name="query"
            value={filters.query}
            onChange={handleFilterChange}
            placeholder={placeholder}
            autoComplete="off"
            className="bg-[#252525] rounded-xl focus:outline-none px-3 py-2 text-sm placeholder-white text-white w-full"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* genre dropdown */}
          <Dropdown
            label="Genre"
            name="genre"
            options={genres.map((genre) => ({
              label: genre.name,
              value: genre.id,
            }))}
            value={filters.genre}
            onChange={handleFilterChange}
          />
          {/* years dropdown */}
          <Dropdown
            label="Year"
            name="year"
            options={filterOptions.years.map((year) => ({
              label: year,
              value: year,
            }))}
            value={filters.year}
            onChange={handleFilterChange}
          />
          {/* rating dropdown */}
          <Dropdown
            label="Rating"
            name="rating"
            options={filterOptions.rating.map((rating) => ({
              label: `${rating} +`,
              value: rating,
            }))}
            value={filters.rating}
            onChange={handleFilterChange}
          />
          {/* language dropdown */}
          <Dropdown
            label="Language"
            name="language"
            options={languages.map((language) => ({
              label: language.english_name,
              value: language.iso_639_1,
            }))}
            value={filters.language}
            onChange={handleFilterChange}
          />
          {/* sort by dropdown */}
          <Dropdown
            label="Sort By"
            name="sortBy"
            options={filterOptions.sortBy}
            value={filters.sortBy}
            onChange={handleFilterChange}
          />
          {/* search button */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className=" cursor-pointer bg-yellow-400 text-black font-semibold w-full hover:bg-yellow-500 transition  rounded-md px-5 py-2"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="cursor-pointer bg-yellow-400 text-black font-semibold w-full hover:bg-yellow-500 transition rounded-md px-5 py-2"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
