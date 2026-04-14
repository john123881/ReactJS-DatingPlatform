import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import Image from 'next/image';
import { FaBookmark, FaChevronDown, FaStar, FaPlay, FaCalendar, FaClock, FaArrowLeft, FaCheck } from 'react-icons/fa6';
import { BookingService } from '@/services/booking-service';
import YouTube from 'react-youtube';
import { useCollect } from '@/context/use-collect';

export default function MovieDetail({ onPageChange }) {
  const pageTitle = '電影詳情';
  const router = useRouter();
  const { auth } = useAuth();
  const { refreshCollectList, allCollectList, setAllCollectList } = useCollect();
  const { mid } = router.query;

  const [movie, setMovie] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const descriptionRef = useRef(null);
  const interactingItems = useRef(new Set());

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

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
    setIsLoading(true);
    try {
      const data = await BookingService.getMovieDetail(mid);
      if (data && data.length > 0) {
        setMovie(data[0]);
        if (auth.id !== 0) {
          checkMoviesStatus(mid);
        }
      }
    } catch (error) {
      console.error('Failed to fetch movie detail', error);
      toast.error('載入電影詳情失敗');
    } finally {
      setIsLoading(false);
    }
  }, [auth.id, checkMoviesStatus]);

  useEffect(() => {
    if (mid) {
      getMovieDetail(mid);
    }
  }, [mid, getMovieDetail]);

  const handleSavedClick = async () => {
    if (auth.id === 0) {
      toast.warning('請先登入!');
      return;
    }
    const movieId = mid;
    const userId = auth.id;

    if (interactingItems.current.has(`save-${movieId}`)) return;
    interactingItems.current.add(`save-${movieId}`);

    const wasSavedBeforeAction = isSaved;
    const newSavedState = !wasSavedBeforeAction;

    // 1. 樂觀更新頁面按鈕
    setIsSaved(newSavedState);
    toast.success(newSavedState ? '收藏成功!' : '已取消收藏!');

    // 2. 樂觀更新全域收藏清單 (Sidebar)
    if (newSavedState) {
        const newItem = {
          saved_id: Date.now(),
          item_id: movieId,
          title: movie.title,
          img: movie.movie_img_url || movie.movie_img,
          item_type: 'movie',
          movie_rating: movie.movie_rating,
          content: '', // 補上 content 避免傳入 undefined
          created_at: new Date().toISOString(),
          subtitle: movie.booking_movie_type?.movie_type,
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
      const result = wasSavedBeforeAction
        ? await BookingService.unsaveMovie(userId, movieId)
        : await BookingService.saveMovie(userId, movieId);

      if (result.success || result?.output?.success) {
        // 3. 觸發背景刷新以維持最終一致性
        refreshCollectList();
      } else {
        throw new Error('操作失敗');
      }
    } catch (error) {
      // 失敗時還原所有狀態
      setIsSaved(wasSavedBeforeAction);
      setAllCollectList((prev) =>
        wasSavedBeforeAction
          ? [...prev] // 這裡較難精確還原，但 refresh 會在成功時處理
          : prev.filter((item) => item.item_id != movieId),
      );
      toast.error('操作失敗，請稍後再試');
    } finally {
      interactingItems.current.delete(`save-${movieId}`);
    }
  };

  const getMovieImgSrc = (src) => {
    if (!src || src === '/unavailable-image.jpg') return '/unavailable-image.jpg';
    if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) {
      return src;
    }
    return `/movie_img/${src}`;
  };

  if (isLoading && !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neongreen"></div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <>
      <PageTitle pageTitle={`${movie.title} - Taipei Date`} />
      
      <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden font-inter pb-32">
        {/* 1. 沉浸式背景 (Blurred Backdrop) */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#050505] z-10"></div>
          <Image
            src={getMovieImgSrc(movie.poster_img)}
            alt="background blur"
            fill
            className="object-cover opacity-30 blur-3xl scale-110"
          />
        </div>

        {/* 2. 導覽列 (Header) */}
        <header className="relative z-50 flex items-center justify-between p-6 lg:px-12 max-w-[1440px] mx-auto pt-32 lg:pt-40">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-neongreen/50 transition-all"
          >
            <FaArrowLeft className="w-5 h-5 text-neongreen group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wide">返回</span>
          </button>
        </header>

        {/* 3. 主要內容區 (Main Content) */}
        <main className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pt-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* 左側：海報 (Poster Card) */}
            <div className="w-full lg:w-[400px] flex-shrink-0 flex justify-center lg:block">
              <div className="relative w-[280px] lg:w-full aspect-[2/3] group">
                <div className="absolute inset-0 bg-neongreen/20 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-3xl"></div>
                <Image
                  src={getMovieImgSrc(movie.poster_img)}
                  alt={movie.title}
                  fill
                  className="rounded-3xl object-cover shadow-2xl border border-white/10 relative z-10"
                  priority
                />
              </div>
            </div>

            {/* 右側：詳細資訊 (Info & CTA) */}
            <div className="flex-1 flex flex-col pt-4">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-neongreen/10 border border-neongreen/30 text-neongreen text-xs font-bold tracking-widest uppercase">
                  {movie.movie_type_name || 'Drama'}
                </span>
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                  <FaStar className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-black">{movie.movie_rating || '5.0'}</span>
                </div>
                
                {/* 收藏按鈕搬家到這裡 (Bookmark relocated here) */}
                <button 
                  onClick={handleSavedClick}
                  className={`ml-auto lg:ml-4 flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
                    isSaved 
                      ? 'bg-neongreen/20 border-neongreen text-neongreen shadow-[0_0_15px_rgba(160,255,31,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white hover:border-neongreen/50'
                  }`}
                >
                  <FaBookmark className={`w-4 h-4 ${isSaved ? 'text-neongreen' : ''}`} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isSaved ? '已收藏' : '加入收藏'}
                  </span>
                </button>
              </div>

              <h1 className="text-4xl lg:text-7xl font-black mb-8 leading-tight tracking-tight">
                {movie.title}
              </h1>

              {/* Stats Bar */}
              <div className="flex flex-wrap gap-8 text-white/60 mb-10 pb-10 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FaCalendar className="w-5 h-5 text-neongreen" />
                  <span className="font-medium text-lg">2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="w-5 h-5 text-neongreen" />
                  <span className="font-medium text-lg">141 min</span>
                </div>
              </div>

              {/* Description Section with MORE */}
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-neongreen rounded-full"></span>
                  電影介紹
                </h3>
                <div className="relative">
                  <div 
                    ref={descriptionRef}
                    className={`text-white/70 leading-relaxed text-lg transition-all duration-500 overflow-hidden ${
                      isExpanded ? 'max-h-[2000px]' : 'max-h-[100px]'
                    }`}
                  >
                    {movie.movie_description}
                    {!isExpanded && (
                      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#050505] to-transparent"></div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 flex items-center gap-2 text-neongreen hover:text-white transition-colors group"
                  >
                    <span className="text-sm font-bold tracking-wider uppercase">
                      {isExpanded ? '收起詳情' : '查看更多'}
                    </span>
                    <FaChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'animate-bounce'}`} />
                  </button>
                </div>
              </div>

              {/* Action Buttons (Desktop Hidden, shown below for Desktop) */}
              <div className="hidden lg:flex gap-6 mt-4">
                <button 
                  onClick={() => router.push('/under-construction')}
                  className="px-12 py-5 rounded-2xl bg-neongreen text-black font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(160,255,31,0.3)] hover:shadow-[0_0_50px_rgba(160,255,31,0.5)]"
                >
                  立即訂票
                </button>
              </div>
            </div>
          </div>

          {/* 4. 預告片區 (Trailer Section) */}
          <section className="mt-20 lg:mt-32 pb-20">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-neongreen/20">
                <FaPlay className="w-6 h-6 text-neongreen" />
              </span>
              預告片預覽
            </h3>
            <div className="glass-card-neon rounded-[40px] overflow-hidden border border-white/5 bg-white/2 p-4 lg:p-8">
              {movie.youtube_id ? (
                <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-inner">
                  <YouTube
                    videoId={movie.youtube_id}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 0,
                        modestbranding: 1,
                        rel: 0,
                      }
                    }}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full aspect-video bg-white/5 rounded-3xl text-white/20">
                  <FaPlay className="w-20 h-20 mb-4 opacity-10" />
                  <p className="text-xl font-bold">暫無預告片影片</p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* 5. 行動端底部按鈕 (Mobile Sticky CTA) */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full p-6 z-[60] bg-gradient-to-t from-black via-black/90 to-transparent">
          <button 
            onClick={() => router.push('/under-construction')}
            className="w-full py-5 rounded-2xl bg-neongreen text-black font-black text-xl shadow-[0_0_30px_rgba(160,255,31,0.4)] active:scale-95 transition-all"
          >
            立即訂票
          </button>
        </div>
      </div>
    </>
  );
}
