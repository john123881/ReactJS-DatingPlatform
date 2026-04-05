import { useEffect } from 'react';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import EventCard from '@/components/community/card/eventCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageLoader from '@/components/ui/loader/page-loader';
import CommunityLayout from '@/components/community/layout/CommunityLayout';

export default function Events({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { events, eventHasMore, getCommunityEvents, loadingEvents } = usePostContext();

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null && events.length === 0) {
      getCommunityEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.id]);

  if (loadingEvents && events.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <PageLoader type="index" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-center h-fit pt-10 relative">
        {loadingEvents && (
          <div className="absolute inset-x-0 top-0 z-50 flex justify-center pt-2">
            <div className="bg-dark/80 backdrop-blur-md px-4 py-2 rounded-full border border-neongreen/30 shadow-neon flex items-center gap-2">
               <span className="loading loading-spinner text-neongreen loading-sm"></span>
               <span className="text-neongreen text-xs font-bold tracking-widest">正在更新活動資料...</span>
            </div>
          </div>
        )}
        <InfiniteScroll
          dataLength={events.length}
          next={getCommunityEvents}
          hasMore={eventHasMore}
          loader={<PageLoader type="index" minHeight="200px" />}
          // endMessage={<p>No more events</p>}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
          }}
        >
          {events.map((event, i) => (
            <EventCard event={event} key={i} />
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}

Events.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;
