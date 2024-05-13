import React, { useState, useEffect, useRef } from 'react';
import PageTitle from '@/components/page-title';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import SearchBar from '@/components/date/search-bar';
import ChatMsg from '@/components/date/chat-msg';
import ChatMsgLeftContext from '@/components/date/chat-msg-left-context';
import ChatMsgRightContext from '@/components/date/chat-msg-right-context';
import SideBar from '@/components/date/side-bar';
import BlockModal from '@/components/date/modal/block-modal';
import { TiThMenu } from 'react-icons/ti';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import {
  ACCOUNT_GET,
  DATE_FRIENDSHIPS,
  DATE_FRIENDSHIPS_EDIT,
  DATE_FRIENDSHIPS_MESSAGE,
  DATE_FRIENDSHIPS_MESSAGE_NEW_MSG,
  DATE_FRIENDSHIPS_MESSAGE_NEW_IMG,
} from '@/components/config/api-path';

//DATA
// "data": [
//     {
//       "friendship_id": 1,
//       "sender_id": "Serene",
//       "sender_avatar": "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
//       "message_id": 1,
//       "content": "哈囉～你好!!!",
//       "sended_at": "15:44"
//     },]

export default function ChatRoomContext() {
  const socketPort = 3003; // SOCKET_PORT
  const pageTitle = '聊天室';
  const initialTabs = [
    { title: '找新興趣', path: '/date/select-interests', active: false },
    { title: '找新朋友', path: '/date/new-friends', active: false },
    { title: '好友列表', path: '/date/friends-list', active: false },
    { title: '聊天室', path: '/date/chat-room', active: true },
  ];

  const {
    auth,
    getAuthHeader,
    userAvatar,
    setUserAvatar,
    setRerender,
    rerender,
  } = useAuth();

  const router = useRouter();
  const { friendship_id } = router.query;

  const scrollContainerRef = useRef(null); //引用滾動器

  const [messages, setMessages] = useState([]); // 狀態：消息列表
  const [input, setInput] = useState(''); // 狀態：輸入字段的值
  const [friendName, setFriendName] = useState(''); // 儲存好友名字
  const [searchQuery, setSearchQuery] = useState(''); // 搜索狀態
  const [isTyping, setIsTyping] = useState(false);

  const socket = useRef(null);
  let roomName = router.query.friendship_id;

  // 拿到 auth.id 的頭貼
  useEffect(() => {
    if (auth.id === 0) {
      return;
    }
    const controller = new AbortController(); //建立一個新的控制器
    const getUserAvatar = async () => {
      try {
        const res = await fetch(`${ACCOUNT_GET}/${auth.id}`, {
          headers: { ...getAuthHeader() },
        });
        const result = await res.json();
        console.log('Navbar, getUserAvatar:', result);
        if (result.success) {
          const { avatar } = result.data;
          setUserAvatar(avatar);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getUserAvatar();

    //這裡return abort動作
    return () => {
      controller.abort();
    };
  }, [userAvatar, auth.id]);

  // 拿到好友名字
  useEffect(() => {
    if (!router.isReady || !friendship_id) return;

    const fetchFriendIdAndName = async () => {
      try {
        const response = await fetch(`${DATE_FRIENDSHIPS}/${friendship_id}`, {
          headers: { ...getAuthHeader() },
        });

        const result = await response.json();
        // TODO error handler
        if (!result.success) {
          return;
        }
        const { user_id1, user_id2 } = result.data;

        // 確定與當前用戶不同
        setFriendName(user_id1 === auth.username ? user_id2 : user_id1);
      } catch (error) {
        console.error('Error fetching friend information:', error);
      }
    };

    const fetchMessages = async () => {
      const url = `${DATE_FRIENDSHIPS_MESSAGE}/${friendship_id}`;
      try {
        const response = await fetch(url, { headers: { ...getAuthHeader() } });
        console.log('response', response);
        const result = await response.json();

        console.log('date', result);
        if (Array.isArray(result.data)) {
          setMessages(result.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchFriendIdAndName();
    fetchMessages();
  }, [router.isReady, router.query]);

  // 使用 socket
  useEffect(() => {
    console.log('token', auth);
    if (!auth.token || (socket.current && socket.current.connected)) return;

    console.log('header', getAuthHeader());

    // 當下無連接時，建立連結
    socket.current = io(`http://localhost:${socketPort}`, {
      auth: {
        headers: { ...getAuthHeader() },
      },
    });

    // 連結成功
    socket.current.on('connect', () => {
      console.log('Socket connected：）');
      // 在連線建立後，立即加入指定的房間
      socket.current.emit('addRoom', roomName);
      // 發送 'image' 事件，包含圖片資料
      //socket.current.emit('send_image', messageData);
      // 在socket連接成功後，將auth.id資訊傳遞給socket並設置為userId
      socket.current.userId = auth.id;
    });

    // 添加圖片接收的監聽器
    socket.current.on('send_image', (messageData) => {
      console.log('Received image data:', messageData);
      // 將圖片添加到原有的消息列表中;
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // 添加消息接收的監聽器
    socket.current.on('send_message', (message) => {
      console.log('Received message data:', message);
      // 將新的消息添加到原有的消息列表中
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const handleUserTyping = ({ isTyping }) => {
      setIsTyping(isTyping);
    };
    socket.current.on('typing', handleUserTyping);

    // 在組件卸載時，關閉socket連接
    return () => {
      if (!auth.token) return;

      // 在組件卸載時，關閉 socket 連接
      socket.current.off();
      console.log('Socket disconnected!');
    };
  }, [router.isReady]);

  // 格式化時間的函數
  const formatTime = () =>
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  /*
  // let isComposing = false;

  // 處理中文輸入開始
  const handleComposition = (e) => {
    console.log(e.type);
    if (e.type === 'compositionend') {
      isComposing = false;
    } else {
      isComposing = true;
    }

    console.log('中文輸入開始');
  };
  */

  // 使用 useEffect 將訊息滾動到最下方
  useEffect(() => {
    if (!messages) return;

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
    // scrollTop 被設置為 scrollHeight 時，容器會嘗試將內容向上滾動到最大高度，這樣會將內容最底部訊息顯示出來
  }, [messages]); // 當 messages 改變時，滾動到最下方

  // 函數：發送消息
  const sendMessage = async () => {
    // 如果輸入的消息為空時，不執行
    if (input.trim() === '') return;

    const message = {
      msg_type: 'T',
      content: input,
      sender_id: auth.username,
      sended_at: formatTime(),
      sender_avatar: userAvatar,
    };

    // 發送 'send_message' 事件到後端
    socket.current.emit('send_message', { roomName, message });
    console.log(`使用者：${auth.username}，傳送內容：${input}`);

    /// 將新消息添加到消息列表中
    // setMessages((prevMessages) => [...prevMessages, message]);

    // 清空輸入字段
    setInput('');
    setRerender(!rerender);

    // 同時將傳送訊息存到資料庫
    const url = `${DATE_FRIENDSHIPS_MESSAGE_NEW_MSG}`;
    try {
      // 發送 'send_message' 事件到後端
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          friendship_id: roomName,
          sender_id: auth.id,
          content: input,
        }),
      });

      if (response.ok === false) {
        // throw Error();
        console.error('訊息發送失敗');

        return;
      }

      console.log('訊息發送成功');
    } catch (error) {
      console.error('訊息發送出錯', error);
    }
  };

  // 封鎖好友
  const handleBlockingClick = async () => {
    console.log(friendship_id);
    // TODO try catch
    const response = await fetch(`${DATE_FRIENDSHIPS_EDIT}/${friendship_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        friendship_status: 'blocking',
      }),
    });
    if (response.ok) {
      const data = await response.json();

      toast.success('好友已封鎖！', { duration: 1500 });
      router.push('/date/friends-list');
    } else {
      console.error('Failed to update data');
    }
  };

  // 建立用於更新搜索查詢的處理
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 監控對方是否輸入中
  // useEffect(() => {
  //   const handleUserTyping = ({ isTyping }) => {
  //     setIsTyping(isTyping);
  //   };
  //   socket.current.on('typing', handleUserTyping);
  //   return () => {
  //     socket.current.off('typing', handleUserTyping);
  //   };
  // }, []);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInput(value);
    socket.current.emit('typing', { isTyping: true });
    setTimeout(() => {
      socket.current.emit('typing', { isTyping: false });
    }, 2000);
  };

  // 傳送圖片
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // 觸發隱藏的 input
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('friendship_id', roomName);
    formData.append('sender_id', auth.id);
    formData.append('content', '');
    formData.append('file', file);

    const url = `${DATE_FRIENDSHIPS_MESSAGE_NEW_IMG}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();

        const messageData = {
          msg_type: 'I',
          content: responseData.content,
          sender_id: auth.username,
          sended_at: formatTime(),
          sender_avatar: userAvatar,
        };
        console.log(messageData);

        socket.current.emit('send_image', { roomName, messageData });
        console.log(
          `使用者：${auth.username}，傳送內容：${messageData.content}`
        );

        // setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <SideBar tabs={initialTabs} />
      <div className="flex flex-col mx-4 md:flex-row md-h-[600px]  md:mx-20 mt-10 pt-20">
        {/* 左側開始 */}
        <div className="overflow-y-auto bg-[#2C2C2C] border border-gray-500 p-4 h-[600px] md:h-[800px] flex-col items-center  rounded-xl  md:w-2/5 hidden md:flex">
          <div
            className="w-full md:w-auto flex flex-col justify-start md:justify-start ml-4 mb-4"
            style={{ position: 'sticky', top: -18, zIndex: 11 }}
          >
            <div
              style={{
                backgroundColor: '#2C2C2C',
                paddingTop: '30px',
                paddingLeft: '100px',
                paddingRight: '100px',
              }}
            >
              <SearchBar onChange={handleSearchChange} className="relative" />
            </div>
          </div>
          <div className="pl-[24px] pr-[24px]">
            <ChatMsg searchQuery={searchQuery} />
          </div>
        </div>
        {/* 左側結束 */}

        {/* 右側開始 */}
        <div className="relative bg-transparent border border-gray-500 md:p-0 flex flex-col mx-auto w-full md:w-3/5 md:mx-0 rounded-xl h-[590px] md:h-[800px] md:block ">
          <div className="flex items-center justify-between bg-[#2C2C2C] p-[10px] rounded-t-xl w-full">
            <p className="text-white">{friendName}</p>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button">
                <TiThMenu className="text-white" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 items-center justify-center"
              >
                <li
                  onClick={() =>
                    document.getElementById('block_modal').showModal()
                  }
                >
                  <span>
                    封鎖
                    <BlockModal blockingClick={handleBlockingClick} />
                  </span>
                </li>
              </ul>
            </div>
          </div>
          {/* 消息框 */}
          <div
            className="flex flex-col overflow-y-auto pb-[80px]"
            ref={scrollContainerRef} //
            style={{ maxHeight: '750px', overflowY: 'auto' }}
          >
            {/* 顯示消息列表 */}
            {/* 首先要先判斷 是誰傳 */}
            {messages.map((message, index) => {
              return message.sender_id === auth.username ? (
                <ChatMsgRightContext key={index} messages={message}>
                  {message.msg_type === 'I' ? (
                    <img width={100} src={message.content} alt="Sent image" />
                  ) : null}
                </ChatMsgRightContext>
              ) : (
                <ChatMsgLeftContext key={index} messages={message}>
                  {message.msg_type === 'I' ? (
                    <img
                      width={100}
                      src={message.content}
                      alt="Received image"
                    />
                  ) : null}
                </ChatMsgLeftContext>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 w-full ">
            <p className="m-2 text-gray-500">
              {isTyping ? '對方輸入中...' : ''}
            </p>
            <div className="mt-auto px-4 py-2 bg-[#2C2C2C] rounded-b-xl flex items-center justify-between">
              <input
                className="flex-grow bg-transparent placeholder-gray-500 focus:outline-none border border-primary rounded-full px-3 py-1 h-auto"
                type="text"
                placeholder="請輸入內容..."
                value={input}
                // onCompositionStart={handleComposition}
                // onCompositionEnd={handleComposition}
                onChange={handleInputChange}
                onKeyUp={(e) => {
                  const { isComposing, key } = e;
                  console.log(e.nativeEvent.isComposing);
                  console.log({ isComposing, key });
                  !e.nativeEvent.isComposing &&
                    e.key === 'Enter' &&
                    sendMessage();
                }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }} // 隱藏 input
                onChange={handleFileChange} // 當選擇檔案時觸發
              />
              <button
                type="button"
                className="px-4 py-1 btn-primary bg-primary border border-primary rounded-full  font-semibold h-auto"
                onClick={handleButtonClick}
              >
                ＋
              </button>
              <button
                type="button"
                className="px-4 py-1 btn-primary bg-primary border border-primary rounded-full  font-semibold h-auto"
                onClick={sendMessage}
              >
                送出
              </button>
            </div>
          </div>
        </div>
        {/* 右側结束 */}
      </div>
    </>
  );
}
