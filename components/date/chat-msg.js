import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { DATE_FRIENDSHIPS_MESSAGE_SENDER } from '../config/api-path';
import io from 'socket.io-client';

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

  //TODO: `http://localhost:3001/date/friendships_message/sender_id/${userid1}`，依照登入使用者變動
  const [msg, setMsg] = useState([]);
  const { auth, getAuthHeader, rerender } = useAuth();
  const socket = useRef(null);
  const socketPort = 3003;

  const getMsg = async () => {
    const url = `${DATE_FRIENDSHIPS_MESSAGE_SENDER}/${auth.id}`;
    try {
      const res = await fetch(url, { headers: { ...getAuthHeader() } });
      console.log('res', res);
      const data = await res.json();
      console.log('date', data);

      if (Array.isArray(data.data)) {
        setMsg(data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getMsg();
  }, [rerender]);
  // 過濾消息列表
  const filteredMsgs = msg.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      console.log(userId);
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
  }, [socket.current]);

  return (
    <>
      {filteredMsgs.map((msg, index) => {
        const isCurrentUser = msg.sender_name === auth.username;

        const friendId = isCurrentUser ? msg.other_friend_id : msg.sender_id;
        console.log(friendId);
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
                  <img src={displayAvatar} alt="會員照片" />
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
                {msg.sended_at}
              </p>
              {/* </div> */}
            </div>
          </Link>
        );
      })}
    </>
  );
}
