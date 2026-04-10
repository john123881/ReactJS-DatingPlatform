import { usePostContext } from '@/context/post-context';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './modal.module.css';
import { FiSearch } from 'react-icons/fi';

export default function SearchModalMobile() {
  const {
    searchTerm,
    searchResults,
    hasSearched,
    getSearchUsers,
    resetAndCloseSearchModal,
    setProfilePosts,
    setProfilePage,
    setUserProfileHasMore,
    setReload,
    searchModalMobileRef,
    handleFilterClick,
    setIsHoverActive,
  } = usePostContext();

  const router = useRouter();

  const handleSearchChange = async (e) => {
    getSearchUsers(e.target.value);
  };

  const handleProfileClick = async (userId) => {
    // 清空當前貼文列表和重置頁碼以確保載入新用戶的貼文
    setProfilePosts([]);
    setProfilePage(1);
    setUserProfileHasMore(true);

    await resetAndCloseSearchModal();
    await searchModalMobileRef.current.close(); // 確保模態窗口關閉

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
        id="search_modal_mobile"
        ref={searchModalMobileRef}
        className="modal modal-top sm:modal-middle"
      >
        <div
          className="modal-box flex flex-col"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <p
            className={`${styles['searchModalListItemText']} font-bold text-lg mb-5 text-h5`}
          >
            搜尋
          </p>
          <label className="input input-bordered flex items-center gap-2 mb-3 ">
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
              type="text"
              className="grow"
              placeholder="搜尋......"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>
          {/* <p className={`${styles['searchModalListItemText']} text-h6 mb-3`}>
            歷史紀錄
          </p> */}
          <ul className="mt-4 overflow-y-auto flex-1">
            {/* 搜尋標籤或關鍵字選項 */}
            {searchTerm.trim().length > 0 && (
              <li
                className="flex items-center gap-3 p-3 mb-4 rounded-xl border border-neongreen/30 bg-neongreen/5 hover:bg-neongreen/10 cursor-pointer transition-all group scale-100 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  handleFilterClick(searchTerm);
                  resetAndCloseSearchModal();
                  if (searchModalMobileRef.current) {
                    searchModalMobileRef.current.close();
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-neongreen/20 flex items-center justify-center text-neongreen text-xl group-hover:bg-neongreen group-hover:text-black transition-colors">
                  <FiSearch />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">搜尋標籤或關鍵字</span>
                  <span className="text-neongreen text-xs font-medium">
                    {searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}`}
                  </span>
                </div>
              </li>
            )}

            {hasSearched && searchResults.length === 0 ? (
              searchTerm.trim().length > 0 && (
                <p className={`${styles['searchModalListText']} text-center py-10 opacity-50 text-sm`}>
                  未找到結果
                </p>
              )
            ) : (
              searchResults.map((user, index) => (
                <li
                  key={index}
                  className="searchModalListItem flex flex-row justify-between items-center mb-3 p-2 hover:bg-white/5 rounded-2xl transition-all cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleProfileClick(user.user_id);
                  }}
                >
                  <div className="card-iconListLeft flex flex-row items-center">
                    <div className="avatar mr-3">
                      <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
                        <img
                          src={user.avatar || '/unknown-user-image.jpg'}
                          alt={user.username || 'No Image Available'}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className={`${styles['searchModalListEmail']} text-white text-sm font-medium`}>
                        {user.username}
                      </span>
                      <span className="text-gray-500 text-xs text-left">
                        @{user.email.split('@')[0]}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={resetAndCloseSearchModal}>close</button>
        </form>
      </dialog>
    </>
  );
}
