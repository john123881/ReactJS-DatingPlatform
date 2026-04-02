import { useEffect } from 'react';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import SuggestionBar from '@/components/community/suggestionbar/SuggestionBar';
import PostCardLarge from '@/components/community/card/postCardLarge';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageLoader from '@/components/ui/loader/page-loader';
import CommunityLayout from '@/components/community/layout/CommunityLayout';

export default function Index({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const {
    posts,
    currentKeyword,
    filteredPosts,
    indexHasMore,
    indexFilteredHasMore,
    filteredPage,
    isFilterActive,
    activeFilterButton,
    handleFilterClick,
    getCommunityIndexPost,
    getCommunityIndexFilteredPost,
  } = usePostContext();

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null) {
      if (!isFilterActive && posts.length === 0) {
        getCommunityIndexPost();
      }
      if (filteredPage === 1 && isFilterActive && filteredPosts.length === 0) {
        getCommunityIndexFilteredPost(currentKeyword);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.id, isFilterActive, currentKeyword]);

  return (
    <>
      <div className="flex flex-row flex-wrap w-full">
        <div className="flex justify-center w-full lg:basis-7/12">
          <div className="flex flex-col items-center justify-start min-h-screen gap-8 pt-10">
            <div className="filterBtn flex gap-5 justify-between sm:w-[330px] md:w-[480px] md:mx-auto sm:mx-5">
              <button
                className={`${
                  activeFilterButton === '約會'
                    ? 'bg-primary text-black'
                    : 'bg-dark border'
                } rounded-full hover:bg-primary hover:text-black w-28 h-8`}
                onClick={() => {
                  handleFilterClick('約會');
                }}
              >
                約會
              </button>
              <button
                className={`${
                  activeFilterButton === '酒吧'
                    ? 'bg-primary text-black'
                    : 'bg-dark border'
                } rounded-full hover:bg-primary hover:text-black w-28 h-8`}
                onClick={() => {
                  handleFilterClick('酒吧');
                }}
              >
                酒吧
              </button>
              <button
                className={`${
                  activeFilterButton === '電影'
                    ? 'bg-primary text-black'
                    : 'bg-dark border'
                } rounded-full hover:bg-primary hover:text-black w-28 h-8`}
                onClick={() => {
                  handleFilterClick('電影');
                }}
              >
                電影
              </button>
            </div>

            <InfiniteScroll
              dataLength={
                isFilterActive ? filteredPosts.length : posts.length
              }
              next={
                isFilterActive
                  ? () => getCommunityIndexFilteredPost(currentKeyword)
                  : getCommunityIndexPost
              }
              hasMore={isFilterActive ? indexFilteredHasMore : indexHasMore}
              loader={<PageLoader type="index" minHeight="500px" />}
              // endMessage={<p>No more posts</p>}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              {(isFilterActive ? filteredPosts : posts).map((post, i) => (
                <PostCardLarge post={post} key={i} />
              ))}
            </InfiniteScroll>
          </div>
        </div>

        <div className="justify-end hidden w-full pr-10 lg:flex lg:basis-5/12 xl:basis-3/12">
          <SuggestionBar />
        </div>
      </div>
    </>
  );
}

Index.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;
