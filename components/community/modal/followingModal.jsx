import { usePostContext } from '@/context/post-context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './modal.module.css';
import { getImageUrl } from '@/services/image-utils';

export default function FollowingModal({ followings, modalId }) {
  const {
    resetAndCloseFollowingModal,
    setProfilePosts,
    setProfilePage,
    setUserProfileHasMore,
    setReload,
    followingModalRef,
  } = usePostContext();

  const router = useRouter();

  const handleProfileClick = async (userId) => {
    // 清空當前貼文列表和重置頁碼以確保載入新用戶的貼文
    setProfilePosts([]);
    setProfilePage(1);
    setUserProfileHasMore(true);

    await resetAndCloseFollowingModal();
    await followingModalRef.current.close(); // 確保模態窗口關閉

    if (router.query.uid === userId.toString()) {
      // 如果用戶點擊的是已經在的個人檔案頁面，則強制觸發更新
      setReload((prev) => !prev); // 切換 forceUpdate 狀態
    } else {
      router.push(`/community/profile/${userId}`); // 導向新的用戶檔案
    }
  };

  return (
    <>
      <dialog
        id={modalId}
        ref={followingModalRef}
        className="modal modal-bottom sm:modal-middle max-w-full"
      >
        <div
          className="modal-box md:w-[450px] md:h-[550px] border border-white/10 shadow-2xl relative overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), 0 0 1px rgba(57, 255, 20, 0.2)'
          }}
        >
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <h3 className="font-black text-2xl text-white tracking-tighter uppercase italic">
              Following <span className="text-neongreen text-sm not-italic ml-1 opacity-70">/ 追蹤中</span>
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-neongreen transition-colors">✕</button>
            </form>
          </div>

          <ul className="space-y-1 pr-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {followings.map((user, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/10 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleProfileClick(user.user_id);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/5 group-hover:ring-neongreen/50 transition-all duration-500">
                      <img
                        src={getImageUrl(user.avatar, 'avatar')}
                        alt={user.username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm group-hover:text-neongreen transition-colors">
                      {user.username}
                    </span>
                    <span className="text-gray-500 text-xs font-mono opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                      @{user.email.split('@')[0]}
                    </span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[10px] cursor-pointer uppercase tracking-widest text-neongreen font-black bg-neongreen/10 px-2 py-1 rounded border border-neongreen/30">View Profile</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => {
              resetAndCloseFollowingModal();
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
}
