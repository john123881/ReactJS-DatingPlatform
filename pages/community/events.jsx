import { useEffect } from 'react';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import EventCard from '@/components/community/card/eventCard';
import Sidebar from '@/components/community/sidebar/sidebar';
import TabbarMobile from '@/components/community/tabbar/tabbarMobile';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './page.module.css';
import PageTitle from '@/components/page-title';
import PageLoader from '@/components/ui/loader/page-loader';


export default function Events({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth } = useAuth();

  const { events, eventHasMore, getCommunityEvents } = usePostContext();

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null && events.length === 0) {
      getCommunityEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.id]);

  return (
    <>
      <title>{'Community - Taipei Date'}</title>
      <PageTitle pageTitle={pageTitle} />

      <div className="flex md:hidden">
        <TabbarMobile />
      </div>
      <div className="flex flex-col w-full pt-28">
        <div className="flex flex-wrap min-h-screen max-w-[1440px] mx-auto w-full">
          <div className="hidden md:flex md:basis-2/12">
            <Sidebar />
          </div>
          <div className="flex md:basis-10/12 flex-wrap gap-5 justify-center h-fit">
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
        </div>
      </div>
    </>
  );
}
