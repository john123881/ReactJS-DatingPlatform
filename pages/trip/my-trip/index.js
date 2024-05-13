import { useState, useEffect } from 'react';
import TripSidebar from '../../../components/shen/sidebars/trip-sidebar';
import TripCardMy from '../../../components/shen/trip-card-my';
import TripCard from '@/components/shen/trip-card';
import { useAuth } from '@/context/auth-context';
import { jwtDecode } from 'jwt-decode';
import Router from 'next/router';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function MyTrip({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);
  const { auth, getAuthHeader } = useAuth();
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState(null); // 添加 user_id 狀態
  const [tripDate, setTripDate] = useState('');
  const [tripTitle, setTripTitle] = useState('');
  const [otherTrips, setOtherTrips] = useState([]);
  const { open, close, isLoading } = useLoader();
  //為日期選擇設下限制，不能選擇今天以前的日期
  const today = new Date();
  today.setHours(today.getHours() + 8); // 加八個小時
  const localDate = today.toISOString().split('T')[0];
  // console.log(getAuthHeader());
  // console.log(auth.id);
  useEffect(() => {
    if (auth.id === 0) return;
    fetchTrips();
    // 解密 jwt 並設置 user_id
    const jwtObject = getAuthHeader();
    const jwt = jwtObject?.Authorization?.slice(7); // 提取 jwt 字串
    console.log(jwt);
    if (jwt) {
      const decoded = jwtDecode(jwt);
      setUserId(decoded.id);
      // console.log(decoded.id);
    }
  }, [auth.id]);
  useEffect(() => {
    console.log(userId);
  }, [userId]);

  const fetchTrips = async () => {
    open();
    try {
      const response = await fetch('http://localhost:3001/trip/trip-plans', {
        headers: { ...getAuthHeader() },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched Trip Data:', data);
      setTrips(data);
    } catch (error) {
      console.error('Fetching trips error:', error);
    }
    close();
  };
  /////////////在尚無行程時顯示其他人的推薦行程//////////////////////
  useEffect(() => {
    if (auth.id === 0) return;
    fetchOtherTrips();
  }, [auth.id]); // 防止重複執行

  const fetchOtherTrips = async () => {
    open();
    try {
      const response = await fetch('http://localhost:3001/trip/other-plans', {
        headers: { ...getAuthHeader() },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched Trip Data:', data);
      setOtherTrips(data);
    } catch (error) {
      console.error('Fetching trips error:', error);
    }
    close();
  };
  ////////////////////////////////////////////////////////
  const onDeleteSuccess = (tripPlanId) => {
    // 過濾掉被刪除的行程
    const updatedTrips = trips.filter(
      (trip) => trip.trip_plan_id !== tripPlanId
    );
    setTrips(updatedTrips);
  };

  // 以 useState 控制 modal 的開關
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 開啟modal
  const openModal = () => setIsModalOpen(true);

  // 關閉modal
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log('tripDate:', tripDate);
    // console.log('tripTitle:', tripTitle);
    try {
      const response = await fetch(
        'http://localhost:3001/trip/trip-plans/add',
        {
          method: 'POST',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: auth.id,
            trip_date: tripDate,
            trip_title: tripTitle,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Network response was not ok');
      }
      console.log('Trip plan created successfully:', data);
      closeModal();

      const newTripPlanId = data.tripPlanId;
      console.log(newTripPlanId);
      const newPath = `/trip/my-trip/detail/${newTripPlanId}`;
      Router.push(newPath);
    } catch (error) {
      console.error('Creating trip plan error:', error);
    }
  };
  const recomend = (
    <div className="flex flex-wrap justify-center mx-5 my-5 min-h-screen">
      <div className="flex flex-col items-center justify-start w-full max-w-4xl sm:mt-24">
        <p className="mb-12 sm:text-2xl text-center">
          立即規劃屬於自己的專屬行程
        </p>
        <div className="mb-16">
          {/* 更新按鈕的onClick處理函式，以開啟彈出視窗 */}
          <button
            className="mt-5 mb-5 bg-black sm:text-2xl text-white border border-white rounded-full px-5 py-2.5 hover:bg-[#a0ff1f] hover:text-black hover:border-black"
            onClick={openModal}
          >
            新增行程
          </button>
          {/* 以 useState 來控制<dialog> */}
          {isModalOpen && (
            <dialog open id="my_modal_1" className="modal">
              <form onSubmit={handleSubmit}>
                <div className="modal-box w-96">
                  <h3 className="font-bold text-lg mb-4 text-white">
                    建立行程
                  </h3>
                  <input type="hidden" name="user_id" value={auth.id} />
                  <p className="text-white">行程日期</p>
                  <input
                    type="date"
                    name="trip_date"
                    className="mt-4 mb-4 px-2 py-1 w-full"
                    value={tripDate}
                    onChange={(event) => setTripDate(event.target.value)}
                    min={localDate}
                    required
                  />
                  <p className="text-white">行程名稱</p>
                  <input
                    type="text"
                    name="trip_title"
                    className="mt-4 mb-4 px-2 py-1 w-full"
                    placeholder="請輸入行程名稱"
                    value={tripTitle}
                    onChange={(event) => setTripTitle(event.target.value)}
                  />
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                      onClick={closeModal}
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                    >
                      完成
                    </button>
                  </div>
                </div>
              </form>
            </dialog>
          )}
        </div>
        <p className="sm:text-2xl">還沒有任何想法嗎？參考看看別人的行程吧</p>
      </div>
      <div className=" mb-24 w-full flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-5 sm:gap-14 my-4 justify-center">
          {otherTrips.slice(0, 5).map((otherTrip) => (
            <TripCard key={otherTrip.trip_plan_id} otherTrip={otherTrip} />
          ))}
        </div>
      </div>
    </div>
  );

  if (trips.length > 0) {
    return (
      <>
        <PageTitle pageTitle={pageTitle} />
        <div className="flex flex-col min-h-screen">
          <TripSidebar />
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex-grow ">
              <div className="flex flex-col items-center justify-center">
                <button
                  className="mt-5 mb-5 bg-black sm:text-2xl text-white border border-white rounded-full px-5 py-2.5 hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                  onClick={openModal}
                >
                  新增行程
                </button>
                {/* 以 useState 來控制<dialog> */}
                {isModalOpen && (
                  <dialog open id="my_modal_1" className="modal">
                    <form onSubmit={handleSubmit}>
                      <div className="modal-box w-96">
                        <h3 className="font-bold text-lg mb-4 text-white">
                          建立行程
                        </h3>
                        <input type="hidden" name="user_id" value={auth.id} />
                        <p className="text-white">行程日期</p>
                        <input
                          type="date"
                          name="trip_date"
                          className="mt-4 mb-4 px-2 py-1 w-full"
                          value={tripDate}
                          onChange={(event) => setTripDate(event.target.value)}
                          min={localDate}
                          required
                        />
                        <p className="text-white">行程名稱</p>
                        <input
                          type="text"
                          name="trip_title"
                          className="mt-4 mb-4 px-2 py-1 w-full"
                          placeholder="請輸入行程名稱"
                          value={tripTitle}
                          onChange={(event) => setTripTitle(event.target.value)}
                          required
                        />
                        <div className="modal-action">
                          <button
                            type="button"
                            className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                            onClick={closeModal}
                          >
                            取消
                          </button>
                          <button
                            type="submit"
                            className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                          >
                            完成
                          </button>
                        </div>
                      </div>
                    </form>
                  </dialog>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-5 sm:gap-14 my-4 justify-center">
                  {trips.map((trip) => (
                    <TripCardMy
                      key={trip.trip_plan_id}
                      trip={trip}
                      onDeleteSuccess={onDeleteSuccess}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        <PageTitle pageTitle={pageTitle} />
        <TripSidebar />
        {isLoading ? <Loader /> : recomend}
      </>
    );
  }
}

// if (noContent) {
//   return (
//     <>
//       <TripSidebar />
//       {recomend}
//       <Footer />
//     </>
//   );
// } else {
