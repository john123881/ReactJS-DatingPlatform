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

  const { events, eventHasMore, getCommunityEvents } = usePostContext();

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null && events.length === 0) {
      getCommunityEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.id]);

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-center h-fit pt-10">
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
