import { useEffect, useState, useRef } from 'react';
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
import MovieModal from '@/components/ui/modal/account/movieModal';
import { getImageUrl } from '@/services/image-utils';


import {
  API_SERVER,
} from '@/configs/api-config';
import { CommunityService } from '@/services/community-service';
import { AccountService } from '@/services/account-service';
import { useRouter } from 'next/router';
import { toast as customToast } from '@/lib/toast';

export default function Header({ currentPageTitle, handlePageChange }) {
  // const fakeData = [
  //   {
  //     title: '小王',
  //     subtitle: '5',
  //     img: `${API_SERVER}/avatar/defaultAvatar.jpg`,
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
    isAuthLoaded,
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
    refreshTrigger,
  } = useCollect();
  // const [movieV, setMovieV] = useState({});

  const [listData, setListData] = useState([]);

  const [dropDownOpen, setDropDownOpen] = useState(false);

  const { userInfo } = usePostContext();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const imgRef = useRef(null);

  // const [dropDownCollectOpen, setDropDownCollectOpen] = useState(false);
  const [showContent, setShowContent] = useState(
    Array(Array(10).fill.length).fill(false),
  );

  // //返回與 page 變量相對應的中文名稱
  function getPageChineseName(currentPageTitle) {
    switch (currentPageTitle) {
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
    try {
      const data = await CommunityService.getNotifications(userInfo.user_id);
      setNotifications(data.noti);
      setUnreadCount(data.noti.filter((noti) => !noti.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markNotiAsRead = async (notiId) => {
    const userId = userInfo.user_id;
    try {
      const result = await CommunityService.markNotiAsRead(notiId, userId);
      if (result.success) {
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.comm_noti_id === notiId ? { ...noti, isRead: true } : noti,
          ),
        );
        // 更新未讀計數
        setUnreadCount((prevCount) => prevCount - 1);
      } else {
        throw new Error(result.message || 'Failed to mark notification as read');
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
            src={getImageUrl(avatar, 'avatar')}
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


  //取大頭照
  useEffect(() => {
    if (auth.id === 0) {
      return;
    }
    const controller = new AbortController(); //建立一個新的控制器
    // const signal = controller.signal; //取得訊號 塞到fetch後面
    const getUserAvatar = async () => {
      setIsFetchingProfile(true);
      try {
        const result = await AccountService.getProfile(auth.id);
        if (result.success) {
          const { avatar } = result.data;
          setUserAvatar(avatar);
        }
      } catch (e) {
        // Error handled silently or could be console.error if needed
      } finally {
        setIsFetchingProfile(false);
      }
    };
    getUserAvatar();
    setImageLoaded(false); 
    
    // 如果圖片已經在緩存中並加載完成，手動觸發狀態更新
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }

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
        const result = await AccountService.getCollectList(auth.id);
        const fetchedData = result?.output?.data || result?.data || result?.rows || (Array.isArray(result) ? result : null);
        
        if (result?.output?.error === '無收藏' || !fetchedData || fetchedData.length === 0) {
          setListData([]); // 設置為空列表
          return;
        } else {
          setListData(fetchedData);
        }
      } catch (error) {
        console.error('Failed to fetch NAVBAR COLLECT LIST:', error);
        // setIsLoading(false); // 確保即使出錯也要結束加載
      }
    };
    fetchAllCollectList();
    //這裡return abort動作
    return () => {
      controller.abort();
    };
  }, [auth.id, posts, bars, movies, rerender, refreshTrigger]);

  //點擊COLLECT LIST視窗外的區域會觸發DropDown的變化為false，關閉COLLECT LIST視窗
  useEffect(() => {
    const listener = (e) => {
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
                title: '社群媒體',
                href: '/community',
                isProtected: false,
              },
              {
                title: '行程規劃',
                href: '/trip',
                isProtected: true,
              },
              {
                title: '酒吧探索',
                href: '/bar',
                isProtected: false,
              },
              {
                title: '電影探索',
                href: '/booking',
                isProtected: false,
              },
            ].map((page, index) => (
              <li key={index}>
                <Link
                  onMouseEnter={() => {
                    handleTitleEnter(page.title, true);
                  }}
                  onMouseLeave={() => handleTitleLeave(page.title, false)}
                  onClick={(e) => {
                    if (page.isProtected && auth.id === 0) {
                      e.preventDefault();
                      setLoginModalToggle(true);
                    }
                  }}
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
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                {( !isAuthLoaded || isFetchingProfile || !imageLoaded) && (
                  <span className="loading loading-spinner loading-sm text-primary"></span>
                )}
                <img
                  ref={imgRef}
                  width={24}
                  height={24}
                  alt="User Avatar"
                  src={getImageUrl(userAvatar, 'avatar')}
                  className={`rounded-full ${
                    !isAuthLoaded || isFetchingProfile || !imageLoaded ? 'hidden' : 'block'
                  }`}
                  onLoad={() => setImageLoaded(true)}
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
                      setDropDownOpen(false);
                      customToast.success('已登出');
                      logout();
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
            title: '社群媒體',
            icon: <BsGlobe2 className="text-h5" />,
            href: '/community',
            isProtected: false,
          },
          {
            title: '行程規劃',
            icon: <FiCalendar className="text-h5" />,
            href: '/trip',
            isProtected: true,
          },
          {
            title: '酒吧探索',
            icon: <BiSolidDrink className="text-h5" />,
            href: '/bar',
            isProtected: false,
          },
          {
            title: '電影探索',
            icon: <BsTicketPerforated className="text-h5" />,
            href: '/booking',
            isProtected: false,
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
              onClick={(e) => {
                if (button.isProtected && auth.id === 0) {
                  e.preventDefault();
                  setLoginModalToggle(true);
                }
              }}
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
