import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';
import { useAuth } from '@/context/auth-context';
import { useCollect } from '@/context/use-collect';
import { BookingService } from '@/services/booking-service';
import { toast } from '@/lib/toast';

export default function MovieCard({ movie, index, isSaved: initialSaved }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const router = useRouter();

  const { auth, rerender, setRerender } = useAuth();
  const { refreshCollectList } = useCollect();

  // const handleHeartClick = () => {
  //   setIsClicked(!isClicked);
  // };

  const handleSavedClick = async () => {
    const movieId = movie.movie_id;
    const userId = auth.id;

    if (userId === 0) {
      toast.warning('請先登入!');
      return;
    }

    const wasSaved = isSaved || false;
    const newSavedState = !wasSaved;

    // 樂觀更新
    setIsSaved(newSavedState);
    toast.success(newSavedState ? '收藏成功!' : '已取消收藏!');

    try {
      const res = wasSaved
        ? await BookingService.unsaveMovie(userId, movieId)
        : await BookingService.saveMovie(userId, movieId);

      if (res.success || res.status) {
        setRerender(!rerender);
        refreshCollectList();
      } else {
        throw new Error('Failed to update save status');
      }
    } catch (error) {
      console.error('Error updating save status:', error);
      setIsSaved(wasSaved); // 發生錯誤時還原
      toast.error('操作失敗!', error.message);
    }
  };

  function getMovieTypeName(movieTypeId) {
    switch (movieTypeId) {
      case 1: return '劇情';
      case 2: return '愛情';
      case 3: return '喜劇';
      case 4: return '動作';
      case 5: return '動畫';
      case 6: return '驚悚';
      case 7: return '懸疑';
      default: return '其他';
    }
  }

  function getBadgeStyle(typeName) {
    switch (typeName) {
      case '愛情':
        return { border: '1px solid #FF69B4', color: '#FF69B4' };
      case '喜劇':
        return { border: '1px solid #A0FF1F', color: '#A0FF1F' };
      case '劇情':
        return { border: '1px solid #00BFFF', color: '#00BFFF' };
      case '動作':
        return { border: '1px solid #FF4500', color: '#FF4500' };
      case '懸疑':
      case '驚悚':
        return { border: '1px solid #9400D3', color: '#9400D3' };
      default:
        return { border: '1px solid #A0FF1F', color: '#A0FF1F' };
    }
  }

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
      <div
        key={index}
        className={`card bg-base-100 shadow-xl relative overflow-hidden ${
          isSaved ? ' ring-1 ring-neongreen/30' : ''
        }`}
        style={{
          width: '280px',
          height: '520px', // 稍微增加一點高度以容納標題
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <figure className="flex-shrink-0" style={{ height: '380px', overflow: 'hidden', margin: 0 }}>
          <img
            src={getMovieImgSrc(movie.poster_img)}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src = '/unavailable-image.jpg';
            }}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: hoveredIndex === index ? 'brightness(70%)' : 'none',
              transition: 'filter 0.3s',
              opacity: hoveredIndex === index ? '0.7' : '1',
            }}
          />
          {hoveredIndex === index && (
            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-300"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', height: '380px' }}
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
                  className="btn btn-outline border-neongreen text-white hover:bg-neongreen hover:text-black hover:border-neongreen transition-all duration-300"
                  style={{
                    width: '130px',
                    height: '40px',
                    marginBottom: '10px',
                    borderRadius: '30px',
                  }}
                  href={`/booking/movie-booking-detail/${movie.movie_id}`}
                >
                  立即訂票
                </Link>
                <button
                  className="btn btn-outline border-neongreen text-white hover:bg-neongreen hover:text-black hover:border-neongreen transition-all duration-300"
                  style={{
                    width: '130px',
                    height: '40px',
                    borderRadius: '30px',
                  }}
                  onClick={() =>
                    router.push(
                      `/booking/movie-booking-detail/${movie.movie_id}`,
                    )
                  }
                >
                  電影資訊
                </button>
              </div>
            </div>
          )}
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

        <div className="card-body p-4 flex flex-col justify-between" style={{ height: '140px' }}>
          {/* 標題區塊 - 固定高度處理換行 */}
          <div className="title-area" style={{ minHeight: '3rem' }}>
            <h2 className="card-title text-white line-clamp-2" style={{ fontSize: '1rem', lineHeight: '1.2' }}>
              {movie.title}
            </h2>
          </div>
          
          {/* 標籤區塊 - 確保對齊 */}
          <div className="flex flex-wrap gap-2 mt-auto">
            <div
              className="badge badge-secondary w-20"
              style={{
                backgroundColor: 'grey',
                color: 'white',
                border: 'none'
              }}
            >
              數位
            </div>
            {movie.movie_type_id && (
              <div
                className="badge badge-secondary w-20"
                style={{
                  backgroundColor: 'transparent',
                  ...getBadgeStyle(getMovieTypeName(movie.movie_type_id))
                }}
              >
                {getMovieTypeName(movie.movie_type_id)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
