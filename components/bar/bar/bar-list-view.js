import { useEffect, useState, useCallback, useMemo } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import Loader from '@/components/ui/loader/loader';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
import { useBarList } from '@/hooks/bar/use-bar-list';
import PageTitle from '@/components/page-title';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { BarService } from '@/services/bar-service';

/**
 * 通用酒吧列表視圖組件
 */
export default function BarListView({ category, title, loaderText = '正在探索驚喜...', onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  const { auth } = useAuth();
  
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  // 搜尋與狀態管理
  const [savedBars, setSavedBars] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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

  // 監聽 Bars 變化同步 ID
  const barIdsString = useMemo(() => {
    const activeBars = hasSearched ? searchResults : bars;
    return activeBars.map((bar) => bar.bar_id).join(',');
  }, [bars, searchResults, hasSearched]);

  useEffect(() => {
    if (barIdsString && auth.id !== 0) {
      checkBarsStatus(barIdsString);
    }
  }, [barIdsString, checkBarsStatus, auth.id]);

  // 搜尋邏輯 (與主頁面同步)
  const getSearchBars = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await BarService.searchBars(value);
      setSearchResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        getSearchBars(searchTerm);
      } else {
        setSearchResults([]);
        setHasSearched(false);
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col lg:flex-row justify-center pt-28 px-4 lg:px-12 gap-8 max-w-[1600px] mx-auto">
        {/* 側邊欄 */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-32 glass-card-neon p-6 rounded-[2.5rem] border border-white/10 shadow-[0_0_20px_rgba(160,255,31,0.05)]">
            <BarListSidebar
              onAreaSelected={onAreaSelected}
              onTypeSelected={onTypeSelected}
            />
          </div>
        </aside>

        {/* 主內容 */}
        <main className="flex-1 flex flex-col gap-8">
          <div className="text-sm breadcrumbs">
            <Breadcrumbs currentPage={title} />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 className="font-bold text-white text-2xl lg:text-4xl neon-text-green">
              {hasSearched ? `搜尋：${searchTerm}` : title}
            </h1>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <BarListDropdownMobile />
              <label className="flex-1 md:flex-none flex items-center gap-2 h-[42px] lg:h-[45px] px-5 lg:px-6 rounded-full border border-white/20 bg-white/5 hover:border-[#A0FF1F] text-white transition-all duration-300 w-full md:w-[350px] group focus-within:border-[#A0FF1F] focus-within:bg-white/10 [box-shadow:0_0_15px_rgba(160,255,31,0.05)]">
                <input
                  type="text"
                  className="grow bg-transparent focus:outline-none placeholder:text-white/40 text-sm"
                  placeholder="搜尋氛圍、名稱或地區..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 lg:w-5 lg:h-5 opacity-60 text-[#A0FF1F] group-hover:scale-110 transition-transform">
                  <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
          </div>

          {/* 網格列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-10 min-h-[600px]">
            {isLoading || isSearching ? (
              <div className="col-span-full">
                <Loader minHeight="400px" text={loaderText} />
              </div>
            ) : hasSearched ? (
              searchResults.length > 0 ? (
                searchResults.map((bar, index) => (
                  <div key={bar.bar_id} className={`animate-fadeInUp stagger-${(index % 8) + 1} flex justify-center`}>
                    <BarCard bar={bar} savedBars={savedBars} setSavedBars={setSavedBars} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-white/60 py-20 text-center glass-card-neon rounded-3xl">
                  找不到符合的酒吧，換個關鍵字試試？
                </div>
              )
            ) : bars.length > 0 ? (
              bars
              .slice((currentPage - 1) * barsPerPage, currentPage * barsPerPage)
              .map((bar, index) => (
                <div key={bar.bar_id} className={`animate-fadeInUp stagger-${(index % 8) + 1} flex justify-center`}>
                  <BarCard bar={bar} savedBars={savedBars} setSavedBars={setSavedBars} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-white/60 py-20 text-center glass-card-neon rounded-3xl">
                目前尚無酒吧資料。
              </div>
            )}
          </div>

          {/* 頁碼 */}
          {totalPages > 1 && !hasSearched && (
            <div className="flex items-center justify-center mt-12 mb-20 gap-2">
              <button
                className="btn btn-circle btn-outline btn-sm border-white/20 text-white hover:bg-[#A0FF1F] hover:text-black hover:border-[#A0FF1F]"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: maxPageNumberLimit - minPageNumberLimit + 1 }, (_, index) => (
                <button
                  key={minPageNumberLimit + index}
                  className={`btn btn-circle btn-sm border-none transition-all duration-300 ${
                    currentPage === minPageNumberLimit + index
                      ? 'bg-[#A0FF1F] text-black font-bold shadow-[0_0_15px_rgba(160,255,31,0.5)]'
                      : 'bg-white/5 text-white hover:bg-white/20'
                  }`}
                  onClick={() => handlePageChange(minPageNumberLimit + index)}
                >
                  {minPageNumberLimit + index}
                </button>
              ))}
              <button
                className="btn btn-circle btn-outline btn-sm border-white/20 text-white hover:bg-[#A0FF1F] hover:text-black hover:border-[#A0FF1F]"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
