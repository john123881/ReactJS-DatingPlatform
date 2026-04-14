import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useAuth } from '@/context/auth-context';
import { useCollect } from '@/context/use-collect';
import { BookingService } from '@/services/booking-service';
import { toast } from '@/lib/toast';

export default function MovieCard({ movie, index, isSaved: initialSaved }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const router = useRouter();

  const { auth, rerender, setRerender } = useAuth();
  const { refreshCollectList, setAllCollectList } = useCollect();

  // const handleHeartClick = () => {
  //   setIsClicked(!isClicked);
  // };

  const interactingItems = useRef(new Set());

  const handleSavedClick = async () => {
    const movieId = movie.movie_id;
    const userId = auth.id;

    if (interactingItems.current.has(`save-${movieId}`)) return;
    interactingItems.current.add(`save-${movieId}`);

    if (userId === 0) {
      interactingItems.current.delete(`save-${movieId}`);
      toast.warning('請先登入!');
      return;
    }

    const wasSavedBeforeAction = isSaved || false;
    const newSavedState = !wasSavedBeforeAction;

    // 1. 樂觀更新卡片按鈕
    setIsSaved(newSavedState);
    toast.success(newSavedState ? '收藏成功!' : '已取消收藏!');

    // 2. 樂觀更新全域收藏清單 (Sidebar)
    if (newSavedState) {
      const newItem = {
        saved_id: Date.now(),
        item_id: movieId,
        title: movie.title,
        img: movie.poster_img, // 注意欄位名稱
        item_type: 'movie',
        movie_rating: movie.movie_rating,
        content: '', // 補上 content 避免傳入 undefined
        created_at: new Date().toISOString(),
        subtitle: getMovieTypeName(movie.movie_type_id),
      };
      setAllCollectList((prev) => [newItem, ...prev]);
    } else {
      setAllCollectList((prev) =>
        prev.filter(
          (item) => !(item.item_id == movieId && item.item_type === 'movie'),
        ),
      );
    }

    try {
      const res = wasSavedBeforeAction
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
      // 失敗時還原所有狀態
      setIsSaved(wasSavedBeforeAction);
      setAllCollectList((prev) =>
        wasSavedBeforeAction
          ? [...prev]
          : prev.filter((item) => item.item_id != movieId),
      );
      toast.error('操作失敗!');
    } finally {
      interactingItems.current.delete(`save-${movieId}`);
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
        className={`glass-card-neon w-full group overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(160,255,31,0.15)] transform-gpu hover:-translate-y-1 ${
          isSaved ? ' ring-1 ring-neongreen/30' : ''
        }`}
        style={{
          width: '280px',
          height: '460px',
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <figure className="relative h-[320px] overflow-hidden">
          <Link href={`/booking/movie-booking-detail/${movie.movie_id}`}>
            <div className="relative w-full h-full cursor-pointer group-hover:scale-110 transition-transform duration-500 transform-gpu">
              <img
                src={getMovieImgSrc(movie.poster_img)}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src = '/unavailable-image.jpg';
                }}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* 收藏按鈕 - 比照酒吧風格 */}
          <div className="absolute top-3 right-3 z-10">
            <div 
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isSaved 
                  ? 'bg-[#A0FF1F]/20 border border-[#A0FF1F]/50 shadow-[0_0_15px_rgba(160,255,31,0.3)]' 
                  : 'bg-black/40 border border-white/20 hover:border-[#A0FF1F] hover:bg-[#A0FF1F]/10'
              }`}
              onClick={handleSavedClick}
            >
              {isSaved ? (
                <FaBookmark
                  className="text-[18px] transition-transform duration-300 active:scale-125 hover:scale-110"
                  color="#A0FF1F"
                />
              ) : (
                <FaRegBookmark
                  className="text-[18px] text-white transition-transform duration-300 hover:scale-110 hover:text-[#A0FF1F]"
                />
              )}
            </div>
          </div>
        </figure>

        <div className="movie-card-content p-4 flex flex-col h-[140px]">
          <div className="text-[16px] lg:text-[18px] text-white font-bold truncate mb-2 group-hover:text-[#A0FF1F] transition-colors">
            {movie.title}
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            {/* 評分標籤 - 固定一個高級感數字 */}
            <div className="flex px-2 py-0.5 rounded-full bg-[#A0FF1F]/10 justify-center items-center border border-[#A0FF1F]/30">
              <span className="text-[12px] text-[#A0FF1F] font-bold mr-1">
                {movie.movie_rating || '0.0'}
              </span>
              <svg className="w-3 h-3 text-[#A0FF1F] fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex items-center gap-1 text-white/50">
              <span className="text-[12px]">台北市</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5">
            <span className="text-[11px] text-white/60 font-medium tracking-wide uppercase">
              {getMovieTypeName(movie.movie_type_id)}
            </span>
            <Link
              className="text-[11px] bg-[#A0FF1F] text-black font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(160,255,31,0.3)] hover:shadow-[0_0_25px_rgba(160,255,31,0.5)] hover:scale-105 transition-all duration-300"
              href="/under-construction"
            >
              立即訂票
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
