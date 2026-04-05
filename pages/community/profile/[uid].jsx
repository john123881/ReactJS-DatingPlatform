import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import ProfileCard from '@/components/community/card/profileCard';
import ProfileEventCard from '@/components/community/card/ProfileEventCard';
import ProfileInfo from '@/components/community/profileInfo/profileInfo';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CommunityService } from '@/services/community-service';
import PageLoader from '@/components/ui/loader/page-loader';
import CommunityLayout from '@/components/community/layout/CommunityLayout';

export default function Profile({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  const { auth } = useAuth();
  const { uid } = router.query;

  const {
    profilePosts,
    setProfilePosts,
    profilePage,
    setProfilePage,
    profileHasMore,
    setProfileHasMore,
    getCommunityProfilePost,
    // 活動相關
    profileEvents,
    setProfileEvents,
    profileEventPage,
    setProfileEventPage,
    profileEventHasMore,
    setProfileEventHasMore,
    getCommunityUserProfileEvents,
    reload,
  } = usePostContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderLoading, setIsHeaderLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'events'

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  useEffect(() => {
    if (uid) {
      setIsLoading(true);
      setIsHeaderLoading(true);
      
      // 重置狀態
      setProfilePosts([]);
      setProfilePage(1);
      setProfileHasMore(true);
      
      setProfileEvents([]);
      setProfileEventPage(1);
      setProfileEventHasMore(true);

      // 預設抓取貼文
      getCommunityProfilePost(uid).finally(() => {
        setIsLoading(false);
      });
      
      // 預也抓取活動 (或者等到切換 tab 再抓，這裡我們先預抓第一頁以顯示數量或加速切換)
      getCommunityUserProfileEvents(uid);
    }
  }, [uid, reload]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex flex-col w-full items-center pt-10">
        {(isLoading || isHeaderLoading) && (
          <div className="flex items-center justify-center min-h-[500px] w-full">
            <PageLoader type="index" />
          </div>
        )}

        <div className={(isLoading || isHeaderLoading) ? 'hidden' : 'w-full flex flex-col items-center'}>
            <ProfileInfo onReady={() => setIsHeaderLoading(false)} />
            
            {/* Tab Switcher */}
            <div className="w-full max-w-[1030px] flex justify-center border-b border-gray-700 mb-8 mt-4">
              <button 
                onClick={() => handleTabChange('posts')}
                className={`px-10 py-4 font-bold transition-all ${activeTab === 'posts' ? 'text-neongreen border-b-2 border-neongreen' : 'text-gray-400 hover:text-white'}`}
              >
                貼文
              </button>
              <button 
                onClick={() => handleTabChange('events')}
                className={`px-10 py-4 font-bold transition-all ${activeTab === 'events' ? 'text-neongreen border-b-2 border-neongreen' : 'text-gray-400 hover:text-white'}`}
              >
                活動
              </button>
            </div>

            <div className="flex flex-wrap gap-5 justify-center w-full px-4">
              {activeTab === 'posts' ? (
                <InfiniteScroll
                  dataLength={profilePosts.length}
                  next={() => getCommunityProfilePost(uid)}
                  hasMore={profileHasMore}
                  loader={<PageLoader type="index" minHeight="200px" />}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    width: '100%'
                  }}
                >
                  {profilePosts.map((post, i) => (
                    <ProfileCard post={post} key={`post-${i}`} />
                  ))}
                  {profilePosts.length === 0 && !profileHasMore && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50 w-full text-center">
                      <div className="text-6xl mb-4">📭</div>
                      <p className="text-xl text-white">目前還沒有任何貼文哦！</p>
                    </div>
                  )}
                </InfiniteScroll>
              ) : (
                <InfiniteScroll
                  dataLength={profileEvents.length}
                  next={() => getCommunityUserProfileEvents(uid)}
                  hasMore={profileEventHasMore}
                  loader={<PageLoader type="index" minHeight="200px" />}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    width: '100%'
                  }}
                >
                  {profileEvents.map((event, i) => (
                    <ProfileEventCard event={event} key={`event-${i}`} />
                  ))}
                  {profileEvents.length === 0 && !profileEventHasMore && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50 w-full text-center">
                      <div className="text-6xl mb-4">🗓️</div>
                      <p className="text-xl text-white">目前還沒有發起任何活動哦！</p>
                    </div>
                  )}
                </InfiniteScroll>
              )}
            </div>
        </div>
      </div>
    </>
  );
}

Profile.getLayout = (page) => <CommunityLayout>{page}</CommunityLayout>;
