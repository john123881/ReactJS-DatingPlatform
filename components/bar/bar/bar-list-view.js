import { useEffect, useState, useCallback, useMemo } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import Loader from '@/components/ui/loader/loader';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
import { useBarList } from '@/hooks/bar/use-bar-list';
import PageTitle from '@/components/page-title';
import { useAuth } from '@/context/auth-context';
import { BarService } from '@/services/bar-service';

/**
 * 通用酒吧列表視圖組件
 */
export default function BarListView({ category, title, loaderText = '尋找美酒中...', onPageChange }) {
  const pageTitle = '酒吧探索';
  const { auth } = useAuth();
  const [savedBars, setSavedBars] = useState({});

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const {
    isLoading,
    bars,
    currentPage,
    barsPerPage,
    totalPages,
    maxPageNumberLimit,
    minPageNumberLimit,
    handlePageChange,
    onAreaSelected,
    onTypeSelected,
  } = useBarList(category);

  // 檢查儲存酒吧狀態
  const checkBarsStatus = useCallback(
    async (barIds) => {
      const userId = auth.id;
      if (userId === 0 || !barIds) return;

      try {
        const data = await BarService.checkBarStatus(userId, barIds);
        setSavedBars((prevSavedBars) => {
          const newSavedBars = { ...prevSavedBars };
          data.forEach((status) => {
            newSavedBars[status.barId] = status.isSaved;
          });
          return newSavedBars;
        });
      } catch (error) {
        console.error('無法獲取酒吧狀態:', error);
      }
    },
    [auth.id],
  );

  const barIdsString = useMemo(() => {
    return bars.map((bar) => bar.bar_id).join(',');
  }, [bars]);

  useEffect(() => {
    if (barIdsString && auth.id !== 0) {
      checkBarsStatus(barIdsString);
    }
  }, [barIdsString, checkBarsStatus, auth.id]);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row justify-center pt-28">
        {/* 側邊欄 - 桌面版 */}
        <div className="flex-col items-center hidden md:flex md:w-2/12">
          <BarListSidebar
            onAreaSelected={onAreaSelected}
            onTypeSelected={onTypeSelected}
          />
        </div>

        {/* 主內容區 */}
        <div className="flex flex-col justify-center w-11/12 gap-6 mx-auto md:w-8/12">
          <div className="text-sm breadcrumbs">
            <Breadcrumbs currentPage={title} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="font-bold text-white md:text-h5">
              {title}
            </div>
            {/* 手機版下拉選單 */}
            <BarListDropdownMobile />
            
            {/* 搜索框 (目前維持靜態展示，如需功能可擴展用 useBarList 處理) */}
            <label className="hidden input input-bordered md:flex items-center gap-2 h-[32px] rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white">
              <input type="text" className="grow placeholder:text-gray-400" placeholder="搜索" />
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
            </label>
          </div>

          {/* 酒吧卡片列表 */}
          <div className="flex flex-wrap items-center justify-center w-full gap-4 mx-auto min-h-[400px]">
            {isLoading ? (
              <Loader minHeight="60vh" text={loaderText} />
            ) : bars.length > 0 ? (
              bars
                .slice((currentPage - 1) * barsPerPage, currentPage * barsPerPage)
                .map((bar) => (
                  <BarCard
                    bar={bar}
                    key={bar.bar_id}
                    savedBars={savedBars}
                    setSavedBars={setSavedBars}
                  />
                ))
            ) : (
              <div className="text-white py-20 text-center w-full">目前該地區沒有酒吧資料</div>
            )}
          </div>

          {/* 分頁控制項 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-10">
              <button
                className="btn btn-sm btn-ghost text-white"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from(
                { length: maxPageNumberLimit - minPageNumberLimit + 1 },
                (_, index) => (
                  <button
                    key={minPageNumberLimit + index}
                    className={`btn btn-sm ${
                      currentPage === minPageNumberLimit + index
                        ? 'bg-[#A0FF1F] text-black border-none'
                        : 'btn-ghost text-white'
                    }`}
                    onClick={() => handlePageChange(minPageNumberLimit + index)}
                  >
                    {minPageNumberLimit + index}
                  </button>
                ),
              )}
              <button
                className="btn btn-sm btn-ghost text-white"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
        <div className="hidden md:flex md:w-2/12"></div>
      </div>
    </>
  );
}
