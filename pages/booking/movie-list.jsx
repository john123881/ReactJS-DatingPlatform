import MovieCard from '@/components/booking/card/movieCard';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { IoTicketOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import Link from 'next/link';

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

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
    router.push(`/booking/movie-list/${typeId}`); // 使用 useRouter 來動態導航
  };

  const getBookingMovieCard = async () => {
    try {
      const res = await fetch('http://localhost:3001/booking/movie-list');
      const data = await res.json();

      const movieIds = data.map((movie) => movie.movie_id).join(',');

      await checkMoviesStatus(movieIds); // 檢查電影狀態

      setMovieCards(data);
    } catch (error) {
      console.log('Failed to fetch movie card', error);
    }
  };

  const checkMoviesStatus = async (movieIds) => {
    const userId = auth.id;

    console.log('checkMoviesStatus');

    try {
      const response = await fetch(
        `http://localhost:3001/booking/check-movie-status?userId=${userId}&movieIds=${movieIds}`
      );
      const data = await response.json();

      console.log(data);

      // 初始化兩個對象來存儲所有電影的收藏狀態
      const newSavedMoives = { ...savedMovies };

      // 遍歷從後端獲取的每個貼文的狀態數據
      data.forEach((status) => {
        // 將每個電影的收藏狀態存儲到 newSavedMoives 對象中
        newSavedMoives[status.movieId] = status.isSaved;
      });

      // 更新 React 狀態以觸發界面更新，以顯示最新的點讚和收藏狀態
      setSavedMovies(newSavedMoives);
    } catch (error) {
      console.error('無法獲取電影狀態:', error);
    }
  };

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
      try {
        const response = await fetch(
          `http://localhost:3001/booking/search-movies?searchTerm=${value}`
        );
        const data = await response.json();
        setSearchResults(data);
        setHasSearched(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false); // 結束加載
      }
    }
  };

  const [clickedButton, setClickedButton] = useState(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null) {
      getBookingMovieCard();
    }
  }, [auth.id]);

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
          <option disabled selected>
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

      <div className="flex flex-wrap justify-center sm:justify-between gap-6 mx-10">
        {isLoading ? (
          <p>Loading...</p> // 正在加載提示
        ) : hasSearched && searchResults.length === 0 ? (
          <p>未找到结果</p> // 搜索后无结果提示
        ) : (
          (hasSearched ? searchResults : movieCards).map((movie, index) => (
            <MovieCard
              movie={movie}
              key={index}
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
