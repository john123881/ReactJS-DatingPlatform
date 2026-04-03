import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import Image from 'next/image';
import { API_BASE_URL } from '@/configs/api-config';

import { BookingService } from '@/services/booking-service';
import YouTube from 'react-youtube';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

export default function MovieDetail({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth } = useAuth();

  const { mid } = router.query;

  const [clickedButton, setClickedButton] = useState(null);

  const [showFullDescription, setShowFullDescription] = useState(false); // 初始化电影描述显示状态為false

  const [movie, setMovie] = useState([]);

  const [hovered, setHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const descriptionRef = useRef(null);

  const scrollToDescription = () => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkMoviesStatus = useCallback(async (movieId) => {
    const userId = auth.id;
    if (userId === 0 || !movieId) return;

    try {
      const data = await BookingService.checkMovieStatus(userId, movieId);
      if (data && data.length > 0) {
        setIsSaved(data[0].isSaved);
      }
    } catch (error) {
      console.error('無法獲取電影狀態:', error);
    }
  }, [auth.id]);

  const getMovieDetail = useCallback(async (mid) => {
    try {
      // 使用 BookingService
      const data = await BookingService.getMovieDetail(mid);
      setMovie(data);
      if (auth.id !== 0) {
        checkMoviesStatus(mid);
      }
    } catch (error) {
      console.error('Failed to fetch movie detail', error);
    }
  }, [auth.id, checkMoviesStatus]);

  useEffect(() => {
    const { mid } = router.query;
    if (mid) {
      getMovieDetail(mid);
    }
  }, [router.query?.mid, getMovieDetail]);

  const handleSavedClick = async () => {
    if (auth.id === 0) {
      toast.warning('請先登入!');
      return;
    }
    const movieId = mid;
    const userId = auth.id;

    // 樂觀更新 (Optimistic Update)
    const wasSaved = isSaved;
    const newSavedState = !wasSaved;
    setIsSaved(newSavedState);
    toast.success(newSavedState ? '收藏成功!' : '已取消收藏!');
    try {
      const result = wasSaved
        ? await BookingService.unsaveMovie(userId, movieId)
        : await BookingService.saveMovie(userId, movieId);

      if (
        !result.success &&
        !result.output?.success &&
        !result.msg?.includes('成功') &&
        !result.message?.includes('成功')
      ) {
        throw new Error(result.message || result.msg || '操作失敗');
      }
    } catch (error) {
      // 發生錯誤時還原狀態
      setIsSaved(wasSaved);
      console.error('Error updating save status:', error);
      toast.error('操作失敗!', error.message);
    }
  };

  // const BookingConfirmModal = dynamic(
  //   () => import('@/components/bar/modal/booking-confirm-modal'),
  //   { ssr: false }
  // );
  // 取得電影圖片路徑的輔助函式
  const getMovieImgSrc = (src) => {
    if (!src || src === '/unavailable-image.jpg') return '/unavailable-image.jpg';
    if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) {
      return src;
    }
    return `/movie_img/${src}`;
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex justify-center">
        <div style={{ width: '100%' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            {/* 電影影片播放 */}
            <div className="card bg-transparent shadow-xl">
              {/* <video controls className="w-full" style={{ maxHeight: '493px' }}>
                <source
                  src="https://www.example.com/video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video> */}
            </div>

            {/* 電影資訊 */}
            <div className="card lg:card-side bg-transparent shadow-xl p-20 mx-4 mt-11">
              <figure className="lg:flex-shrink-0">
                <Image
                  className="lg:w-[300px] lg:h-[480px] object-cover rounded-xl"
                  src={getMovieImgSrc(movie[0]?.poster_img)}
                  onError={(e) => {
                    e.target.src = '/unavailable-image.jpg';
                  }}
                  alt="電影海報"
                  width={300}
                  height={480}
                  priority
                />
              </figure>
              <div className="card-body">
                <h2
                  className="card-title pt-2 pb-2 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:pb-0"
                  style={{ fontSize: '2rem' }}
                >
                  {movie[0]?.title}
                  <button
                    className={`btn btn-outline btn-accent w-[130px] mx-24 mt-2`}
                    style={{
                      height: '0.5rem',
                      borderColor: '#A0FF1F',
                      color: isSaved ? 'white' : 'black',
                      backgroundColor: isSaved ? 'transparent' : '#A0FF1F',
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleSavedClick}
                  >
                    {/* 愛心圖標 */}
                    <FontAwesomeIcon
                      icon={isSaved ? faHeart : farHeart}
                      className="heart-icon  lg:w-[16px] h-[16px]"
                      style={{
                        color: isSaved ? 'red' : 'gray',
                        cursor: 'pointer',
                      }}
                    />
                    {isSaved ? '已收藏' : '加入收藏'}
                  </button>
                </h2>
                <div className="review flex ">
                  <span>5.0</span>
                  <div className="bar-detail-stars flex gap-1.5 rating rating-sm mx-2 mt-1">
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                      readOnly
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                      readOnly
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                      readOnly
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                      readOnly
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                      checked
                      readOnly
                    />
                  </div>
                </div>
                <p
                  ref={descriptionRef}
                  style={{
                    maxHeight: showFullDescription ? 'none' : '3em',
                    overflow: 'hidden',
                  }}
                >
                  {movie[0]?.movie_description}
                </p>
                {!showFullDescription && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setShowFullDescription(true);
                        scrollToDescription();
                      }}
                    >
                      More
                    </button>{' '}
                    {/* 点击按钮显示更多描述并滚动到描述位置 */}
                  </div>
                )}
              </div>
            </div>

            {/* 電影時刻/電影介紹 */}
            <div className="flex justify-center  mx-12 w-[100px] lg:w-[100%]">
              {/* 在这里添加 mb-8 来增加上下间距 */}
              <div className="w-[85%] lg:w-[100%]">
                <div role="tablist" className="tabs tabs-bordered pt-8 pb-8">
                  <input
                    type="radio"
                    name="my_tabs_1"
                    role="tab"
                    className="tab"
                    aria-label="電影時刻"
                    style={{ width: '130px' }}
                    readOnly
                  />
                  <div role="tabpanel" className="tab-content p-10">
                    <form className="space-y-4">
                      <div className="text-[15px] lg:text-[20px] text-white">
                        選擇電影時段
                      </div>
                      <div>
                        <label className="text-[15px] lg:text-[18px] text-white">
                          全票
                        </label>
                        <br />
                        <select 
                          className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            選擇張數
                          </option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[15px] lg:text-[18px] text-white">
                          電影日期
                        </label>
                        <br />
                        <input
                          type="date"
                          className="input input-bordered input-sm w-full max-w-xs mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-[15px] lg:text-[18px] text-white">
                          電影時刻
                        </label>
                        <br />
                        <select 
                          className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            選擇時刻
                          </option>
                          <option>14:30 </option>
                          <option>16:50</option>
                          <option>17:30</option>
                          <option>18:30</option>
                          <option>23:10</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white">其他備註</label>
                        <br />
                        <textarea
                          className="textarea textarea-bordered h-24 textarea-sm w-full max-w-xs"
                          placeholder=""
                        ></textarea>
                      </div>
                      <div
                        type="submit"
                        className="btn w-[320px] bg-[#A0FF1F] text-black border-none rounded-[20px] hover:bg-[#A0FF1F]"
                        onClick={() => {
                          toast.success('訂位成功!');
                        }}
                      >
                        <span className="text-h6 text-black">確認訂票</span>
                      </div>
                    </form>

                    <br></br>
                    <br></br>
                    <br></br>
                  </div>

                  <input
                    type="radio"
                    name="my_tabs_1"
                    role="tab"
                    className="tab"
                    aria-label="電影介紹"
                    checked
                    readOnly
                    style={{ width: '130px' }}
                  />
                  <div role="tabpanel" className="tab-content p-10 mt-4 mx-2">
                    <div className="card bg-transparent shadow-xl">
                      {movie[0]?.youtube_id ? (
                        <YouTube
                          videoId={movie[0]?.youtube_id}
                          className="w-full h-full lg:h-[500px]"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-[300px] bg-slate-800 text-gray-400 rounded-xl">
                          暫無預告片影片
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
