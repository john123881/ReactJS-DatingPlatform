import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { usePostContext } from '@/context/post-context';
import { useRouter } from 'next/router';
import Router from 'next/router';
import ShareModal from '../modal/shareModal';
import EditModal from '../modal/editModal';
import { FiSend, FiMessageCircle, FiMoreHorizontal } from 'react-icons/fi';
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { getImageUrl, handleImageError } from '@/services/image-utils';


export default function PostModal({ post, modalId, isOpen }) {
  const { auth } = useAuth();
  const router = useRouter();
  const postModalRef = useRef(null);
  const textareaRef = useRef(null);

  // 用組件內的區域狀態管理輸入，避免全域 context 每打一個字就觸發所有卡片重新渲染（解決卡頓）
  const [localComment, setLocalComment] = useState('');

  const {
    handleLikedClick,
    handleSavedClick,
    likedPosts,
    savedPosts,
    comments,
    handleCommentUpload,
    handleDeletePostClick,
    handleDeleteCommentClick,
    setPostModalToggle,
    setProfilePosts,
    setProfilePage,
    setUserProfileHasMore,
    handleKeyPress,
  } = usePostContext();

  const userId = auth.id;
  const isLiked = likedPosts[post.post_id] || false;
  const isSaved = savedPosts[post.post_id] || false;
  const editModalId = `edit_modal_${post.post_id}`;
  const shareModalId = `share_modal_${post.post_id}`;

  const handleCommentContentChange = (e) => {
    setLocalComment(e.target.value);
  };

  const handleUserClick = (userId) => {
    setProfilePosts([]);
    setProfilePage(1);
    setUserProfileHasMore(true);
    setPostModalToggle(false);
    router.push(`/community/profile/${userId}`);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setPostModalToggle(false);
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <div
        id={modalId}
        ref={postModalRef}
        className={`modal z-[101] transition-all duration-300 ${isOpen ? 'modal-open pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div
          className="modal-box w-full max-w-[1200px] max-h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden p-0 flex flex-col md:flex-row relative will-change-transform"
        >
          <button
            onClick={() => {
              setPostModalToggle(false);
            }}
            className="btn btn-sm btn-circle bg-black/50 border-none absolute right-4 top-4 z-[110] text-white hover:text-neongreen"
          >
            ✕
          </button>

          <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
            {/* Left side: Image */}
            <figure
              className="w-full md:w-[60%] bg-black flex items-center justify-center p-0 m-0"
              onDoubleClick={() => {
                handleLikedClick(post);
              }}
            >
                <img
                  src={getImageUrl(post.img, 'post')}
                  alt={post.photo_name || 'No Image Available'}
                  className="w-full h-full object-contain max-h-[50vh] md:max-h-none"
                  onError={(e) => handleImageError(e, 'post')}
                />
            </figure>

            {/* Right side: Content & Comments */}
            <div className="flex flex-col w-full md:w-[40%] bg-[#0A0A0A] h-full overflow-hidden border-l border-white/10">
              <div className="px-6 pb-6 pt-14 overflow-auto hide-scrollbar flex-grow">
                {/* Header */}
                <div className="flex flex-row items-center gap-3 mb-6 justify-between">
                  <div className="flex justify-start items-center gap-2">
                    <div className="avatar">
                      <div className="w-10 rounded-full border border-white/10 p-[2px] flex items-center justify-center overflow-hidden cursor-pointer"
                           onClick={() => handleUserClick(post.post_userId)}>
                        <img
                          src={getImageUrl(post.avatar, 'avatar')}
                          alt={post.photo_name || 'No Image Available'}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => handleImageError(e, 'avatar')}
                        />
                      </div>
                    </div>
                    <div
                      className="cursor-pointer font-bold text-sm hover:text-neongreen transition-colors"
                      onClick={() => handleUserClick(post.post_userId)}
                    >
                      <span>
                        {post.email ? post.email.split('@')[0] : 'unknownuser'}
                      </span>
                    </div>
                  </div>
                  
                  {userId === post.post_userId && (
                    <div className="flex justify-end pr-1">
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="p-2 cursor-pointer">
                          <FiMoreHorizontal className="text-xl hover:text-neongreen transition-colors" />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[120] menu p-2 shadow-2xl bg-neutral-800 border border-white/10 rounded-xl w-32"
                        >
                          <li>
                            <a
                              className="hover:text-neongreen text-sm"
                              onClick={() =>
                                document.getElementById(editModalId).showModal()
                              }
                            >
                              編輯貼文
                            </a>
                          </li>
                          <li>
                            <a
                              className="hover:text-red-500 text-sm"
                              onClick={() => handleDeletePostClick(post, modalId)}
                            >
                              刪除貼文
                            </a>
                          </li>
                        </ul>
                      </div>
                      <EditModal
                        post={post}
                        modalId={editModalId}
                        key={post.post_id}
                      />
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="mb-8 px-2">
                  <p className="text-gray-200 text-sm leading-relaxed">{post.post_context}</p>
                </div>

                {/* Comment list */}
                <div className="space-y-6">
                  {comments[post.post_id] &&
                    comments[post.post_id].map((comment, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-start gap-3">
                          <div className="avatar flex-shrink-0">
                            <div className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center overflow-hidden cursor-pointer"
                                 onClick={() => handleUserClick(comment.user_id)}>
                              <img
                                src={getImageUrl(comment.avatar, 'avatar')}
                                alt="avatar"
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => handleImageError(e, 'avatar')}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span 
                                className="font-bold text-xs cursor-pointer hover:text-neongreen transition-colors"
                                onClick={() => handleUserClick(comment.user_id)}
                              >
                                {comment.email ? comment.email.split('@')[0] : 'unknownuser'}
                              </span>
                              
                              {userId === comment.user_id && (
                                <div className="dropdown dropdown-end">
                                  <div tabIndex={0} className="p-1 cursor-pointer">
                                    <FiMoreHorizontal className="text-gray-400 hover:text-neongreen" />
                                  </div>
                                  <ul
                                    tabIndex={0}
                                    className="dropdown-content z-50 menu p-2 shadow-2xl bg-neutral-800 border border-white/10 rounded-xl w-32"
                                  >
                                    <li>
                                      <a
                                        className="hover:text-red-500 text-xs"
                                        onClick={() => handleDeleteCommentClick(comment)}
                                      >
                                        刪除回覆
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-300 break-words mt-1 leading-normal">
                              {comment.context}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions & Comment Input Area */}
              <div className="p-6 bg-[#0A0A0A] border-t border-white/10">
                {userId !== 0 && userId !== null && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-5">
                        {isLiked ? (
                          <FaHeart
                            className="text-2xl text-neongreen cursor-pointer hover:scale-110 active:scale-95 transition-all"
                            onClick={() => handleLikedClick(post)}
                          />
                        ) : (
                          <FaRegHeart
                            className="text-2xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 active:scale-95 transition-all"
                            onClick={() => handleLikedClick(post)}
                          />
                        )}
                        <FiMessageCircle
                          className="text-2xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                          onClick={() => textareaRef.current?.focus()}
                        />
                        <FiSend
                          className="text-2xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                          onClick={() => document.getElementById(shareModalId).showModal()}
                        />
                        <ShareModal
                          post={post}
                          key={post.post_id}
                          postId={post.post_id}
                          modalId={shareModalId}
                        />
                      </div>
                      <div>
                        {isSaved ? (
                          <FaBookmark
                            className="text-2xl text-neongreen cursor-pointer hover:scale-110 transition-all"
                            onClick={() => handleSavedClick(post)}
                          />
                        ) : (
                          <FaRegBookmark
                            className="text-2xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                            onClick={() => handleSavedClick(post)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row gap-3 items-end">
                      <textarea
                        ref={textareaRef}
                        className="textarea bg-white/5 border-white/10 w-full h-11 min-h-[44px] max-h-32 resize-none rounded-xl p-3 focus:border-neongreen/50 outline-none text-sm transition-all overflow-auto hide-scrollbar text-white placeholder:text-gray-600"
                        placeholder="新增回覆..."
                        value={localComment}
                        onChange={handleCommentContentChange}
                        onKeyDown={(e) =>
                          handleKeyPress(e, () => {
                            handleCommentUpload(post, localComment);
                            setLocalComment('');
                          })
                        }
                      />
                      <button
                        className="h-11 px-6 text-neongreen hover:text-black hover:bg-neongreen border border-neongreen/50 hover:border-neongreen rounded-xl transition-all font-bold text-sm whitespace-nowrap"
                        onClick={async () => {
                          await handleCommentUpload(post, localComment);
                          setLocalComment('');
                        }}
                      >
                        發送
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-black/80"
          onClick={() => setPostModalToggle(false)}
        >
          <button>close</button>
        </form>
      </div>
    </>
  );
}
