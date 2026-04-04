import { useState } from 'react';
import { TripService } from '@/services/trip-service';
import { toast } from '@/lib/toast';

export default function CarouselContentMovie2({
  movies,
  altText,
  onClick,
  trip_plan_id,
  refreshAllDetails,
  newDetail = []
}) {
  const [showDetails, setShowDetails] = useState(false);
  const modalId = `modal_movie_${movies.movie_id}`; // 確保彈跳視窗的 id 是唯一值
  const [timeOfDay, setTimeOfDay] = useState('1'); // 用於存儲選擇的時段

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
    if (onClick) {
      onClick();
    }
    document.getElementById(modalId).showModal(); // 開啟彈跳視窗
  };

  const handleCloseModal = () => {
    document.getElementById(modalId).close(); // 關閉彈跳視窗
  };
  const handleTimeChange = (event) => {
    setTimeOfDay(event.target.value); // 更新選擇的時段
  };
  const handleSubmit = async () => {
    // 檢查該時段是否已存在「有效內容」的項目
    const isExist = Array.isArray(newDetail) && newDetail.some(item => {
        return String(item.block) === String(timeOfDay) && (Boolean(item.movie_id) || Boolean(item.bar_id));
    });
    
    if (isExist) {
        toast.warning('時段重複', '該時段已有安排其它行程囉！請先刪除原行程再加入新的行程～');
        return;
    }
    
    try {
      const result = await TripService.addMovieToTripBlock(trip_plan_id, {
        movie_id: movies.movie_id,
        block: timeOfDay,
      });

      if (result.success) {
        toast.success(`成功加入: ${movies.title}`);
        document.getElementById(modalId).close(); // 關閉彈跳視窗

        // 發送自遞義事件，通知對應的區塊進行局部重新整理
        window.dispatchEvent(new CustomEvent('trip-detail-refresh', { 
            detail: { block: timeOfDay } 
        }));

        refreshAllDetails();
      } else {
        toast.error('發生錯誤', result.message || '未知錯誤');
      }
    } catch (error) {
      console.error('Error adding movie to trip:', error);
      toast.error('連線失敗', error.message);
    }
  };

  return (
    <div className="relative group animate__animated animate__fadeIn">
      <img
        src={
          movies.movie_img_url
            ? movies.movie_img_url
            : `/movie_img/${movies.poster_img}`
        }
        alt={altText}
        className="object-cover w-48 h-48 transition-transform duration-300 ease-in-out group-hover:scale-110 border border-white rounded-lg cursor-pointer"
        onClick={handleShowDetails}
      />
      <div
        className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
        onClick={handleShowDetails}
      >
        <p className="text-white text-xl text-center">{movies.title}</p>
      </div>
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          </form>
          <div className="flex justify-start items-center">
            <img
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover"
              src={
                movies.movie_img_url
                  ? movies.movie_img_url
                  : `/movie_img/${movies.poster_img}`
              }
              alt={`Image of ${movies.title}`}
            />
            <div className="flex flex-col justify-center items-start ml-5 mr-5 sm:ml-12 sm:mr-12 flex-grow min-w-0">
              <h2 className="text-white text-base mb-2 truncate w-full">{movies.title}</h2>
              <h2 className="text-white text-sm opacity-80 mb-3">{movies.movie_type}片</h2>
              <div className="mt-1 flex items-center whitespace-nowrap">
                <label htmlFor="timeOfDay" className="text-white text-sm mr-2">
                  選擇時段：
                </label>
                <select
                  name="timeOfDay"
                  value={timeOfDay}
                  onChange={handleTimeChange}
                  className="bg-black text-white text-sm p-1 rounded"
                >
                  <option value="1">早上</option>
                  <option value="2">下午</option>
                  <option value="3">晚上</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="text-white hover:text-black text-xs px-6 py-2 bg-black hover:bg-[#a0ff1f] rounded-full border border-white flex justify-center items-center mt-4 whitespace-nowrap flex-shrink-0 min-w-[100px]"
            >
              加入行程
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
