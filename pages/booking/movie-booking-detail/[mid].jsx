import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/auth-context';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

import YouTube from 'react-youtube';
import dynamic from 'next/dynamic';

export default function MovieDetail({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const { auth } = useAuth();

  const { mid } = router.query;

  const [clickedButton, setClickedButton] = useState(null);
  const descriptionRef = useRef(null); // 创建对电影描述元素的引用

  const [showFullDescription, setShowFullDescription] = useState(false); // 初始化电影描述显示状态为false

  const [movie, setMovie] = useState([]);
  const [savedMovies, setSavedMovies] = useState({});

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription); // 切换电影描述显示状态
  };

  const scrollToDescription = () => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [hovered, setHovered] = useState(false);

  const [clickedButtonIndex, setClickedButtonIndex] = useState(null);

  const handleButtonClick = () => {
    setClickedButtonIndex((prevIndex) => (prevIndex === null ? 0 : null)); // 切换样式
  };

  const getMovieDetail = async (mid) => {
    try {
      const res = await fetch(
        `http://localhost:3001/booking/get-movie-detail/${mid}`
      );
      const data = await res.json();
      setMovie(data);
    } catch (error) {
      console.log('Failed to fetch movie card', error);
    }
  };

  useEffect(() => {
    const { mid } = router.query;

    if (auth.id !== undefined && auth.id !== null && mid) {
      getMovieDetail(mid);
      // console.log('movie', movie);
    }
  }, [auth.id, mid]);

  // const BookingConfirmModal = dynamic(
  //   () => import('@/components/bar/modal/booking-confirm-modal'),
  //   { ssr: false }
  // );
  // const [selectedTime, setSelectedTime] = useState('');

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
              <figure>
                <img
                  className="lg:w-[300px] lg:h-[480px]"
                  src={movie[0]?.movie_img || '/unavailable-image.jpg'}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title pt-2 pb-2 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:pb-0" style={{ fontSize: '2rem' }}>
                  {movie[0]?.title}
                  <button
                    className={`btn btn-outline btn-accent w-[130px] mx-24 mt-2`}
                    style={{
                      height: '0.5rem',
                      borderColor: '#A0FF1F',
                      color: 'black',
                      backgroundColor:'#A0FF1F'
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => setClickedButton(!clickedButton)}
                  >
                    {/* 愛心圖標 */}
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="heart-icon  lg:w-[16px] h-[16px]"
                      style={{
                        color: 'red',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        // 切換按鈕點擊狀態
                        setClickedButton(
                          clickedButton === 'heart' ? null : 'heart'
                        );
                      }}
                    />
                    加入收藏
                  </button>
                </h2>
                <div className="review flex ">
                  <span>5.0</span>
                  <div className="bar-detail-stars flex gap-1.5 rating rating-sm mx-2 mt-1">
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                      checked
                    />
                  </div>
                </div>
                <p
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
                        <select className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2">
                          <option disabled selected>
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
                        <select className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2">
                          <option disabled selected>
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
                        onClick={() =>
                          // document
                          //   .getElementById('movie-confirm-modal')
                          //   .showModal()
                          Swal.fire({
                            title: '訂位成功!',
                            icon: 'success',
                            confirmButtonText: '關閉',
                            confirmButtonColor: '#A0FF1F',
                            background: 'rgba(0, 0, 0, 0.85)',
                          })
                        }
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
                    style={{ width: '130px' }}
                  />
                  <div role="tabpanel" className="tab-content p-10 mt-4 mx-2">
                    <div className="card bg-transparent shadow-xl">
                      <YouTube
                        videoId={movie[0]?.youtube_id}
                        className="w-full"
                      />
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
