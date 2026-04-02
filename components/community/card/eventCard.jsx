import { useAuth } from '@/context/auth-context';
import { usePostContext } from '@/context/post-context';
import { useState } from 'react';
import { FiSend, FiMoreHorizontal } from 'react-icons/fi';
import EditEventModal from '../modal/editEventModal';
import Link from 'next/link';
import Image from 'next/image';
import { toast as customToast } from '@/lib/toast';
import { handleImageError } from '@/services/image-utils';
import styles from './card.module.css';

export default function EventCard({ event }) {
  const { auth } = useAuth();
  const { handleAttendedClick, attendedEvents, handleDeleteEventClick } =
    usePostContext();
  const [isFlipped, setIsFlipped] = useState(false);

  const userId = auth.id;

  // 基於 comm_event_id 的唯一 edit modal id
  const editEventModalId = `edit_event_modal_${event?.comm_event_id}`;

  // 基於 post_id 的唯一 share modal id
  const shareEventModalId = `share_event_modal_${event?.comm_event_id}`;

  const isAttended = attendedEvents[event?.comm_event_id] || false;

  const handleFlip = (e) => {
    setIsFlipped(!isFlipped);
  };

  const handleQuickCopy = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/community/event/${event?.comm_event_id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        customToast.success('複製連結成功!');
      })
      .catch((err) => {
        console.error('無法複製連結: ', err);
        customToast.error('複製連結失敗!');
      });
  };

  // 於前端處理地點顯示
  const formatLocation = (location) => {
    if (!location) return '';
    // 檢查 location 是否有足夠長度, 如果沒有直接返回原字串
    return location.length > 6 ? location.substring(0, 6) : location;
  };

  return (
    <>
      <div className={styles['flip-card']} onClick={handleFlip}>
        <div
          className={`${styles['flip-card-inner']} ${
            isFlipped ? styles.flipped : ''
          }`}
        >
          <div
            className={`${styles['flip-card-front']} eventCard card md:w-[330px] md:h-[480px] flex flex-col items-center justify-start border-grayBorder overflow-hidden`}
          >
            <figure className="relative card-photo w-[330px] h-[330px] overflow-hidden rounded-2xl">
              <Image
                src={event.img || '/unavailable-image.jpg'}
                alt={event.photo_name || 'No Image Available'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => handleImageError(e, 'event')}
              />
            </figure>
            <div className="card-body h-auto w-[330px] p-0 overflow-auto flex flex-col justify-between">
              <div className="card-info text-h4 flex flex-col justify-between">
                <div className="flex flex-row justify-between items-start">
                  <div className="card-infoLeft flex flex-row gap-2 px-1 py-1">
                    <div className="flex flex-col gap-3">
                      <Link 
                        href={`/community/event/${event?.comm_event_id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-h5 font-bold hover:text-neongreen transition-colors">{event.title}</p>
                      </Link>
                      <p className="text-h6">
                        {formatLocation(event.location)}
                      </p>
                      <p className="text-h6">
                        {`${event.start_date} ${event.start_time}`}
                      </p>
                    </div>
                  </div>

                  <div className="card-iconListRight flex justify-end items-center px-1 py-1 ">
                    <FiSend
                      className="card-icon hover:text-neongreen"
                      onClick={handleQuickCopy}
                    />
                    {userId === event.user_id ? (
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          className="m-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiMoreHorizontal className="card-icon hover:text-neongreen" />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                          }}
                        >
                          <li>
                            <a
                              className="hover:text-neongreen"
                              onClick={() =>
                                document
                                  .getElementById(editEventModalId)
                                  .showModal()
                              }
                            >
                              編輯活動
                            </a>
                          </li>
                          <li>
                            <a
                              className="hover:text-neongreen"
                              onClick={() => handleDeleteEventClick(event)}
                            >
                              刪除活動
                            </a>
                          </li>
                        </ul>
                      </div>
                    ) : null}
                    <EditEventModal
                      event={event}
                      modalId={editEventModalId}
                      key={event.comm_event_id}
                    />
                  </div>
                </div>
              </div>
              {userId !== 0 && userId !== null && (
                <div className="card-actions flex justify-center px-1 py-1 ">
                  <button
                    className="btn bg-dark border-neongreen rounded-full text-neongreen hover:shadow-xl3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAttendedClick(event);
                    }}
                  >
                    {isAttended ? <span>已參加</span> : <span>參加</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            className={`${styles['flip-card-back']} flex flex-col gap-5`}
            onClick={(e) => {
              // 點擊背面也翻回去
              e.stopPropagation();
              handleFlip();
            }}
          >
            <p className="text-h5 font-bold">{event.title}</p>
            <p className="text-h6 font-light">{event.description}</p>
            <p className="text-h6">{event.location}</p>
            <p className="text-h6">
              {`${event.start_date} ${event.start_time} - ${event.end_date} ${event.end_time}`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
