import Link from 'next/link';
import { useRouter } from 'next/router';

export default function TripNavigationTab({ showTitle = true }) {
  const router = useRouter();
  const isCalendar = router.pathname === '/trip';
  const isMyTrip = router.pathname === '/trip/my-trip';
  const isOtherTrip = router.pathname === '/trip/other-trip';

  return (
    <div className="pt-16 pb-3 border-b-2 border-white/50 w-full max-w-[1450px] mx-auto px-6 sm:px-12 transition-all duration-300">
      <div className="trip-sidebar">
        {showTitle && (
          <p className="hidden mb-12 text-5xl sm:text-7xl sm:block font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            行程規劃
          </p>
        )}
        <div className="flex justify-around items-center sidebarOptions sm:justify-start gap-4 sm:gap-16">
          <Link
            href="/trip"
            className={`text-sm sm:text-3xl font-bold transition-all duration-300 hover:scale-110 ${
              isCalendar ? 'text-neongreen drop-shadow-[0_0_8px_rgba(160,255,31,0.5)]' : 'text-gray-400 hover:text-neongreen'
            }`}
          >
            我的日曆
          </Link>
          <Link
            href="/trip/my-trip"
            className={`text-sm sm:text-3xl font-bold transition-all duration-300 hover:scale-110 ${
              isMyTrip ? 'text-neongreen drop-shadow-[0_0_8px_rgba(160,255,31,0.5)]' : 'text-gray-400 hover:text-neongreen'
            }`}
          >
            我的行程
          </Link>
          <Link
            href="/trip/other-trip"
            className={`text-sm sm:text-3xl font-bold transition-all duration-300 hover:scale-110 ${
              isOtherTrip ? 'text-neongreen drop-shadow-[0_0_8px_rgba(160,255,31,0.5)]' : 'text-gray-400 hover:text-neongreen'
            }`}
          >
            其他人的分享
          </Link>
        </div>
      </div>
    </div>
  );
}
