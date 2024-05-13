import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';
import { useRouter } from 'next/router';

export default function MovieCard({ movie, index, isSaved: initialSaved }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // const [savedMovies, setSavedMovies] = useState({});
  const [isSaved, setIsSaved] = useState(initialSaved);
  const router = useRouter();

  const { auth, rerender, setRerender } = useAuth();

  // const handleHeartClick = () => {
  //   setIsClicked(!isClicked);
  // };

  const handleSavedClick = async () => {
    const movieId = movie.movie_id;
    const userId = auth.id;

    if (userId === 0) {
      return;
    }

    const wasSaved = isSaved || false;
    const newSavedState = !wasSaved;

    try {
      const url = wasSaved ? 'unsave-movie' : 'save-movie';
      const res = await fetch(`http://localhost:3001/booking/${url}`, {
        method: wasSaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId, userId }),
      });
      if (res.ok) {
        // setRerender(!rerender);
        // setSavedMovies((prev) => ({ ...prev, [movieId]: newSavedState }));
        setIsSaved(newSavedState); // 更新本地狀態
        setRerender(!rerender);
      } else {
        throw new Error('Failed to update save status');
      }
    } catch (error) {
      console.error('Error updating save status:', error);
    }
  };

  function getMovieTypeName(movieTypeId) {
    switch (movieTypeId) {
      case 1:
        return '劇情';
      case 2:
        return '愛情';
      case 3:
        return '喜劇';
      case 4:
        return '動作';
      case 5:
        return '動畫';
      case 6:
        return '驚悚';
      case 7:
        return '懸疑';
      default:
        return '其他';
    }
  }

  // 當來自父組件的 isSavedProp 改變時，更新本地 isSaved 狀態
  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  return (
    <>
      <div
        key={index}
        className={`card bg-base-100 shadow-xl relative ${
          isHovered || isClicked ? ' bg-white' : ''
        }`}
        style={{
        width: '280px',
        height: '500px',
        '@media (min-width: 768px)': {  // 响应式媒体查询
          width: '50%',
          height: '20px',
          backgroundColor: 'red',
        },
      }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <figure>
          <div className="shadow-xl card bg-base-100 w-72">
            <figure>
              <img
                // src={movie.movie_img}
                src={
                  `/movie_img/${movie.poster_img}` || '/unavailable-image.jpg'
                }
                // src="https://upload.wikimedia.org/wikipedia/zh/7/7a/Oppenheimer_%28film%29_poster.jpg"
                alt={movie.title} // 使用動態的 movieName
                style={{
                  height: ' 400px ',
                  objectFit: 'cover',
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
                    <Link
                      className="btn btn-outline"
                      style={{
                        width: '130px',
                        height: '40px',
                        marginBottom: '10px',
                        borderRadius: '30px',
                      }}
                      // onClick={() =>
                      //   (window.location.href = `../../../booking/movie-booking-detail/${movie.movie_id}`)
                      // }
                      href={`movie-booking-detail/${movie.movie_id}`}
                    >
                      立即訂票
                    </Link>
                    <button
                      className="btn btn-outline"
                      style={{
                        width: '130px',
                        height: '40px',
                        borderRadius: '30px',
                      }}
                      // onClick={() =>
                      //   (window.location.href = `../../../booking/movie-booking-detail/${movie.movie_id}`)
                      // }

                      onClick={() =>
                        router.push(
                          `../../../booking/movie-booking-detail/${movie.movie_id}`
                        )
                      }
                    >
                      電影資訊
                    </button>
                  </div>
                </div>
              )}
            </figure>
          </div>
        </figure>

        {/* 爱心图标 */}
        <div
          className="absolute cursor-pointer top-2 right-2"
          onClick={handleSavedClick}
          style={{
            backgroundColor: 'white', // 根据点击状态改变背景色
            borderRadius: '50%', // 圆形背景
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSaved ? (
            <FaHeart
              size={24}
              color="#ff6b6b" // 填充颜色
              // onClick={() => {
              //   handleSavedClick(movie);
              // }}
            />
          ) : (
            <FaRegHeart
              size={24}
              color="#000" // 默认颜色
              // onClick={() => handleSavedClick(movie)}
            />
          )}
        </div>

        <div className="card-body">
          <h2 className="card-title flex flex-wrap items-center">
            <span style={{ fontSize: '1rem' }}>{movie.title}</span>{' '}
            {/* 使用動態的 movieName */}
            <div
              className="badge badge-secondary w-20 mr-2 mt-2"
              style={{
                backgroundColor: 'grey',
                color: 'white',
              }}
            >
              數位
            </div>
            <div
              className="badge badge-secondary w-20 mt-2"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #A0FF1F',
                color: '#A0FF1F',
              }}
            >
              {getMovieTypeName(movie.movie_type_id)}
            </div>
          </h2>
        </div>
      </div>
    </>
  );
}
