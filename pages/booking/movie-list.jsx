import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { BookingService } from '@/services/booking-service';
import MovieCard from '@/components/booking/card/movieCard';
import PageTitle from '@/components/page-title';
import Loader from '@/components/ui/loader/loader';

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth } = useAuth();

  const [movieCards, setMovieCards] = useState([]);
  const [savedMovies, setSavedMovies] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //movie type下拉式選單
  const handleTypeChange = (event) => {
    const typeId = event.target.value; // 這裡獲得的將是如 "1", "2", 等的字符串
    if (typeId) {
      router.push(`/booking/movie-list/${typeId}`); // 使用 useRouter 來動態導航
    }
  };

  const checkMoviesStatus = useCallback(async (movieIds) => {
    const userId = auth.id;
    if (userId === 0 || !movieIds) return;

    try {
      console.log('Checking movie status for movies:', movieIds);
      const data = await BookingService.checkMovieStatus(userId, movieIds);
      console.log('Received movie status data:', data);

      if (data && Array.isArray(data)) {
        // 使用功能性更新，避免依賴 savedMovies 導致無限迴圈
        setSavedMovies((prevSavedMovies) => {
          const newSavedMovies = { ...prevSavedMovies };
          data.forEach((status) => {
            newSavedMovies[status.movieId] = status.isSaved;
          });
          return newSavedMovies;
        });
      } else {
        console.warn('checkMovieStatus returned invalid data format:', data);
      }
    } catch (error) {
      console.error('無法獲取電影狀態:', error);
    }
  }, [auth.id]);

  const getBookingMovieCard = useCallback(async () => {
    console.log('getBookingMovieCard started, auth.id:', auth.id);
    setIsLoading(true);
    try {
      console.log('Fetching movie list...');
      const data = await BookingService.getMovieList();
      console.log('Fetched movies:', data?.length || 0);
      
      if (data && Array.isArray(data) && data.length > 0) {
        const movieIds = data.map((movie) => movie.movie_id).join(',');
        await checkMoviesStatus(movieIds);
      }
      setMovieCards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch movie card', error);
    } finally {
      console.log('getBookingMovieCard finished, setting isLoading to false');
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

    // 確保空字串不會觸發
    if (value.trim()) {
      setIsLoading(true);
      try {
        const data = await BookingService.searchMovies(value);
        setSearchResults(data);
        setHasSearched(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false); // 結束加載
      }
    }
  };

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null) {
      getBookingMovieCard();
    }
  }, [auth.id, getBookingMovieCard]);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex gap-4 pt-20 pb-10 mx-10 mt-10 ">
        {/* 分類搜索 */}
        <select
          className="w-20 lg:w-full max-w-xs select select-bordered bg--100 border-neongreen text-neongreen focus:border-neongreen "
          onChange={handleTypeChange} // 為 select 元素添加 onChange 處理器
          defaultValue=""
        >
          <option value="" disabled>
            想找哪類的電影
          </option>
          <option value="1">劇情</option>
          <option value="2">愛情</option>
          <option value="3">喜劇</option>
          <option value="4">動作</option>
          <option value="5">動畫</option>
          <option value="6">驚悚</option>
          <option value="7">懸疑</option>
        </select>

        {/* 關鍵字搜索 */}
        <label className="flex items-center w-48 lg:w-full max-w-xs gap-2 input input-bordered border-neongreen text-neongreen focus:border-neongreen">
          <input
            type="text"
            className="grow"
            placeholder="搜索電影"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="flex flex-wrap justify-center md:justify-start gap-6 lg:gap-10 mx-4 md:mx-10">
        {isLoading ? (
          <Loader minHeight="400px" text="正在搜尋電影..." />
        ) : hasSearched && searchResults.length === 0 ? (
          <p className="text-white py-20 text-center w-full">未找到結果</p>
        ) : (
          (hasSearched ? searchResults : movieCards).map((movie, index) => (
            <MovieCard
              movie={movie}
              key={movie.movie_id || index}
              isSaved={savedMovies[movie.movie_id] || false}
            />
          ))
        )}
      </div>

      {/* 分頁 */}
      {/* <div className="flex justify-center join">
        <button className="join-item btn">1</button>
        <button className="join-item btn">2</button>
        <button className="join-item btn">3</button>
        <button className="join-item btn">4</button>
      </div> */}
    </>
  );
}
