import { useState, useEffect, useRef, memo } from 'react';
import { useAuth } from '@/context/auth-context';
import { usePostContext } from '@/context/post-context';
import { useRouter } from 'next/router';
import Router from 'next/router';
import ShareModal from '../modal/shareModal';
import EditModal from '../modal/editModal';
import { FiSend, FiMessageCircle, FiMoreHorizontal } from 'react-icons/fi';
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { getImageUrl, handleImageError } from '@/services/image-utils';


function PostModalContent({ post, modalId, isOpen }) {
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
    loadingComments,
    handleCommentUpload,
    handleDeletePostClick,
    handleDeleteCommentClick,
    handleCommentUpdate,
    handleFilterClick,
    getPostComments,
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

  useEffect(() => {
    if (isOpen && post.post_id) {
      getPostComments(post.post_id);
    }
  }, [isOpen, post.post_id, getPostComments]);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return '剛剛';
    if (diff < 3600) return `${Math.floor(diff / 60)}分鐘前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小時前`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.comm_comment_id);
    setEditingText(comment.context);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const submitEdit = async (commentId) => {
    if (!editingText.trim()) return;
    const success = await handleCommentUpdate(commentId, editingText);
    if (success) {
      setEditingCommentId(null);
      setEditingText('');
    }
  };

  return (
    <>
      <div
        id={modalId}
        ref={postModalRef}
        className={`modal flex transition-all duration-300 ${isOpen ? 'modal-open pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        style={{ zIndex: 99999 }}
      >
        <div
          className="modal-box w-full md:max-w-[1200px] md:max-h-[90vh] h-full h-screen max-h-none md:max-h-[90vh] rounded-none md:rounded-2xl bg-[#0A0A0A] border-none md:border md:border-white/10 overflow-hidden p-0 flex flex-col md:flex-row relative will-change-transform m-0"
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
                  className="w-full h-full object-contain max-h-[35vh] md:max-h-none"
                  loading="eager"
                  fetchpriority="high"
                  decoding="sync"
                  onError={(e) => handleImageError(e, 'post')}
                />
            </figure>

            {/* Right side: Content & Comments */}
            <div className="flex flex-col w-full md:w-[40%] bg-[#0A0A0A] h-full overflow-hidden border-l border-white/10">
              <div className="px-6 pb-10 pt-20 md:pt-14 overflow-auto hide-scrollbar flex-grow">
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
                      className="flex items-center gap-2"
                    >
                      <div
                        className="cursor-pointer font-bold text-sm hover:text-neongreen transition-colors"
                        onClick={() => handleUserClick(post.post_userId)}
                      >
                        <span>
                          {post.email ? post.email.split('@')[0] : 'unknownuser'}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal mt-0.5">
                        • {formatTime(post.created_at)}
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
                <div className="mb-4 px-2">
                  <p className="text-gray-200 text-sm leading-relaxed mb-4">
                    {(post.post_context || '').split('#')[0].trim()}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(post.post_context || '').split('#').slice(1).map((tag, i) => (
                      <div key={i} className="badge badge-outline border-neongreen/30 text-neongreen text-[10px] px-2 py-2">
                        #{tag.trim()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comment list */}
                <div className="space-y-8">
                  {loadingComments[post.post_id] ? (
                    // Skeleton UI
                    <>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col gap-2 animate-pulse">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
                            <div className="flex flex-col flex-grow gap-2 mt-1">
                              <div className="h-3 w-20 bg-white/5 rounded" />
                              <div className="h-3 w-full bg-white/5 rounded" />
                              <div className="h-3 w-2/3 bg-white/5 rounded" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    comments[post.post_id] &&
                    comments[post.post_id].map((comment, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex items-start gap-3">
                          <div className="avatar flex-shrink-0">
                            <div
                              className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center overflow-hidden cursor-pointer"
                              onClick={() => handleUserClick(comment.user_id)}
                            >
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
                                {comment.email
                                  ? comment.email.split('@')[0]
                                  : 'unknownuser'}
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500">
                                  {formatTime(comment.created_at)}
                                </span>
                                {userId === comment.user_id && (
                                  <div className="dropdown dropdown-end">
                                    <div
                                      tabIndex={0}
                                      className="p-1 cursor-pointer"
                                    >
                                      <FiMoreHorizontal className="text-gray-400 hover:text-neongreen" />
                                    </div>
                                    <ul
                                      tabIndex={0}
                                      className="dropdown-content z-50 menu p-2 shadow-2xl bg-neutral-800 border border-white/10 rounded-xl w-32"
                                    >
                                      <li>
                                        <a
                                          className="hover:text-neongreen text-xs"
                                          onClick={() => startEditing(comment)}
                                        >
                                          編輯回覆
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          className="hover:text-red-500 text-xs"
                                          onClick={() =>
                                            handleDeleteCommentClick(comment)
                                          }
                                        >
                                          刪除回覆
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            {editingCommentId === comment.comm_comment_id ? (
                              <div className="mt-2 flex flex-col gap-2">
                                <textarea
                                  className="textarea bg-white/5 border-white/10 w-full min-h-[60px] resize-none rounded-lg p-2 focus:border-neongreen/50 outline-none text-xs text-white"
                                  value={editingText}
                                  onChange={(e) =>
                                    setEditingText(e.target.value)
                                  }
                                  autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    className="btn btn-xs btn-ghost text-gray-400 hover:text-white"
                                    onClick={cancelEditing}
                                  >
                                    取消
                                  </button>
                                  <button
                                    className="btn btn-xs bg-neongreen border-none text-black hover:bg-neongreen/80"
                                    onClick={() =>
                                      submitEdit(comment.comm_comment_id)
                                    }
                                  >
                                    儲存
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-300 break-words mt-1 leading-normal">
                                {comment.context}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions & Comment Input Area */}
              <div className="p-4 md:p-6 pb-32 md:pb-6 bg-[#0A0A0A] border-t border-white/10">
                {userId !== 0 && userId !== null && (
                  <div className="flex flex-col gap-3 md:gap-4">
                    {/* Icons Area - more compact on mobile */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-4 md:gap-5">
                        {isLiked ? (
                          <FaHeart
                            className="text-xl md:text-2xl text-neongreen cursor-pointer hover:scale-110 active:scale-95 transition-all"
                            onClick={() => handleLikedClick(post)}
                          />
                        ) : (
                          <FaRegHeart
                            className="text-xl md:text-2xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 active:scale-95 transition-all"
                            onClick={() => handleLikedClick(post)}
                          />
                        )/* 移除多餘的括號 */}
                        <FiMessageCircle
                          className="text-xl md:text-2xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                          onClick={() => textareaRef.current?.focus()}
                        />
                        <FiSend
                          className="text-xl md:text-2xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                          onClick={() => document.getElementById(shareModalId).showModal()}
                        />
                      </div>
                      <div>
                        {isSaved ? (
                          <FaBookmark
                            className="text-xl md:text-2xl text-neongreen cursor-pointer hover:scale-110 transition-all"
                            onClick={() => handleSavedClick(post)}
                          />
                        ) : (
                          <FaRegBookmark
                            className="text-xl md:text-2xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                            onClick={() => handleSavedClick(post)}
                          />
                        )}
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex flex-row gap-2 md:gap-3 items-end">
                      <textarea
                        ref={textareaRef}
                        className="textarea bg-white/5 border-white/10 w-full h-10 md:h-11 min-h-[40px] md:min-h-[44px] max-h-32 resize-none rounded-xl p-2 md:p-3 focus:border-neongreen/50 outline-none text-xs md:text-sm transition-all overflow-auto hide-scrollbar text-white placeholder:text-gray-600"
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
                        className="h-10 md:h-11 px-4 md:px-6 text-neongreen hover:text-black hover:bg-neongreen border border-neongreen/50 hover:border-neongreen rounded-xl transition-all font-bold text-xs md:text-sm whitespace-nowrap"
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
        <div
          className="modal-backdrop bg-black/80"
          onClick={() => setPostModalToggle(false)}
        >
          <button className="hidden">close</button>
        </div>
      </div>
    </>
  );
}

const PostModal = memo(PostModalContent, (prevProps, nextProps) => {
  // 只有當 isOpen 狀態改變，或是貼文內容/圖片有更新時才重繪
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.post.post_id === nextProps.post.post_id &&
    prevProps.post.updated_at === nextProps.post.updated_at &&
    prevProps.post.img === nextProps.post.img
  );
});

PostModal.displayName = 'PostModal';

export default PostModal;
