import { useEffect, useState, useCallback } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import Loader from '@/components/ui/loader/loader';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { BarService } from '@/services/bar-service';
import { useBarList } from '@/hooks/use-bar-list';

export default function BarList({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const { auth, getAuthHeader } = useAuth();
  const [savedBars, setSavedBars] = useState({});
  const {
    isLoading,
    bars,
    setBars,
    currentPage,
    setCurrentPage,
    barsPerPage,
    selectedAreaId,
    selectedTypeId,
    totalPages,
    maxPageNumberLimit,
    minPageNumberLimit,
    handlePageChange,
    onAreaSelected,
    onTypeSelected,
  } = useBarList();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);


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
    [auth.id],
  );

  // 監聽 bars 變化並檢查狀態
  useEffect(() => {
    if (bars.length > 0) {
      const barIds = bars.map((bar) => bar.bar_id).join(',');
      checkBarsStatus(barIds);
    }
  }, [bars, checkBarsStatus]);

  // BarListSidebar
  // const handleAreaSelected = (areaId) => {
  //   setSelectedAreaId(areaId);
  // };

  // useEffect(() => {
  //   const url = selectedAreaId
  //     ? `http://localhost:3001/bar/bar-list?area=${selectedAreaId}`
  //     : 'http://localhost:3001/bar/bar-list';

  //   fetch(url, {
  //     headers: { ...getAuthHeader() },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setBars(data);
  //       setCurrentPage(1); // Reset to first page upon area change
  //     })
  //     .catch(console.error);
  // }, [selectedAreaId]);


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
        const data = await BarService.searchBars(value);
        setSearchResults(data);
        setHasSearched(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
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
              {/* 所有酒吧 */}
              {bars?.bar_type_id}
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
            {isLoading && !hasSearched ? (
              <Loader minHeight="400px" text="正在探索酒吧..." />
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
                <div className="text-white py-20 text-center w-full">未找到結果</div>
              )
            ) : bars.length > 0 ? (
              bars
              .slice((currentPage - 1) * barsPerPage, currentPage * barsPerPage)
              .map((bar) => (
                <BarCard
                  key={bar.bar_id}
                  bar={bar}
                  savedBars={savedBars}
                  setSavedBars={setSavedBars}
                />
              ))
            ) : (
                <div className="text-white py-20 text-center w-full">目前沒有酒吧資料</div>
            )}
          </div>
          {/* <div className="flex items-center justify-center"> */}
          <div className="flex items-center justify-center">
            <button
              // className="btn btn-sm"
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
                  // className={`btn btn-sm ${
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
              // className="btn btn-sm"
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
        {/* <div className="flex md:w-2/12"></div> */}
        <div className="flex md:w-2/12"></div>
      </div>
    </>
  );
}
