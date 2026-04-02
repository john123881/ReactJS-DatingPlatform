import { useEffect } from 'react';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PostCardMedium from '@/components/community/card/postCardMedium';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageLoader from '@/components/ui/loader/page-loader';
import CommunityLayout from '@/components/community/layout/CommunityLayout';

export default function Explore({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

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
      <div className="flex flex-wrap gap-5 justify-center pt-10">
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
      </div>
    </>
  );
}

Explore.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;
