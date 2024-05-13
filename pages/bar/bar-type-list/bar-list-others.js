import { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarCard from '@/components/bar/card/bar-card';
import BarListSidebar from '@/components/bar/bar/bar-list-sidebar(1)';
import BarListDropdownMobile from '@/components/bar/button/bar-list-dropdown-mobile';
// import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function BarListOthers({ onPageChange }) {
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
  const [selectedTypeId, setSelectedTypeId] = useState('');
  // const { userAvatar, setUserAvatar, auth, getAuthHeader, checkAuth } =
  //   useAuth();

  const totalPages = Math.ceil(bars.length / barsPerPage);
  const maxPageNumberLimit = Math.min(currentPage + 2, totalPages);
  const minPageNumberLimit = Math.max(currentPage - 2, 1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getBarList = async () => {
    // console.log('Token:', auth);

    try {
      const res = await fetch('http://localhost:3001/bar/bar-list-others', {
        // headers: { Authorization: 'Bearer ' + auth.token },
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
    getBarList();
  }, []);

  // 處理地區和類型的選擇
  const onAreaSelected = (areaId) => {
    setSelectedAreaId(areaId);
    updateBarsList(areaId, selectedTypeId);
  };

  const onTypeSelected = (typeId) => {
    setSelectedTypeId(typeId);
    updateBarsList(selectedAreaId, typeId);
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
            <Breadcrumbs currentPage="其他酒吧" />
          </div>
          <div className="flex items-center justify-between">
            <div className="font-bold text-white md:text-h5">
              其他酒吧
              {/* {bars?.bar_type_id} */}
            </div>
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
          <div className="flex flex-wrap items-center justify-center w-full gap-4 mx-auto">
            {bars
              .slice((currentPage - 1) * barsPerPage, currentPage * barsPerPage)
              .map((bar, i) => (
                <BarCard bar={bar} key={bar.bar_id} />
              ))}
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
