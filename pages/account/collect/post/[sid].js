import { useState, useEffect, use } from 'react';
import Sidebar from '@/components/account-center/sidebar/sidebar';
import PageTitle from '@/components/page-title';
import Breadcrumbs from '@/components/account-center/breadcrumbs/breadcrumbs';
import BurgerMenu from '@/components/account-center/burgermenu/burger-menu';
import { RxCrossCircled, RxDoubleArrowRight } from 'react-icons/rx';
import { usePostContext } from '@/context/post-context';
import { useCollect } from '@/context/use-collect';
import { useLoader } from '@/context/use-loader';
import CollectLoader from '@/components/account-center/loader/collect-loader';
import Link from 'next/link';

import {
  ACCOUNT_COLLECT_POST,
  ACCOUNT_COLLECT_POST_DELETE,
} from '@/components/config/api-path';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import PostModal from '@/components/community/modal/postModal';

export default function AccountCollect({ onPageChange }) {
  const pageTitle = '會員中心';
  const currentPage = '個人收藏';
  const router = useRouter();
  const { close, isLoading, open } = useLoader();
  const { p, setP, modalId, setModalId } = useCollect();
  const { auth, getAuthHeader, checkAuth, rerender } = useAuth();
  const {
    postModalToggle,
    setPostModalToggle,
    posts,
    setPosts,
    checkPostsStatus,
    getPostComments,
    savedPosts,
  } = usePostContext();

  const [pages, setPages] = useState({
    rows: [],
    page: 0,
    totalPages: 0,
  });
  const [radio, setRadio] = useState('貼文');
  const [arrowHovered, setArrowHovered] = useState(
    Array(posts.length).fill(false)
  );

  //處理 post.map 把裡面的post.id 及 post.data 導出來傳遞給Modal
  const handlePostClick = (post, post_id) => {
    setPostModalToggle(post_id);
    setP(post);
    setModalId(post_id);
  };

  //詳細箭頭動畫
  const handleArrowHover = (index, isHovered) => {
    const newArrowHovered = [...arrowHovered];
    newArrowHovered[index] = isHovered;
    setArrowHovered(newArrowHovered);
  };

  //處理上一頁按鈕
  const handlePrevPage = (e) => {
    e.preventDefault();
    const prevPage = pages.page - 1;
    if (prevPage >= 1) {
      setPages({ ...pages, page: prevPage });

      const nweQuery = { ...router.query, page: prevPage };

      // 構建新的 URL
      // const queryString = new URLSearchParams(query).toString();
      // console.log('prevPageQS:', queryString);

      // 更新路由的 query string
      router.push(
        {
          pathname: router.pathname, // 將 pathname 設置到 url 中
          query: nweQuery, // 將 query 設置到 url 中
        }
        // undefined,
        // { scroll: false }
      ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    }
  };
  //處理下一頁按鈕
  const handleNextPage = (e) => {
    e.preventDefault();
    const nextPage = pages.page + 1;
    if (nextPage <= pages.totalPages) {
      setPages({ ...pages, page: nextPage });
      // 獲取當前路由的 query string
      const nweQuery = { ...router.query, page: nextPage };

      // 構建新的 URL
      // const queryString = new URLSearchParams(query).toString();

      // 更新路由的 query string
      router.push(
        {
          pathname: router.pathname, // 將 pathname 設置到 url 中
          query: nweQuery, // 將 query 設置到 url 中
        }
        // undefined,
        // { scroll: false }
      ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    }
  };

  //渲染方法定義-貼文收藏
  const getSavePostData = async () => {
    // setIsLoading(true); // 開始加載

    try {
      const res = await fetch(
        `${ACCOUNT_COLLECT_POST}/${router.query.sid}${location.search}`,
        {
          headers: { ...getAuthHeader() },
        }
      );
      const result = await res.json();
      console.log(
        'getSavePostData() fetch data 中的result:',
        result.output.data
      );
      if (result.output.error === '無收藏') {
        setPosts([]);
        toast.error('無貼文收藏', { duration: 1500 });
      } else {
        const postIds = result.output.data
          .map((post) => post.post_id)
          .join(',');
        // console.log('postID為:', postIds); //1,2,3,4,5
        await checkPostsStatus(postIds); // 檢查貼文狀態
        await getPostComments(postIds);

        setPosts(result.output.data); // 更新posts狀態
        setPages({ page: result.page, totalPages: result.totalPages });
        // setPage((prevPage) => prevPage + 1); // 更新頁碼
        // setIsLoading(false); // 結束加載
        // close(2);
      }
    } catch (error) {
      console.error('Failed to fetch index posts:', error);
      // setIsLoading(false); // 確保即使出錯也要結束加載
    }
  };

  //渲染-貼文收藏
  useEffect(() => {
    if (auth.id === 0 || !router.isReady) return;

    const fetchCheck = async () => {
      const result = await checkAuth(router.query.sid);
      if (!result.success) {
        router.push('/');
        toast.error(result.error, { duration: 1500 });
        return;
      }
      getSavePostData();
      // console.log('fecth後post為:', posts);
    };

    open();
    fetchCheck();
    close(2);
  }, [router.query, auth.id, radio, rerender]);

  //當modal中做收藏的動作
  // useEffect(() => {
  //   // 檢查 savedPosts 中是否有 isSaved 為 false 的項目
  //   const unsavedPosts = Object.entries(savedPosts).filter(
  //     ([_, post]) => !post.isSaved
  //   );
  //   //找出有 isSaved 為 false 的post_id
  //   // const falseKey = Object.keys(savedPosts).find((key) => !savedPosts[key]);
  //   const unsavedPostsWithFalseStatus = unsavedPosts.filter(
  //     ([_, isSaved]) => !isSaved
  //   );
  //   const unsavedPostIds = unsavedPostsWithFalseStatus.map(
  //     ([postId, _]) => postId
  //   );

  //   // 如果有未保存的貼文，則觸發重新渲染更新
  //   // if (hasUnsavedPosts && falseKey !== undefined) {
  //   // console.log('posts:', posts);
  //   // console.log('savedPosts:', savedPosts); //{293: false, 294: true, 295: true, 296: true, 297: true, 298: true}
  //   // console.log('有未保存的貼文，unsavedPosts:', unsavedPosts); //[Array(2), Array(2), Array(2), Array(2), Array(2)]
  //   // console.log('unsavedPostsWithFalseStatus:', unsavedPosts。WithFalseStatus); //[Array(2)] ['293', false]
  //   // console.log('unsavedPostIds:', unsavedPostIds); // ['293']

  //   if (!unsavedPostIds.length) return;
  //   // console.log('有未保存的貼文，觸發重新渲染更新');

  //   const newSavedPosts = posts.filter(
  //     (post) => !unsavedPostIds.includes(post.post_id.toString())
  //   );
  //   // console.log('newSavedPosts:', newSavedPosts);
  //   setPosts(newSavedPosts);
  //   setPostModalToggle(false);
  //   // }
  // }, [savedPosts]);

  useEffect(() => {
    onPageChange(pageTitle);
  }, []);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex min-h-screen pt-10 bg-dark ">
        <Sidebar currentPage={currentPage} />

        <div className="w-screen px-4 py-12 sm:px-6 md:px-8 lg:ps-14 lg:pe-44 xl:pe-60">
          <div className="flex flex-col w-full ">
            <BurgerMenu currentPage={currentPage} />
            <Breadcrumbs currentPage={currentPage} />

            <div>
              {/* TabBar START */}
              <div className="grid-cols-4 mt-4 tabs ">
                {/* SearchBar START */}
                {/* <div className="flex justify-end item-center">
                  <label className="flex items-center max-w-[170px] border-slate-700 w-full min-w-[150px] gap-1 ms-2 input input-bordered input-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="date"
                      className="grow input-sm p-s0"
                      placeholder="Search"
                    />
                  </label>
                </div> */}
                {/* SearchBar END */}

                <Link
                  href={`/account/collect/post/${auth.id}`}
                  className={`tab 
                       text-white border-b-2 border-b-white
                      `}
                  aria-label="貼文"
                >
                  貼文
                </Link>
                <Link
                  href={`/account/collect/bar/${auth.id}`}
                  className={`tab ${
                    radio === '酒吧'
                      ? 'text-white border-b-2 border-b-white'
                      : ''
                  }`}
                  aria-label="酒吧"
                >
                  酒吧
                </Link>
                <Link
                  href={`/account/collect/movie/${auth.id}`}
                  className={`tab ${
                    radio === '電影'
                      ? 'text-white border-b-2 border-b-white'
                      : ''
                  }`}
                  aria-label="電影"
                >
                  電影
                </Link>
                {/* <Link
                  href={`/account/collect/movie/${auth.id}`}
                  className={`tab ${
                    radio === '行程'
                      ? 'text-white border-b-2 border-b-white duration-500 ease-in-out'
                      : 'duration-500 ease-in-out'
                  }`}
                  aria-label="行程"
                >
                  行程
                </Link> */}
              </div>
              {/* TabBar END */}

              {isLoading ? (
                <CollectLoader />
              ) : (
                <>
                  <div
                    className={`mt-4 pb-3 flex flex-col justify-between w-full lg:mx-1 xl:mx-1 rounded-box  place-items-center `}
                  >
                    {/* CONTENT1 START */}
                    {posts.map((post, i) => (
                      <div
                        key={i}
                        className="grid z-0 outline outline-1 outline-grayBorder  rounded-xl my-2 w-[360px] sm:w-full grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px]"
                      >
                        <div className="shadow-xl card sm:card-side ">
                          <figure className=" sm:w-[300px] h-[200px]  sm:basis-1/3">
                            <img
                              src={post.img || '/unavailable-image.jpg'}
                              className="object-cover sm:min-w-[300px] sm:min-h-full z-0"
                              alt={post.photo_name || 'No Image Available'}
                            />
                          </figure>
                          <div className="card-body h-[200px] relative pe-[48px] sm:basis-2/3">
                            <Link
                              className="absolute top-[23px] left-[32px] avatar me-2"
                              href={`/community/profile/${post.post_userId}`}
                            >
                              <div className="w-[36px] h-[36px] rounded-full ">
                                <img
                                  src={post.avatar || '/unknown-user-image.jpg'}
                                  alt={post.photo_name || 'No Image Available'}
                                />
                              </div>
                            </Link>
                            <div className="flex items-center ms-[46px] font-bold text-white text-h5">
                              {post.email
                                ? post.email.split('@')[0]
                                : 'unknown'}
                            </div>
                            <div>{post.post_context.split('#')[0]}</div>
                            <div className="absolute bottom-[16px] left-[32px] ">
                              {post.post_context.split('#')[1] && (
                                <div className=" badge text-neongreen badge-outline">
                                  {post.post_context.split('#')[1]}
                                </div>
                              )}
                              {post.post_context.split('#')[2] && (
                                <div className="ms-1 badge badge-secondary badge-outline">
                                  {post.post_context.split('#')[2]}
                                </div>
                              )}
                              {post.post_context.split('#')[3] && (
                                <div className="ms-1 sm:absolute sm:bottom-[26px] sm:ms-0 md:relative md:bottom-0 md:ms-1 left-[0px]  badge badge-info badge-outline">
                                  {post.post_context.split('#')[3]}
                                </div>
                              )}
                            </div>

                            <RxCrossCircled
                              onClick={async () => {
                                console.log('post.save_id:', post.save_id);
                                const r = await fetch(
                                  `${ACCOUNT_COLLECT_POST_DELETE}/${post.save_id}`,
                                  {
                                    method: 'DELETE',
                                    headers: { ...getAuthHeader() },
                                  }
                                );
                                const result = await r.json();
                                if (
                                  result.output.success &&
                                  result.output.action === 'remove'
                                ) {
                                  toast.success('刪除收藏成功', {
                                    duration: 1500,
                                  });
                                }
                                router.push({
                                  pathname: router.pathname, // 將 pathname 設置到 url 中
                                  query: router.query, // 將 query 設置到 url 中
                                });
                              }}
                              className="text-white absolute right-[8px] top-[-192px] sm:top-[8px] cursor-pointer hover:text-neongreen text-4xl"
                            />
                            <div className="absolute bottom-[16px] right-[16px] justify-end card-actions">
                              <span
                                onClick={() => {
                                  handlePostClick(post, post.post_id);
                                  // console.log('點下詳細的postID', post.post_id);
                                  // setPostModalToggle(post.post_id);
                                  // setP({ post });
                                  // setModalId(post.post_id);
                                  // handleShowModal(post.post_id);
                                }}
                                onMouseEnter={() => handleArrowHover(i, true)}
                                onMouseLeave={() => handleArrowHover(i, false)}
                                className={`flex items-center cursor-pointer hover:text-neongreen`}
                              >
                                <RxDoubleArrowRight
                                  className={`me-4 ${
                                    arrowHovered[i]
                                      ? 'translate-x-[10px] duration-500 ease-in-out '
                                      : 'text-dark duration-500 ease-in-out'
                                  }`}
                                />
                                詳細...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <PostModal
                      className={`z-[100]`}
                      post={p}
                      modalId={modalId}
                      isOpen={postModalToggle === modalId}
                    />

                    {/* Pagination START */}
                    <div className="mb-3 join bg-base-100">
                      {/* 上一頁按紐 */}
                      <button
                        className={`
                      ${Number(router.query.page) > 1 ? ' ' : 'btn-disabled'}
                      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                        onClick={handlePrevPage}
                      >
                        «
                      </button>
                      {/* 分頁按紐 */}
                      {[...Array(5)].map((v, i) => {
                        let p = pages.page <= 5 ? 1 + i : pages.page + i;

                        if (p < 1) return null;

                        if (p > pages.totalPages)
                          return (
                            <button
                              key={p}
                              className={`${
                                p === pages.page ? 'text-neongreen ' : ''
                              } btn-disabled max-w-[25px] join-item btn border-slate-700 hover:bg-primary hover:text-dark btn-xs `}
                            >
                              {p}
                            </button>
                          );

                        return (
                          <button
                            key={p}
                            style={{
                              transition: 'transform 0.2s ease-in-out',
                            }}
                            className={`${
                              p === pages.page ? 'text-neongreen ' : ''
                            } join-item btn max-w-[25px] border-slate-700 hover:bg-primary hover:text-dark btn-xs hover:sm:scale-[1.1]  hover:sm:translate-y-[-5px]`}
                            onClick={(e) => {
                              e.preventDefault();
                              const nweQuery = { ...router.query, page: p };
                              router.push(
                                {
                                  pathname: router.pathname,
                                  query: nweQuery,
                                }
                                // undefined,
                                // { scroll: false }
                              );
                            }}
                          >
                            {p}
                          </button>
                        );
                      })}
                      {/* 下一頁按紐 */}
                      <button
                        className={`
                      ${
                        parseInt(router.query.page) === pages.totalPages ||
                        pages.totalPages === 0
                          ? ' btn-disabled'
                          : ''
                      }
                      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                        onClick={handleNextPage}
                      >
                        »
                      </button>
                    </div>
                    {/* Pagination START */}
                    {/* CONTENT1 END */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
