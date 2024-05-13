import { useState, useEffect } from 'react';
import Sidebar from '@/components/account-center/sidebar/sidebar';
import PageTitle from '@/components/page-title';
import Breadcrumbs from '@/components/account-center/breadcrumbs/breadcrumbs';
import BurgerMenu from '@/components/account-center/burgermenu/burger-menu';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import {
  ACCOUNT_RECORD_POINT_GET,
  ACCOUNT_RECORD_GAME,
} from '@/components/config/api-path';
import toast from 'react-hot-toast';
import { useLoader } from '@/context/use-loader';
import RecordLoader2 from '@/components/account-center/loader/record-loader2';
import RecordLoader3 from '@/components/account-center/loader/record-loader3';

export default function AccountRecord({ onPageChange }) {
  const pageTitle = '會員中心';
  const currentPage = '紀錄查詢';

  const router = useRouter();
  const { close, open, isLoading } = useLoader();
  const { auth, getAuthHeader, checkAuth } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [gameRecordOpen, setGameRecordOpen] = useState(false);

  const [pointSource, setPointSource] = useState('選擇');
  const [dateSortToggle, setDateSortToggle] = useState(false);
  const [valueDateBegin, setValueDateBegin] = useState('');
  const [valueDateEnd, setValueDateEnd] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState(false);

  const [recordListPoint, setRecordListPoint] = useState({
    rows: [],
    page: 0,
    totalPages: 0,
  });
  const [recordListGame, setRecordListGame] = useState({
    rows: [],
    page: 0,
    totalPages: 0,
  });

  //處理積分紀錄上下頁按鈕
  const handlePointPrevPage = () => {
    const prevPage = recordListPoint.page - 1;
    if (prevPage >= 1) {
      setRecordListPoint((recordListPoint) => ({
        ...recordListPoint,
        page: prevPage,
      }));

      const nweQuery = { ...router.query, page: prevPage };

      // 構建新的 URL
      // const queryString = new URLSearchParams(query).toString();
      // console.log('prevPageQS:', queryString);

      // 更新路由的 query string
      router.push(
        {
          pathname: router.pathname, // 將 pathname 設置到 url 中
          query: nweQuery, // 將 query 設置到 url 中
        },
        undefined,
        { scroll: false }
      ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    }
  };
  const handlePointNextPage = (e) => {
    e.preventDefault();
    const nextPage = recordListPoint.page + 1;
    if (nextPage <= recordListPoint.totalPages) {
      setRecordListPoint((recordListPoint) => ({
        ...recordListPoint,
        page: nextPage,
      }));
      // 獲取當前路由的 query string
      const nweQuery = { ...router.query, page: nextPage };

      // 構建新的 URL
      // const queryString = new URLSearchParams(query).toString();

      // 更新路由的 query string
      router.push(
        {
          pathname: router.pathname, // 將 pathname 設置到 url 中
          query: nweQuery, // 將 query 設置到 url 中
        },
        undefined,
        { scroll: false }
      ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    }
  };

  //處理遊戲紀錄上下頁按鈕
  const handleGamePrevPage = () => {
    const prevPage = recordListGame.page - 1;
    if (prevPage >= 1) {
      setRecordListGame((recordListGame) => ({
        ...recordListGame,
        page: prevPage,
      }));

      const nweQuery = { ...router.query, page: prevPage };

      // 構建新的 URL
      // const queryString = new URLSearchParams(query).toString();
      // console.log('prevPageQS:', queryString);

      // 更新路由的 query string
      router.push(
        {
          pathname: router.pathname, // 將 pathname 設置到 url 中
          query: nweQuery, // 將 query 設置到 url 中
        },
        undefined,
        { scroll: false }
      ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    }
  };
  const handleGameNextPage = (e) => {
    e.preventDefault();
    const nextPage = recordListGame.page + 1;
    if (nextPage <= recordListGame.totalPages) {
      setRecordListGame((recordListGame) => ({
        ...recordListGame,
        page: nextPage,
      }));
      // 獲取當前路由的 query string
      const nweQuery = { ...router.query, page: nextPage };

      // 構建新的 URL
      // const queryString = new URLSearchParams(query).toString();

      // 更新路由的 query string
      router.push(
        {
          pathname: router.pathname, // 將 pathname 設置到 url 中
          query: nweQuery, // 將 query 設置到 url 中
        },
        undefined,
        { scroll: false }
      ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    }
  };

  //處理積分來源
  const handlePointSource = (e) => {
    const selectedValue = e.target.value;
    // if (selectedValue === '選擇') {
    //   return;
    // }
    setPointSource(selectedValue);

    // 更新路由的 query string
    router.push(
      {
        pathname: router.pathname, // 將 pathname 設置到 url 中
        query: { ...router.query, selectedValue, page: 1 }, // 將 query 設置到 url 中,選擇來源時，頁面要回到第一頁
      },
      undefined,
      { scroll: false }
    ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
  };

  //處理日期開始
  const handleDateBegin = (e) => {
    const newValueDateBegin = e.target.value;
    setValueDateBegin(newValueDateBegin);
    router.push(
      {
        pathname: router.pathname, // 將 pathname 設置到 url 中
        query: { ...router.query, date_begin: newValueDateBegin, page: 1 }, // 將 query 設置到 url 中,選擇排序時，頁面要回到第一頁
      },
      undefined,
      { scroll: false }
    ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
  };

  //處理日期結束
  const handleDateEnd = (e) => {
    const newValueDateEnd = e.target.value;
    setValueDateEnd(newValueDateEnd);
    router.push(
      {
        pathname: router.pathname, // 將 pathname 設置到 url 中
        query: { ...router.query, date_end: newValueDateEnd, page: 1 }, // 將 query 設置到 url 中,選擇排序時，頁面要回到第一頁
      },
      undefined,
      { scroll: false }
    ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
  };

  //處理日期排序
  const handleDateSort = () => {
    const newDateSortToggle = !dateSortToggle;
    const sort = newDateSortToggle ? 'ASC' : 'DESC';
    // 更新路由的 query string
    router.push(
      {
        pathname: router.pathname, // 將 pathname 設置到 url 中
        query: { ...router.query, sortDate: sort, page: 1 }, // 將 query 設置到 url 中,選擇排序時，頁面要回到第一頁
      },
      undefined,
      { scroll: false }
    ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    setDateSortToggle(newDateSortToggle);
  };

  //處理類型排序
  const handleSort = (field) => {
    const newField = field;
    console.log('點擊後的類型是:', newField);
    let sort = '';
    if (
      router.query.sortField === newField &&
      router.query.sortDirection === 'DESC'
    ) {
      sort = 'ASC';
    } else {
      sort = 'DESC';
    }
    const newSortDirection = sort === 'ASC' ? true : false;

    // console.log('點擊後的sort是:', sort);
    // console.log('點擊後的sortDirection是:', newSortDirection);
    router.push(
      {
        pathname: router.pathname, // 將 pathname 設置到 url 中
        query: {
          ...router.query,
          sortDirection: sort,
          sortField: newField,
          page: 1,
        }, // 將 query 設置到 url 中,選擇排序時，頁面要回到第一頁
      },
      undefined,
      { scroll: false }
    ); // 將 scroll 選項設置到 options 中，undefined 表示忽略 as 參數
    // console.log('點擊後router.push.query是:', router.query);
    setSortDirection(newSortDirection);
    setSortField(newField);
  };

  //處理類型切換按鈕
  const handleToggleChange = (e) => {
    setGameRecordOpen(e.target.checked);
  };

  //Router_ID 與 JWT_ID 之 檢查
  const fetchCheck = async () => {
    if (auth.id === 0 || !router.isReady) return;
    const result = await checkAuth(router.query.sid);
    if (!result.success) {
      router.push('/');
      toast.error(result.error, { duration: 1500 });
      return;
    }
    close(1.5);
  };

  //渲染->積分紀錄
  useEffect(() => {
    if (!router.isReady || auth.id === 0 || router.query.sid === undefined)
      return;

    //gameRecordOpen 開啟時 才會fetch
    if (gameRecordOpen) {
      return;
    }

    fetchCheck();

    open();
    //定義: FETCH積分紀錄
    const fetchPointRecord = async () => {
      // console.log('${location.search}是:', location.search);
      // const query = {
      //   ...router.query,
      //   pointSource: pointSource, // 添加 pointSource 到 query 对象中
      // };

      // const queryString = new URLSearchParams(query).toString();
      // console.log('FETCH->qS:', queryString);
      // // qS: page=2&sid=1&pointSource=%E7%99%BB%E5%85%A5%E7%8D%B2%E5%BE%97
      // console.log('FETCH->router.query:', router.query);
      // // page: '2';
      // // sid: '1';
      // console.log('FETCH->location.search:', location.search);
      // // location.search: ?page=2

      const r = await fetch(
        `${ACCOUNT_RECORD_POINT_GET}/${router.query.sid}${location.search}`,
        {
          headers: { ...getAuthHeader() },
        }
      );
      const result = await r.json();
      console.log('積分紀錄資料:', result);
      if (result.output.error === '無相關紀錄') {
        setRecordListPoint({
          rows: [],
          page: 0,
          totalPages: 0,
        });
        toast.error(result.output.error, { duration: 1500 });
      }
      if (!result.success) {
        return;
      }

      setRecordListPoint({
        ...recordListPoint,
        rows: result.output.data,
        page: result.page,
        totalPages: result.totalPages,
      });
    };
    //要求積分紀錄
    fetchPointRecord();
    close(0.5);
  }, [router.query, auth.id, gameRecordOpen]);

  //渲染->遊戲紀錄
  useEffect(() => {
    if (!router.isReady || auth.id === 0 || router.query.sid === undefined)
      return;

    //gameRecordOpen 開啟時 才會fetch
    if (!gameRecordOpen) {
      return;
    }

    fetchCheck();

    open();
    //定義:FETCH遊戲紀錄
    const fetchGameRecord = async () => {
      try {
        const r = await fetch(
          `${ACCOUNT_RECORD_GAME}/${router.query.sid}${location.search}`,
          {
            headers: { ...getAuthHeader() },
          }
        );
        const result = await r.json();
        console.log('遊戲紀錄資料:', result);
        if (result.output.error === '無相關紀錄') {
          setRecordListGame({
            rows: [],
            page: 0,
            totalPages: 0,
          });
          toast.error(result.output.error, { duration: 1500 });
        }
        if (!result.success) {
          // alert('error to fetch');
          return;
        }
        setRecordListGame({
          ...recordListGame,
          rows: result.output.data,
          page: result.page,
          totalPages: result.totalPages,
        });
      } catch (error) {
        console.log('fetchGameRecord has error:', error);
      }
    };
    //要求遊戲紀錄
    fetchGameRecord();
    close(0.5);
  }, [gameRecordOpen, router.query, auth.id]);

  //進頁面做唯一次渲染
  useEffect(() => {
    onPageChange(pageTitle);
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day = today.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    const currentDateStr = `${year}-${month}-${day}`;
    setCurrentDate(currentDateStr);
  }, []);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex min-h-screen pt-10 bg-dark ">
        <Sidebar currentPage={currentPage} />
        <div className="w-screen px-4 py-12 sm:px-6 md:px-8 lg:ps-14 lg:pe-44 xl:pe-60">
          <div className="flex flex-col w-full ">
            <BurgerMenu currentPage={currentPage} />
            <Breadcrumbs currentPage={currentPage} />

            {/* Toggle START */}
            <label
              onClick={() => {
                setPointSource('全部');
                setDateSortToggle(false);
                setValueDateBegin('');
                setValueDateEnd('');
                router.push({
                  pathname: router.pathname,
                  query: { sid: auth.id },
                });
              }}
              className="relative grid px-4 mx-auto mt-4 border rounded-full cursor-pointer border-slate-700 bg-base-300 border-rounded place-items-center"
            >
              <span
                className={` absolute left-[16px] h-[22px] w-[130px] rounded-full  bg-primary z-10 ${
                  gameRecordOpen
                    ? 'translate-x-[100%] duration-700 ease-in-out'
                    : ' duration-700 ease-in-out'
                }`}
              >
                {' '}
              </span>
              <span
                className={`${
                  gameRecordOpen ? 'text-light' : 'text-dark'
                } select-none delay-400 z-20 col-start-1 row-start-1  relative max-w-[145px] min-w-[130px] px-3 py-1 my-1 rounded-full text-center label-text `}
              >
                積分查詢
              </span>

              <input
                type="checkbox"
                id="toggle"
                checked={gameRecordOpen}
                onChange={handleToggleChange}
                className="hidden col-span-2 col-start-1 row-start-1 toggle bg-base-content"
              />
              <span
                className={`${
                  gameRecordOpen ? 'text-dark' : 'text-light'
                } select-none delay-400 z-20 col-start-2 row-start-1 max-w-[145px] min-w-[130px] px-3 py-1 my-1 rounded-full text-center label-text 
             `}
              >
                遊戲紀錄
              </span>
            </label>
            {/* Toggle END */}

            {/* SearchBar START */}
            <div className="flex justify-between mt-4 item-center">
              <select
                value={pointSource}
                onChange={handlePointSource}
                className={`w-full max-w-[150px] min-w-[90px] sm:ms-2 border-slate-700 px-4 select justify-start select-bordered select-sm join-item  ${
                  gameRecordOpen ? 'hidden' : 'block '
                }`}
              >
                <option value="全部">全部</option>
                <option value="登入獲得">登入獲得</option>
                <option value="遊玩遊戲">遊玩遊戲</option>
              </select>
              <div className="flex justify-end ms-auto">
                <label className="flex items-center border-slate-700  w-full min-w-[120px] max-w-[150px] gap-1 ms-2 px-0 pe-1 sm:px-2 input input-bordered input-sm">
                  <input
                    name="dateBegin"
                    type="date"
                    className="px-0 text-center cursor-pointer grow input-sm"
                    placeholder="yyyy/mm/dd"
                    value={valueDateBegin}
                    max={valueDateEnd ? valueDateEnd : currentDate} // 設置日期的最大值為當前日期
                    onChange={handleDateBegin}
                  />
                </label>
                <span className="items-center pt-1 mx-1">~</span>
                <label className="flex items-center border-slate-700   w-full min-w-[120px] max-w-[150px] gap-1 px-0 pe-1 sm:px-2 input input-bordered input-sm">
                  <input
                    name="dateEnd"
                    type="date"
                    className="px-0 text-center cursor-pointer grow input-sm"
                    placeholder="yyyy/mm/dd"
                    value={valueDateEnd}
                    min={valueDateBegin}
                    max={currentDate} // 設置日期的最大值為當前日期
                    onChange={handleDateEnd}
                  />
                </label>
              </div>
            </div>
            {/* SearchBar END */}

            {/* CONTENT1 START */}
            <div
              className={`mt-4 flex flex-col justify-between w-full  h-[580px] ${
                gameRecordOpen ? 'hidden' : 'block '
              } lg:mx-1 xl:mx-1 bg-base-300 rounded-box place-items-center`}
            >
              <table className="container table py-4 bg-base-300">
                <thead className="w-full ">
                  <tr className="border-b border-slate-500 min-h-[52px]">
                    <th
                      onClick={handleDateSort}
                      className="text-lg text-center cursor-pointer text-light hover:text-neongreen"
                    >
                      日期
                      <span className="relative ">
                        <MdArrowDropUp
                          className={`absolute top-[-2px] right-[-20px] ${
                            dateSortToggle ? 'text-slate-600' : ''
                          } `}
                        />
                        <MdArrowDropDown
                          className={`absolute top-[7px] right-[-20px] ${
                            dateSortToggle ? '' : 'text-slate-600'
                          }`}
                        />
                      </span>
                    </th>
                    <th className="text-lg text-center text-light ">
                      紅利積分
                    </th>
                    <th className="text-lg text-center text-light ">
                      獲得來源
                    </th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {isLoading ? (
                    <RecordLoader2 />
                  ) : (
                    <>
                      {recordListPoint.rows &&
                        recordListPoint.rows.map((v, i) => {
                          return (
                            <tr
                              key={i}
                              className=" text-slate-400 hover:text-primary"
                            >
                              <td className="text-base text-center ">
                                {v.created_at}
                              </td>
                              <td className="text-base text-center ">
                                {v.points_increase}
                              </td>
                              <td className="text-base text-center ">
                                {v.reason}
                              </td>
                            </tr>
                          );
                        })}
                    </>
                  )}
                </tbody>
              </table>
              {isLoading ? (
                <>
                  <div className="mb-3 skeleton join bg-base-200 min-h-[32px]"></div>
                </>
              ) : (
                <>
                  <div className="mb-3 join bg-base-200">
                    <button
                      className={`
                      ${Number(router.query.page) > 1 ? ' ' : 'btn-disabled'}
                      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                      onClick={handlePointPrevPage}
                    >
                      «
                    </button>

                    {[...Array(5)].map((v, i) => {
                      let p =
                        recordListPoint.page <= 5
                          ? 1 + i
                          : recordListPoint.page + i;

                      if (p < 1) return null;

                      if (p > recordListPoint.totalPages)
                        return (
                          <button
                            key={p}
                            className={`${
                              p === recordListPoint.page
                                ? 'text-neongreen '
                                : ''
                            } btn-disabled max-w-[25px] join-item btn border-slate-700 hover:bg-primary hover:text-dark btn-xs `}
                          >
                            {p}
                          </button>
                        );

                      return (
                        <button
                          key={p}
                          style={{
                            transition: 'transform 0.2s ease-in-out',
                          }}
                          className={`${
                            p === recordListPoint.page ? 'text-neongreen ' : ''
                          } join-item btn max-w-[25px] border-slate-700 hover:bg-primary hover:text-dark btn-xs hover:sm:scale-[1.1]  hover:sm:translate-y-[-5px]`}
                          onClick={(e) => {
                            e.preventDefault();
                            const nweQuery = { ...router.query, page: p };
                            router.push(
                              {
                                pathname: router.pathname,
                                query: nweQuery,
                              },
                              undefined,
                              { scroll: false }
                            );
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      className={`
                      ${
                        router.query.page ===
                          recordListPoint.totalPages.toString() ||
                        recordListPoint.totalPages === 0
                          ? ' btn-disabled'
                          : ''
                      }
                      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                      onClick={handlePointNextPage}
                    >
                      »
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* CONTENT1 END */}

            {/* CONTENT2 START */}
            <div
              className={`mt-4 flex flex-col justify-between w-full h-[580px] ${
                gameRecordOpen ? 'block ' : 'hidden '
              } lg:mx-1 xl:mx-1 bg-base-300 rounded-box place-items-center `}
            >
              <table className="container table py-4">
                <thead className="w-full ">
                  <tr className="border-b border-slate-500 min-h-[52px]">
                    <th
                      onClick={() => {
                        handleSort('created_at');
                      }}
                      className="text-lg text-center cursor-pointer text-light hover:text-neongreen"
                    >
                      日期{' '}
                      <span className={'relative '}>
                        <MdArrowDropUp
                          className={`absolute top-[-2px] right-[-20px] ${
                            !sortDirection && sortField === 'created_at'
                              ? 'text-light'
                              : 'text-slate-600'
                          } `}
                        />
                        <MdArrowDropDown
                          className={`absolute top-[7px] right-[-20px] ${
                            sortDirection && sortField === 'created_at'
                              ? 'text-light'
                              : 'text-slate-600'
                          }`}
                        />
                      </span>
                    </th>
                    <th
                      onClick={() => {
                        handleSort('game_score');
                      }}
                      className="text-lg text-center cursor-pointer text-light hover:text-neongreen"
                    >
                      遊戲分數{' '}
                      <span className={'relative '}>
                        <MdArrowDropUp
                          className={`absolute top-[-2px] right-[-20px] ${
                            !sortDirection && sortField === 'game_score'
                              ? 'text-light'
                              : 'text-slate-600'
                          } `}
                        />
                        <MdArrowDropDown
                          className={`absolute top-[7px] right-[-20px] ${
                            sortDirection && sortField === 'game_score'
                              ? 'text-light'
                              : 'text-slate-600'
                          }`}
                        />
                      </span>
                    </th>
                    <th
                      onClick={() => {
                        handleSort('game_time');
                      }}
                      className="text-lg text-center cursor-pointer text-light hover:text-neongreen"
                    >
                      遊戲時間{' '}
                      <span className={'relative '}>
                        <MdArrowDropUp
                          className={`absolute top-[-2px] right-[-20px] ${
                            !sortDirection && sortField === 'game_time'
                              ? 'text-light'
                              : 'text-slate-600'
                          } `}
                        />
                        <MdArrowDropDown
                          className={`absolute top-[7px] right-[-20px] ${
                            sortDirection && sortField === 'game_time'
                              ? 'text-light'
                              : 'text-slate-600'
                          }`}
                        />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {isLoading ? (
                    <RecordLoader3 />
                  ) : (
                    <>
                      {recordListGame.rows &&
                        recordListGame.rows.map((v, i) => {
                          return (
                            <tr
                              key={i}
                              className=" text-slate-400 hover:text-primary"
                            >
                              <td className="text-base text-center ">
                                {v.created_at}
                              </td>
                              <td className="text-base text-center ">
                                {v.game_score}
                              </td>
                              <td className="text-base text-center ">
                                {v.game_time}
                              </td>
                            </tr>
                          );
                        })}
                    </>
                  )}
                </tbody>
              </table>
              {isLoading ? (
                <>
                  {' '}
                  <div className="mb-3 skeleton join bg-base-200 min-h-[32px]"></div>
                </>
              ) : (
                <>
                  <div className="mb-3 join bg-base-200">
                    <button
                      className={`
      ${Number(router.query.page) > 1 ? ' ' : 'btn-disabled'}
      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                      onClick={handleGamePrevPage}
                    >
                      «
                    </button>

                    {[...Array(5)].map((v, i) => {
                      let p =
                        recordListGame.page <= 5
                          ? 1 + i
                          : recordListGame.page + i;

                      if (p < 1) return null;

                      if (p > recordListGame.totalPages)
                        return (
                          <button
                            key={p}
                            className={`${
                              p === recordListGame.page ? 'text-neongreen ' : ''
                            } btn-disabled max-w-[25px] join-item btn border-slate-700 hover:bg-primary hover:text-dark btn-xs `}
                          >
                            {p}
                          </button>
                        );

                      return (
                        <button
                          key={p}
                          style={{
                            transition: 'transform 0.2s ease-in-out',
                          }}
                          className={`${
                            p === recordListGame.page ? 'text-neongreen ' : ''
                          } join-item btn max-w-[25px] border-slate-700 hover:bg-primary hover:text-dark btn-xs hover:sm:scale-[1.1]  hover:sm:translate-y-[-5px]`}
                          onClick={(e) => {
                            e.preventDefault();
                            const nweQuery = { ...router.query, page: p };
                            router.push(
                              {
                                pathname: router.pathname,
                                query: nweQuery,
                              },
                              undefined,
                              { scroll: false }
                            );
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      className={`
      ${
        router.query.page === recordListGame.totalPages.toString() ||
        recordListGame.totalPages === 0
          ? ' btn-disabled'
          : ''
      }
      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                      onClick={handleGameNextPage}
                    >
                      »
                    </button>
                  </div>
                </>
              )}
              {/* <div className="mb-3 join bg-base-200">
              </div> */}
            </div>
            {/* CONTENT2 END */}
          </div>
        </div>
      </div>
    </>
  );
}
