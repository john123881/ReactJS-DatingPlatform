import { usePostContext } from '@/context/post-context';
import { useRouter } from 'next/router';
import styles from './modal.module.css';
import { FiSearch } from 'react-icons/fi';

export default function SearchModal() {
  const {
    searchTerm,
    searchResults,
    hasSearched,
    getSearchUsers,
    resetAndCloseSearchModal,
    setIsHoverActive,
    setProfilePosts,
    setProfilePage,
    setUserProfileHasMore,
    setReload,
    searchModalRef,
    handleFilterClick,
  } = usePostContext();

  const router = useRouter();

  const handleSearchChange = async (e) => {
    getSearchUsers(e.target.value);
  };

  const handleTagSearch = (keyword) => {
    // 呼叫過濾邏輯
    handleFilterClick(keyword);
    // 關閉 Modal
    resetAndCloseSearchModal();
    if (searchModalRef.current) {
      searchModalRef.current.close();
    }
  };

  const handleProfileClick = async (userId) => {
    // 清空當前貼文列表和重置頁碼以確保載入新用戶的貼文
    setProfilePosts([]);
    setProfilePage(1);
    setUserProfileHasMore(true);

    await resetAndCloseSearchModal();
    setIsHoverActive(true);
    await searchModalRef.current.close(); // 確保模態窗口關閉

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
        id="search_modal"
        ref={searchModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div
          className="modal-box w-[500px] h-[500px] "
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <p
            className={`${styles['searchModalListItemText']} font-bold text-lg mb-5 text-h5 flex justify-center`}
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
              placeholder="搜尋標籤、關鍵字或用戶... "
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>
          
          <ul className="mt-4">
            {/* 搜尋標籤或關鍵字選項 */}
            {searchTerm.trim().length > 0 && (
              <li
                className="flex items-center gap-3 p-3 mb-4 rounded-xl border border-neongreen/30 bg-neongreen/5 hover:bg-neongreen/10 cursor-pointer transition-all group scale-100 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleTagSearch(searchTerm)}
              >
                <div className="w-10 h-10 rounded-full bg-neongreen/20 flex items-center justify-center text-neongreen text-xl group-hover:bg-neongreen group-hover:text-black transition-colors">
                  <FiSearch />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold">搜尋標籤或關鍵字</span>
                  <span className="text-neongreen text-sm font-medium">
                    {searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}`}
                  </span>
                </div>
              </li>
            )}

            {hasSearched && searchResults.length === 0 ? (
              searchTerm.trim().length === 0 && (
                <p className={`${styles['searchModalListText']} text-center py-10 opacity-50`}>
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
                      <div className="w-10 rounded-full border border-white/10">
                        <img
                          src={user.avatar || '/unknown-user-image.jpg'}
                          alt={user.username || 'No Image Available'}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`${styles['searchModalListEmail']} text-white text-sm font-medium`}>
                        {user.username}
                      </span>
                      <span className="text-gray-500 text-xs">
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
          <button
            onClick={() => {
              // some weird bug here (daisy UI), use setTimeout to force execute this function
              setTimeout(() => {
                setIsHoverActive(true);
              }, 0);
              resetAndCloseSearchModal();
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
}
