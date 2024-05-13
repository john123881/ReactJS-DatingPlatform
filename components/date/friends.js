import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import io from 'socket.io-client';

// 接收 searchQuery 作為屬性
export default function Friends({ searchQuery }) {
  const [friend, setFriend] = useState([]);
  const { auth, getAuthHeader } = useAuth();

  const socket = useRef(null);
  const socketPort = 3003;

  const getFriend = async () => {
    try {
      const url = `http://localhost:3001/date/friends-list/accepted/${auth.id}`;
      const res = await fetch(url, { headers: { ...getAuthHeader() } });
      const data = await res.json();
      console.log(data);
      if (Array.isArray(data.data)) {
        setFriend(data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFriend();
  }, [auth.id]);

  // 根據 searchQuery 過濾朋友列表
  const filteredFriends = friend.filter((friend) => {
    const friendName =
      auth.username === friend.user_id1_name
        ? friend.user_id2_name
        : friend.user_id1_name;

    // 搜索條件
    return friendName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const [socketId, setSocketId] = useState(null);

  // 使用 socket
  useEffect(() => {
    if (!socket.current) {
      // 當下無連接時，建立連結
      socket.current = io(`http://localhost:${socketPort}`, {
        auth: {
          headers: { ...getAuthHeader() },
        },
      });

      // 連結成功
      socket.current.on('connect', () => {
        console.log('Socket connected：）');

        socket.current.userId = auth.id;
        setSocketId(auth.id);
        socket.current.emit('get_online', { isOnline: true });
        console.log(auth.id);
      });
    }
  }, [socketPort]);

  // 監控對方是否在線
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const handleUserConnected = (userId) => {
      setOnlineUsers((prev) => [...prev, userId]); // 增加上線用戶
    };

    const handleUserDisconnected = (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId)); // 移除下線用戶
    };

    socket.current.on('user_connected', handleUserConnected);
    socket.current.on('user_disconnected', handleUserDisconnected);

    return () => {
      socket.current.off('user_connected', handleUserConnected);
      socket.current.off('user_disconnected', handleUserDisconnected);
    };
  }, []);

  return (
    <>
      {filteredFriends.map((friend, index) => {
        const friendId =
          auth.username === friend.user_id1_name
            ? friend.user_id2
            : friend.user_id1;

        const friendName =
          auth.username === friend.user_id1_name
            ? friend.user_id2_name
            : friend.user_id1_name;

        const friendAvatar =
          auth.username === friend.user_id1_name
            ? friend.user_id2_avatar
            : friend.user_id1_avatar;

        // 判断是否在線
        const isOnline = onlineUsers.includes(friendId);
        console.log(isOnline);

        return (
          <Link
            href={`/date/chat-room-context/${friend.friendship_id}`}
            key={index}
          >
            <div className="flex justify-start items-center md:mt-4 w-400 md:w-full gap-6 mb-4 mt-2">
              <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full">
                  <img src={friendAvatar} alt="會員照片" />
                </div>
              </div>
              <p className="w-[100px] flex justify-start items-start">
                {friendName}
              </p>
            </div>
          </Link>
        );
      })}
    </>
  );
}

////
// 假資料
// const mockDataList = [
//   {
//     avatar:
//       'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
//     username: 'Xina',
//   },
//   {
//     avatar:
//       'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
//     username: 'John',
//   },
//   // 可以添加更多朋友資料
// ];
