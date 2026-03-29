import { useState, useEffect, useCallback } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { BarService } from '@/services/bar-service';

export default function List({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth, getAuthHeader } = useAuth();
  const [bars, setBars] = useState([]);
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

  // 檢查儲存酒吧狀態
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
    [auth.id, getAuthHeader],
  );

  //FETCH GET 酒吧列表資料
  const getBarListDynamicById = useCallback(
    async (bar_type_id) => {
      if (!bar_type_id) return; // 確保 bar_type_id 存在

      try {
        // 使用特殊的分類端點，或者通用 getBars
        // 這裡後端路徑是 /bar/bar-list/:bar_type_id
        // 我們映射到 BarService.getBars({ bar_type_id })
        const result = await BarService.getBars({ bar_type_id });

        const barIds = result.map((bar) => bar.bar_id).join(',');
        checkBarsStatus(barIds); //確認Saved or not 狀態的fetch

        setBars(result); 
      } catch (error) {
        console.error('Failed to fetch bar list:', error);
      }
    },
    [checkBarsStatus],
  );

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
      //確保能得到bar_type_id
      const { bar_type_id } = router.query;
      // 有bar_type_id後，向伺服器要求資料
      getBarListDynamicById(bar_type_id);
    }
  }, [router.isReady, router.query, getBarListDynamicById]);


  // bar-type sidebar
  const onTypeSelected = (typeId) => {
    // 使用 useRouter 的 push 方法
    router.push(`/bar/${typeId}`);
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row justify-center pt-28">
        <div className="flex-col items-center hidden md:flex md:w-2/12">
          {/* <BarListSidebar onAreaSelected={handleAreaSelected} /> */}
          <BarListSidebar
            // onAreaSelected={onAreaSelected}
            // onTypeSelected={onTypeSelected}
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
              {bars.length > 0 ? bars[0].bar_type_name : '加載中...'}
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
          <div className="flex flex-wrap items-center justify-center w-full gap-4 mx-auto">
            {hasSearched ? (
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
                    backgroundColor: currentPage === index + 1 ? '#A0FF1F' : '',
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
