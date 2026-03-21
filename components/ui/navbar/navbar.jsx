import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBell, FaBookmark, FaCircle } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import {
  BsGlobe2,
  BsChatSquareHeart,
  BsTicketPerforated,
} from 'react-icons/bs';
import { BiSolidDrink } from 'react-icons/bi';
import { FiCalendar } from 'react-icons/fi';
import { Logo } from './logo';
import CollectList from '@/components/account-center/collect-list/collect-list';
import { useAuth } from '@/context/auth-context';
import { useCollect } from '@/context/use-collect';
import { usePostContext } from '@/context/post-context';
import PostModal from '@/components/community/modal/postModal';
import MovieModal from '@/components/account-center/modal/movieModal';

import {
  API_SERVER,
  ACCOUNT_GET,
  ACCOUNT_COLLECT_LIST_GET,
} from '@/configs/api-config';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Header({ currentPageTitle, handlePageChange }) {
  // const fakeData = [
  //   {
  //     title: '小王',
  //     subtitle: '5',
  //     img: 'http://119.14.42.80:3001/avatar/defaultAvatar.jpg',
  //     img_name: 'post_img',
  //     content:
  //       '第一次去那家話題酒吧，結果完全超出預期！服務和氛圍一流！🥂👏 #酒吧體驗 #夜生活好去處 #酒吧',
  //     item_type: 'post',
  //     saved_id: 7,
  //   },
  //   {
  //     title: 'Circle Bar圈圈吧',
  //     subtitle: '台北市文山區羅斯福路五段31-1號',
  //     img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMrtW_x0iQ2FKNC7Qy1ei2Xorjd_rO3n05NhZP3hGc7Q&s',
  //     img_name: 'bar_img',
  //     content:
  //       '環境比較偏向美式酒吧，調酒師以及客人也都相當的熱情，還有飛鏢可以打，價格也是相對親民，整體來說是師大...',
  //     item_type: 'bar',
  //     saved_id: 85,
  //   },
  //   {
  //     title: '當男人戀愛時',
  //     subtitle: '愛情',
  //     img: 'https://i.loli.net/2021/08/20/98yclsjuTLR5n1q.jpg',
  //     img_name: 'movie_img',
  //     content: '一個臭直男的愛情故事，探討男人在戀愛中的痛苦和幸福。',
  //     item_type: 'movie',
  //     saved_id: 10,
  //   },
  // ];
  // console.log('NAVBAR currentPageTitle:', currentPageTitle);
  const router = useRouter();
  const {
    posts,
    postModalToggle,
    // setPostModalToggle,
    // checkPostsStatus,
    // getPostComments,
  } = usePostContext();
  const {
    auth,
    logout,
    setLoginModalToggle,
    userAvatar,
    setUserAvatar,
    getAuthHeader,
    rerender,
    // setRerender,
  } = useAuth();

  const {
    p,
    modalId,
    bars,
    movies,
    movieV,
    // setMovieV,
    movieModalToggle,
    // setMovieModalToggle,
    dropDownCollectOpen,
    setDropDownCollectOpen,
  } = useCollect();
  // const [movieV, setMovieV] = useState({});

  const [listData, setListData] = useState([
    {
      title: 'unknownTitle',
      subtitle: 'unknown',
      img: '/unavailable-image.jpg',
      img_name: 'No Image Available',
      content: 'Null',
      item_type: 'post',
      saved_id: 0,
      email: 'unknown@mail.com',
      item_id: 0,
      username: 'unknownUser',
    },
  ]);

  const [dropDownOpen, setDropDownOpen] = useState(false);

  const { socket, userInfo } = usePostContext();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // const [dropDownCollectOpen, setDropDownCollectOpen] = useState(false);
  const [showContent, setShowContent] = useState(
    Array(Array(10).fill.length).fill(false),
  );

  // //返回與 page 變量相對應的中文名稱
  function getPageChineseName(currentPageTitle) {
    switch (currentPageTitle) {
      case '配對交友':
        return 0;
      case '社群媒體':
        return 1;
      case '行程規劃':
        return 2;
      case '酒吧探索':
        return 3;
      case '電影探索':
        return 4;
      default:
        return -1; // 如果找不到匹配，返回原始值
    }
  }

  //詳細箭頭動畫
  const [titleHovered, setTitleHovered] = useState(Array(5).fill(false));
  const handleTitleEnter = (title, isHovered) => {
    const currentPageIndex = getPageChineseName(title);
    const newTitleHovered = titleHovered.map((v, i) =>
      i === currentPageIndex ? isHovered : false,
    );
    setTitleHovered(newTitleHovered);
  };
  const handleTitleLeave = (title, f) => {
    const currentPageIndex = getPageChineseName(title);
    const newTitleHovered = titleHovered.map((v, i) =>
      i === currentPageIndex ? f : v,
    );
    setTitleHovered(newTitleHovered);
  };

  const getNotifications = async () => {
    const response = await fetch(
      `${API_SERVER}/community/get-noti/${userInfo.user_id}`,
    );
    const data = await response.json();
    setNotifications(data.noti);
    setUnreadCount(data.noti.filter((noti) => !noti.isRead).length);
  };

  const markNotiAsRead = async (notiId) => {
    const userId = userInfo.user_id;
    try {
      const response = await fetch(
        `${API_SERVER}/community/mark-noti-as-read/${notiId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        },
      );
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.comm_noti_id === notiId ? { ...noti, isRead: true } : noti,
          ),
        );
        // 更新未讀計數
        setUnreadCount((prevCount) => prevCount - 1);
      } else {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const displayNotification = ({
    notiId,
    senderName,
    type,
    postId,
    senderId,
    avatar,
    isRead,
    key,
  }) => {
    let message;
    let url;

    switch (type) {
      case 'like':
        message = `${senderName}  喜愛你的貼文`;
        url = `/community/post/${postId}`;
        break;
      case 'comment':
        message = `${senderName}  回覆你的貼文`;
        url = `/community/post/${postId}`;
        break;
      case 'follow':
        message = `${senderName}  開始追蹤你`;
        url = `/community/profile/${senderId}`;
        break;
      default:
        message = '你有一則新通知';
        url = '#'; // 設置為默認或錯誤處理的 URL
    }

    return (
      <li
        key={key}
        className="relative flex flex-row items-center notification hover:text-primary"
        onClick={() => {
          markNotiAsRead(notiId);
          if (!isRead) {
            document
              .getElementById(`ReadIcon-${notiId}`)
              .classList.add('hidden');
          }
        }}
      >
        <div>
          <img
            className="rounded-full"
            width={24}
            height={24}
            src={avatar || '/unknown-user-image.jpg'}
            alt="使用者頭像"
          />
        </div>
        <Link href={url}>{message}</Link>
        {!isRead && (
          <FaCircle
            id={`ReadIcon-${notiId}`}
            className="absolute right-0 bg-primary hover:bg-primary"
          />
        )}
      </li>
    );
  };

  useEffect(() => {
    if (userInfo.user_id) {
      getNotifications();
    }
  }, [userInfo.user_id]);

  // 監聽從 PostCard 發送的通知
  useEffect(() => {
    if (socket) {
      socket.on('getNotification', (data) => {
        setNotifications((prev) => [data, ...prev]); // 更新通知列表
        setUnreadCount((prevCount) => prevCount + 1); // 增加未讀計數
        toast('收到新通知', {
          style: {
            background: '#A0FF1F',
            color: '#000',
          },
        });
      });

      return () => socket.off('getNotification'); // 清理監聽器
    }
  }, [socket]);

  //取大頭照
  useEffect(() => {
    if (auth.id === 0) {
      return;
    }
    const controller = new AbortController(); //建立一個新的控制器
    // const signal = controller.signal; //取得訊號 塞到fetch後面
    const getUserAvatar = async () => {
      try {
        const res = await fetch(`${ACCOUNT_GET}/${auth.id}`, {
          headers: { ...getAuthHeader() },
        });
        const result = await res.json();
        // console.log('Navbar, getUserAvatar:', result);
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

  //COLLECT LIST : map迴圈 做 accordion 的處理
  const handleContentHover = (index, isHovered) => {
    const newShowContent = Array(10).fill(false);
    newShowContent[index] = isHovered;
    setShowContent(newShowContent);
  };

  //取收藏列表的資料
  useEffect(() => {
    if (auth.id === 0) {
      return;
    }

    const controller = new AbortController(); //建立一個新的控制器
    // const signal = controller.signal; //取得訊號 塞到fetch後面
    const fetchAllCollectList = async () => {
      try {
        const r = await fetch(`${ACCOUNT_COLLECT_LIST_GET}/${auth.id}`, {
          headers: { ...getAuthHeader() },
        });
        const result = await r.json();
        // 增加更嚴格的檢查以防止 TypeError
        if (result && result.output) {
          if (result.output.error === '無收藏') {
            setListData([]); // 設置為空列表
          } else if (Array.isArray(result.output.data)) {
            setListData(result.output.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch NAVBAR COLLECT LIST:', error);
      }
    };
    fetchAllCollectList();
    //這裡return abort動作
    return () => {
      controller.abort();
    };
  }, [auth.id, posts, bars, movies, rerender]);

  //點擊COLLECT LIST視窗外的區域會觸發DropDown的變化為false，關閉COLLECT LIST視窗
  useEffect(() => {
    const listener = (e) => {
      // console.log(e.target, e.target.closest('.collect_list'));
      if (
        !e.target.closest('.collect_list') &&
        !e.target.closest('.open_collect_list')
      ) {
        setDropDownCollectOpen(false);
      }
    };
    window.addEventListener('click', listener);

    return () => {
      window.removeEventListener('click', listener);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 z-[60] w-full h-16 navbar bg-dark ;">
        {/* NAVBAR 左側區域 - LOGO */}
        <div className="ml-3 navbar-start">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* NAVBAR 中間區域 */}
        <div className="hidden navbar-center md:flex">
          <ul className="px-0 menu menu-horizontal">
            {[
              {
                title: '配對交友',
                href: '/date',
              },
              {
                title: '社群媒體',
                href: '/community',
              },
              {
                title: '行程規劃',
                href: '/trip',
              },
              {
                title: '酒吧探索',
                href: '/bar',
              },
              {
                title: '電影探索',
                href: '/booking',
              },
            ].map((page, index) => (
              <li key={index}>
                <Link
                  onMouseEnter={() => {
                    handleTitleEnter(page.title, true);
                    // console.log('ENTER 發生時 titleHovered:', titleHovered);
                  }}
                  onMouseLeave={() => handleTitleLeave(page.title, false)}
                  href={`${page.href}`}
                  className={`sm:text-sm text-light focus:text-neongreen hover:shadow-xl3 hover:animate-pulse sm:px-1 md:px-4 lg:px-8 ${
                    currentPageTitle === page.title ? ' text-primary' : ''
                    // titleHovered[index] ? ' text-primary' : ''
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* NAVBAR 右側區域 */}
        <div className="navbar-end">
          {/* NAVBAR 右側 - 通知中心(未登入)*/}
          <div
            className={`dropdown dropdown-bottom dropdown-end ${
              auth.id ? 'hidden ' : ' block'
            } `}
          >
            <button
              onClick={() => {
                setLoginModalToggle(true);
              }}
              className="text-2xl btn-ghost btn-circle btn text-light hover:shadow-xl3 hover:animate-pulse "
            >
              <FaBell />
            </button>
          </div>
          {/* NAVBAR 右側 - 通知中心 */}
          <div
            className={`dropdown dropdown-bottom dropdown-end ${
              auth.id ? ' block' : ' hidden'
            } `}
          >
            <button className="text-2xl btn-ghost btn-circle btn text-light hover:shadow-xl3 hover:animate-pulse ">
              <FaBell />
              {unreadCount > 0 && (
                <span className="absolute top-0 text-black rounded-full badge badge-sm bg-primary left-7">
                  {unreadCount}
                </span>
              )}
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content z-[60] menu p-2 shadow bg-base-100 rounded-box w-72 h-3/4 text-h6"
              // fixed dropdown menu to top right
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                position: 'fixed',
                right: '30px',
                top: '70px',
              }}
            >
              {/* 最多呈現 10 筆資料 */}
              {notifications
                ?.slice(0, 10)
                .map((noti, index) =>
                  displayNotification({ ...noti, key: index }),
                )}
            </ul>
          </div>

          {/* NAVBAR 右側 - 收藏列表(未登入) */}
          <div
            className={`dropdown dropdown-bottom dropdown-end  ${
              auth.id ? 'hidden ' : ' block'
            }`}
          >
            <button
              onClick={() => {
                setLoginModalToggle(true);
              }}
              className="text-2xl btn-ghost btn-circle text-light btn hover:shadow-xl3 hover:animate-pulse"
            >
              <FaBookmark />
            </button>
          </div>
          {/* NAVBAR 右側 - 收藏列表 */}
          <div
            className={`dropdown dropdown-bottom dropdown-end  ${
              auth.id ? ' block' : ' hidden'
            }`}
          >
            <button
              type="button"
              onClick={() => setDropDownCollectOpen(!dropDownCollectOpen)}
              className=" btn-ghost btn-circle btn hover:shadow-xl3 text-light hover:animate-pulse open_collect_list"
            >
              <FaBookmark className="flex justify-center text-2xl align-middle " />
            </button>

            <div
              tabIndex={0}
              className={`${
                dropDownCollectOpen ? 'block' : 'hidden'
              }  overflow-y-auto z-[0] menu pb-2 pt-0 shadow bg-dark  w-[330px] h-[400px] text-h6 px-1 border rounded-3xl border-grayBorder collect_list`}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                position: 'fixed',
                right: '30px',
                top: '70px',
              }}
            >
              <div className="sticky top-0 h-[52px] z-20 flex items-center justify-between  bg-dark ">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white ms-4">
                  個人收藏
                </h5>

                <Link
                  href={`/account/collect/post/${auth.id}`}
                  onClick={() => setDropDownCollectOpen(false)}
                  className="text-sm font-medium me-2 text-slate-700 hover:text-neongreen"
                >
                  看更多...
                </Link>
              </div>
              <ul className={`flow-root divide-y divide-gray-700 `}>
                {listData.map((data, i) => (
                  <CollectList
                    key={i}
                    i={i}
                    handleContentHover={handleContentHover}
                    data={data}
                    showContent={showContent}
                    setDropDownCollectOpen={setDropDownCollectOpen}
                  />
                ))}
              </ul>
            </div>
            <PostModal
              className={`z-[100]`}
              post={p}
              modalId={modalId}
              isOpen={postModalToggle === modalId}
            />
            <MovieModal
              className={`z-[100]`}
              movie={movieV}
              modalId={modalId}
              isOpen={movieModalToggle === modalId}
            />
          </div>

          {/* NAVBAR 右側 - 會員中心(未登入) */}
          <div
            className={`dropdown dropdown-end ${
              auth.id ? 'hidden ' : ' block'
            }`}
          >
            <div
              onClick={() => {
                setLoginModalToggle(true);
              }}
              tabIndex={0}
              role="button"
              className="text-3xl btn btn-ghost btn-circle avatar text-light hover:shadow-xl3 hover:animate-pulse "
            >
              <MdAccountCircle />
            </div>
          </div>
          {/* NAVBAR 右側 - 會員中心 */}
          <div
            className={`dropdown dropdown-end ${
              auth.id ? ' block' : ' hidden'
            }`}
          >
            <div
              onClick={() => setDropDownOpen(!dropDownOpen)}
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:shadow-xl3 hover:animate-pulse"
            >
              <div className="w-6 rounded-full ">
                <img
                  width={24}
                  height={24}
                  alt="Tailwind CSS Navbar component"
                  src={userAvatar ? userAvatar : `/unknown-user-image.jpg`}
                />
              </div>
            </div>
            {dropDownOpen && (
              <ul
                tabIndex={0}
                className="menu ease-in duration-300 menu-sm dropdown-content border-1 mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="hover:text-neongreen">
                  <Link
                    onClick={() => setDropDownOpen(false)}
                    href={`/account/index/${auth.id}`}
                  >
                    會員中心
                  </Link>
                </li>
                <li className="hover:text-neongreen">
                  <Link
                    onClick={() => setDropDownOpen(false)}
                    href={`/account/play-game/${auth.id}`}
                  >
                    玩遊戲
                  </Link>
                </li>
                <li className="hover:text-neongreen">
                  <Link
                    onClick={async (e) => {
                      e.preventDefault();
                      setDropDownOpen(false);
                      toast.success('已登出', { duration: 1500 });
                      logout();
                      router.push('/');
                    }}
                    href="/"
                  >
                    登出
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* NAVBAR 中間底下區域 for mobile */}
      <div className="z-50 h-20 bg-dark btm-nav btm-nav-sm md:hidden">
        {[
          {
            title: '配對交友',
            icon: <BsChatSquareHeart className="text-h5" />,
            href: '/date',
          },
          {
            title: '社群媒體',
            icon: <BsGlobe2 className="text-h5" />,
            href: '/community',
          },
          {
            title: '行程規劃',
            icon: <FiCalendar className="text-h5" />,
            href: '/trip',
          },
          {
            title: '酒吧探索',
            icon: <BiSolidDrink className="text-h5" />,
            href: '/bar',
          },
          {
            title: '電影探索',
            icon: <BsTicketPerforated className="text-h5" />,
            href: '/booking',
          },
        ].map((button, index) => (
          <button
            key={index}
            className={` cursor-auto ${
              currentPageTitle === button.title ? 'active text-primary' : ''
            }`}
          >
            <Link
              className={`text-xs ${
                currentPageTitle === button.title
                  ? 'text-primary'
                  : 'text-light'
              } sm:px-0.5 lg:px-8 flex flex-col items-center hover:text-primary hover:active:text-primary`}
              href={button.href}
            >
              {button.icon}
              <span className="text-[9px] ">{button.title}</span>
            </Link>
          </button>
        ))}
      </div>
    </>
  );
}
