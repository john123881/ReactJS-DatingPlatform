import { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function List({ onPageChange }) {
  const pageTitle = '社群媒體';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const { auth, getAuthHeader } = useAuth();
  const [bars, setBars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [barsPerPage] = useState(8);
  const [savedBars, setSavedBars] = useState({});

  // const [selectedAreaId, setSelectedAreaId] = useState('');
  // const [selectedTypeId, setSelectedTypeId] = useState('');

  const totalPages = Math.ceil(bars.length / barsPerPage);
  const maxPageNumberLimit = Math.min(currentPage + 2, totalPages);
  const minPageNumberLimit = Math.max(currentPage - 2, 1);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 檢查儲存酒吧狀態
  const checkBarsStatus = async (barIds) => {
    const userId = auth.id;

    if (userId === 0) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/bar/check-bar-status?userId=${userId}&barIds=${barIds}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      const data = await response.json();
      // console.log('checkBarsStatus 的 data:', data);

      // 初始化來存儲所有酒吧的收藏狀態
      const newSavedBars = { ...savedBars };
      console.log('checkBarsStatus 的 newSavedBars:', newSavedBars);

      // 遍歷從後端獲取的每個貼文的狀態數據
      data.forEach((status) => {
        // 將每個貼文的收藏狀態存儲到 newSavedBars 對象中
        newSavedBars[status.barId] = status.isSaved;
      });
      // console.log('checkBarsStatus 的 newSavedBars2:', newSavedBars);

      // 更新 React 狀態以觸發界面更新，以顯示最新的收藏狀態
      setSavedBars(newSavedBars);
    } catch (error) {
      console.error('無法獲取酒吧狀態:', error);
    }
  };

  //FETCH GET 酒吧列表資料
  const getBarListType = async (bar_area_id) => {
    if (!bar_area_id) return; // 確保 bar_area_id 存在

    const url = `http://localhost:3001/bar/bar-list/area/${bar_area_id}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      // console.log('getBarListDynamicById 的 data:', data);

      const barIds = data.map((bar) => bar.bar_id).join(',');
      // console.log('getBarListDynamicById 的 barIds:', barIds);
      checkBarsStatus(barIds); //確認Saved or not 狀態的fetch
      setBars(data); // 確認數據是否為預期格式
    } catch (error) {
      console.error('Failed to fetch bar area:', error);
    }
  };

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
        const response = await fetch(
          `http://localhost:3001/bar/search-bars?searchTerm=${value}`
        );
        const data = await response.json();
        setSearchResults(data);
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
      const { bar_area_id } = router.query;
      // bar_area_id
      getBarListType(bar_area_id);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    console.log(bars); // 查看bars數據結構
  }, [bars]);

  // // 處理地區和類型的選擇
  // const onAreaSelected = (areaId) => {
  //   setSelectedAreaId(areaId);
  //   updateBarsList(areaId, selectedTypeId);
  // };

  // const onTypeSelected = (typeId) => {
  //   setSelectedTypeId(typeId);
  //   updateBarsList(selectedAreaId, typeId);
  // };

  // bar-type sidebar
  const onTypeSelected = (typeId) => {
    console.log('Selected type ID:', typeId);
    // 使用 useRouter 的 push 方法
    router.push(`/bar/${typeId}`);
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row pt-28 justify-center">
        <div className="hidden md:flex flex-col items-center md:w-2/12">
          {/* <BarListSidebar onAreaSelected={handleAreaSelected} /> */}
          <BarListSidebar
            // onAreaSelected={onAreaSelected}
            // onTypeSelected={onTypeSelected}
            onTypeSelected={onTypeSelected}
          />
        </div>
        <div className="flex flex-col justify-center mx-auto w-11/12 md:w-8/12 gap-6">
          <div className="text-sm breadcrumbs">
            <Breadcrumbs currentPage="" />
          </div>
          <div className="flex justify-between items-center">
            <div className="md:text-h5 text-white font-bold">
              {/* 特色酒吧 */}
              {/* {bars?.bar_type_name} */}
              {bars.length > 0 ? bars[0].bar_area_name : '加載中...'}
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
          <div className="flex flex-wrap mx-auto w-full gap-4 justify-center items-center">
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
                  currentPage * barsPerPage
                )
                .map((bar, i) => (
                  <BarCard
                    key={bar.bar_id}
                    bar={bar}
                    savedBars={savedBars}
                    setSavedBars={setSavedBars}
                  />
                ))
            )}
          </div>
          <div className="flex justify-center items-center">
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
              )
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
