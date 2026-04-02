import {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '@/configs/api-config';
import { CommunityService } from '@/services/community-service';
import { toast as customToast } from '@/lib/toast';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { auth, getAuthHeader, rerender, setRerender } = useAuth();

  const [posts, setPosts] = useState([]);
  const [profilePosts, setProfilePosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postPage, setPostPage] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [eventPageCard, setEventPageCard] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [randomPosts, setRandomPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [postCreated, setPostCreated] = useState(false); // 標示貼文是否已創建
  const [postId, setPostId] = useState(''); // 儲存創立貼文後的 post id

  const [selectedFile, setSelectedFile] = useState(null); // 選中的檔案
  const [previewUrl, setPreviewUrl] = useState(''); // 預覽圖片(呼叫URL.createObjectURL得到的網址)

  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [events, setEvents] = useState([]);
  const [minDate, setMinDate] = useState(''); // 建立event 當下時間紀錄
  const [minEndDate, setMinEndDate] = useState(minDate); // 活動結束日期必須大於等於開始日期
  const [eventCreated, setEventCreated] = useState(false); // 標示活動是否已創建
  const [eventId, setEventId] = useState(''); // 儲存創立貼文後的 event id
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    status: 'upcoming',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const [indexHasMore, setIndexHasMore] = useState(true);
  const [indexFilteredHasMore, setIndexFilteredHasMore] = useState(true);
  const [exploreHasMore, setExploreHasMore] = useState(true);
  const [profileHasMore, setProfileHasMore] = useState(true);
  const [userProfileHasMore, setUserProfileHasMore] = useState(true);
  const [eventHasMore, setEventHasMore] = useState(true);
  const [commentHasMore, setCommentHasMore] = useState(true);

  const [page, setPage] = useState(1);
  const [profilePage, setProfilePage] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [randomPage, setRandomPage] = useState(1);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});

  const [attendedEvents, setAttendedEvents] = useState({});
  const [following, setFollowing] = useState({});
  const [postModalToggle, setPostModalToggle] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isHoverActive, setIsHoverActive] = useState(true);
  const [activeFilterButton, setActiveFilterButton] = useState('');
  const [reload, setReload] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const fileInputRef = useRef(null);
  const createModalRef = useRef(null);
  const createModalMobileRef = useRef(null);
  const createEventModalRef = useRef(null);
  const createEventModalMobileRef = useRef(null);
  const searchModalRef = useRef(null);
  const searchModalMobileRef = useRef(null);
  const followerModalRef = useRef(null);
  const followingModalRef = useRef(null);

  const interactingItems = useRef(new Set());

  const router = useRouter();
  const { uid } = router.query;

  const [userInfo, setUserInfo] = useState({});

  const getUserDetail = useCallback(async () => {
    if (!auth.id) return;

    try {
      const data = await CommunityService.getUserInfo(auth.id);
      // 確保即使 data[0] 為 undefined，也能安全地設置一個空對象
      setUserInfo(data[0] || {});
    } catch (error) {
      console.error('Failed to fetch user info', error);
      setUserInfo({}); // 當請求失敗時，也設置一個空對象
    }
  }, [auth.id]);

  const getPostComments = useCallback(async (postIds) => {
    if (!postIds || postIds === '0' || postIds === 0) return;
    try {
      const data = await CommunityService.getComments(postIds);

      // 將評論數據按 post_id 分類
      const commentsByPostId = data.reduce((accumulator, comment) => {
        // 從每個評論中解構出 post_id
        const { post_id } = comment;
        // 如果累積器（accumulator）中尚未有這個 post_id 的鍵，則初始化為空陣列, 以確保後面可以將評論推送到這個陣列中
        if (!accumulator[post_id]) {
          accumulator[post_id] = [];
        }
        // 將當前的評論對象推送到對應 post_id 的陣列中
        accumulator[post_id].push(comment);
        // 返回更新後的累積器物件，供 reduce 函數的下一次迭代使用
        return accumulator;
      }, {}); // 初始值為一個空物件，這是 reduce 函數建立物件累積的起點

      // 更新評論狀態，結合新載入的評論數據
      setComments((prevComments) => {
        // 創建一個新的物件來存放更新後的評論數據，這個物件是基於先前的評論狀態（prevComments）的副本
        const updatedComments = { ...prevComments };

        // 遍歷每個postId對應的新評論列表
        for (const postId in commentsByPostId) {
          // 直接用新載入的評論數據替換掉原有的評論數據
          updatedComments[postId] = commentsByPostId[postId];
        }

        // 返回更新後的評論物件，這個操作將觸發React的狀態更新，導致相關組件根據新的評論數據重新渲染
        return updatedComments;
      });

      if (data.length === 0) {
        setCommentHasMore(false); // 如果返回的數據少於預期，設置hasMore為false
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  }, []);

  const checkPostsStatus = useCallback(
    async (postIds) => {
      const userId = auth.id;

      if (userId === 0 || !postIds || postIds === '0' || postIds === 0) {
        return;
      }

      try {
        const data = await CommunityService.checkPostStatus(userId, postIds);

        // 使用函式式更新來避免對 likedPosts 和 savedPosts 的依賴
        setLikedPosts((prevLiked) => {
          const newLiked = { ...prevLiked };
          data.forEach((status) => {
            newLiked[status.postId] = status.isLiked;
          });
          return newLiked;
        });

        setSavedPosts((prevSaved) => {
          const newSaved = { ...prevSaved };
          data.forEach((status) => {
            newSaved[status.postId] = status.isSaved;
          });
          return newSaved;
        });
      } catch (error) {
        console.error('無法獲取貼文狀態:', error);
      }
    },
    [auth.id],
  );

  const checkEventsStatus = useCallback(
    async (eventIds) => {
      const userId = auth.id;

      if (userId === 0) {
        return;
      }

      try {
        const data = await CommunityService.checkEventStatus(userId, eventIds);

        // 使用函式式更新來避免對 attendedEvents 的依賴
        setAttendedEvents((prevAttended) => {
          const newAttended = { ...prevAttended };
          data.forEach((status) => {
            newAttended[status.eventId] = status.isAttended;
          });
          return newAttended;
        });
      } catch (error) {
        console.error('無法獲取活動狀態:', error);
      }
    },
    [auth.id],
  );

  const checkFollowingStatus = useCallback(
    async (followingId) => {
      const userId = auth.id;

      if (userId === 0) return;

      try {
        const data = await CommunityService.checkFollowStatus(userId, followingId);

        // 更新追蹤狀態
        setFollowing((prev) => ({
          ...prev,
          [followingId]: data.isFollowing,
        }));
      } catch (error) {
        console.error('無法獲取追蹤狀態:', error);
      }
    },
    [auth.id],
  );

  const getCommunityIndexPost = useCallback(async () => {
    if (!indexHasMore) return; // 防止重複請求
    // setIsLoading(true); // 開始加載

    try {
      const data = await CommunityService.getPosts(page, 12);
      if (data.length === 0) {
        setIndexHasMore(false); // 如果返回的數據少於預期，設置hasMore為false
      } else {
        const postIds = data.map((post) => post.post_id).join(',');

        await checkPostsStatus(postIds); // 檢查貼文狀態
        await getPostComments(postIds);

        setPosts((prevPosts) => [...prevPosts, ...data]); // 更新posts狀態
        setPage((prevPage) => prevPage + 1); // 更新頁碼
        // setIsLoading(false); // 結束加載
      }
    } catch (error) {
      console.error('Failed to fetch index posts:', error);
      // setIsLoading(false); // 確保即使出錯也要結束加載
    }
  }, [indexHasMore, page, checkPostsStatus, getPostComments]);

  const getCommunityIndexFilteredPost = useCallback(
    async (keyword) => {
      if (!indexFilteredHasMore) return; // 防止重複請求
      // setIsLoading(true); // 開始加載

      try {
        const data = await CommunityService.getPostsByKeyword(
          keyword,
          filteredPage,
          12,
        );
        if (data.length === 0) {
          setIndexFilteredHasMore(false); // 如果返回的數據少於預期，設置hasMore為false
        } else {
          const postIds = data.map((post) => post.post_id).join(',');

          await checkPostsStatus(postIds); // 檢查貼文狀態
          await getPostComments(postIds);

          setFilteredPosts((prevPosts) => [...prevPosts, ...data]); // 更新posts狀態
          setFilteredPage((prevPage) => prevPage + 1); // 更新頁碼
          setIsFilterActive(true);
          // setIsLoading(false); // 結束加載
        }
      } catch (error) {
        console.error('Failed to fetch index posts:', error);
        // setIsLoading(false); // 確保即使出錯也要結束加載
      }
    },
    [indexFilteredHasMore, filteredPage, checkPostsStatus, getPostComments],
  );

  const getCommunityExplorePost = useCallback(async () => {
    if (!exploreHasMore) return; // 防止重複請求
    // setIsLoading(true); // 開始加載

    try {
      const data = await CommunityService.getRandomPosts(randomPage, 12);
      if (data.length === 0) {
        setExploreHasMore(false); // 如果返回的數據少於預期，設置hasMore為false
      } else {
        const postIds = data.map((post) => post.post_id).join(',');

        await checkPostsStatus(postIds); // 檢查貼文狀態
        await getPostComments(postIds);

        setRandomPosts((prevPosts) => [...prevPosts, ...data]); // 更新posts狀態
        setRandomPage((prevPage) => prevPage + 1); // 更新頁碼
        // setIsLoading(false); // 結束加載
      }
    } catch (error) {
      console.error('Failed to fetch explore posts:', error);
      // setIsLoading(false); // 確保即使出錯也要結束加載
    }
  }, [exploreHasMore, randomPage, checkPostsStatus, getPostComments]);

  const getCommunityProfilePost = useCallback(async () => {
    if (!profileHasMore) return; // 防止重複請求
    // setIsLoading(true); // 開始加載
    try {
      const data = await CommunityService.getPosts(page, 12);
      if (data.length === 0) {
        setProfileHasMore(false); // 如果返回的數據少於預期，設置hasMore為false
      } else {
        const postIds = data.map((post) => post.post_id).join(',');

        await checkPostsStatus(postIds); // 檢查貼文狀態
        await getPostComments(postIds);

        setProfilePosts((prevPosts) => [...prevPosts, ...data]); // 更新posts狀態
        setPage((prevPage) => prevPage + 1); // 更新頁碼
        // setIsLoading(false); // 結束加載
      }
    } catch (error) {
      console.error('Failed to fetch profile posts:', error);
      // setIsLoading(false); // 確保即使出錯也要結束加載
    }
  }, [profileHasMore, page, checkPostsStatus, getPostComments]);

  const getPostPage = useCallback(
    async (pid) => {
      try {
        const data = await CommunityService.getPostDetail(pid);
        if (data.length !== 0) {
          await checkPostsStatus(pid); // 檢查貼文狀態
          await getPostComments(pid);

          setPostPage(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch index posts:', error);
        // setIsLoading(false); // 確保即使出錯也要結束加載
      }
    },
    [checkPostsStatus, getPostComments],
  );

  const getEventPage = useCallback(
    async (eid) => {
      try {
        const data = await CommunityService.getEventDetail(eid);
        if (data.length !== 0) {
          await checkEventsStatus(eid); // 檢查活動狀態

          setEventPageCard(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch index posts:', error);
        // setIsLoading(true); // 確保即使出錯也要結束加載
      }
    },
    [checkEventsStatus],
  );

  const getCommunityEvents = useCallback(async () => {
    if (!eventHasMore) return; // 防止重複請求
    // setIsLoading(true); // 開始加載

    try {
      const data = await CommunityService.getEvents(eventPage, 12);
      if (data.length === 0) {
        setEventHasMore(false); // 如果返回的數據少於預期，設置hasMore為false
      } else {
        const eventIds = data.map((event) => event.comm_event_id).join(',');

        await checkEventsStatus(eventIds); // 檢查活動狀態

        setEvents((prevEvents) => [...prevEvents, ...data]); // 更新posts狀態
        setEventPage((prevPage) => prevPage + 1); // 更新頁碼
        // setIsLoading(false); // 結束加載
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // setIsLoading(false); // 確保即使出錯也要結束加載
    }
  }, [eventHasMore, eventPage, checkEventsStatus]);

  // 上傳回覆
  const handleCommentUpload = useCallback(
    async (post, newComment) => {
      const postId = post.post_id;
      const userId = auth.id;

      if (userId === 0 || !postId || postId === '0' || postId === 0) {
        return;
      }

      try {
        const data = await CommunityService.addComment({
          context: newComment,
          content: newComment, // 同時送出 content 防止後端欄位不一致
          status: 'posted',
          postId,
          post_id: postId,
          userId,
          user_id: userId,
        });

        // 原本程式碼中有 res.ok，但這裡 CommunityService 應該直接回傳 data
        // 如果 handleCommentUpload 內部需要 res，請確保 CommunityService 回傳完整的回應
        // 假設 CommunityService.addComment 成功即回傳 data
        if (data) {
          setComments((prevComments) => {
            const updatedComments = { ...prevComments };
            const commentsForPost = updatedComments[postId] || [];
            updatedComments[postId] = [...commentsForPost, data];
            return updatedComments;
          });

          getPostComments(postId);
          setNewComment('');
        }
      } catch (error) {
        console.error('upload comment failed:', error);
      } finally {
        setNewComment('');
      }
    },
    [auth.id, getPostComments],
  );

  const getSearchUsers = useCallback(async (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    // 確保空字串不會觸發
    if (value.trim()) {
      try {
        const data = await CommunityService.searchUsers(value);
        setSearchResults(data);
        setHasSearched(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  }, []);

  // 重置搜尋內容並關閉視窗
  const resetAndCloseSearchModal = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setProfilePage(1);
    // setProfilePosts([]);
  };

  // 重置內容並關閉視窗
  const resetAndCloseFollowerModal = () => {
    setProfilePage(1);
    // setProfilePosts([]);
  };

  // 重置內容並關閉視窗
  const resetAndCloseFollowingModal = () => {
    setProfilePage(1);
    // setProfilePosts([]);
  };

  // 選擇檔案有變動時的處理函式
  const handleFileChange = (e) => {
    // 取得檔案，只取第一個檔案
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // 檔案有變時設定回初始值
      setPreviewUrl('');
    } else {
      setSelectedFile(null);
      // 檔案有變時設定回初始值
      setPreviewUrl('');
    }
  };

  // 重置選取內容並關閉視窗
  const resetAndCloseModal = () => {
    setSelectedFile(null);
    setPreviewUrl('');

    if (createModalRef.current) {
      createModalRef.current.close();
    }
    if (createModalMobileRef.current) {
      createModalMobileRef.current.close();
    }
    if (createEventModalRef.current) {
      createEventModalRef.current.close();
    }
    if (createEventModalMobileRef.current) {
      createEventModalMobileRef.current.close();
    }
    // if (editModalRef.current) {
    //   editModalRef.current.close();
    // }
  };

  // 重置篩選
  const handleFilterClick = (keyword) => {
    // reset
    setFilteredPosts([]);
    setFilteredPage(1);

    setCurrentKeyword(keyword);
    setActiveFilterButton(keyword);
    setIsFilterActive(true);
  };

  // 觸發隱藏的 file input 點擊事件
  const handleFilePicker = () => {
    // 利用 ref 引用來觸發 input 的點擊事件
    fileInputRef.current?.click();
  };

  // 重置貼文狀態
  const resetPostState = () => {
    setPostId('');
    setPostCreated(false);
  };

  // 上傳貼文
  const handlePostUpload = async () => {
    const userId = auth.id;

    if (userId === 0) {
      return;
    }

    // if (!postContent) {
    //   createModalRef.current.close();
    //   createModalMobileRef.current.close();
    //   Swal.fire({
    //     title: '請輸入貼文內容!',
    //     icon: 'warning',
    //     confirmButtonText: '關閉',
    //     confirmButtonColor: '#A0FF1F',
    //     background: 'rgba(0, 0, 0, 0.85)',
    //   });
    //   return;
    // }

    try {
      const data = await CommunityService.createPost({
        context: postContent,
        userId,
      });
      if (data.success) {
        setPostId(data.post_id);
        setPostCreated(true);
        return data.post_id; // 返回 postId 給 handleFileUpload
      } else {
        throw new Error(data.message || '新增貼文失敗');
      }
    } catch (error) {
      customToast.error('分享失敗!');
    }
  };

  // 上傳圖片到伺服器
  const handleFileUpload = async () => {
    let currentPostId = postId;

    if (!postCreated) {
      currentPostId = await handlePostUpload();
      if (!currentPostId) {
        console.error('No post ID returned');
        return; // 如果新增貼文失敗或沒有 postID 則停止執行
      }
      setPostId(currentPostId);
      setPostCreated(true);
    }

    try {
      // 用fetch送出檔案
      const fd = new FormData();
      fd.append('photo', selectedFile);
      fd.append('postId', currentPostId);

      const data = await CommunityService.uploadPostPhoto(fd);

      if (data.success) {
        // 更新貼文以觸發刷新頁面 !!!Important!!!
        setPosts((prevPosts) => [data, ...prevPosts]);
        setProfilePosts((prevPosts) => [data, ...prevPosts]);
        setFilteredPosts((prevPosts) => [data, ...prevPosts]);
        setRandomPosts((prevPosts) => [data, ...prevPosts]);
        setPostPage((prevPosts) => [
          data,
          ...(Array.isArray(prevPosts) ? prevPosts : []),
        ]);
        setPostsCount((prevCount) => prevCount + 1); // 增加貼文數量
      } else {
        throw new Error('Network response was not ok.');
      }

      // 關閉 create modal
      createModalRef.current.close();
      createModalMobileRef.current.close();

      customToast.success('分享成功!');
      resetAndCloseModal();
      resetPostState();
    } catch (error) {
      console.error('upload failed:', error);
      createModalRef.current.close();
      createModalMobileRef.current.close();

      customToast.error('分享失敗!');
    }
  };

  const handlePostUpdate = async (post, localPostContext, editModalRef) => {
    const postId = post.post_id;
    const userId = auth.id;

    if (userId === 0) {
      return;
    }

    // if (!localPostContext) {
    //   Swal.fire({
    //     title: '請輸入貼文內容!',
    //     icon: 'warning',
    //     confirmButtonText: '關閉',
    //     confirmButtonColor: '#A0FF1F',
    //     background: 'rgba(0, 0, 0, 0.85)',
    //   });
    //   return;
    // }

    try {
      const data = await CommunityService.updatePost({
        context: localPostContext,
        postId,
      });

      if (data.success) {
        // 更新狀態中的貼文 !!!Important
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.post_id === postId) {
              return { ...p, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return p;
          }),
        );
        setFilteredPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.post_id === postId) {
              return { ...p, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return p;
          }),
        );
        setProfilePosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.post_id === postId) {
              return { ...p, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return p;
          }),
        );
        setRandomPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.post_id === postId) {
              return { ...p, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return p;
          }),
        );

        // 更新 post page 單筆資料
        if (postPage.post_id === postId) {
          setPostPage({ ...postPage, ...data });
        }
      } else {
        throw new Error(data.message || '編輯貼文失敗');
      }

      // 貼文更新成功，檢查是否有檔案要上傳
      if (selectedFile) {
        await updatePostPhotoUpdate(postId, editModalRef);
      }

      // 關閉 edit modal
      editModalRef.current.close();

      Swal.fire({
        title: '編輯成功!',
        icon: 'success',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      }).then((result) => {
        if (result.isConfirmed) {
          resetAndCloseModal();
        }
      });
    } catch (error) {
      console.error('Failed to update the post:', error);

      // 關閉 edit modal
      editModalRef.current.close();

      Swal.fire({
        title: '編輯失敗!',
        icon: 'error',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      }).then((result) => {
        if (result.isConfirmed) {
          resetAndCloseModal();
        }
      });
    }
  };

  // 處理照片更新
  const updatePostPhotoUpdate = async (postId, editModalRef) => {
    try {
      const fd = new FormData();
      fd.append('photo', selectedFile);
      fd.append('postId', postId);

      const data = await CommunityService.updatePostPhoto(fd);

      if (data.success) {
        // 更新狀態中的貼文 !!!Important
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.post_id === postId) {
              return { ...p, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return p;
          }),
        );
        setFilteredPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.post_id === postId) {
              return { ...p, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return p;
          }),
        );
        setProfilePosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.post_id === postId) {
              return { ...p, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return p;
          }),
        );
        setRandomPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.post_id === postId) {
              return { ...p, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return p;
          }),
        );

        // 更新 post page 單筆資料
        if (postPage.post_id === postId) {
          setPostPage({ ...postPage, ...data });
        }
      } else {
        throw new Error('Network response was not ok.');
      }

      // 關閉 edit modal
      editModalRef.current.close();

      Swal.fire({
        title: '分享成功!',
        icon: 'success',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      }).then((result) => {
        if (result.isConfirmed) {
          resetAndCloseModal();
          resetPostState();
        }
      });
    } catch (error) {
      console.error('upload failed:', error);
      // 關閉 edit modal
      editModalRef.current.close();

      Swal.fire({
        title: '更新照片失敗!',
        icon: 'error',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      }).then((result) => {
        if (result.isConfirmed) {
          resetAndCloseModal();
        }
      });
    }
  };

  const handleEventUpdate = async (
    event,
    localEventDetails,
    editEventModalRef,
  ) => {
    const eventId = event.comm_event_id;
    const userId = auth.id;

    if (userId === 0) {
      return;
    }

    if (!localEventDetails) {
      Swal.fire({
        title: '請輸入活動內容!',
        icon: 'warning',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      });
      return;
    }

    try {
      const data = await CommunityService.updateEvent({
        ...localEventDetails,
        status: 'upcoming',
        eventId,
      });

      if (data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((e) => {
            if (e.comm_event_id === eventId) {
              return { ...e, ...data }; // 使用來自 API 回應的 data 作為更新後資料的來源
            }
            return e;
          }),
        );

        // 更新 event page card 單筆資料
        if (eventPageCard.comm_event_id === eventId) {
          setEventPageCard({ ...eventPageCard, ...data });
        }
      } else {
        throw new Error(data.message || '編輯活動失敗');
      }

      // 活動更新成功，檢查是否有檔案要上傳
      if (selectedFile) {
        try {
          const fd = new FormData();
          fd.append('photo', selectedFile);
          fd.append('eventId', eventId);

          const data = await CommunityService.updateEventPhoto(fd);

          if (data.success) {
            // 更新活動以觸發刷新頁面 !!!Important!!!
            // setEvents((prevEvents) => [data.event, ...prevEvents]);
            setEvents((prevEvents) =>
              prevEvents.map((e) => {
                if (e.comm_event_id === eventId) {
                  return { ...e, ...data.event }; // 使用來自 API 回應的 data.post 作為更新後資料的來源
                }
                return e;
              }),
            );

            // 更新 event page card 單筆資料
            if (eventPageCard.comm_event_id === eventId) {
              setEventPageCard({ ...eventPageCard, ...data.event });
            }
          } else {
            throw new Error('Network response was not ok.');
          }

          // 關閉 edit event modal
          editEventModalRef.current.close();

          Swal.fire({
            title: '分享成功!',
            icon: 'success',
            confirmButtonText: '關閉',
            confirmButtonColor: '#A0FF1F',
            background: 'rgba(0, 0, 0, 0.85)',
          }).then((result) => {
            if (result.isConfirmed) {
              resetAndCloseModal();
              resetPostState();
            }
          });
        } catch (error) {
          console.error('upload failed:', error);
          createModalRef.current.close();
          createModalMobileRef.current.close();

          Swal.fire({
            title: '更新照片失敗!',
            icon: 'error',
            confirmButtonText: '關閉',
            confirmButtonColor: '#A0FF1F',
            background: 'rgba(0, 0, 0, 0.85)',
          }).then((result) => {
            if (result.isConfirmed) {
              resetAndCloseModal();
            }
          });
        }
      }

      // 關閉 edit event modal
      editEventModalRef.current.close();

      Swal.fire({
        title: '編輯成功!',
        icon: 'success',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      }).then((result) => {
        if (result.isConfirmed) {
          resetAndCloseModal();
        }
      });
    } catch (error) {
      console.error('Failed to update the post:', error);

      editEventModalRef.current.close();

      Swal.fire({
        title: '編輯失敗!',
        icon: 'error',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      }).then((result) => {
        if (result.isConfirmed) {
          resetAndCloseModal();
        }
      });
    }
  };

  const handleLikedClick = useCallback(
    async (post) => {
      const postId = post.post_id;
      const userId = auth.id;

      if (userId === 0 || !postId || postId === '0' || postId === 0) {
        return;
      }

      if (interactingItems.current.has(`like-${postId}`)) return;
      interactingItems.current.add(`like-${postId}`);

      // 獲取當前狀態並進行樂觀更新
      let prevLikedState = false;
      setLikedPosts((prev) => {
        prevLikedState = prev[postId] || false;
        return { ...prev, [postId]: !prevLikedState };
      });

      try {
        const result = prevLikedState
          ? await CommunityService.unlikePost(userId, postId)
          : await CommunityService.likePost(userId, postId);


        if (
          !(result.success ||
          result.output?.success ||
          result.status === 'success' ||
          result.status === 'ok' ||
          result.msg?.includes('成功') ||
          result.message?.includes('成功'))
        ) {
          throw new Error('Failed to update like status');
        }
      } catch (error) {
        console.error('Error updating like status, reverting:', error);
        // 發生錯誤，還原回先前的狀態
        setLikedPosts((prev) => ({ ...prev, [postId]: prevLikedState }));
      } finally {
        interactingItems.current.delete(`like-${postId}`);
      }
    },
    [auth.id],
  );

  const handleAttendedClick = useCallback(
    async (event) => {
      const eventId = event.comm_event_id;
      const userId = auth.id;

      if (userId === 0) {
        return;
      }

      if (interactingItems.current.has(`attend-${eventId}`)) return;
      interactingItems.current.add(`attend-${eventId}`);

      const prevAttendedState = attendedEvents[eventId] || false;
      const newAttendedState = !prevAttendedState;

      // 樂觀更新
      setAttendedEvents((prev) => ({
        ...prev,
        [eventId]: newAttendedState,
      }));

      try {
        const result = prevAttendedState
          ? await CommunityService.notAttendEvent(userId, eventId)
          : await CommunityService.attendEvent(userId, eventId);


        if (
          !(result.success ||
          result.output?.success ||
          result.status === 'success' ||
          result.status === 'ok' ||
          result.msg?.includes('成功') ||
          result.message?.includes('成功'))
        ) {
          throw new Error('Failed to update attendance status');
        }
      } catch (error) {
        console.error('Error updating event attendance, reverting:', error);
        // 還原
        setAttendedEvents((prev) => ({
          ...prev,
          [eventId]: prevAttendedState,
        }));
      } finally {
        interactingItems.current.delete(`attend-${eventId}`);
      }
    },
    [auth.id, attendedEvents],
  );

  const handleSavedClick = useCallback(
    async (post) => {
      const postId = post.post_id;
      const userId = auth.id;

      if (userId === 0 || !postId || postId === '0' || postId === 0) {
        return;
      }

      if (interactingItems.current.has(`save-${postId}`)) return;
      interactingItems.current.add(`save-${postId}`);

      const prevSavedState = savedPosts[postId] || false;
      const newSavedState = !prevSavedState;

      // 樂觀更新
      setSavedPosts((prev) => ({ ...prev, [postId]: newSavedState }));

      try {
        const result = prevSavedState
          ? await CommunityService.unsavePost(userId, postId)
          : await CommunityService.savePost(userId, postId);


        if (
          result.success ||
          result.output?.success ||
          result.status === 'success' ||
          result.status === 'ok' ||
          result.msg?.includes('成功') ||
          result.message?.includes('成功')
        ) {
          setRerender(!rerender);
        } else {
          throw new Error('Failed to update save status');
        }
      } catch (error) {
        console.error('Error updating save status, reverting:', error);
        // 還原
        setSavedPosts((prev) => ({ ...prev, [postId]: prevSavedState }));
      } finally {
        interactingItems.current.delete(`save-${postId}`);
      }
    },
    [auth.id, savedPosts, rerender, setRerender],
  );

  const handleFollowClick = useCallback(
    async (FollowingId) => {
      const userId = auth.id; // 當前登入用戶的ID

      if (userId === 0) return; // 未登入狀態直接返回

      if (interactingItems.current.has(`follow-${FollowingId}`)) return;
      interactingItems.current.add(`follow-${FollowingId}`);

      const prevFollowingState = following[FollowingId] || false;
      const newFollowingState = !prevFollowingState;

      // 樂觀更新
      setFollowing((prev) => ({
        ...prev,
        [FollowingId]: newFollowingState,
      }));

      try {
        const result = prevFollowingState
          ? await CommunityService.unfollowUser(userId, FollowingId)
          : await CommunityService.followUser(userId, FollowingId);

        if (
          !(result.success ||
          result.output?.success ||
          result.msg?.includes('成功') ||
          result.message?.includes('成功'))
        ) {
          throw new Error('Failed to update follow status');
        }
      } catch (error) {
        console.error('Error updating follow status, reverting:', error);
        // 還原
        setFollowing((prev) => ({
          ...prev,
          [FollowingId]: prevFollowingState,
        }));
      } finally {
        interactingItems.current.delete(`follow-${FollowingId}`);
      }
    },
    [auth.id, following],
  );

  const handleDeletePostClick = useCallback(
    async (post) => {
      const postId = post.post_id;

      if (!postId || postId === '0' || postId === 0) return;

      Swal.fire({
        title: '確定刪除?',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: `取消`,
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      }).then(async (result) => {
        // 如果點擊確認刪除才執行
        if (result.isConfirmed) {
          try {
            const res = await CommunityService.deletePost(postId);

            if (res.success) {
              // 更新 posts, randomPosts 狀態以移除已刪除的貼文
              setPosts((prevPosts) => {
                return prevPosts.filter((post) => post.post_id !== postId);
              });
              setProfilePosts((prevPosts) => {
                return prevPosts.filter((post) => post.post_id !== postId);
              });
              setFilteredPosts((prevPosts) => {
                return prevPosts.filter((post) => post.post_id !== postId);
              });
              setRandomPosts((prevPosts) => {
                return prevPosts.filter((post) => post.post_id !== postId);
              });
              setPostPage((prevPosts) => {
                // return prevPosts.filter((post) => post.post_id !== postId);
                return Array.isArray(prevPosts)
                  ? prevPosts.filter((post) => post.post_id !== postId)
                  : [];
              });

              setPostsCount((prevCount) => prevCount - 1); // 減少貼文數量

              customToast.success('刪除成功!');
            } else {
              customToast.error('刪除失敗!');
            }
          } catch (error) {
            console.error('Error delete post status:', error);
            customToast.error('刪除失敗!');
          }
        }
      });
    },
    [getAuthHeader],
  );

  const handleDeleteEventClick = async (event, modalId) => {
    const eventId = event.comm_event_id;

    if (!eventId) return;

    Swal.fire({
      title: '確定刪除?',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: `取消`,
      confirmButtonColor: '#A0FF1F',
      background: 'rgba(0, 0, 0, 0.85)',
    }).then(async (result) => {
      // 如果點擊確認刪除才執行
      if (result.isConfirmed) {
        try {
          const res = await CommunityService.deleteEvent(eventId);

          if (res.success) {
            // 更新 events 狀態以移除已刪除的貼文
            setEvents((prevEvents) => {
              return prevEvents.filter(
                (event) => event.comm_event_id !== eventId,
              );
            });

            customToast.success('刪除成功!');
          } else {
            customToast.error('刪除失敗!');
          }
        } catch (error) {
          console.error('Error delete post status:', error);
          customToast.error('刪除失敗!');
        }
      }
    });
  };

  const handleDeleteCommentClick = useCallback(
    async (comment, modalId) => {
      const commentId = comment.comm_comment_id;

      if (!commentId) return;

      const result = await Swal.fire({
        title: '確定刪除?',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      });

      // 如果點擊確認刪除才執行
      if (result.isConfirmed) {
        try {
          const res = await CommunityService.deleteComment(commentId);

          if (res.success) {
            // 更新 comments 狀態以移除已刪除的回覆
            setComments((prevComments) => {
              // 遍歷所有貼文的評論
              const updatedComments = { ...prevComments };

              for (const postId in updatedComments) {
                // 過濾出除了要刪除的那個評論外的所有評論
                updatedComments[postId] = updatedComments[postId].filter(
                  (comment) => comment.comm_comment_id !== commentId,
                );
              }

              return updatedComments; // 返回更新後的評論對象
            });

            customToast.success('刪除成功!');
            return true; // 確保成功時返回 true 給 handleRemoveNotification
          } else {
            customToast.error('刪除失敗!');
          }
        } catch (error) {
          console.error('Error delete post status:', error);
          customToast.error('刪除失敗!');
        }
      }
    },
    [getAuthHeader],
  );

  // 重置貼文狀態
  const resetEventState = () => {
    setEventId('');
    setEventCreated(false);
  };

  // 上傳活動資訊
  const handleEventUpload = async () => {
    const userId = auth.id;

    if (userId === 0) {
      return;
    }

    if (!eventDetails) {
      customToast.warning('請輸入活動內容!');
      return;
    }

    try {
      const data = await CommunityService.createEvent({
        ...eventDetails,
        status: 'upcoming',
        userId,
      });

      if (data.success) {
        setEventId(data.comm_event_id);
        setEventCreated(true);
        return data.comm_event_id;
      } else {
        throw new Error(data.message || '新增活動失敗');
      }
    } catch (error) {
      console.error('upload event failed:', error);
      createEventModalRef.current.close();
      createEventModalMobileRef.current.close();
      customToast.error('創建活動失敗!');
    }
  };

  // 上傳圖片到伺服器
  const handleEventFileUpload = async () => {
    let currentEventId = eventId;

    if (!eventCreated) {
      currentEventId = await handleEventUpload();
      if (!currentEventId) {
        console.error('No event ID returned');
        return;
      }
      setEventId(currentEventId);
      setEventCreated(true);
    }

    const fd = new FormData();
    fd.append('photo', selectedFile);
    fd.append('eventId', currentEventId);

    try {
      const data = await CommunityService.uploadEventPhoto(fd);

      if (data.success) {
        setEvents((prevEvents) => [data, ...prevEvents]);
      } else {
        throw new Error('Network response was not ok.');
      }

      createEventModalRef.current.close();
      createEventModalMobileRef.current.close();

      customToast.success('創建活動成功!');
      resetAndCloseModal();
      resetEventState();
    } catch (error) {
      console.error('upload failed:', error);
      createEventModalRef.current.close();
      createEventModalMobileRef.current.close();
      customToast.error('創建活動失敗!');
    }
  };

  const handleDateFocus = (e) => {
    e.target.type = 'date';
  };

  const handleBlur = (e) => {
    if (e.target.value === '') {
      e.target.type = 'text';
    }
  };

  const handleTimeFocus = (e) => {
    e.target.type = 'time';
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file); // 假設你有這樣的函數設置選中的檔案
    handleFileChange({ target: { files: acceptedFiles } });
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 防止預設行為，如換行
      action(); // 執行傳入的回調函數
    }
  };


  useEffect(() => {
    if (auth.id) {
      getUserDetail();
    }
  }, [auth.id]);

  const value = useMemo(
    () => ({
      getCommunityIndexPost,
      getCommunityIndexFilteredPost,
      getCommunityExplorePost,
      getCommunityProfilePost,
      getCommunityEvents,
      getPostPage,
      getEventPage,
      uid,
      userInfo,
      posts,
      setPosts,
      profilePosts,
      postPage,
      eventPageCard,
      filteredPosts,
      postsCount,
      setPostsCount,
      setFilteredPosts,
      filteredPage,
      setFilteredPage,
      currentKeyword,
      randomPosts,
      setPostContent,
      setProfilePosts,
      profilePage,
      setProfilePage,
      setEventPageCard,
      checkPostsStatus,
      checkFollowingStatus,
      getPostComments,
      comments,
      setComments,
      newComment,
      setNewComment,
      events,
      setEvents,
      minDate,
      setMinDate,
      minEndDate,
      setMinEndDate,
      indexHasMore,
      indexFilteredHasMore,
      exploreHasMore,
      profileHasMore,
      userProfileHasMore,
      setUserProfileHasMore,
      eventHasMore,
      commentHasMore,
      handleCommentUpload,
      handlePostUpload,
      handleFileUpload,
      handlePostUpdate,
      handleEventUpdate,
      handleFileChange,
      selectedFile,
      setSelectedFile,
      previewUrl,
      setPreviewUrl,
      resetAndCloseModal,
      handleFilePicker,
      handleLikedClick,
      handleSavedClick,
      handleAttendedClick,
      handleFollowClick,
      handleDeletePostClick,
      handleDeleteEventClick,
      handleDeleteCommentClick,
      handleFilterClick,
      likedPosts,
      savedPosts,
      attendedEvents,
      setEventDetails,
      following,
      setFollowing,
      handleEventUpload,
      handleEventFileUpload,
      handleDateFocus,
      handleBlur,
      handleTimeFocus,
      onDrop,
      handleKeyPress,
      postModalToggle,
      setPostModalToggle,
      isFilterActive,
      setIsFilterActive,
      activeFilterButton,
      setActiveFilterButton,
      isHoverActive,
      setIsHoverActive,
      reload,
      setReload,
      searchTerm,
      searchResults,
      hasSearched,
      getSearchUsers,
      resetAndCloseSearchModal,
      resetAndCloseFollowerModal,
      resetAndCloseFollowingModal,
      fileInputRef,
      createModalRef,
      createModalMobileRef,
      createEventModalRef,
      createEventModalMobileRef,
      searchModalRef,
      searchModalMobileRef,
      followerModalRef,
      followingModalRef,
    }),
    [
      getCommunityIndexPost,
      getCommunityIndexFilteredPost,
      getCommunityExplorePost,
      getCommunityProfilePost,
      getCommunityEvents,
      getPostPage,
      getEventPage,
      uid,
      userInfo,
      posts,
      profilePosts,
      postPage,
      eventPageCard,
      filteredPosts,
      postsCount,
      filteredPage,
      currentKeyword,
      randomPosts,
      postContent,
      profilePage,
      checkPostsStatus,
      checkFollowingStatus,
      getPostComments,
      comments,
      newComment,
      events,
      minDate,
      minEndDate,
      indexHasMore,
      indexFilteredHasMore,
      exploreHasMore,
      profileHasMore,
      userProfileHasMore,
      eventHasMore,
      commentHasMore,
      handleCommentUpload,
      handlePostUpload,
      handleFileUpload,
      handlePostUpdate,
      handleEventUpdate,
      handleFileChange,
      selectedFile,
      previewUrl,
      handleLikedClick,
      handleSavedClick,
      handleAttendedClick,
      handleFollowClick,
      handleDeletePostClick,
      handleDeleteEventClick,
      handleDeleteCommentClick,
      handleFilterClick,
      likedPosts,
      savedPosts,
      attendedEvents,
      following,
      handleEventUpload,
      handleEventFileUpload,
      postModalToggle,
      isFilterActive,
      activeFilterButton,
      isHoverActive,
      reload,
      searchTerm,
      searchResults,
      hasSearched,
      getSearchUsers,
      auth,
    ],
  );

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
