import { useAuth } from '@/context/auth-context';
import { usePostContext } from '@/context/post-context';
import { useRouter } from 'next/router';
import { FiSend, FiMessageCircle, FiMoreHorizontal } from 'react-icons/fi';
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import ShareModal from '../modal/shareModal';
import PostModal from '../modal/postModal';
import EditModal from '../modal/editModal';
import styles from './card.module.css';

import { getImageUrl, handleImageError } from '@/services/image-utils';

export default function PostCardLarge({ post }) {
  const { auth } = useAuth();

  const router = useRouter();

  const {
    socket,
    userInfo,
    handleLikedClick,
    handleSavedClick,
    likedPosts,
    savedPosts,
    handleDeletePostClick,
    postModalToggle,
    setProfilePosts,
    setProfilePage,
    setUserProfileHasMore,
    setPostModalToggle,
  } = usePostContext();

  const userId = auth.id;

  const isLiked = likedPosts[post.post_id] || false;
  const isSaved = savedPosts[post.post_id] || false;

  // 基於 post_id 的唯一 id
  const modalId = `photo_modal_${post.post_id}`;

  // 基於 post_id 的唯一 edit modal id
  const editModalId = `edit_modal_${post.post_id}`;

  // 基於 post_id 的唯一 share modal id
  const shareModalId = `share_modal_${post.post_id}`;

  const handleUserClick = (userId) => {
    // 清空當前貼文列表和重置頁碼以確保載入新用戶的貼文
    setProfilePosts([]);
    setProfilePage(1);
    setUserProfileHasMore(true);
    setPostModalToggle(false);

    router.push(`/community/profile/${userId}`);
  };

  const handleNotification = (type) => {
    // 確保 socket已獲取
    if (socket) {
      const notificationData = {
        senderId: userInfo.user_id,
        senderName: userInfo.username,
        avatar: userInfo.avatar,
        receiverId: post.post_userId,
        receiverName: post.username,
        type: type,
        postId: post.post_id,
        message: `${userInfo.username} ${
          type === 'like'
            ? '喜愛你的貼文'
            : type === 'comment'
              ? '回覆你的貼文'
              : '開始追蹤你'
        }`,
      };
      socket.emit('sendNotification', notificationData);
    }
  };

  const handleRemoveNotification = (type) => {
    if (socket) {
      const notificationData = {
        senderId: userInfo.user_id,
        receiverId: post.post_userId,
        postId: post.post_id,
        type: type,
      };
      socket.emit('removeNotification', notificationData);
    }
  };

  return (
    <>
      <div className="card sm:w-[330px] md:w-[480px] sm:h-auto max-h-[700px] overflow-hidden flex border-grayBorder mx-5">
        <div className="card-user flex h-10 items-center gap-2 m-2 justify-between">
          <div className="flex justify-start items-center gap-2 ">
            <div
              className="cursor-pointer"
              onClick={() => handleUserClick(post.post_userId)}
            >
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={getImageUrl(post.avatar, 'avatar')}
                    alt={post.photo_name || 'No Image Available'}
                    onError={(e) => handleImageError(e, 'avatar')}
                  />
                </div>
              </div>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleUserClick(post.post_userId)}
            >
              <span>
                {post.email ? post.email.split('@')[0] : 'unknownuser'}
              </span>
            </div>
          </div>
          {/* 只有當用戶登入時顯示這些元件 */}
          {userId === post.post_userId ? (
            <div className="flex justify-end">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className="m-2">
                  <FiMoreHorizontal className="card-icon hover:text-neongreen" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-50"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  }}
                >
                  <li>
                    <a
                      className="hover:text-neongreen"
                      onClick={() =>
                        document.getElementById(editModalId).showModal()
                      }
                    >
                      編輯貼文
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-neongreen"
                      onClick={() => handleDeletePostClick(post)}
                    >
                      刪除貼文
                    </a>
                  </li>
                </ul>
              </div>
              <EditModal post={post} modalId={editModalId} key={post.post_id} />
            </div>
          ) : null}
        </div>
        <figure
          className="card-photo m-0 z-40"
          onDoubleClick={() => {
            handleLikedClick(post);
            handleRemoveNotification('like');
            if (!isLiked) {
              handleNotification('like');
            }
          }}
        >
          <div className={styles.parallaxContainer}>
            <div className={styles.parallax}>
              <div className={styles.parallaxHoverTopLeft}></div>
              <div className={styles.parallaxHoverTopRight}></div>
              <div className={styles.parallaxHoverBottomLeft}></div>
              <div className={styles.parallaxHoverBottomRight}></div>
              <div className={styles.parallaxContent}>
                <div className="parallaxContentBack">
                  <img
                    src={getImageUrl(post.img, 'post')}
                    alt={post.photo_name || 'No Image Available'}
                    className={`${styles.parallaxMedia} card-photo w-[480px] h-[480px] object-cover`}
                    onError={(e) => handleImageError(e, 'post')}
                  />
                </div>
              </div>
            </div>
          </div>
        </figure>
        <div className="card-body w-full p-0 overflow-auto hide-scrollbar max-w-[480px] px-3 py-3">
          {/* 只有當用戶登入時顯示這些元件 */}
          {userId !== 0 && userId !== null && (
            <div className="card-iconList text-h4 flex flex-row justify-between">
              <div className="card-iconListLeft flex flex-row gap-1">
                {isLiked ? (
                  <FaHeart
                    className="card-icon hover:text-neongreen"
                    onClick={() => {
                      handleLikedClick(post);
                      handleRemoveNotification('like');
                    }}
                  />
                ) : (
                  <FaRegHeart
                    className="card-icon  hover:text-neongreen"
                    onClick={() => {
                      handleLikedClick(post);
                      handleNotification('like');
                    }}
                  />
                )}

                <FiMessageCircle
                  className="card-icon hover:text-neongreen"
                  onClick={() => {
                    setPostModalToggle(modalId);
                  }}
                />
                <FiSend
                  className="card-icon hover:text-neongreen"
                  onClick={() => {
                    document.getElementById(shareModalId).showModal();
                  }}
                />
                <ShareModal
                  post={post}
                  key={post.post_id}
                  postId={post.post_id}
                  modalId={shareModalId}
                />
              </div>
              <div className="card-iconListRight flex justify-end">
                {isSaved ? (
                  <FaBookmark
                    className="card-icon hover:text-neongreen"
                    onClick={() => handleSavedClick(post)}
                  />
                ) : (
                  <FaRegBookmark
                    className="card-icon hover:text-neongreen"
                    onClick={() => handleSavedClick(post)}
                  />
                )}
              </div>
            </div>
          )}
          <p className="postContext mb-2">{post.post_context}</p>
          <div className="flex flex-wrap gap-2 mb-3 px-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#a0ff1f] text-[#a0ff1f] bg-black/50"># 新年派對</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#ff03ff] text-[#ff03ff] bg-black/50"># 慶祝時刻</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#00d4ff] text-[#00d4ff] bg-black/50"># 酒吧</span>
          </div>
          <p
            className="commentontext text-[12px] text-grayBlue cursor-pointer"
            onClick={() => {
              setPostModalToggle(modalId);
            }}
          >
            查看回覆
          </p>
          <PostModal
            key={post.post_id}
            post={post}
            modalId={modalId}
            isOpen={postModalToggle === modalId}
          />
          {/* {showReply && (
            <div className="flex flex-col justify-center items-center">
              <textarea
                className="textarea textarea-ghost w-full h-16 resize-none rounded-full mb-3"
                placeholder="新增回覆"
              />
              <button className="btn bg-dark border-primary rounded-full text-primary hover:shadow-xl3 flex justify-center">
                分享
              </button>
            </div>
          )} */}
          <div className="card-actions justify-end"></div>
        </div>
      </div>
    </>
  );
}
