import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import {
  SOCKET_SERVER,
} from '@/configs/api-config';
import { DateService } from '@/services/date-service';
import io from 'socket.io-client';
import { getImageUrl, handleImageError, formatChatTime } from '@/services/image-utils';

export default function ChatMsg({ searchQuery }) {
  // 假資料
  // const mockDataList = [
  //   {
  //     profile_picture_url:
  //       'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
  //     sender_name: 'Xina',
  //     content: 'Hello!你也喜歡去酒吧嗎？',
  //     sended_at: '16:35',
  //   },
  //   {
  //     profile_picture_url:
  //       'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
  //     sender_name: 'Xina',
  //     content: 'Hello!你也喜歡去酒吧嗎？',
  //     sended_at: '16:35',
  //   },
  // ];

  //TODO: URL 依照登入使用者變動
  const [msg, setMsg] = useState([]);
  const { auth, rerender } = useAuth();
  const socket = useRef(null);

  const getMsg = async () => {
    try {
      const result = await DateService.getMessagesBySender(auth.id);
      if (Array.isArray(result)) {
        setMsg(result);
      }
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    }
  };

  useEffect(() => {
    getMsg();
  }, [rerender]);
  // 過濾消息列表
  const filteredMsgs = msg.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [socketId, setSocketId] = useState(null);

  // 使用 socket & 監控對方是否在線
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (auth.token && !socket.current) {
      // 當下無連接時，建立連結
      const newSocket = io(SOCKET_SERVER, {
        withCredentials: true, // 核心！允許發送 Cookie
      });
      socket.current = newSocket;

      // 連結成功
      newSocket.on('connect', () => {
        newSocket.userId = auth.id;
        setSocketId(auth.id);
        newSocket.emit('get_online', { isOnline: true });
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

      newSocket.on('user_connected', handleUserConnected);
      newSocket.on('user_disconnected', handleUserDisconnected);
    }

    return () => {
      if (socket.current) {
        socket.current.off('user_connected');
        socket.current.off('user_disconnected');
        socket.current.close();
        socket.current = null;
      }
    };
  }, [auth.id, auth.token]); // 使用 auth.id 和 token 作為依賴

  return (
    <>
      {filteredMsgs.map((msg, index) => {
        const isCurrentUser = msg.sender_name === auth.username;

        const friendId = isCurrentUser ? msg.other_friend_id : msg.sender_id;
        const displayName = isCurrentUser
          ? msg.other_friend_name
          : msg.sender_name;
        const displayAvatar = isCurrentUser
          ? msg.other_friend_avatar
          : msg.avatar;

        // 判断是否在線
        const isOnline = onlineUsers.includes(friendId);
        // console.log(isOnline);

        return (
          <Link
            href={`/date/chat-room-context/${msg.friendship_id}`}
            key={index}
          >
            <div className="flex items-center mb-6">
              <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full">
                  <img 
                    src={getImageUrl(displayAvatar, 'avatar')} 
                    alt="會員照片" 
                    onError={(e) => handleImageError(e, 'avatar')}
                  />
                </div>
              </div>
              {/* <img
                className="w-12 h-12 md:w-16 md:h-16 rounded-full mr-4"
                src={displayAvatar}
                alt="會員照片"
              /> */}
              <div className="flex flex-col flex-grow p-2">
                <p className="w-[100px] text-xs md:text-base">{displayName}</p>
                <p
                  className="w-[100px] text-xs md:text-base truncate "
                  style={{ width: '15em' }}
                >
                  {msg.content}
                </p>
              </div>
              {/* <div className="mr-2 text-right md:text-right flex flex-col justify-start items-start"> */}
              <p className="text-xs md:text-xs justify-start items-start">
                {formatChatTime(msg.sended_at)}
              </p>
              {/* </div> */}
            </div>
          </Link>
        );
      })}
    </>
  );
}
