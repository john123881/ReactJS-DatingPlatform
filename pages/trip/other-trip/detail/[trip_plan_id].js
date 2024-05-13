import { useState, useEffect } from 'react';
import TripSidebar3 from '@/components/shen/sidebars/trip-sidebar3';
import OtherContentMorning from '@/components/shen/other-content/other-content-morning';
import OtherContentNoon from '@/components/shen/other-content/other-content-noon';
import OtherContentNight from '@/components/shen/other-content/other-content-night';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import PageTitle from '@/components/page-title';

export default function OtherTripdetail({ onPageChange }) {
  const pageTitle = '行程規劃';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);
  const { auth } = useAuth();

  const { trip_plan_id } = router.query;
  const [tripDetails, setTripDetails] = useState([]); //用於儲存從trip_details中獲取的值
  const [selectedDate, setSelectedDate] = useState(''); // 用於儲存表單選擇的日期
  const [tripName, setTripName] = useState({}); //用於儲存從trip_plans中獲取的值
  // 以 useState 控制 modal 的開關
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 開啟modal
  const openModal = () => setIsModalOpen(true);

  // 關閉modal
  const closeModal = () => setIsModalOpen(false);

  function createOtherContent() {
    event.preventDefault();
    const tripPlanData = {
      tripPlan: {
        user_id: auth.id, // 替換成實際的 user_id
        trip_title: tripName.trip_title,
        trip_content: null, // 這裡是行程内容，如果為空可以設置 null 或保持空字串
        trip_description: tripName.trip_description, // 行程描述
        trip_notes: tripName.trip_notes,
        trip_date: selectedDate, // 使用選擇的日期
        trip_draft: 0,
        trip_pic: tripName.trip_pic,
      },
      tripDetails: tripDetails.map((detail) => ({
        block: detail.block,
        movie_id: detail.movie_id,
        bar_id: detail.bar_id,
      })),
    };

    fetch('http://localhost:3001/trip/other-plans/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripPlanData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('行程添加成功！', data);
          closeModal();
          Swal.fire({
            icon: 'success',
            title: '成功',
            text: `成功將${tripName.trip_title}加入月曆!`,
            confirmButtonColor: '#A0FF1F',
            background: 'rgba(0,0,0,0.85)',
          });
        } else {
          console.error('行程添加失败：', data.error);
        }
      })
      .catch((error) => {
        console.error('請求錯誤：', error);
      });
  }
  //取得所有和 trip_plan_id 相符的 trip_details 的資料
  useEffect(() => {
    if (trip_plan_id) {
      const fetchTripDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/trip/my-details/allday-content/${trip_plan_id}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data);
          setTripDetails(data.slice(0, 3));
          console.log(tripDetails);
        } catch (error) {
          console.error('Fetching trip details error:', error);
        }
      };

      fetchTripDetails();
    }
  }, [trip_plan_id]);

  useEffect(() => {
    console.log(tripDetails);
  }, [tripDetails]);

  //trip_plans 的資料
  useEffect(() => {
    if (trip_plan_id) {
      const fetchTripName = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/trip/my-details/trip-plan/${trip_plan_id}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Fetched Trip Name Data:', data);
          if (data) {
            setTripName(data);
            console.log('Setting tripName to:', data);
          }
        } catch (error) {
          console.error('Fetching trip details error:', error);
        }
      };

      fetchTripName();
    }
  }, [trip_plan_id]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <PageTitle pageTitle={pageTitle} />
        <TripSidebar3 tripName={tripName} />
        <div className="flex  sm:justify-start justify-center items-center w-full py-8">
          <div className="mt-8 mb-8 flex flex-col justify-center items-center gap-8 w-full max-w-5xl px-4">
            <OtherContentMorning trip_plan_id={trip_plan_id} />
            <OtherContentNoon trip_plan_id={trip_plan_id} />
            <OtherContentNight trip_plan_id={trip_plan_id} />
            <button
              className="sm:hidden text-black  text-lg px-9 py-4 bg-[#a0ff1f] rounded-full border border-black flex justify-center items-center cursor-pointer  hover:shadow-xl3 hover:animate-pulse hover:text-black"
              onClick={openModal}
            >
              加入我的日曆
            </button>
          </div>
          <div className="hidden sm:flex flex-col justify-start items-center h-[700px] w-[600px] border border-white rounded-xl">
            <h3 className="mt-3 text-3xl text-white ">行程筆記</h3>
            <p className="mt-4 mb-4 text-xl">行程描述</p>
            <div className="w-[550px] h-[200px] border border-white rounded-xl">
              {tripName.trip_description ? (
                <div className="text-center p-2">
                  {tripName.trip_description}
                </div>
              ) : (
                <p className="text-center p-2">用戶並未為此行程添加細節</p>
              )}
            </div>
            <p className="mt-4 mb-4 text-xl">行程筆記</p>
            <div className="w-[550px] h-[300px] border border-white rounded-xl">
              {tripName.trip_notes ? (
                <div className="text-center p-2">{tripName.trip_notes}</div>
              ) : (
                <p className="text-center p-2">用戶並未為此行程添加筆記</p>
              )}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex justify-center">
          <button
            className="text-black text-lg px-9 py-4 w-[350px] bg-[#a0ff1f] rounded-full border border-black cursor-pointer hover:shadow-xl3 hover:animate-pulse hover:text-black"
            onClick={openModal}
          >
            加入我的日曆
          </button>
        </div>
      </div>
      {isModalOpen && (
        <dialog open id="my_modal_1" className="modal">
          <form>
            <div className="modal-box w-96">
              <h3 className="font-bold text-lg mb-4 text-white">
                將 <span className="text-[#a0ff1f]">{tripName.trip_title}</span>{' '}
                加入月曆
              </h3>
              <input type="hidden" name="user_id" value={auth.id} />
              <p className="text-white">行程日期</p>
              <input
                type="date"
                name="trip_date"
                className="mt-4 mb-4 px-2 py-1 w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)} // 保存選擇的日期到狀態中
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
                  onClick={createOtherContent}
                >
                  完成
                </button>
              </div>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
