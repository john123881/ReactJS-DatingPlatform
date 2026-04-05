import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import ProfileCard from '@/components/community/card/profileCard';
import ProfileInfo from '@/components/community/profileInfo/profileInfo';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CommunityService } from '@/services/community-service';
import PageLoader from '@/components/ui/loader/page-loader';
import CommunityLayout from '@/components/community/layout/CommunityLayout';

export default function Profile({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);
  const { uid } = router.query;

  const {
    profilePosts,
    setProfilePosts,
    userProfileHasMore,
    setUserProfileHasMore,
    profilePage,
    setProfilePage,
    checkFollowingStatus,
    checkPostsStatus,
    getPostComments,
    reload,
  } = usePostContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderLoading, setIsHeaderLoading] = useState(true);

  const getCommunityUserProfilePost = useCallback(
    async (page = profilePage) => {
      if (!uid) return;
      try {
        const data = await CommunityService.getPostsByUser(uid, page, 12);

        if (data.length === 0) {
          setUserProfileHasMore(false);
          return;
        }

        const postIds = data.map((post) => post.post_id).join(',');

        await Promise.all([
          checkFollowingStatus(uid),
          checkPostsStatus(postIds),
          getPostComments(postIds),
        ]);

        setProfilePosts((prevPosts) => [...prevPosts, ...data]);
        setProfilePage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      uid,
      userProfileHasMore,
      profilePage,
      checkFollowingStatus,
      checkPostsStatus,
      getPostComments,
      setProfilePosts,
      setProfilePage,
      setUserProfileHasMore,
    ],
  );

  useEffect(() => {
    if (auth.id !== undefined && auth.id !== null && uid) {
      setProfilePosts([]);
      setUserProfileHasMore(true);
      setIsLoading(true);
      setIsHeaderLoading(true);
      setProfilePage(1);
      getCommunityUserProfilePost(1);
    }
  }, [auth.id, uid, reload]); // uid 變化時重新調用, 或是重複點擊則 reload

  return (
    <>
      <div className="flex flex-col w-full items-center pt-10">
        {/* 統一載入動畫 */}
        {(isLoading || isHeaderLoading) && (
          <div className="flex items-center justify-center min-h-[500px] w-full">
            <PageLoader type="index" />
          </div>
        )}

        {/* 內容區塊：即便在載入中也要掛載 ProfileInfo 以觸發資料抓取，但先隱藏 */}
        <div className={(isLoading || isHeaderLoading) ? 'hidden' : 'w-full flex flex-col items-center'}>
            {/* info area */}
            <ProfileInfo onReady={() => setIsHeaderLoading(false)} />
            {/* post area */}
            <div className="flex flex-wrap gap-5 justify-center">
              <InfiniteScroll
                dataLength={profilePosts.length}
                next={getCommunityUserProfilePost}
                hasMore={userProfileHasMore}
                loader={<PageLoader type="index" minHeight="200px" />}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '1.25rem',
                }}
              >
                {profilePosts.map((post, i) => (
                  <ProfileCard post={post} key={i} />
                ))}
              </InfiniteScroll>

              {/* 空內容預設顯示 */}
              {profilePosts.length === 0 && !userProfileHasMore && (
                <div className="flex flex-col items-center justify-center py-20 opacity-50 w-full">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-xl">目前還沒有任何貼文哦！</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </>
  );
}

Profile.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;
