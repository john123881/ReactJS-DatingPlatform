import { useEffect } from 'react';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PostCardMedium from '@/components/community/card/postCardMedium';
import Sidebar from '@/components/community/sidebar/sidebar';
import TabbarMobile from '@/components/community/tabbar/tabbarMobile';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './page.module.css';
import PageTitle from '@/components/page-title';
import PageLoader from '@/components/ui/loader/page-loader';


export default function Explore({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth } = useAuth();

  const { randomPosts, exploreHasMore, getCommunityExplorePost } =
    usePostContext();

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null && randomPosts.length === 0) {
      getCommunityExplorePost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.id]);

  return (
    <>
      <title>{'Community - Taipei Date'}</title>
      <PageTitle pageTitle={pageTitle} />

      {/* sidebar for mobile */}
      <div className="block md:hidden">
        <TabbarMobile />
      </div>

      <div className="flex flex-col w-full pt-28">
        <div className="flex flex-wrap min-h-screen max-w-[1440px] mx-auto w-full">
          <div className="hidden md:flex md:basis-2/12">
            <Sidebar />
          </div>

          {/* <div className="flex w-full md:basis-6/12 justify-center">
            <div
              className="flex items-center justify-center w-full"
              style={{ minHeight: '100vh' }}
            >
              <div className={`${styles[`lds-heart`]}`}>
                <div></div>
              </div>
            </div>
          </div> */}

          <div className="flex flex-wrap md:basis-10/12 gap-5 justify-center pt-10">
            <div className="flex flex-wrap gap-5 justify-center">
              <InfiniteScroll
                dataLength={randomPosts.length}
                next={getCommunityExplorePost}
                hasMore={exploreHasMore}
                loader={<PageLoader type="index" minHeight="200px" />}
                // endMessage={<p>No more posts</p>}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '1.25rem',
                }}
              >
                {randomPosts.map((post, i) => (
                  <PostCardMedium post={post} key={i} />
                ))}
              </InfiniteScroll>
            </div>
            {/* <div className="md:flex md:flex-wrap md:gap-5 md:justify-center hidden">
              {posts.map((_, index) => (
                <PostCardMedium key={index} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-5 mx-5 md:hidden">
              {posts.map((_, index) => (
                <PostCardMedium key={index} />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
