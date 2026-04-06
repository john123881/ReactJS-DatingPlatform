import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { usePostContext } from '@/context/post-context';
import { FiSend, FiMoreHorizontal } from 'react-icons/fi';
import PageLoader from '@/components/ui/loader/page-loader';
import { toast as customToast } from '@/lib/toast';
import { handleImageError } from '@/services/image-utils';
import EditEventModal from '@/components/community/modal/editEventModal';
import ParticipantModal from '@/components/community/modal/participantModal';
import CommunityLayout from '@/components/community/layout/CommunityLayout';
import Link from 'next/link';

export default function Event({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  const { eid } = router.query;

  const { auth } = useAuth();

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const {
    getEventPage,
    eventPageCard,
    attendedEvents,
    handleAttendedClick,
    handleDeleteEventClick,
    getEventParticipants,
    eventParticipants,
    participantModalRef,
  } = usePostContext();

  const isAttended = attendedEvents[eventPageCard?.comm_event_id] || false;

  const userId = auth.id;

  // 基於 comm_event_id 的唯一 edit modal id
  const editEventModalId = `edit_event_modal_${eventPageCard?.comm_event_id}`;
  const participantModalId = `participant_modal_${eventPageCard?.comm_event_id}`;

  const handleParticipantClick = async () => {
    if (eventPageCard?.comm_event_id) {
      await getEventParticipants(eventPageCard.comm_event_id);
      if (participantModalRef.current) {
        participantModalRef.current.showModal();
      }
    }
  };

  const handleQuickCopy = (e) => {
    e?.stopPropagation();
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
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

  useEffect(() => {
    if (eid) {
      getEventPage(eid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eid]);

  if (!eventPageCard || Object.keys(eventPageCard).length === 0 || eventPageCard.comm_event_id != eid) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="flex flex-col w-full items-center px-4 pt-10">
        <div className="w-full max-w-[1000px] mb-6">
          <nav className="flex items-center text-sm font-medium space-x-2 text-gray-400">
            <button 
              onClick={() => router.push('/community')}
              className="hover:text-white transition-colors"
            >
              社群媒體
            </button>
            <span className="text-gray-600">/</span>
            <button 
              onClick={() => router.push('/community/events')}
              className="hover:text-white transition-colors"
            >
              活動列表
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-neongreen font-bold truncate max-w-[200px] md:max-w-md">
              {eventPageCard?.title}
            </span>
          </nav>
        </div>
        <div className="w-full max-w-[1000px] bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:shadow-primary/5">
          <div className="flex flex-col md:flex-row h-full">
            {/* Image Section */}
            <figure className="relative w-full md:w-3/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-900/50">
              <Image
                src={eventPageCard?.img || '/unavailable-image.jpg'}
                alt={eventPageCard?.photo_name || 'No Image Available'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                className="object-contain transition-transform duration-700"
                onError={(e) => handleImageError(e, 'event')}
              />
              <div className="absolute top-4 left-4">
                <span className="badge bg-neongreen text-black border-none font-bold px-4 py-3 shadow-lg">活動主頁</span>
              </div>
            </figure>

            {/* Content Section */}
            <div className="flex flex-col w-full md:w-2/5 p-8 md:p-10 justify-between gap-6">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {eventPageCard?.title || '未命名活動'}
                  </h1>
                  
                  <div className="flex gap-4">
                    <FiSend
                      className="w-6 h-6 text-gray-400 hover:text-neongreen cursor-pointer transition-colors"
                      onClick={handleQuickCopy}
                      title="分享連結"
                    />
                    
                    {userId === eventPageCard?.user_id && (
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="cursor-pointer">
                          <FiMoreHorizontal className="w-6 h-6 text-gray-400 hover:text-neongreen transition-colors" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-2xl bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl w-36">
                          <li>
                            <a className="hover:text-neongreen py-3" onClick={() => document.getElementById(editEventModalId).showModal()}>
                              編輯活動
                            </a>
                          </li>
                          <li>
                            <a className="hover:text-red-500 py-3" onClick={() => handleDeleteEventClick(eventPageCard)}>
                              刪除活動
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* 發起者資訊 */}
                <Link 
                  href={`/community/profile/${eventPageCard?.user_id}`}
                  className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-neongreen/50 group-hover:border-neongreen transition-all duration-300">
                    <Image
                      src={eventPageCard?.organizer_avatar ? (eventPageCard.organizer_avatar.startsWith('http') ? eventPageCard.organizer_avatar : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}${eventPageCard.organizer_avatar}`) : '/avatar/defaultAvatar.jpg'}
                      alt={eventPageCard?.organizer_name || '主辦人頭像'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">發起者</p>
                    <p className="text-white font-bold text-lg leading-tight group-hover:text-neongreen transition-colors">{eventPageCard?.organizer_name || '神秘用戶'}</p>
                  </div>
                </Link>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 rounded-full bg-neongreen animate-pulse"></div>
                    <p className="text-lg leading-relaxed">{eventPageCard?.description || '目前暫無詳細描述。'}</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-start gap-4 text-gray-400 text-sm">
                      <span className="font-semibold text-neongreen whitespace-nowrap min-w-[3rem]">地點:</span>
                      <span className="text-white">{eventPageCard?.location || '地點未選定'}</span>
                    </div>
                    <div className="flex items-start gap-4 text-gray-400 text-sm">
                      <span className="font-semibold text-neongreen whitespace-nowrap min-w-[3rem]">時間:</span>
                      <span className="text-white leading-relaxed">
                        {eventPageCard?.start_date ? `${eventPageCard.start_date} ${eventPageCard.start_time || ''}` : '時間未定'} 
                        {eventPageCard?.end_date && <><br /><span className="text-gray-500">—</span> {eventPageCard.end_date} {eventPageCard.end_time || ''}</>}
                      </span>
                    </div>

                    {/* 參與者資訊 */}
                    <div 
                      className="flex items-start gap-4 text-gray-400 text-sm pt-2 border-t border-white/5 cursor-pointer group/participants"
                      onClick={handleParticipantClick}
                    >
                      <span className="font-semibold text-neongreen whitespace-nowrap min-w-[3rem] group-hover/participants:translate-x-1 transition-transform duration-300">參與者:</span>
                      <div className="flex flex-col gap-1">
                        <span className="text-white group-hover/participants:text-neongreen transition-colors">
                          目前已參加：<span className="font-bold text-neongreen">{eventPageCard?.participant_count || 0}</span> 人
                        </span>
                        {eventPageCard?.first_participant_name ? (
                          <span className="text-xs text-gray-400 group-hover/participants:text-gray-300 transition-colors">
                            ( {eventPageCard.first_participant_name} {eventPageCard.participant_count > 1 ? '及其他參與者...' : '已參加'} )
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 italic">點擊查看詳情</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <article className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed italic border-l-2 border-neongreen/30 pl-4">
                    {eventPageCard?.post_context || '歡迎參加本次活動，與志同道合的朋友一起分享美好時光。'}
                  </p>
                </article>
              </div>

              {/* Actions */}
              {userId !== 0 && userId !== null && (
                <div className="mt-8 flex flex-col gap-4">
                  <button
                    className={`btn w-full h-14 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 ${
                      isAttended 
                        ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
                        : 'bg-neongreen text-black border-none hover:bg-neongreen/90 hover:shadow-primary/20'
                    }`}
                    onClick={() => handleAttendedClick(eventPageCard)}
                  >
                    {isAttended ? '取消參加' : '立即參加'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {userId === eventPageCard?.user_id && (
          <EditEventModal
            event={eventPageCard}
            modalId={editEventModalId}
            key={eventPageCard?.comm_event_id}
          />
        )}
        
        <ParticipantModal 
          participants={eventParticipants}
          modalId={participantModalId}
        />
      </div>
    </>
  );
}

Event.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;
