import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { usePostContext } from '@/context/post-context';
import FollowerModal from '../modal/followerModal';
import FollowingModal from '../modal/followingModal';
import { CommunityService } from '@/services/community-service';
import PageLoader from '@/components/ui/loader/page-loader';
import { getImageUrl, handleImageError } from '@/services/image-utils';


export default function ProfileInfo({ onReady }) {
  const { auth } = useAuth();
  const {
    userInfo,
    following,
    postsCount,
    setPostsCount,
    handleFollowClick,
    reload,
  } = usePostContext();

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  // const [postsCount, setPostsCount] = useState(0);
  const [localUserInfo, setLocalUserInfo] = useState({});
  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowings, setUserFollowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = auth.id;

  const router = useRouter();
  const { uid } = router.query;

  // 基於 post_id 的唯一 edit modal id
  const followerModalId = `follower_modal_${userId}`;

  // 基於 post_id 的唯一 edit modal id
  const followingModalId = `following_modal_${userId}`;

  // 是否追蹤當前瀏覽的用戶的資訊
  const isFollowing = following[uid] || false;

  const getFollowUsers = async () => {
    if (!uid) return;
    try {
      const data = await CommunityService.getFollows(uid);
      data.forEach((item) => {
        if (item.relation_type === 'followers') {
          setFollowersCount(item.count);
        } else if (item.relation_type === 'following') {
          setFollowingCount(item.count);
        }
      });
    } catch (error) {
      console.error('Failed to fetch follows', error);
    }
  };

  const getPostsCount = async () => {
    if (!uid) return;
    try {
      const data = await CommunityService.getCountPosts(uid);
      setPostsCount(data[0].PostCount);
    } catch (error) {
      console.error('Failed to fetch post count', error);
    }
  };

  const getLocalUserInfo = async () => {
    if (!uid) return;
    try {
      const data = await CommunityService.getUserInfo(uid);
      // 後端返回的是單一物件 (findUnique)，直接設置即可
      setLocalUserInfo(data || {});
    } catch (error) {
      console.error('Failed to fetch user info', error);
      setLocalUserInfo({}); // 當請求失敗時，也設置一個空對象
    }
  };

  const getFollowers = async () => {
    if (!uid) return;
    try {
      const data = await CommunityService.getFollowers(uid);
      setUserFollowers(data); // 更新 userFollowers 狀態
    } catch (error) {
      console.error('Failed to fetch user followers', error);
      setUserFollowers([]); // 當請求失敗時，也設置一個空對象
    }
  };

  const getFollowings = async () => {
    if (!uid) return;
    try {
      const data = await CommunityService.getFollowings(uid);
      setUserFollowings(data); // 更新 userFollowings 狀態
    } catch (error) {
      console.error('Failed to fetch user followings', error);
      setUserFollowings([]); // 當請求失敗時，也設置一個空對象
    }
  };


  useEffect(() => {
    // 只要有 uid 就應該抓取基本資訊 (公開頁面不需要 auth.id)
    if (uid) {
      // 不要在組件內部再次觸發 setIsLoading(true)，因為父組件已經在處理了
      // 除非是 uid 以外的異步更新，否則應保持流暢
      Promise.all([
        getFollowUsers(),
        getPostsCount(),
        getLocalUserInfo(),
        getFollowers(),
        getFollowings(),
      ]).finally(() => {
        setIsLoading(false);
        if (onReady) onReady();
      });
    } else {
      setIsLoading(false);
      if (onReady) onReady();
    }
  }, [uid, reload]); // 只有當 uid 或 reload 變化時重新抓取

  // 移除了原本的 if (isLoading) return <div ... />
  // 改由父組件 (profile/[uid].jsx) 統一控制載入狀態

  return (
    <>
      <div className="w-full flex items-center justify-center px-8 py-5">
        <div className="flex flex-col sm:flex-row justify-center gap-2 w-full flex-grow">
          {/* Profile avatar */}
          <div className="basis-3/12 flex items-center justify-center">
            <div className="avatar">
              <div className="w-32 rounded-full">
                <img
                  src={getImageUrl(localUserInfo.avatar, 'avatar')}
                  alt={localUserInfo.username || 'No Image Available'}
                  onError={(e) => handleImageError(e, 'avatar')}
                />
              </div>
            </div>
          </div>
          {/* Profile info */}
          <div className="basis-8/12 flex flex-col justify-between item-center gap-2 w-full flex-grow">
            <div className="flex items-center">
              <div className="userId">
                {localUserInfo.username
                  ? localUserInfo.username
                  : localUserInfo.email
                    ? localUserInfo.email.split('@')[0]
                    : '載入中...'}
              </div>
              <div className="flex mx-10">
                {/* 確保個人頁面不顯示追蹤功能, 轉換 uid 從字符串到數字，以保持類型一致 */}
                {userId !== 0 &&
                  userId !== null &&
                  uid &&
                  auth.id &&
                  parseInt(auth.id, 10) !== parseInt(uid, 10) && (
                    <button
                      className="btn bg-dark border-white rounded-full text-white hover:shadow-xl3 hover:text-neongreen"
                      onClick={() => {
                        handleFollowClick(uid);
                      }}
                    >
                      {isFollowing ? '追蹤中' : '追蹤'}
                    </button>
                  )}
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 whitespace-nowrap">
              <div className="basis-1/3">{postsCount} 貼文</div>
              <div
                className="basis-1/3 cursor-pointer"
                onClick={() =>
                  document.getElementById(followerModalId).showModal()
                }
              >
                {followersCount} 追蹤者
              </div>
              <div
                className="basis-1/3 cursor-pointer"
                onClick={() =>
                  document.getElementById(followingModalId).showModal()
                }
              >
                {followingCount} 追蹤中
              </div>
              <FollowerModal
                followers={userFollowers}
                modalId={followerModalId}
                key={`follower-${uid}`}
              />
              <FollowingModal
                followings={userFollowings}
                modalId={followingModalId}
                key={`following-${uid}`}
              />
            </div>

            <div className="flex items-center">
              {localUserInfo.profile_content}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
