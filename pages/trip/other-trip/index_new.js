import { useState, useEffect, useCallback, useRef } from 'react';
import TripNavigationTab from '@/components/trip/sidebars/trip-navigation-tab';
import TripCard from '@/components/trip/common/trip-card';
import { useAuth } from '@/context/auth-context';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { TripService } from '@/services/trip-service';

export default function OtherTrip({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  const { auth, isAuthLoaded, setLoginModalToggle } = useAuth();
  const [otherTrips, setOtherTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 分頁狀態
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // IntersectionObserver Sentinel
  const sentinelRef = useRef(null);

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  // Auth Guard
  useEffect(() => {
    if (isAuthLoaded && auth.id === 0) {
      setLoginModalToggle(true);
    }
  }, [isAuthLoaded, auth.id, setLoginModalToggle]);

  const fetchTrips = useCallback(async (pageNum = 1, isLoadMore = false) => {
    if (pageNum === 1) setIsInitialLoading(true);
    else setIsLoadingMore(true);

    try {
      const result = await TripService.getOtherPlans(pageNum, 10);
      const newTrips = result.data || [];
      const totalPages = result.pagination?.totalPages || 1;

      if (isLoadMore) {
        setOtherTrips(prev => {
          // 避免重複加入
          const existingIds = new Set(prev.map(t => t.trip_plan_id));
          const filteredNew = newTrips.filter(t => !existingIds.has(t.trip_plan_id));
          return [...prev, ...filteredNew];
        });
      } else {
        setOtherTrips(newTrips);
      }

      setHasMore(pageNum < totalPages);
    } catch (error) {
      console.error('Fetching trips error:', error);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // 初始載入
  useEffect(() => {
    if (auth.id !== 0 && isAuthLoaded) {
      fetchTrips(1, false);
    }
  }, [auth.id, isAuthLoaded, fetchTrips]);

  // IntersectionObserver 實作
  useEffect(() => {
    if (!hasMore || isLoadingMore || isInitialLoading || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchTrips(nextPage, true);
            return nextPage;
          });
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isInitialLoading, fetchTrips]);

  // 以 filter 的方式過濾
  const filteredTrips = (otherTrips || []).filter((trip) =>
    (trip?.trip_title || '').toLowerCase().includes((searchTerm || '').toLowerCase()),
  );

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <PageTitle pageTitle={pageTitle} />
      <TripNavigationTab />
      
      <div className="flex-grow w-full max-w-screen-2xl mx-auto px-6 sm:px-12 py-10 transition-all duration-300">
        <div className="flex flex-col items-center sm:items-start space-y-12">
          {/* 搜尋欄 */}
          <label className="input input-bordered hidden sm:flex items-center gap-3 h-14 bg-white/5 border-white/20 rounded-2xl px-6 w-full max-w-md focus-within:border-neongreen transition-all">
            <input
              type="text"
              className="grow bg-transparent text-white text-lg outline-none"
              placeholder="搜尋精彩行程..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 text-gray-400">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>

          <div className="w-full mt-8 min-h-[500px]">
            {auth.id === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-white/40 space-y-4">
                  <p className="text-2xl font-bold">請先登入以探索分享行程</p>
                  <button 
                    onClick={() => setLoginModalToggle(true)}
                    className="px-8 py-3 bg-neongreen text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    立即登入
                  </button>
                </div>
            ) : isInitialLoading ? (
              <div className="flex justify-center items-center h-[500px] animate__animated animate__fadeIn">
                <Loader text="獲取分享行程中..." />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12 justify-items-center sm:justify-items-start animate__animated animate__fadeIn w-full">
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map((otherTrip) => (
                      <TripCard key={otherTrip.trip_plan_id} trip={otherTrip} />
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center text-white/50 text-xl">
                      沒有找到符合條件的行程
                    </div>
                  )}
                </div>
                
                {/* Sentinel Element for IntersectionObserver */}
                <div ref={sentinelRef} className="w-full h-20" />
                
                {/* 載入更多指示器 */}
                {isLoadingMore && (
                  <div className="py-10 flex justify-center w-full animate__animated animate__fadeIn">
                    <Loader text="正在探索更多細節..." />
                  </div>
                )}
                
                {!hasMore && otherTrips.length > 0 && (
                  <div className="py-10 text-white/20 text-sm font-medium tracking-widest uppercase">
                    已經展示所有精彩行程
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
