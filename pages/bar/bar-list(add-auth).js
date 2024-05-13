import { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar(1)';
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

  const [bars, setBars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [barsPerPage] = useState(8);
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const { userAvatar, setUserAvatar, auth, getAuthHeader, checkAuth } =
    useAuth();

  const getBarList = async () => {
    console.log('Token:', auth);

    try {
      const res = await fetch('http://localhost:3001/bar/bar-list', {
        headers: { Authorization: 'Bearer ' + auth.token },
      });
      const data = await res.json();
      console.log('json', data);
      // if (!data.success) {
      //   // alert('error');
      //   return;
      // }
      setBars(data);
    } catch (error) {
      console.error('Failed to fetch bar list:', error);
    }
  };

  useEffect(() => {
    if (auth.id === 0) {
      return;
    }
    getBarList();
  }, [auth]);

  // useEffect(() => {
  //   const url = selectedAreaId
  //     ? `http://localhost:3001/bar/bar-list?area=${selectedAreaId}`
  //     : 'http://localhost:3001/bar/bar-list';

  //   fetch(url)
  //     .then((res) => res.json())
  //     .then(setBars)
  //     .catch(console.error);
  // }, [selectedAreaId]); // 这里我们假设不需要在组件加载时获取全列表，如果需要，则应该将getBarList逻辑加入此处。

  // useEffect(() => {
  //   let url = 'http://localhost:3001/bar/bar-list';
  //   if (selectedAreaId) {
  //     url += `?area=${selectedAreaId}`; // Assuming the backend can handle this query
  //   }

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

  const handleAreaSelected = (areaId) => {
    console.log('Selected Area ID: ', areaId);
    setSelectedAreaId(areaId);
  };

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

  const totalPages = Math.ceil(bars.length / barsPerPage);
  const maxPageNumberLimit = Math.min(currentPage + 2, totalPages);
  const minPageNumberLimit = Math.max(currentPage - 2, 1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row pt-28 justify-center">
        <div className="hidden md:flex flex-col items-center md:w-2/12">
          <BarListSidebar onAreaSelected={handleAreaSelected} />
        </div>
        <div className="flex flex-col justify-center mx-auto w-11/12 md:w-8/12 gap-6">
          <div className="text-sm breadcrumbs">
            <Breadcrumbs currentPage="酒吧列表" />
          </div>
          <div className="flex justify-between items-center">
            <div className="md:text-h5 text-white font-bold">特色酒吧</div>
            <BarListDropdownMobile />
            <label className="hidden input input-bordered md:flex items-center gap-2 h-[32px] rounded-xl border-white bg-transparent hover:border-[#A0FF1F] text-white">
              <input type="text" className="grow" placeholder="搜索" />
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
            {bars
              .slice((currentPage - 1) * barsPerPage, currentPage * barsPerPage)
              .map((bar, i) => (
                <BarCard bar={bar} key={i} />
              ))}
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
