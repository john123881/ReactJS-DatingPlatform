import { useState, useEffect, useCallback, useMemo } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { BarService } from '@/services/bar-service';
import Loader from '@/components/ui/loader/loader';

export default function List({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth, getAuthHeader } = useAuth();
  const [bars, setBars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [barsPerPage] = useState(8);
  const [savedBars, setSavedBars] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // search input
  // const [searchTerm, setSearchTerm] = useState('');
  // const [searchResults, setSearchResults] = useState([]);
  // const [hasSearched, setHasSearched] = useState(false);

  // const searchModalRef = useRef(null);
  // const searchModalMobileRef = useRef(null);
  // const getSearchUsers = async (value) => {
  //   setSearchTerm(value);

  //   if (!value.trim()) {
  //     setSearchResults([]);
  //     setHasSearched(false);
  //     return;
  //   }

  //   // 確保空字串不會觸發
  //   if (value.trim()) {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3001/bar/search-users?searchTerm=${value}`
  //       );
  //       const data = await response.json();
  //       setSearchResults(data);
  //       setHasSearched(true);
  //     } catch (error) {
  //       console.error('Search error:', error);
  //     }
  //   }
  // };
  //search end
  // const [selectedAreaId, setSelectedAreaId] = useState('');
  // const [selectedTypeId, setSelectedTypeId] = useState('');

  const totalPages = Math.ceil(bars.length / barsPerPage);
  const maxPageNumberLimit = Math.min(currentPage + 2, totalPages);
  const minPageNumberLimit = Math.max(currentPage - 2, 1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 檢查儲存酒吧狀態 - 使用 useCallback 確保參考穩定
  const checkBarsStatus = useCallback(
    async (barIds) => {
      const userId = auth.id;

      if (userId === 0) {
        return;
      }

      try {
        const data = await BarService.checkBarStatus(userId, barIds);

        // 更新 React 狀態以觸發界面更新，以顯示最新的收藏狀態
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
    [auth.id], // 移除 getAuthHeader 依賴
  );

  //FETCH GET 酒吧列表資料 - 使用 useCallback 確保參考穩定
  const getBarListDynamicById = useCallback(
    async (bar_type_id) => {
      if (!bar_type_id) return;

      try {
        setIsLoading(true);
        const result = await BarService.getBars({ bar_type_id });
        setBars(result || []); 
      } catch (error) {
        console.error('Failed to fetch bar list:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 監聽 bars 變化並檢查狀態 - 使用 memo 化的字串避免無限迴圈
  const barIdsString = useMemo(() => {
    return bars.map((bar) => bar.bar_id).join(',');
  }, [bars]);

  useEffect(() => {
    if (barIdsString && auth.id !== 0) {
      checkBarsStatus(barIdsString);
    }
  }, [barIdsString, checkBarsStatus, auth.id]);

  const handleSearchChange = async (e) => {
    getSearchBars(e.target.value);
  };

  const getSearchBars = async (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    // 確保空字串不會觸發
    if (value.trim()) {
      try {
        const result = await BarService.searchBars(value);
        setSearchResults(result);
        setHasSearched(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  // 動態路由成功
  useEffect(() => {
    if (router.isReady) {
      const { bar_type_id } = router.query;
      if (bar_type_id) {
        getBarListDynamicById(bar_type_id);
      }
    }
  }, [router.isReady, router.query?.bar_type_id, getBarListDynamicById]);


  // bar-area navigation
  const onAreaSelected = (areaId) => {
    router.push(`/bar/bar-list/area/${areaId}`);
  };

  // bar-type sidebar navigation
  const onTypeSelected = (typeId) => {
    // 使用 useRouter 的 push 方法
    router.push(`/bar/bar-list/${typeId}`);
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row justify-center pt-28">
        <div className="flex-col items-center hidden md:flex md:w-2/12">
          {/* <BarListSidebar onAreaSelected={handleAreaSelected} /> */}
          <BarListSidebar
            onAreaSelected={onAreaSelected}
            onTypeSelected={onTypeSelected}
          />
        </div>
        <div className="flex flex-col justify-center w-11/12 gap-6 mx-auto md:w-8/12">
          <div className="text-sm breadcrumbs">
            <Breadcrumbs currentPage="" />
          </div>
          <div className="flex items-center justify-between">
            <div className="font-bold text-white md:text-h5">
              {/* 特色酒吧 */}
              {/* {bars?.bar_type_name} */}
              {isLoading ? '正在搜尋驚喜...' : (bars.length > 0 ? bars[0].bar_type_name : '特色酒吧')}
            </div>
            <BarListDropdownMobile />
            <label className="hidden input input-bordered md:flex items-center gap-2 h-[32px] rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white">
              <input
                type="text"
                className="grow"
                placeholder="搜索"
                value={searchTerm}
                onChange={handleSearchChange}
              />
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
          <div className="flex flex-wrap items-center justify-center w-full gap-4 mx-auto min-h-[400px]">
            {isLoading ? (
              <Loader minHeight="400px" text="正在載入酒吧清單..." />
            ) : hasSearched ? (
              searchResults.length > 0 ? (
                searchResults.map((bar) => (
                  <BarCard
                    key={bar.bar_id}
                    bar={bar}
                    savedBars={savedBars}
                    setSavedBars={setSavedBars}
                  />
                ))
              ) : (
                <p>未找到結果</p>
              )
            ) : (
              bars
                .slice(
                  (currentPage - 1) * barsPerPage,
                  currentPage * barsPerPage,
                )
                .map((bar) => (
                  <BarCard
                    key={bar.bar_id}
                    bar={bar}
                    savedBars={savedBars}
                    setSavedBars={setSavedBars}
                  />
                ))
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="btn btn-sm"
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
                      ? 'btn-active'
                      : ''
                  }`}
                  onClick={() => handlePageChange(minPageNumberLimit + index)}
                  style={{
                    backgroundColor: currentPage === minPageNumberLimit + index ? '#A0FF1F' : '',
                  }}
                >
                  {minPageNumberLimit + index}
                </button>
              ),
            )}
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="flex md:w-2/12"></div>
      </div>
    </>
  );
}
