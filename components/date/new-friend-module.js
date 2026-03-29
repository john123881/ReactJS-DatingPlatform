import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import SelectBtn from '@/components/date/select-btn';
import { AccountService } from '@/services/account-service';
import { DateService } from '@/services/date-service';
import toast from 'react-hot-toast';
import { useDate } from '@/context/date-context';
import Link from 'next/link';
import { useLoader } from '@/context/use-loader';
import { getImageUrl, handleImageError } from '@/services/image-utils';
import NewFriendModuleLoader from './loader/new-friend-module-loader';

export default function NewFriends() {
  // // 假資料
  // const mockData = {
  //   avatar:
  //     'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
  //   name: 'Xina',
  //   age: 28,
  //   bar_type: ['運動酒吧'],
  //   movie_type: ['愛情片'],
  //   profile_content:
  //     '熱愛生活，尤其喜歡在風格獨特的酒吧中探索，期待找到能一同分享這份喜好的新朋友。',
  // };

  // TODO:bio,selectedUserId 改成可以不用狀態的方式
  // bios[bioIndex]=bio
  // const bio = bios[bioIndex]

  const [bio, setBio] = useState(null);
  const [bios, setBios] = useState([]);
  const [bioIndex, setBioIndex] = useState(0); //索引值變

  const [selectedUserId, setSelectedUserId] = useState(null); // 新增這個狀態變數來保存 user_id
  const { auth, getAuthHeader } = useAuth();
  const { toggleBar, setToggleBar, toggleMovie, setToggleMovie } = useDate();
  const { open, close, isLoading } = useLoader();

  const handleClearToggle = (event, bar) => {
    setToggleBar({
      id: 0,
      name: '請選擇一種喜愛的酒吧類型',
    });
    setToggleMovie({
      id: 0,
      name: '請選擇一種喜愛的電影類型',
    });
  };

  const [selectedBarTypeId, setSelectedBarTypeId] = useState(null);
  const [selectedMovieTypeId, setSelectedMovieTypeId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // 統合抓取邏輯：確保 auth.id 有值才執行，並依序抓取偏好與推薦
  useEffect(() => {
    if (!auth.id || auth.id === 0) return;

    const fetchData = async () => {
      open();
      try {
        // 1. 獲取用戶偏好設定
        const profileResult = await AccountService.getProfile(auth.id);
        let barId = selectedBarTypeId;
        let movieId = selectedMovieTypeId;

        if (profileResult.success) {
          barId = profileResult.data.bar_type_id;
          movieId = profileResult.data.movie_type_id;
          setSelectedBarTypeId(barId);
          setSelectedMovieTypeId(movieId);
        }

        // 2. 獲取推薦名單
        const bioResult = await DateService.getRecommendedFriends(
          auth.id,
          barId,
          movieId
        );

        if (bioResult.success && bioResult.data.length > 0) {
          setBio(bioResult.data[0]);
          setBios(bioResult.data);
          setSelectedUserId(bioResult.data[0].user_id);
          setBioIndex(0);
        } else {
          setBio(null);
          setBios([]);
        }
      } catch (error) {
        console.error('Error in NewFriends fetchData:', error);
      } finally {
        setHasFetched(true);
        close(0.5);
      }
    };

    fetchData();
  }, [auth.id]);

  useEffect(() => {
    if (bios.length > 0 && bioIndex < bios.length) {
      setSelectedUserId(bios[bioIndex].user_id);
      setBio(bios[bioIndex]);
    } else if (hasFetched) {
      setBio(null); // 只有在已經抓取過的情況下才設為 null
    }
  }, [bioIndex, bios, hasFetched]);

  if (!hasFetched || (isLoading && !bio)) {
    return <NewFriendModuleLoader />;
  }

  if (!bio) {
    return (
      <div className="flex flex-col items-center justify-center p-4 gap-10">
        <p className="text-lg md:text-lg sm:text-base">
          好可惜，暫時無共同興趣的朋友！
        </p>
        <button className="text-black border-2 rounded-full btn-primary bg-primary border-primary hover:shadow-xl3 w-40 py-1 mx-2 md:w-60 md:py-2 mx-auto block">
          <Link href="/date/select-interests" onClick={handleClearToggle}>
            重新選擇興趣
          </Link>
        </button>
      </div>
    );
  }

  const handleAcceptClick = async () => {
    const targetId = selectedUserId || bio?.user_id;
    if (!targetId) {
      console.log('Selected user id is not available yet');
      return;
    }
    const result = await DateService.sendFriendRequest({
      user_id1: auth.id,
      user_id2: targetId,
      friendship_status: 'accepted',
    });

    // 在成功更新後重新獲取資料
    if (result.success) {
      toast.success('好友已送出！', { duration: 1500 });
      setBioIndex(bioIndex + 1);
    } else {
      console.error('Failed to update data');
    }
  };

  const handleRejectClick = async () => {
    const targetId = selectedUserId || bio?.user_id;
    if (!targetId) {
      console.log('Selected user id is not available yet');
      return;
    }
    const result = await DateService.sendFriendRequest({
      user_id1: auth.id,
      user_id2: targetId,
      friendship_status: 'rejected',
    });

    // 在成功更新後重新獲取資料
    if (result.success) {
      toast.success('已跳過此對象', { duration: 1500 });
      setBioIndex(bioIndex + 1);
    } else {
      console.error('Failed to update data');
    }
  };

  return (
    <>
      {isLoading ? (
        <NewFriendModuleLoader />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-6">今日新朋友</h1>
          <div>
            <div className="flex flex-col items-center justify-center">
              <img
                className="w-64 h-64 border-3 border-green-500 rounded-lg"
                src={getImageUrl(bio.avatar, 'avatar')}
                alt={`會員照片 ${bio.username}`}
                onError={(e) => handleImageError(e, 'avatar')}
              />
            </div>
            <div className="flex flex-col items-center justify-center mt-[20px]">
              <p className="mb-3 text-lg md:text-lg sm:text-base">
                {bio.username}，
                {bio.birthday
                  ? Math.floor(
                      (new Date() - new Date(bio.birthday)) /
                        (1000 * 60 * 60 * 24 * 365.25),
                    )
                  : '未知'}
              </p>
              <p className="mb-3 text-lg md:text-lg sm:text-base">
                {bio.bar_type?.bar_type_name}、{bio.movie_type?.movie_type}
              </p>
              <p className="mb-6 text-center text-lg md:text-lg sm:text-base">
                {bio.profile_content}
              </p>
            </div>
          </div>
          <SelectBtn
            onAcceptClick={handleAcceptClick} // 接受
            onRejectClick={handleRejectClick} // 拒絕
          />
        </div>
      )}
    </>
  );
}
