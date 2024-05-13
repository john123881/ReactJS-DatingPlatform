import { useState, useEffect } from 'react';
import { IoMdStar } from 'react-icons/io';
import Sidebar from '@/components/account-center/sidebar/sidebar';
import PageTitle from '@/components/page-title';
import Breadcrumbs from '@/components/account-center/breadcrumbs/breadcrumbs';
import BurgerMenu from '@/components/account-center/burgermenu/burger-menu';
import { RxCrossCircled, RxDoubleArrowRight } from 'react-icons/rx';
import { usePostContext } from '@/context/post-context';
import { useLoader } from '@/context/use-loader';
import MovieModal from '@/components/account-center/modal/movieModal';
import CollectLoader from '@/components/account-center/loader/collect-loader';
import Link from 'next/link';

import {
  ACCOUNT_COLLECT_MOVIE,
  ACCOUNT_COLLECT_MOVIE_DELETE,
} from '@/components/config/api-path';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { useCollect } from '@/context/use-collect';
import toast from 'react-hot-toast';

export default function AccountCollect({ onPageChange }) {
  const pageTitle = '會員中心';
  const currentPage = '個人收藏';
  const router = useRouter();
  const { close, isLoading, open } = useLoader();
  const { auth, getAuthHeader, checkAuth } = useAuth();

  const [pages, setPages] = useState({
    rows: [],
    page: 0,
    totalPages: 0,
  });
  const {
    movies,
    setMovies,
    movieV,
    setMovieV,
    modalId,
    setModalId,
    movieModalToggle,
    setMovieModalToggle,
  } = useCollect();
  // const { postModalToggle, setPostModalToggle } = usePostContext();
  // const [movies, setMovies] = useState([]);
  const [radio, setRadio] = useState('電影');
  const [arrowHovered, setArrowHovered] = useState(
    Array(movies.length).fill(false)
  );

  //詳細箭頭動畫
  const handleArrowHover = (index, isHovered) => {
    const newArrowHovered = [...arrowHovered];
    newArrowHovered[index] = isHovered;
    setArrowHovered(newArrowHovered);
  };

  //處理上一頁按鈕
  const handlePrevPage = (e) => {
    e.preventDefault();
    const prevPage = pages.page - 1;
    if (prevPage >= 1) {
      setPages({ ...pages, page: prevPage });

      const nweQuery = { ...router.query, page: prevPage };

      // 構建新的 URL
      // const queryString = new URLSearchParams(query).toString();
      // console.log('prevPageQS:', queryString);

      // 更新路由的 query string
      router.push(
        {
          pathname: router.pathname, // 將 pathname 設置到 url 中
          query: nweQuery, // 將 query 設置到 url 中
        }
        // undefined,
        // { scroll: false }
      ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    }
  };
  //處理下一頁按鈕
  const handleNextPage = (e) => {
    e.preventDefault();
    const nextPage = pages.page + 1;
    if (nextPage <= pages.totalPages) {
      setPages({ ...pages, page: nextPage });
      // 獲取當前路由的 query string
      const nweQuery = { ...router.query, page: nextPage };

      // 構建新的 URL
      // const queryString = new URLSearchParams(query).toString();

      // 更新路由的 query string
      router.push(
        {
          pathname: router.pathname, // 將 pathname 設置到 url 中
          query: nweQuery, // 將 query 設置到 url 中
        }
        // undefined,
        // { scroll: false }
      ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    }
  };

  //處理 movie.map
  const handleMovieClick = (movie, movieId) => {
    console.log('handleMovieClick 裡面的 movie', movie);
    console.log('handleMovieClick 裡面的 movieId', movieId);
    setMovieModalToggle(movieId);
    setMovieV(movie);
    setModalId(movieId);
  };

  //渲染-電影收藏
  useEffect(() => {
    const getSaveMovieData = async () => {
      if (auth.id === 0 || !router.isReady) return;
      // setIsLoading(true); // 開始加載

      try {
        const res = await fetch(
          `${ACCOUNT_COLLECT_MOVIE}/${router.query.sid}${location.search}`,
          {
            headers: { ...getAuthHeader() },
          }
        );
        const result = await res.json();
        // console.log('fetch MOVIE data:', result);

        if (result.output.error === '無收藏') {
          setMovies([]); //重置收藏
          toast.error('無電影收藏', { duration: 1500 });
        } else {
          setMovies(result.output.data); // 更新狀態
          setPages({ page: result.page, totalPages: result.totalPages });
          // setPage((prevPage) => prevPage + 1); // 更新頁碼
          // setIsLoading(false); // 結束加載
        }
      } catch (error) {
        console.error('Failed to fetch saved movie:', error);
        // setIsLoading(false); // 確保即使出錯也要結束加載
      }
    };

    const fetchCheck = async () => {
      if (auth.id === 0 || !router.isReady) return;
      const result = await checkAuth(router.query.sid);
      if (!result.success) {
        router.push('/');
        toast.error(result.error, { duration: 1500 });
        return;
      }
      getSaveMovieData();
    };

    open();
    fetchCheck();
    close(1);
  }, [router.query, auth.id]);

  useEffect(() => {
    onPageChange(pageTitle);
  }, []);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex min-h-screen pt-10 bg-dark ">
        <Sidebar currentPage={currentPage} />

        <div className="w-screen px-4 py-12 sm:px-6 md:px-8 lg:ps-14 lg:pe-44 xl:pe-60">
          <div className="flex flex-col w-full ">
            <BurgerMenu currentPage={currentPage} />
            <Breadcrumbs currentPage={currentPage} />

            <div>
              {/* TAB START */}
              <div className="grid-cols-4 mt-4 tabs ">
                {/* SearchBar START */}
                {/* <div className="flex justify-end item-center">
                  <label className="flex items-center max-w-[170px] border-slate-700 w-full min-w-[150px] gap-1 ms-2 input input-bordered input-sm">
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
                    <input
                      type="date"
                      className="grow input-sm p-s0"
                      placeholder="Search"
                    />
                  </label>
                </div> */}
                {/* SearchBar END */}

                <Link
                  href={`/account/collect/post/${auth.id}`}
                  className={`tab ${
                    radio === '貼文'
                      ? 'text-white border-b-2 border-b-white duration-500 ease-in-out'
                      : 'duration-500 ease-in-out'
                  }`}
                  aria-label="貼文"
                >
                  貼文
                </Link>
                <Link
                  href={`/account/collect/bar/${auth.id}`}
                  className={`tab ${
                    radio === '酒吧'
                      ? 'text-white border-b-2 border-b-white '
                      : ''
                  }`}
                  aria-label="酒吧"
                >
                  酒吧
                </Link>
                <Link
                  href={`/account/collect/movie/${auth.id}`}
                  className={`tab ${
                    radio === '電影'
                      ? 'text-white border-b-2 border-b-white duration-500 ease-in-out'
                      : 'duration-500 ease-in-out'
                  }`}
                  aria-label="電影"
                >
                  電影
                </Link>
                {/* <Link
                  href={`/account/collect/movie/${auth.id}`}
                  className={`tab ${
                    radio === '行程'
                      ? 'text-white border-b-2 border-b-white duration-500 ease-in-out'
                      : 'duration-500 ease-in-out'
                  }`}
                  aria-label="行程"
                >
                  行程
                </Link> */}
              </div>
              {/* TAB END */}
              {isLoading ? (
                <CollectLoader />
              ) : (
                <>
                  <div
                    className={`mt-4 pb-3 flex flex-col justify-between w-full lg:mx-1 xl:mx-1 rounded-box  place-items-center `}
                  >
                    {/* CONTENT START */}
                    {/* Card START */}
                    {movies.map((movie, i) => {
                      return (
                        <div
                          key={i}
                          className="grid outline outline-1 outline-grayBorder z-10 rounded-xl my-2 w-[360px] sm:w-full grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px]"
                        >
                          <div className="shadow-xl card sm:card-side ">
                            <figure className=" sm:w-[300px] h-[200px]  sm:basis-1/3">
                              <img
                                src={movie.img || '/unavailable-image.jpg'}
                                className="object-cover w-[360px] sm:min-w-[300px] sm:min-h-full z-0 2xl:w-full 2xl:h-fit"
                                alt={movie.img_name || 'No Image Available'}
                              />
                            </figure>
                            <div className="card-body h-[200px] relative pe-[48px] sm:basis-2/3">
                              <div className="font-bold text-white text-h5">
                                {movie.title
                                  ? movie.title.match(/[\u4e00-\u9fa5]+/g)
                                  : 'unknownMovie'}
                              </div>
                              <div
                                className={`absolute bottom-[16px] left-[32px] 
                             `}
                              >
                                <div
                                  className={`badge
                            ${movie.type === '愛情' ? 'badge-error' : ''}
                            ${movie.type === '劇情' ? 'badge-info' : ''}
                            ${movie.type === '懸疑' ? 'badge-success' : ''}
                            ${movie.type === '喜劇' ? 'badge-secondary' : ''}
                            ${movie.type === '動作' ? 'badge-primary' : ''}`}
                                >
                                  {movie.type}
                                </div>
                                <div className="ms-2 ps-2 pe-1 badge badge-warning badge-outline">
                                  {movie.rating}{' '}
                                  <div className="m-0.5">
                                    <IoMdStar className="text-[14px] lg:text-[16px] text-warning" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                {movie.description.length > 35
                                  ? movie.description.substring(0, 35) + '...'
                                  : movie.description}
                              </div>
                              <RxCrossCircled
                                onClick={async () => {
                                  console.log('bar.save_id:', movie.save_id);
                                  const r = await fetch(
                                    `${ACCOUNT_COLLECT_MOVIE_DELETE}/${movie.save_id}`,
                                    {
                                      method: 'DELETE',
                                      headers: { ...getAuthHeader() },
                                    }
                                  );
                                  const result = await r.json();
                                  if (
                                    result.output.success &&
                                    result.output.action === 'remove'
                                  ) {
                                    toast.success('刪除收藏成功', {
                                      duration: 1500,
                                    });
                                  }
                                  router.push({
                                    pathname: router.pathname, // 將 pathname 設置到 url 中
                                    query: router.query, // 將 query 設置到 url 中
                                  });
                                }}
                                className="text-white absolute right-[8px] top-[-192px] sm:top-[8px] cursor-pointer hover:text-neongreen text-4xl"
                              />
                              <div className="absolute bottom-[16px] right-[16px] justify-end card-actions">
                                <span
                                  onClick={() => {
                                    handleMovieClick(movie, movie.movie_id);
                                    // console.log('點下詳細的postID', post.post_id);
                                    // setPostModalToggle(post.post_id);
                                    // setP({ post });
                                    // setModalId(post.post_id);
                                    // handleShowModal(post.post_id);
                                  }}
                                  // href={`/movie/movie-detail/${movie.bar_id}`}
                                  onMouseEnter={() => handleArrowHover(i, true)}
                                  onMouseLeave={() =>
                                    handleArrowHover(i, false)
                                  }
                                  className={`flex items-center cursor-pointer hover:text-neongreen`}
                                >
                                  <RxDoubleArrowRight
                                    className={`me-4 ${
                                      arrowHovered[i]
                                        ? 'translate-x-[10px] duration-500 ease-in-out '
                                        : 'text-dark duration-500 ease-in-out'
                                    }`}
                                  />
                                  詳細...
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card END */}
                        </div>
                      );
                    })}

                    <MovieModal
                      className={`z-[100]`}
                      movie={movieV}
                      modalId={modalId}
                      isOpen={movieModalToggle === modalId}
                    />
                    {/* Card END */}
                    <div className="mb-3 join bg-base-100">
                      {/* Pagination START */}
                      {/* 上一頁按紐 */}
                      <button
                        className={`
                      ${Number(router.query.page) > 1 ? ' ' : 'btn-disabled'}
                      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                        onClick={handlePrevPage}
                      >
                        «
                      </button>
                      {/* 分頁按紐 */}
                      {[...Array(5)].map((v, i) => {
                        let p = pages.page <= 5 ? 1 + i : pages.page + i;

                        if (p < 1) return null;

                        if (p > pages.totalPages)
                          return (
                            <button
                              key={p}
                              className={`${
                                p === pages.page ? 'text-neongreen ' : ''
                              } btn-disabled max-w-[25px] join-item btn border-slate-700 hover:bg-primary hover:text-dark btn-xs `}
                            >
                              {p}
                            </button>
                          );

                        return (
                          <button
                            key={p}
                            style={{
                              transition: 'transform 0.2s ease-in-out',
                            }}
                            className={`${
                              p === pages.page ? 'text-neongreen ' : ''
                            } join-item btn max-w-[25px] border-slate-700 hover:bg-primary hover:text-dark btn-xs hover:sm:scale-[1.1]  hover:sm:translate-y-[-5px]`}
                            onClick={(e) => {
                              e.preventDefault();
                              const nweQuery = { ...router.query, page: p };
                              router.push(
                                {
                                  pathname: router.pathname,
                                  query: nweQuery,
                                }
                                // undefined,
                                // { scroll: false }
                              );
                            }}
                          >
                            {p}
                          </button>
                        );
                      })}
                      {/* 下一頁按紐 */}
                      <button
                        className={`
                      ${
                        parseInt(router.query.page) === pages.totalPages ||
                        pages.totalPages === 0
                          ? ' btn-disabled'
                          : ''
                      }
                      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                        onClick={handleNextPage}
                      >
                        »
                      </button>
                      {/* Pagination START */}
                    </div>
                    {/* CONTENT END */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
