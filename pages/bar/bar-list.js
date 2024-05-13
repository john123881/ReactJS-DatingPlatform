import { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function BarList({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const { auth, getAuthHeader } = useAuth();
  const [bars, setBars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [barsPerPage] = useState(8);
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [savedBars, setSavedBars] = useState({});

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
  const getBarList = async () => {
    // console.log('Token:', auth);

    try {
      const res = await fetch('http://localhost:3001/bar/bar-list/', {
        // headers: { Authorization: 'Bearer ' + auth.token },
      });
      const data = await res.json();
      // if (!data.success) {
      //   // alert('error');
      //   return;
      // }
      // console.log('getBarListDynamicById 的 data:', data);

      const barIds = data.map((bar) => bar.bar_id).join(',');
      // console.log('getBarListDynamicById 的 barIds:', barIds);
      checkBarsStatus(barIds); //確認Saved or not 狀態的fetch
      setBars(data);
    } catch (error) {
      console.error('Failed to fetch bar list:', error);
    }
  };

  // useEffect(() => {
  //   if (auth.id === 0) {
  //     return;
  //   }
  //   getBarList();
  // }, [auth]);

  useEffect(() => {
    getBarList();
  }, []);

  // BarListSidebar
  // const handleAreaSelected = (areaId) => {
  //   console.log('Selected Area ID: ', areaId);
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

  // try bar_type_id 篩選
  // 更新酒吧列表
  const updateBarsList = async (barAreaId, barTypeId) => {
    const query = new URLSearchParams({
      ...(barAreaId && { bar_area_id: barAreaId }),
      ...(barTypeId && { bar_type_id: barTypeId }),
    }).toString();

    const updateBarsList = async (barAreaId, barTypeId) => {
      const query = new URLSearchParams({
        ...(barAreaId && { bar_area_id: barAreaId }),
        ...(barTypeId && { bar_type_id: barTypeId }),
      }).toString();

      try {
        const response = await fetch(
          `http://localhost:3001/bar/bar-list?${barAreaId}`
        );
        const data = await response.json();
        setBars(data);
      } catch (error) {
        console.error('Failed to fetch filtered bar list:', error);
      }
    };
    try {
      const response = await fetch(
        `http://localhost:3001/bar/bar-list?${barAreaId}`
      );
      const data = await response.json();
      setBars(data);
    } catch (error) {
      console.error('Failed to fetch filtered bar list:', error);
    }
  };

  // 當地區或類型選擇變化時調用更新
  // useEffect(() => {
  //   updateBarsList(selectedAreaId, selectedTypeId);
  // }, [selectedAreaId, selectedTypeId]);

  // 處理地區和類型的選擇
  const onAreaSelected = (areaId) => {
    setSelectedAreaId(areaId);
    updateBarsList(areaId, selectedTypeId);
  };

  const onTypeSelected = (typeId) => {
    setSelectedTypeId(typeId);
    updateBarsList(selectedAreaId, typeId);
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
              )
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
