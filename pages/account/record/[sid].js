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
} from '@/configs/api-config';
import toast from 'react-hot-toast';
import { useLoader } from '@/context/use-loader';
import AccountLoader from '@/components/account-center/loader/account-loader';
import { AccountService } from '@/services/account-service';

export default function AccountRecord({ onPageChange }) {
  const pageTitle = '會員中心';
  const currentPage = '紀錄查詢';

  const router = useRouter();
  const { open, close, isLoading } = useLoader();
  const { auth, getAuthHeader, checkAuth } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [gameRecordOpen, setGameRecordOpen] = useState(false);

  const [pointSource, setPointSource] = useState('全部');
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

      router.push(
        {
          pathname: router.pathname,
          query: nweQuery,
        },
        undefined,
        { scroll: false },
      );
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
      const nweQuery = { ...router.query, page: nextPage };

      router.push(
        {
          pathname: router.pathname,
          query: nweQuery,
        },
        undefined,
        { scroll: false },
      );
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

      router.push(
        {
          pathname: router.pathname,
          query: nweQuery,
        },
        undefined,
        { scroll: false },
      );
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
      const nweQuery = { ...router.query, page: nextPage };

      router.push(
        {
          pathname: router.pathname,
          query: nweQuery,
        },
        undefined,
        { scroll: false },
      );
    }
  };

  //處理積分來源
  const handlePointSource = (e) => {
    const selectedValue = e.target.value;
    setPointSource(selectedValue);

    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, selectedValue, page: 1 },
      },
      undefined,
      { scroll: false },
    );
  };

  //處理日期開始
  const handleDateBegin = (e) => {
    const newValueDateBegin = e.target.value;
    setValueDateBegin(newValueDateBegin);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, date_begin: newValueDateBegin, page: 1 },
      },
      undefined,
      { scroll: false },
    );
  };

  //處理日期結束
  const handleDateEnd = (e) => {
    const newValueDateEnd = e.target.value;
    setValueDateEnd(newValueDateEnd);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, date_end: newValueDateEnd, page: 1 },
      },
      undefined,
      { scroll: false },
    );
  };

  //處理日期排序
  const handleDateSort = () => {
    const newDateSortToggle = !dateSortToggle;
    const sort = newDateSortToggle ? 'ASC' : 'DESC';
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sortDate: sort, page: 1 },
      },
      undefined,
      { scroll: false },
    );
    setDateSortToggle(newDateSortToggle);
  };

  //處理類型排序
  const handleSort = (field) => {
    const newField = field;
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

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          sortDirection: sort,
          sortField: newField,
          page: 1,
        },
      },
      undefined,
      { scroll: false },
    );
    setSortDirection(newSortDirection);
    setSortField(newField);
  };

  //處理類型切換按鈕
  const handleToggleChange = (e) => {
    setGameRecordOpen(e.target.checked);
  };

  //渲染->積分紀錄
  useEffect(() => {
    if (!router.isReady || auth.id === 0 || router.query.sid === undefined) return;
    if (gameRecordOpen) return;

    let isSubscribed = true;

    const loadData = async () => {
      if (!isSubscribed) return;
      setRecordListPoint({ rows: [], page: 0, totalPages: 0 });
      open();
      try {
        const authResult = await checkAuth(router.query.sid);
        if (!authResult.success) {
          if (isSubscribed) {
            router.push('/');
            toast.error(authResult.message || '驗證失敗', { duration: 1500 });
          }
          return;
        }

        const result = await AccountService.getPointRecord(router.query.sid, location.search);
        if (!isSubscribed) return;

        if (result.success) {
          const pointData = result.output || result;
          if (pointData.error === '無相關紀錄') {
            setRecordListPoint({ rows: [], page: 0, totalPages: 0 });
            toast.error(pointData.error, { duration: 1500 });
          } else {
            setRecordListPoint((prev) => ({
              ...prev,
              rows: pointData.data || result.data || [],
              page: result.page || 0,
              totalPages: result.totalPages || 0,
            }));
          }
        }
      } catch (error) {
        console.error('loadData error:', error);
      } finally {
        if (isSubscribed) close(0.5);
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
      close();
    };
  }, [router.query, auth.id, gameRecordOpen, getAuthHeader, router.isReady, checkAuth, open, close]);

  //渲染->遊戲紀錄
  useEffect(() => {
    if (!router.isReady || auth.id === 0 || router.query.sid === undefined) return;
    if (!gameRecordOpen) return;

    let isSubscribed = true;

    const loadData = async () => {
      if (!isSubscribed) return;
      setRecordListGame({ rows: [], page: 0, totalPages: 0 });
      open();
      try {
        const authResult = await checkAuth(router.query.sid);
        if (!authResult.success) {
          if (isSubscribed) {
            router.push('/');
            toast.error(authResult.message || '驗證失敗', { duration: 1500 });
          }
          return;
        }

        const result = await AccountService.getGameRecord(router.query.sid, location.search);
        if (!isSubscribed) return;

        if (result.success) {
          const gameData = result.output || result;
          if (gameData.error === '無相關紀錄') {
            setRecordListGame({ rows: [], page: 0, totalPages: 0 });
            toast.error(gameData.error, { duration: 1500 });
          } else {
            setRecordListGame((prev) => ({
              ...prev,
              rows: gameData.data || result.data || [],
              page: result.page || 0,
              totalPages: result.totalPages || 0,
            }));
          }
        }
      } catch (error) {
        console.error('fetchGameRecord error:', error);
      } finally {
        if (isSubscribed) close(0.5);
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
      close();
    };
  }, [gameRecordOpen, router.query, auth.id, getAuthHeader, router.isReady, checkAuth, open, close]);

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
  }, [onPageChange, pageTitle]);

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
                      className="w-1/3 text-lg text-center cursor-pointer text-light hover:text-neongreen"
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
                    <th className="w-1/3 text-lg text-center text-light ">
                      紅利積分
                    </th>
                    <th className="w-1/3 text-lg text-center text-light ">
                      獲得來源
                    </th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {isLoading ? (
                    <tr>
                      <td colSpan="3" className="p-0 border-0">
                        <AccountLoader type="points" minHeight="450px" />
                      </td>
                    </tr>
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
              {!isLoading && recordListPoint.totalPages > 1 && (
                <div className="mb-3 join bg-base-200">
                  <button
                    className={`
                      ${Number(router.query.page) > 1 ? ' ' : 'btn-disabled'}
                      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                    onClick={handlePointPrevPage}
                  >
                    «
                  </button>

                  {[...Array(Math.min(5, recordListPoint.totalPages))].map(
                    (v, i) => {
                      let p =
                        recordListPoint.page <= 5
                          ? 1 + i
                          : recordListPoint.page + i;

                      if (p < 1 || p > recordListPoint.totalPages) return null;

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
                              { scroll: false },
                            );
                          }}
                        >
                          {p}
                        </button>
                      );
                    },
                  )}

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
              )}
            </div>
            {/* CONTENT1 END */}

            {/* CONTENT2 START */}
            <div
              className={`mt-4 flex flex-col justify-between w-full h-[580px] ${
                gameRecordOpen ? 'block ' : 'hidden '
              } lg:mx-1 xl:mx-1 bg-base-300 rounded-box place-items-center `}
            >
              <table className="container table py-4 bg-base-300">
                <thead className="w-full ">
                  <tr className="border-b border-slate-500 min-h-[52px]">
                    <th
                      onClick={() => {
                        handleSort('created_at');
                      }}
                      className="w-1/3 text-lg text-center cursor-pointer text-light hover:text-neongreen"
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
                      className="w-1/3 text-lg text-center cursor-pointer text-light hover:text-neongreen"
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
                      className="w-1/3 text-lg text-center cursor-pointer text-light hover:text-neongreen"
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
                    <tr>
                      <td colSpan="3" className="p-0 border-0">
                        <AccountLoader type="game_record" minHeight="450px" />
                      </td>
                    </tr>
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
                                {v.game_time
                                  ? v.game_time.includes('T')
                                    ? v.game_time.split('T')[1].substring(0, 8)
                                    : v.game_time
                                  : ''}
                              </td>
                            </tr>
                          );
                        })}
                    </>
                  )}
                </tbody>
              </table>
              {!isLoading && recordListGame.totalPages > 1 && (
                <div className="mb-3 join bg-base-200">
                  <button
                    className={`
                      ${Number(router.query.page) > 1 ? ' ' : 'btn-disabled'}
                      join-item btn border-slate-700 hover:bg-primary btn-xs`}
                    onClick={handleGamePrevPage}
                  >
                    «
                  </button>

                  {[...Array(Math.min(5, recordListGame.totalPages))].map(
                    (v, i) => {
                      let p =
                        recordListGame.page <= 5
                          ? 1 + i
                          : recordListGame.page + i;

                      if (p < 1 || p > recordListGame.totalPages) return null;

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
                              { scroll: false },
                            );
                          }}
                        >
                          {p}
                        </button>
                      );
                    },
                  )}

                  <button
                    className={`
                      ${
                        router.query.page ===
                          recordListGame.totalPages.toString() ||
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
              )}
            </div>
            {/* CONTENT2 END */}
          </div>
        </div>
      </div>
    </>
  );
}
