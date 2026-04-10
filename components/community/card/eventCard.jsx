import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { usePostContext } from '@/context/post-context';
import { useRouter } from 'next/router';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import styles from './card.module.css';
import { getImageUrl, handleImageError } from '@/services/image-utils';
import Link from 'next/link';

export default function EventCard({ event }) {
  const { auth } = useAuth();
  const router = useRouter();
  const { attendedEvents, handleAttendedClick } = usePostContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const userId = auth.id;
  const isAttended = attendedEvents[event.comm_event_id] || false;

  const handleUserClick = (e, userId) => {
    e.stopPropagation();
    router.push(`/community/profile/${userId}`);
  };

  return (
    <>
      <div className="card sm:w-[330px] md:w-[480px] h-auto flex border-grayBorder mx-5 mb-8 shadow-sm overflow-hidden group">
        {/* User Header */}
        <div className="card-user flex h-10 items-center gap-2 m-2 justify-between">
          <div 
            className="flex justify-start items-center gap-2 cursor-pointer"
            onClick={(e) => handleUserClick(e, event.user_id)}
          >
            <div className="avatar">
              <div className="w-8 rounded-full border border-white/10">
                <img
                  src={getImageUrl(event.avatar, 'avatar')}
                  alt={event.username || 'User'}
                  onError={(e) => handleImageError(e, 'avatar')}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-white/80 hover:text-neongreen transition-colors">
              {event.username || (event.email ? event.email.split('@')[0] : 'User')}
            </span>
          </div>
          <div className="badge badge-outline border-neongreen text-neongreen text-[10px] uppercase tracking-widest font-bold">
            EVENT
          </div>
        </div>

        {/* Event Media */}
        <Link href={`/community/event/${event.comm_event_id}`}>
          <figure className="card-photo m-0 relative overflow-hidden cursor-pointer">
            <div className={styles.parallaxContainer}>
              <div className={styles.parallax}>
                <div className={styles.parallaxContent}>
                  <img
                    src={getImageUrl(event.img, 'event')}
                    alt={event.title}
                    className={`${styles.parallaxMedia} w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110`}
                    onError={(e) => handleImageError(e, 'event')}
                  />
                </div>
              </div>
            </div>
            {/* Overlay Date Badge */}
            <div className="absolute top-4 left-4 bg-dark/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex flex-col items-center">
               <span className="text-neongreen font-bold text-lg leading-tight">
                  {event.start_date ? event.start_date.split('月')[1].split('日')[0] : '??'}
               </span>
               <span className="text-white/60 text-[10px] uppercase font-medium">
                  {event.start_date ? event.start_date.split('月')[0].replace('年', '').trim() + '月' : 'MONTH'}
               </span>
            </div>
          </figure>
        </Link>

        {/* Event Details */}
        <div className="card-body p-5 bg-black/20">
          <Link href={`/community/event/${event.comm_event_id}`}>
            <h2 className="card-title text-white hover:text-neongreen transition-colors cursor-pointer truncate">
              {event.title}
            </h2>
          </Link>
          
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <FiCalendar className="text-neongreen" />
              <span>{event.start_date}</span>
            </div>
            {event.start_time && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <FiClock className="text-neongreen" />
                <span>{event.start_time} - {event.end_time || ''}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <FiMapPin className="text-neongreen" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <div className="card-actions justify-between items-center mt-5 pt-4 border-t border-white/5">
            <p className="text-xs text-white/40 italic line-clamp-1 flex-1 mr-4">
              {event.description}
            </p>
            <button 
              className={`btn btn-sm rounded-full px-6 transition-all duration-300 font-bold ${
                isAttended 
                  ? 'bg-neongreen/20 text-neongreen border-neongreen/50 hover:bg-neongreen/30' 
                  : 'bg-neongreen text-black border-none hover:bg-neongreen/80 shadow-neon-sm'
              }`}
              onClick={async (e) => {
                e.preventDefault();
                if (isProcessing) return;
                
                if (typeof handleAttendedClick === 'function') {
                  setIsProcessing(true);
                  try {
                    await handleAttendedClick(event);
                  } finally {
                    setIsProcessing(false);
                  }
                }
              }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : isAttended ? (
                '已參加'
              ) : (
                '立即參加'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

