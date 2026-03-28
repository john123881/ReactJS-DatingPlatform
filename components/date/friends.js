import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import io from 'socket.io-client';
import { DateService } from '@/services/date-service';

// 接收 searchQuery 作為屬性
export default function Friends({ searchQuery }) {
  const [friend, setFriend] = useState([]);
  const { auth, getAuthHeader } = useAuth();

  const socket = useRef(null);
  // Socket connection is handled via SOCKET_SERVER from config

  useEffect(() => {
    const controller = new AbortController();
    const getFriend = async () => {
      try {
        const data = await DateService.getAcceptedFriends(auth.id);
        if (Array.isArray(data.data)) {
          setFriend(data.data);
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error('Error fetching friends list:', e);
        }
      }
    };

    if (auth.id) {
      getFriend();
    }

    return () => {
      controller.abort();
    };
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
  const [onlineUsers, setOnlineUsers] = useState([]);

  // 使用 socket & 監控對方是否在線
  useEffect(() => {
    if (!auth.id) return;

    // 當下無連接時，建立連結
    if (!socket.current) {
      socket.current = io(SOCKET_SERVER, {
        withCredentials: true, // 核心！允許發送 Cookie
      });

      socket.current.on('connect', () => {
        socket.current.userId = auth.id;
        setSocketId(auth.id);
        socket.current.emit('get_online', { isOnline: true });
      });

      const handleUserConnected = (userId) => {
        setOnlineUsers((prev) => {
          if (prev.includes(userId)) return prev;
          return [...prev, userId];
        });
      };

      const handleUserDisconnected = (userId) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      };

      socket.current.on('user_connected', handleUserConnected);
      socket.current.on('user_disconnected', handleUserDisconnected);
    }

    return () => {
      if (socket.current) {
        socket.current.off('user_connected');
        socket.current.off('user_disconnected');
        socket.current.close();
        socket.current = null;
      }
    };
  }, [auth.id]);

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
