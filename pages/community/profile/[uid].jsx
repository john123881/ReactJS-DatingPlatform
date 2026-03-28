import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import Sidebar from '@/components/community/sidebar/sidebar';
import ProfileCard from '@/components/community/card/profileCard';
import TabbarMobile from '@/components/community/tabbar/tabbarMobile';
import ProfileInfo from '@/components/community/profileInfo/profileInfo';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '../page.module.css';
import PageTitle from '@/components/page-title';
import { CommunityService } from '@/services/community-service';
import AccountLoader from '@/components/account-center/loader/account-loader';

export default function Profile({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth } = useAuth();

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

  const { uid } = router.query;

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
      setProfilePage(1);
      getCommunityUserProfilePost(1);
    }
  }, [auth.id, uid, reload]); // uid 變化時重新調用, 或是重複點擊則 reload

  return (
    <>
      <title>{'Community - Taipei Date'}</title>
      <PageTitle pageTitle={pageTitle} />

      {/* sidebar for mobile */}
      <div className="block md:hidden">
        <TabbarMobile />
      </div>

      <div className="flex flex-col w-full items-center justify-center pt-28">
        <div className="flex flex-wrap justify-center w-full min-h-screen">
          <div className="hidden md:flex md:w-2/12">
            <Sidebar />
          </div>

          <div className="flex flex-col md:w-10/12 items-center">
            {isLoading ? (
              <div className="w-full flex justify-center py-20">
                <AccountLoader type="index" minHeight="500px" />
              </div>
            ) : (
              <>
                {/* info area */}
                <ProfileInfo />
                {/* post area */}
                <div className="flex flex-wrap gap-5 justify-center">
                  <InfiniteScroll
                    dataLength={profilePosts.length}
                    next={getCommunityUserProfilePost}
                    hasMore={userProfileHasMore}
                    loader={<AccountLoader type="index" minHeight="200px" />}
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
                </div>
              </>
            )}
            {/* <div className="md:flex md:flex-wrap md:gap-5 md:justify-center hidden">
                {posts.map((_, index) => (
                  <ProfileCard key={index} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-5 mx-5 md:hidden">
                {posts.map((_, index) => (
                  <ProfileCard key={index} />
                ))}
              </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
