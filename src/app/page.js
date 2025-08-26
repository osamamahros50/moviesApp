import Herosection from "./components/Herosection";
import TopRatedMovies from "./components/TopRatedMovies";
import TrendingMovies from "./components/TrendingMovies";
import TrendingTvSeries from "./components/TrendingTvSeries ";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Herosection />
      <TrendingMovies />
      <TopRatedMovies />
      <TrendingTvSeries />
    </div>
  );
}
