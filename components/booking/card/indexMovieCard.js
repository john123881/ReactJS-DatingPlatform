import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';
import { useAuth } from '@/context/auth-context';
import { BookingService } from '@/services/booking-service';
import { useCollect } from '@/context/use-collect';
import { toast } from '@/lib/toast';

export default function MovieCard({ movie, index, isSaved: initialSaved }) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { auth, setLoginModalToggle } = useAuth();
  const { refreshCollectList } = useCollect();

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    const movieId = movie.movie_id;
    const userId = auth.id;

    if (userId === 0) {
      setLoginModalToggle(true);
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

      if (res && (res.success || res.status)) {
        // 成功後刷新全局收藏列表
        refreshCollectList();
      } else {
        throw new Error('操作失敗');
      }
    } catch (error) {
      console.error('Error updating save status:', error);
      setIsSaved(wasSaved); // 還原
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
        className={`card bg-base-100 shadow-xl relative h-[520px] sm:h-[550px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-neongreen/20 ${
          isSaved ? ' ring-1 ring-neongreen/30' : ''
        }`}
        style={{ width: '100%' }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <figure className="flex-shrink-0">
          <div className="card w-full bg-base-100 shadow-xl overflow-hidden">
            <figure className="relative">
              <Image
                src={getMovieImgSrc(movie.movie_img)}
                alt={movie.title}
                width={280}
                height={400}
                style={{
                  width: '100%',
                  aspectRatio: '28/40',
                  objectFit: 'cover',
                  filter: hoveredIndex === index ? 'brightness(70%)' : 'none',
                  transition: 'filter 0.3s',
                  opacity: hoveredIndex === index ? '0.7' : '1',
                }}
              />
              {hoveredIndex === index && (
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
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
                      className="btn btn-outline border-neongreen text-white hover:bg-neongreen hover:text-black hover:border-neongreen transition-all duration-300"
                      style={{
                        width: '130px',
                        height: '40px',
                        marginBottom: '10px',
                        borderRadius: '30px',
                      }}
                      onClick={() => {
                        router.push('/under-construction');
                      }}
                    >
                      立即訂票
                    </button>
                    <button
                      className="btn btn-outline border-neongreen text-white hover:bg-neongreen hover:text-black hover:border-neongreen transition-all duration-300"
                      style={{
                        width: '130px',
                        height: '40px',
                        borderRadius: '30px',
                      }}
                      onClick={() => {
                        if (auth.id === 0) {
                          setLoginModalToggle(true);
                        } else {
                          router.push(`/under-construction`);
                        }
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

        {/* 爱心图标 */}
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={handleHeartClick}
          style={{
            backgroundColor: 'white', // 點擊更換顏色
            borderRadius: '50%', // 圖形背景
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
            />
          ) : (
            <FaRegHeart
              size={24}
              color="#000" // 默认颜色
            />
          )}
        </div>

        <div className="card-body p-4 flex flex-col justify-between overflow-hidden">
          <div className="h-[3rem] flex items-center">
            <h2 className="text-[1rem] font-bold line-clamp-2 leading-snug w-full">
              {movie.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-auto">
            <div
              className="badge badge-secondary w-20"
              style={{
                backgroundColor: 'grey',
                color: 'white',
              }}
            >
              數位
            </div>
            <div
              className="badge badge-secondary w-20"
              style={{
                backgroundColor: 'transparent',
                ...getBadgeStyle(getMovieTypeName(movie.movie_type_id))
              }}
            >
              {getMovieTypeName(movie.movie_type_id)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
