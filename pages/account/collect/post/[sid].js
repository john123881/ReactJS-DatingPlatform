import { useState, useEffect } from 'react';
import AccountLayout from '@/components/account-center/account-layout';
import { RxCrossCircled, RxDoubleArrowRight } from 'react-icons/rx';
import { usePostContext } from '@/context/post-context';
import { useCollect } from '@/context/use-collect';
import { useLoader } from '@/context/use-loader';
import PageLoader from '@/components/ui/loader/page-loader';
import Link from 'next/link';

import { AccountService } from '@/services/account-service';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { toast as customToast } from '@/lib/toast';
import PostModal from '@/components/community/modal/postModal';
import EmptyCollection from '@/components/account-center/empty-collection';

export default function AccountCollect({ onPageChange }) {
  const pageTitle = '會員中心';
  const currentPage = '個人收藏';
  const router = useRouter();
  const { open, close, isLoading } = useLoader();
  const { p, setP, modalId, setModalId } = useCollect();
  const { auth, getAuthHeader, checkAuth, rerender } = useAuth();
  const {
    postModalToggle,
    setPostModalToggle,
    posts,
    setPosts,
    checkPostsStatus,
    getPostComments,
  } = usePostContext();

  const [pages, setPages] = useState({
    rows: [],
    page: 0,
    totalPages: 0,
  });
  const [radio] = useState('貼文');
  const [arrowHovered, setArrowHovered] = useState(
    Array(posts.length).fill(false),
  );
  const [isFetched, setIsFetched] = useState(false);

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

      router.push({
        pathname: router.pathname,
        query: nweQuery,
      });
    }
  };
  
  //處理下一頁按鈕
  const handleNextPage = (e) => {
    e.preventDefault();
    const nextPage = pages.page + 1;
    if (nextPage <= pages.totalPages) {
      setPages({ ...pages, page: nextPage });
      const nweQuery = { ...router.query, page: nextPage };

      router.push({
        pathname: router.pathname,
        query: nweQuery,
      });
    }
  };

  //渲染方法定義-貼文收藏
  const getSavePostData = async () => {
    try {
      const result = await AccountService.collectPost.get(
        router.query.sid,
        `?page=${router.query.page || 1}`,
      );

      const data = result.data || (Array.isArray(result) ? result : []);
      
      if (data.length === 0) {
        setPosts([]);
      } else {
        const postIds = data.map((post) => post.post_id).join(',');

        await checkPostsStatus(postIds);
        await getPostComments(postIds);

        setPosts(data);
        setPages({
          page: result.page || 1,
          totalPages: result.totalPages || 1,
        });
      }
    } catch (error) {
      console.error('Failed to fetch post collection:', error);
    }
  };

  //渲染-貼文收藏
  useEffect(() => {
    const fetchCheck = async () => {
      if (!router.isReady || !router.query.sid) return;

      open();
      setIsFetched(false);
      try {
        if (auth.id === 0) {
          return;
        }
        const result = await checkAuth(router.query.sid);
        if (!result.success) {
          router.push('/');
          customToast.error(result.message || '驗證失敗');
          return;
        }
        await getSavePostData();
      } catch (error) {
        console.error('fetchCheck error:', error);
      } finally {
        setIsFetched(true);
        close(0.5);
      }
    };

    fetchCheck();
  }, [router.isReady, router.query.sid, router.query.page, auth.id, radio, rerender, checkAuth, close, open]);

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  return (
    <AccountLayout currentPage={currentPage} pageTitle={pageTitle}>
      <div>
        {/* TabBar START */}
        <div className="grid-cols-4 mt-4 tabs">
          <Link
            href={`/account/collect/post/${auth.id}`}
            className="tab text-white border-b-2 border-b-white"
            aria-label="貼文"
          >
            貼文
          </Link>
          <Link
            href={`/account/collect/bar/${auth.id}`}
            className={`tab ${radio === '酒吧' ? 'text-white border-b-2 border-b-white' : ''}`}
            aria-label="酒吧"
          >
            酒吧
          </Link>
          <Link
            href={`/account/collect/movie/${auth.id}`}
            className={`tab ${radio === '電影' ? 'text-white border-b-2 border-b-white' : ''}`}
            aria-label="電影"
          >
            電影
          </Link>
        </div>

        {isLoading || !isFetched ? (
          <PageLoader type="post" />
        ) : (
          <>
            <div className="mt-4 pb-3 flex flex-col justify-between w-full lg:mx-1 xl:mx-1 rounded-box place-items-center">
              {posts.length > 0 ? (
                posts.map((post, i) => (
                  <div
                    key={i}
                    className="grid z-0 outline outline-1 outline-grayBorder rounded-xl my-2 w-[360px] sm:w-full grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px]"
                  >
                    <div className="shadow-xl card sm:card-side">
                      <figure className="sm:w-[300px] h-[200px] sm:basis-1/3">
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
                          <div className="w-[36px] h-[36px] rounded-full">
                            <img
                              src={post.avatar || '/unknown-user-image.jpg'}
                              alt={post.photo_name || 'No Image Available'}
                            />
                          </div>
                        </Link>
                        <div className="flex items-center ms-[46px] font-bold text-white text-h5">
                          {post.email ? post.email.split('@')[0] : 'unknown'}
                        </div>
                        <div>{post.post_context.split('#')[0]}</div>
                        <div className="absolute bottom-[16px] left-[32px]">
                          {post.post_context.split('#')[1] && (
                            <div className="badge text-neongreen badge-outline">
                              {post.post_context.split('#')[1]}
                            </div>
                          )}
                          {post.post_context.split('#')[2] && (
                            <div className="ms-1 badge badge-secondary badge-outline">
                              {post.post_context.split('#')[2]}
                            </div>
                          )}
                          {post.post_context.split('#')[3] && (
                            <div className="ms-1 sm:absolute sm:bottom-[26px] sm:ms-0 md:relative md:bottom-0 md:ms-1 left-[0px] badge badge-info badge-outline">
                              {post.post_context.split('#')[3]}
                            </div>
                          )}
                        </div>

                        <RxCrossCircled
                          onClick={async () => {
                            const result = await AccountService.collectPost.delete(
                              post.save_id,
                            );
                            if (result.output.success && result.output.action === 'remove') {
                              customToast.success('刪除收藏成功');
                              setPosts((prev) => prev.filter(p => p.save_id !== post.save_id));
                            }
                          }}
                          className="text-white absolute right-[8px] top-[8px] cursor-pointer hover:text-[#a0ff1f] text-4xl"
                        />
                        <div className="absolute bottom-[16px] right-[16px] justify-end card-actions">
                          <span
                            onClick={() => handlePostClick(post, post.post_id)}
                            onMouseEnter={() => handleArrowHover(i, true)}
                            onMouseLeave={() => handleArrowHover(i, false)}
                            className="flex items-center cursor-pointer hover:text-neongreen"
                          >
                            <RxDoubleArrowRight
                              className={`me-4 ${arrowHovered[i] ? 'translate-x-[10px] duration-500 ease-in-out' : 'text-dark duration-500 ease-in-out'}`}
                            />
                            詳細...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                isFetched && <EmptyCollection itemType="貼文" linkPath="/community" />
              )}
              <PostModal
                className="z-[100]"
                post={p}
                modalId={modalId}
                isOpen={postModalToggle === modalId}
              />

              {pages.totalPages >= 1 && (
                <div className="mb-3 join bg-base-100">
                  <button
                    className={`${Number(router.query.page) > 1 ? '' : 'btn-disabled'} join-item btn border-slate-700 hover:bg-primary btn-xs`}
                    onClick={handlePrevPage}
                  >
                    «
                  </button>
                  {[...Array(Math.min(5, pages.totalPages))].map((v, i) => {
                    let p = pages.page <= 5 ? 1 + i : pages.page + i;
                    if (p < 1 || p > pages.totalPages) return null;
                    return (
                      <button
                        key={p}
                        className={`${p === pages.page ? 'text-neongreen' : ''} join-item btn max-w-[25px] border-slate-700 hover:bg-primary hover:text-dark btn-xs`}
                        onClick={(e) => {
                          e.preventDefault();
                          const nweQuery = { ...router.query, page: p };
                          router.push({ pathname: router.pathname, query: nweQuery }, undefined, { scroll: false });
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    className={`${parseInt(router.query.page) === pages.totalPages || pages.totalPages === 0 ? 'btn-disabled' : ''} join-item btn border-slate-700 hover:bg-primary btn-xs`}
                    onClick={handleNextPage}
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
}
