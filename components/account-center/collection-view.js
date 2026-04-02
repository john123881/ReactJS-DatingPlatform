import { useState } from 'react';
import AccountLayout from '@/components/account-center/account-layout';
import { useLoader } from '@/context/use-loader';
import PageLoader from '@/components/ui/loader/page-loader';
import Link from 'next/link';
import EmptyCollection from '@/components/account-center/empty-collection';
import { useAccountAuth } from '@/hooks/use-account-auth';

/**
 * 會員中心收藏列表通用視圖
 * @param {string} radio - 當前選中的標籤 ('貼文', '酒吧', '電影')
 * @param {array} items - 資料陣列
 * @param {object} pages - 分頁資訊 { page, totalPages }
 * @param {function} onFetchData - 抓取資料的回呼函數
 * @param {function} renderItem - 渲染單個卡片的函數
 * @param {string} emptyItemType - 空列表時顯示的類型名稱
 * @param {string} emptyLinkPath - 空列表時引導跳轉的路徑
 * @param {string} loaderType - 加載器類型
 * @param {function} onPageChange - Navbar 同步回呼
 */
export default function CollectionView({
  radio,
  items = [],
  pages = { page: 1, totalPages: 1 },
  onFetchData,
  renderItem,
  emptyItemType,
  emptyLinkPath,
  loaderType = 'collect',
  onPageChange,
}) {
  const pageTitle = '會員中心';
  const currentPage = '個人收藏';
  const { isLoading } = useLoader();
  
  // 使用統一的授權 Hook
  const { isFetched, auth, router } = useAccountAuth(onFetchData);

  // 處理分頁跳轉
  const handlePageChange = (page) => {
    if (page < 1 || page > pages.totalPages) return;
    const newQuery = { ...router.query, page };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { scroll: false });
  };

  return (
    <AccountLayout currentPage={currentPage} pageTitle={pageTitle}>
      <div>
        {/* TabBar */}
        <div className="grid-cols-4 mt-4 tabs">
          {['貼文', '酒吧', '電影'].map((type) => {
            const pathMap = { '貼文': 'post', '酒吧': 'bar', '電影': 'movie' };
            const isActive = radio === type;
            return (
              <Link
                key={type}
                href={`/account/collect/${pathMap[type]}/${auth.id}`}
                className={`tab ${isActive ? 'text-white border-b-2 border-b-white font-bold' : 'text-gray-400'} duration-300 transition-all`}
              >
                {type}
              </Link>
            );
          })}
        </div>

        {isLoading || !isFetched ? (
          <PageLoader type={loaderType} />
        ) : (
          <div className="mt-4 pb-3 flex flex-col justify-between w-full lg:mx-1 xl:mx-1 rounded-box place-items-center">
            {items.length > 0 ? (
              <>
                {items.map((item, index) => renderItem(item, index))}
                
                {/* 統一分頁控制 UI */}
                {pages.totalPages > 1 && (
                  <div className="mt-6 mb-3 join bg-base-100 shadow-sm border border-slate-700">
                    <button
                      className={`${pages.page > 1 ? '' : 'btn-disabled'} join-item btn btn-xs border-slate-700 hover:bg-neongreen hover:text-black`}
                      onClick={() => handlePageChange(pages.page - 1)}
                    >
                      «
                    </button>
                    {[...Array(Math.min(5, pages.totalPages))].map((_, i) => {
                      const p = pages.page <= 3 ? 1 + i : (pages.page + i - 2);
                      if (p < 1 || p > pages.totalPages) return null;
                      return (
                        <button
                          key={p}
                          className={`${p === pages.page ? 'text-neongreen font-bold border-b-neongreen' : 'text-white'} join-item btn btn-xs max-w-[30px] border-slate-700 hover:bg-neongreen hover:text-black`}
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      className={`${pages.page >= pages.totalPages ? 'btn-disabled' : ''} join-item btn btn-xs border-slate-700 hover:bg-neongreen hover:text-black`}
                      onClick={() => handlePageChange(pages.page + 1)}
                    >
                      »
                    </button>
                  </div>
                )}
              </>
            ) : (
              isFetched && <EmptyCollection itemType={emptyItemType} linkPath={emptyLinkPath} />
            )}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
