import { usePostContext } from '@/context/post-context';
import styles from './card.module.css';
import { getImageUrl, handleImageError } from '@/services/image-utils';
import Link from 'next/link';

export default function ProfileEventCard({ event }) {
  // 這裡我們不使用 Modal，而是直接導引到活動詳細頁面，或是您可以根據需求加入 Modal
  const eventUrl = `/community/event/${event.comm_event_id}`;

  return (
    <Link href={eventUrl} className="block">
      <div className="flex aspect-square card w-[330px] h-[330px] overflow-hidden items-center justify-center border-grayBorder cursor-pointer transition-transform hover:scale-[1.02]">
        <figure className="card-photo m-0 w-full h-full relative">
          <div className={styles.parallaxContainer}>
            <div className={styles.parallax}>
              <div className={styles.parallaxContent}>
                <div className="parallaxContentBack w-full h-full">
                  <img
                    src={getImageUrl(event.img, 'event')}
                    alt={event.title || 'No Image Available'}
                    className={`${styles.parallaxMedia} card-photo w-[330px] h-[330px] object-cover`}
                    onError={(e) => handleImageError(e, 'event')}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 懸浮在上面的標題資訊 */}
          <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4 text-white">
            <p className="font-bold truncate">{event.title}</p>
            <p className="text-xs opacity-80">{event.start_date}</p>
          </div>
        </figure>
      </div>
    </Link>
  );
}
