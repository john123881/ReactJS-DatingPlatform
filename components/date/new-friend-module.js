import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import SelectBtn from '@/components/date/select-btn';
import { DATE_GET_FRIENDS_LIST } from '../config/api-path';
import toast from 'react-hot-toast';
import { useDate } from '@/context/date-context';
import Link from 'next/link';
import { useLoader } from '@/context/use-loader';
import NewFriendModuleLoader from './loader/new-friend-module-loader';
import { ACCOUNT_GET } from '../config/api-path';

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

  // 獲取用戶的 Bar 和 Movie 類型 ID
  useEffect(() => {
    const fetchUserPreferences = async () => {
      open();
      try {
        const res = await fetch(`${ACCOUNT_GET}/${auth.id}`, {
          headers: { ...getAuthHeader() },
        });
        const data = await res.json();

        if (data.success) {
          setSelectedBarTypeId(data.data.bar_type_id);
          setSelectedMovieTypeId(data.data.movie_type_id);
          // console.log(selectedBarTypeId);
          // console.log(selectedMovieTypeId);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
      close();
    };

    fetchUserPreferences();
  }, [auth.id, getAuthHeader]);

  useEffect(() => {
    const userId = auth.id;

    const getBio = async () => {
      open(); // 開啟 loader
      try {
        const res = await fetch(
          `${DATE_GET_FRIENDS_LIST}/${userId}/${selectedBarTypeId}/${selectedMovieTypeId}`,
          { headers: { ...getAuthHeader() } }
        );
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setBio(data.data[0]);
          setBios(data.data);
          setSelectedUserId(data.data[0].user_id);
        } else {
          console.log(data.msg);
        }
      } catch (error) {
        console.error(error);
      }
      close(1); // 關閉 loader
    };

    getBio();
  }, [selectedBarTypeId, selectedMovieTypeId, auth.id, getAuthHeader]);

  useEffect(() => {
    if (bioIndex < bios.length) {
      setSelectedUserId(bios[bioIndex].user_id);
      setBio(bios[bioIndex]);
    }
  }, [bioIndex]);

  useEffect(() => {
    if (bioIndex < bios.length) {
      setSelectedUserId(bios[bioIndex].user_id);
      setBio(bios[bioIndex]);
    } else {
      setBio(null); // 沒有資料
    }
  }, [bioIndex]);

  if (!bio) {
    return (
      <>
        {isLoading ? (
          <NewFriendModuleLoader />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 gap-10">
            {/* <h1 className="text-3xl font-bold mb-6">今日新朋友</h1> */}
            <p className="text-lg md:text-lg sm:text-base">
              好可惜，暫時無共同興趣的朋友！
            </p>
            <button className="text-black border-2 rounded-full btn-primary bg-primary border-primary hover:shadow-xl3 w-40 py-1 mx-2 md:w-60 md:py-2 ">
              <Link href="/date/select-interests" onClick={handleClearToggle}>
                重新選擇興趣
              </Link>
            </button>
          </div>
        )}
      </>
    );
  }

  const handleAcceptClick = async () => {
    if (!selectedUserId) {
      console.log('Selected user id is not available yet');
      return;
    }
    const response = await fetch(`${DATE_GET_FRIENDS_LIST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        user_id1: auth.id,
        user_id2: selectedUserId,
        friendship_status: 'accepted',
      }),
    });
    // 在成功更新後重新獲取資料
    if (response.ok) {
      const data = await response.json();
      //if (data.success && data.data.length > 0) {
      // setBio(data.data[0]);
      toast.success('好友已送出！', { duration: 1500 });
      setBioIndex(bioIndex + 1);

      // setSelectedUserId(data.data[0].user_id);
      //} else {
      //console.log(data.msg);
      // }
    } else {
      console.error('Failed to update data');
    }
  };

  const handleRejectClick = async () => {
    if (!selectedUserId) {
      console.log('Selected user id is not available yet');
      return;
    }
    const response = await fetch(`${DATE_GET_FRIENDS_LIST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        user_id1: auth.id,
        user_id2: selectedUserId,
        friendship_status: 'rejected',
      }),
    });
    // 在成功更新後重新獲取資料
    if (response.ok) {
      const data = await response.json();
      //if (data.success && data.data.length > 0) {
      // setBio(data.data[0]);
      toast.success('好友已拒絕！', { duration: 1500 });
      setBioIndex(bioIndex + 1);

      // setSelectedUserId(data.data[0].user_id);
      //} else {
      //console.log(data.msg);
      // }
    } else {
      console.error('Failed to update data');
    }
  };

  if (!bio) {
    return null;
  }

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
                src={bio.avatar}
                alt={`會員照片 ${bio.username}`}
              />
            </div>
            <div className="flex flex-col items-center justify-center mt-[20px]">
              <p className="mb-3 text-lg md:text-lg sm:text-base">{`${bio.username}，${bio.age}`}</p>
              <p className="mb-3 text-lg md:text-lg sm:text-base">
                {bio.bar_type_name}、{bio.movie_type}
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
