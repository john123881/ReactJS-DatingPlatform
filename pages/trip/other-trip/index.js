import { useState, useEffect } from 'react';
import TripSidebarOther from '@/components/shen/sidebars/trip-sidebar-other';
import TripCard from '../../../components/shen/trip-card';
import { useAuth } from '@/context/auth-context';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function OtherTrip({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);
  const { auth, getAuthHeader } = useAuth();
  const [otherTrips, setOtherTrips] = useState([]);
  const { open, close, isLoading } = useLoader();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (auth.id === 0) return;
    fetchTrips();
  }, [auth.id]);

  const fetchTrips = async () => {
    open();
    try {
      const response = await fetch('http://localhost:3001/trip/other-plans', {
        headers: { ...getAuthHeader() },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOtherTrips(data);
    } catch (error) {
      console.error('Fetching trips error:', error);
    }
    close();
  };

  // 以 filter 的方式過濾，只顯示標題之中包含關鍵字的行程
  const filteredTrips = otherTrips.filter((trip) =>
    trip.trip_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageTitle pageTitle={pageTitle} />
      <TripSidebarOther otherTrips={otherTrips} />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center ">
          <div className="flex flex-col items-center  min-h-screen  my-10 space-y-12">
            <label className="input input-bordered hidden sm:flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="搜尋行程"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-5 sm:gap-14 my-4 justify-center">
              {filteredTrips.map((otherTrip) => (
                <TripCard key={otherTrip.trip_plan_id} otherTrip={otherTrip} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
