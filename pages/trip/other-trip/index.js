import { useState, useEffect, useCallback } from 'react';
import TripNavigationTab from '@/components/trip/sidebars/trip-navigation-tab';
import TripCard from '@/components/trip/common/trip-card';
import { useAuth } from '@/context/auth-context';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '@/configs/api-config';
import PageTitle from '@/components/page-title';
import { TripService } from '@/services/trip-service';

export default function OtherTrip({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  const { auth, getAuthHeader, isAuthLoaded, setLoginModalToggle } = useAuth();
  const [otherTrips, setOtherTrips] = useState([]);
  const { open, close, isLoading: isContextLoading } = useLoader();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  // Auth Guard
  useEffect(() => {
    if (isAuthLoaded && auth.id === 0) {
      setLoginModalToggle(true);
    }
  }, [isAuthLoaded, auth.id, setLoginModalToggle]);

  const fetchTrips = useCallback(async () => {
    open();
    try {
      const result = await TripService.getOtherPlans();
      setOtherTrips(result);
    } catch (error) {
      console.error('Fetching trips error:', error);
    }
    close();
  }, [getAuthHeader, open, close]);

  useEffect(() => {
    if (auth.id === 0) return;
    fetchTrips();
  }, [auth.id, fetchTrips]);

  // 以 filter 的方式過濾，只顯示標題之中包含關鍵字的行程
  const filteredTrips = (otherTrips || []).filter((trip) =>
    (trip?.trip_title || '').toLowerCase().includes((searchTerm || '').toLowerCase()),
  );

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  if (auth.id === 0) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageTitle pageTitle={pageTitle} />
      <TripNavigationTab />
      <div className="flex-grow w-full max-w-screen-2xl mx-auto px-6 sm:px-12 py-10 transition-all duration-300">
        <div className="flex flex-col items-center sm:items-start space-y-12">
          <label className="input input-bordered hidden sm:flex items-center gap-3 h-14 bg-white/5 border-white/20 rounded-2xl px-6 w-full max-w-md focus-within:border-neongreen transition-all">
            <input
              type="text"
              className="grow bg-transparent text-white text-lg outline-none"
              placeholder="搜尋精彩行程..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <div className="w-full mt-8 min-h-[500px]">
            {isContextLoading ? (
              <div className="flex justify-center items-center h-[500px] animate__animated animate__fadeIn">
                <Loader text="獲取分享行程中..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12 justify-items-center sm:justify-items-start animate__animated animate__fadeIn">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
