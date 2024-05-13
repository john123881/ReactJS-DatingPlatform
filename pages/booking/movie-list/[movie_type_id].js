import MovieCard from '@/components/booking/card/movieCard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PageTitle from '@/components/page-title';

// const mockData1 = [
//   { movieName: '奧本海默' },
//   { movieName: 'Movie 2' },
//   { movieName: 'Movie 3' },
//   { movieName: 'Movie 4' },
//   { movieName: 'Movie 5' },
//   { movieName: 'Movie 6' },
//   { movieName: 'Movie 7' }, // 新增的卡片
//   { movieName: 'Movie 8' }, // 新增的卡片
//   { movieName: 'Movie 9' },
//   { movieName: 'Movie 10' },
//   { movieName: 'Movie 11' },
//   { movieName: 'Movie 12' },
// ];

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

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

  //   const getBookingMovieCard = async () => {
  //     try {
  //       const res = await fetch('http://localhost:3001/booking/movie-list');
  //       const data = await res.json();
  //       console.log('asdsadcasc===>>>', data);
  //       setMovieCards(data);
  //     } catch (error) {
  //       console.log('Failed to fetch movie card', error);
  //     }
  //   };

  //   useEffect(() => {
  //     getBookingMovieCard();
  //   }, []);

  // try動態路由
  const getMovieListType = async (movie_type_id) => {
    if (!movie_type_id) return; // 確保 bar_type_id 存在

    const url = `http://localhost:3001/booking/movie-list/${movie_type_id}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setMovieCards(data); // 確認數據是否為預期格式
    } catch (error) {
      console.error('Failed to fetch movie list:', error);
    }
  };

  // 動態路由成功
  useEffect(() => {
    if (router.isReady) {
      //確保能得到 movie_type_id
      const { movie_type_id } = router.query;
      // 有 movie_type_id 後，向伺服器要求資料
      getMovieListType(movie_type_id);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    console.log(movieCards); // 查看bars數據結構
  }, [movieCards]);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      {/* button */}
      <div className="flex justify-center">
        <div
          role="tablist"
          className="tabs tabs-boxed"
          style={{ width: '200px' }}
        >
          <a
            role="tab"
            className="tab"
            style={{
              width: '100px',
              transition: 'transform 0.3s ease-in-out', // 添加过渡效果
              transform: 'translateX(0px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-5px)'; // 鼠标移入时左移5像素
              e.target.style.backgroundColor = '#A0FF1F'; // 鼠标移入时改变颜色
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)'; // 鼠标移出时回到原始位置
              e.target.style.backgroundColor = 'transparent'; // 鼠标移出时恢复原始颜色
            }}
          >
            現正熱播
          </a>
          <a
            role="tab"
            className="tab"
            style={{
              width: '100px',
              transition: 'transform 0.3s ease-in-out', // 添加过渡效果
              transform: 'translateX(0px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(5px)'; // 鼠标移入时左移5像素
              e.target.style.backgroundColor = '#A0FF1F'; // 鼠标移入时改变颜色
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)'; // 鼠标移出时回到原始位置
              e.target.style.backgroundColor = 'transparent'; // 鼠标移出时恢复原始颜色
            }}
            // style={{
            //   width: '100px',
            //   // backgroundColor: '#A0FF1F',
            //   transition: 'transform 0.3s ease-in-out', // 添加过渡效果
            //   ':hover': { transform: 'translateX(5px)' } // 悬停时向右移动5像素
            // }}
          >
            即將上映
          </a>
        </div>
      </div>

      <div className="flex  gap-4 mx-10 pt-10 pb-10">
        {/* 分類搜索 */}
        <select
          className="select select-bordered w-full max-w-xs bg--100 border-neongreen text-neongreen focus:border-neongreen "
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
        <label className="input input-bordered flex items-center gap-2 w-full max-w-xs  border-neongreen text-neongreen focus:border-neongreen">
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

      {/* 分類搜尋
      <select className="select select-bordered w-full max-w-xs">
        <option disabled selected>
          想找哪類的電影
        </option>
        <option>劇情</option>
        <option>愛情</option>
        <option>動作</option>
        <option>懸疑</option>
        <option>動畫</option>
        <option>動畫</option>
      </select>

      關鍵字搜尋
      <label className="input input-bordered flex items-center gap-2">
        <input type="text" className="grow" placeholder="搜尋電影" />
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
      </label> */}

      {/* 電影列表 */}
      {/* <div className="flex justify-center flex-wrap space-x-20 space-y-20">
  {mockData1.map((movie, index) => (
    <div
      key={index}
      className="card w-96 bg-base-100 shadow-xl"
      style={{ width: '260px', height: '450px' }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <figure>
        <div className="card w-96 bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://upload.wikimedia.org/wikipedia/zh/7/7a/Oppenheimer_%28film%29_poster.jpg"
              alt={movie.movieName} // 使用動態的 movieName
              style={{
                filter: hoveredIndex === index ? 'brightness(70%)' : 'none',
                transition: 'filter 0.3s',
                opacity: hoveredIndex === index ? '0.7' : '1',
              }}
            />
            {hoveredIndex === index && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              >
                <div
                  className="card-body"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <button
                    className="btn btn-outline"
                    style={{
                      width: '130px',
                      height: '40px',
                      marginBottom: '10px',
                      borderRadius: '30px',
                    }}
                  >
                    立即訂票
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{
                      width: '130px',
                      height: '40px',
                      borderRadius: '30px',
                    }}
                  >
                    電影資訊
                  </button>
                </div>
              </div>
            )}
          </figure>
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title flex justify-start">
          {movie.movieName}
          <div
            className="badge badge-secondary"
            style={{
              backgroundColor: 'grey',
              // border: '1px solid #A0FF1F',
              color: 'white',
            }}
          >
            數位
          </div>
          <div
            className="badge badge-secondary"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #A0FF1F',
              color: '#A0FF1F',
            }}
          >
            劇情
          </div>
        </h2>
      </div>
    </div>
  ))}
</div> */}

      <div className="flex justify-between flex-wrap space-x-0 space-y-5 gap-3">
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
      {/* <div className="join flex justify-center">
        <button className="join-item btn">1</button>
        <button className="join-item btn">2</button>
        <button className="join-item btn">3</button>
        <button className="join-item btn">4</button>
      </div> */}
    </>
  );
}
