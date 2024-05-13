import { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { IoMdStarOutline, IoMdStar } from 'react-icons/io';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function BarCard({
  bar,
  area,
  id,
  user,
  savedBars,
  setSavedBars,
}) {
  // save bar
  // const [savedBars, setSavedBars] = useState({});
  const [error, setError] = useState('');
  const { auth, getAuthHeader, rerender, setRerender } = useAuth();
  const isSaved = savedBars && savedBars[bar.bar_id];

  const handleSavedClick = async () => {
    if (auth.id == 0) return;
    const barId = bar.bar_id;
    const userId = auth.id; // Ensure user is defined and has an id

    if (!userId) {
      console.error('User ID is undefined or not set');
      return;
    }

    const wasSaved = isSaved;
    const newSavedState = !wasSaved;

    try {
      const url = wasSaved ? '/unsaved-bar' : '/saved-bar';
      const method = wasSaved ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:3001/bar${url}`, {
        method: method,
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ barId, userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSavedBars((prev) => ({ ...prev, [barId]: newSavedState }));
        setRerender(!rerender);
        console.log('Save status updated:', data);
      } else {
        throw new Error(data.message || 'Failed to update save status');
      }
    } catch (error) {
      console.error('Error updating save status:', error);
      setError(error.message);
    }
  };

  // 檢查儲存酒吧狀態
  // const checkBarsStatus = async (barIds) => {
  //   const userId = auth.id;

  //   if (userId === 0) {
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `http://localhost:3001/bar/check-bar-status?userId=${userId}&barIds=${barIds}`,
  //       {
  //         headers: {
  //           ...getAuthHeader(),
  //         },
  //       }
  //     );
  //     const data = await response.json();

  //     // 初始化來存儲所有酒吧的收藏狀態
  //     const newSavedBars = { ...savedBars };

  //     // 遍歷從後端獲取的每個貼文的狀態數據
  //     data.forEach((status) => {
  //       // 將每個貼文的收藏狀態存儲到 newSavedBars 對象中
  //       newSavedBars[status.barId] = status.isSaved;
  //     });

  //     // 更新 React 狀態以觸發界面更新，以顯示最新的收藏狀態
  //     setSavedBars(newSavedBars);
  //   } catch (error) {
  //     console.error('無法獲取酒吧狀態:', error);
  //   }
  // };

  // const currentPage = 'Fake Sober';

  // const imgUrl = useMemo(() => {
  //   if (bar.bar_img) {
  //     return URL.createObjectURL(bar.bar_img);
  //   }
  //   return '';
  // }, [bar]);
  // // const imgUrl = bar.bar_img && URL.createObjectURL(bar.bar_img);
  // console.log('test', bar);
  return (
    <>
      <div
        // key={key}
        className=" card bg-white w-[159px] h-[228px] lg:w-[223px] lg:h-[320px] shadow-xl"
      >
        <figure>
          <div className="cursor-pointer bar-card-img">
            <Link href={`/bar/bar-detail/${bar.bar_id}`}>
              <img
                className="relative w-[159px] h-[146px] lg:w-[223px] lg:h-[205px] object-cover"
                loading="lazy"
                // src={bar.bar_img}
                src={`/barPic/${bar.bar_pic_name}`}
                // src="https://damei17.com/wp-content/uploads/2022/08/Fake-Sober-24.jpg"
                // src={pic.img || 'https://damei17.com/wp-content/uploads/2022/08/Fake-Sober-24.jpg'}
                alt={`Image of ${bar.bar_name}`}
              />
            </Link>
            {/* <div className="absolute text-white top-3 right-3 text-[20px]">
              <FiHeart className="card-icon hover:text-neongreen" />
            </div> */}

            <div className="card-iconListRight flex justify-end absolute text-white top-3 right-3 text-[20px]">
              {isSaved ? (
                <FaHeart
                  className="card-icon hover:text-neongreen"
                  onClick={handleSavedClick}
                />
              ) : (
                <FaRegHeart
                  className="card-icon hover:text-neongreen"
                  onClick={handleSavedClick}
                />
              )}
            </div>
          </div>
        </figure>
        <div className="bar-card-content h-[82px] lg:h-[115px] m-2">
          <div className="text-[11px] lg:text-[15px] text-black font-bold">
            {/* Fake Sober Taipei */}
            {bar.bar_name}
          </div>
          <button>
            <Link href={`/bar/bar-rating-list/${bar.bar_id}`}>
              <div className="flex w-[40px] lg:w-[50px] rounded-[30px] bg-[#BCBCBC] justify-center items-center">
                <div className="text-[9px] lg:text-[12px] text-white ml-2">
                  {/* {bar.averageRating} */}
                  {bar.rating}
                </div>
                <div className="m-0.5 mr-2">
                  <IoMdStar className="text-[13px] lg:text-[16px] text-white" />
                </div>
              </div>
            </Link>
          </button>
          <p className="text-[10px] lg:text-[15px] text-black">
            {/* 信義區 */}
            {bar.bar_area_name}
          </p>
          <div className="w-[145px] lg:w-[200px] flex justify-between">
            <div className="text-[10px] lg:text-[15px] text-black">
              {/* bar_type -> bar_type_name*/}
              {/* 特色酒吧 */}
              {bar.bar_type_name}
            </div>
            <button className="flex relative rounded-[30px] bg-black hover:bg-[#A0FF1F]">
              <Link
                className="text-[10px] lg:text-[12px] text-white hover:text-black m-0.5 mx-3"
                href={`/bar/bar-booking/${bar.bar_id}`}
              >
                立即訂位
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
