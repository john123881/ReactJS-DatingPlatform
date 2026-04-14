import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { BookingService } from '@/services/booking-service';
import MovieCard from '@/components/booking/card/movieCard';
import PageTitle from '@/components/page-title';
import MovieCardSkeleton from '@/components/booking/card/movieCardSkeleton';
import Loader from '@/components/ui/loader/loader';
import MovieSidebar from '@/components/booking/movie-sidebar';
import MovieBreadcrumbs from '@/components/booking/movie-breadcrumbs';
import Link from 'next/link';

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth } = useAuth();
  const genres = [
    { id: 0, name: '全部' },
    { id: 1, name: '劇情' },
    { id: 2, name: '愛情' },
    { id: 3, name: '喜劇' },
    { id: 4, name: '動作' },
    { id: 5, name: '動畫' },
    { id: 6, name: '驚悚' },
    { id: 7, name: '懸疑' },
  ];

  const [movieCards, setMovieCards] = useState([]);
  const [savedMovies, setSavedMovies] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  //movie type下拉式選單
  const handleTypeChange = (event) => {
    const typeId = event.target.value;
    if (typeId) {
      router.push(`/booking/movie-list/${typeId}`);
    }
  };

  const checkMoviesStatus = useCallback(async (movieIds) => {
    const userId = auth.id;
    if (userId === 0 || !movieIds) return;

    try {
      const data = await BookingService.checkMovieStatus(userId, movieIds);

      if (data && Array.isArray(data)) {
        setSavedMovies((prevSavedMovies) => {
          const newSavedMovies = { ...prevSavedMovies };
          data.forEach((status) => {
            newSavedMovies[status.movieId] = status.isSaved;
          });
          return newSavedMovies;
        });
      }
    } catch (error) {
      console.error('無法獲取電影狀態:', error);
    }
  }, [auth.id]);

  const getBookingMovieCard = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await BookingService.getMovieList();
      
      if (data && Array.isArray(data) && data.length > 0) {
        const movieIds = data.map((movie) => movie.movie_id).join(',');
        await checkMoviesStatus(movieIds);
      }
      setMovieCards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch movie card', error);
    } finally {
      setIsLoading(false);
    }
  }, [auth.id, checkMoviesStatus]);

  const handleSearchChange = async (e) => {
    getSearchMovies(e.target.value);
  };

  const getSearchMovies = async (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    if (value.trim()) {
      setIsLoading(true);
      try {
        const data = await BookingService.searchMovies(value);
        setSearchResults(data);
        setHasSearched(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      if (currentScrollY > lastScrollY && currentScrollY > 64) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null) {
      getBookingMovieCard();
    }
  }, [auth.id, getBookingMovieCard]);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      
      <div className="flex flex-col lg:flex-row justify-center pt-28 px-4 lg:px-12 gap-10 max-w-[1700px] mx-auto min-h-screen">
        {/* 1. 側邊導航 (Desktop) */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-28 glass-card-neon p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <MovieSidebar />
          </div>
        </aside>

        {/* 2. 主要內容區 */}
        <main className="flex-1 flex flex-col gap-6 w-full">
          {/* Breadcrumbs */}
          <MovieBreadcrumbs />

          {/* 標頭與搜尋行 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
            <div className="order-2 md:order-1">
              <h1 className="text-3xl lg:text-5xl font-bold text-white neon-text-green tracking-tight mb-2">
                探索精彩電影
              </h1>
              <p className="text-white/40 text-sm tracking-widest uppercase">Discovery & Exploration</p>
            </div>

            {/* 搜尋框 (Bar Style) */}
            <div className="w-full md:w-auto order-1 md:order-2">
              <label className="flex items-center gap-3 h-[50px] px-6 rounded-full border border-white/10 bg-white/5 hover:border-neongreen/50 text-white transition-all duration-300 w-full md:w-[400px] focus-within:border-neongreen focus-within:bg-white/10 shadow-inner group">
                <input
                  type="text"
                  className="grow bg-transparent focus:outline-none placeholder:text-white/20 text-sm sm:text-base"
                  placeholder="搜尋電影名稱、導演或類型..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 opacity-40 text-neongreen group-hover:scale-110 transition-transform">
                  <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
          </div>

          {/* 全域高級導航控制區 (Mobile Only Chips) */}
          <div className={`lg:hidden sticky top-[64px] z-30 flex flex-col items-center w-full bg-black/40 backdrop-blur-xl border-b border-white/5 pb-2 transition-all duration-300 ${
            showNav ? 'translate-y-0 opacity-100' : 'translate-y-[-100px] opacity-0 pointer-events-none'
          }`}>
            <div className="w-full px-2">
              <div className="flex overflow-x-auto no-scrollbar gap-3 py-4 justify-start mask-fade-right px-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => {
                      if (genre.id === 0) {
                        router.push('/booking/movie-list');
                      } else {
                        router.push(`/booking/movie-list/${genre.id}`);
                      }
                    }}
                    className={`flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 border ${
                      (genre.id === 0 && !router.query.movie_type_id) || (router.query.movie_type_id == genre.id)
                        ? 'bg-neongreen text-black border-neongreen shadow-neon-sm scale-105'
                        : 'bg-white/5 text-white/50 border-white/10'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 電影列表網格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 py-6 min-h-[600px] mb-20">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex justify-center animate-pulse">
                   <MovieCardSkeleton />
                </div>
              ))
            ) : hasSearched && searchResults.length === 0 ? (
              <div className="col-span-full py-40 text-center glass-card-neon rounded-3xl border border-white/5 bg-white/2">
                <p className="text-white/40 text-lg">哎呀！找不到相關電影，換個關鍵字試試？</p>
              </div>
            ) : (
              (hasSearched ? searchResults : movieCards).map((movie, index) => (
                <div key={movie.movie_id || index} className="flex justify-center animate-fadeInUp">
                  <MovieCard movie={movie} isSaved={!!savedMovies[movie.movie_id]} />
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}
