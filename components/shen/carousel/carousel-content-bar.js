import React, { useState } from 'react';

export default function CarouselContentBar({
  barSaved,
  altText,
  onClick,
  trip_plan_id,
  refreshAllDetails,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const modalId = `modal_${barSaved.bar_id}`; // 確保每個對話框的 ID 是唯一的
  const [timeOfDay, setTimeOfDay] = useState('1'); // 用於存儲選擇的時段

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
    if (onClick) {
      onClick();
    }
  };

  const handleTimeChange = (event) => {
    setTimeOfDay(event.target.value); // 更新選擇的時段
  };

  const handleSubmit = async () => {
    console.log('Sending block as:', timeOfDay);
    try {
      const response = await fetch(
        `http://localhost:3001/trip/my-details/add-bar/${trip_plan_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bar_id: barSaved.bar_id,
            block: timeOfDay,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        console.log('Bar added to trip successfully!');
        document.getElementById(modalId).close(); // 關閉彈跳視窗
        refreshAllDetails();
      } else {
        alert('失敗了失敗了時間不多囉：' + result.message);
      }
    } catch (error) {
      console.error('Error adding bar to trip:', error);
      alert('Failed to add bar to trip: ' + error.message);
    }
  };

  return (
    <div className="relative group">
      <img
        src={`/barPic/${barSaved.bar_pic_name}`}
        alt={altText}
        className="object-cover w-48 h-48 transition-transform duration-300 ease-in-out group-hover:scale-110 border border-white rounded-lg cursor-pointer"
        onClick={handleShowDetails}
      />
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex justify-start items-center">
            <img
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover"
              src={`/barPic/${barSaved.bar_pic_name}`}
              alt={`Image of ${barSaved.bar_name}`}
            />
            <div className="flex flex-col justify-center items-start ml-5 mr-5 sm:ml-12 sm:mr-12">
              <h2 className="text-white text-base mb-5">{barSaved.bar_name}</h2>
              <div className="flex">
                <div className="text-white text-sm mr-4">
                  {barSaved.bar_area_name}
                </div>
                <div className="text-white text-sm">
                  {barSaved.bar_type_name}
                </div>
              </div>
              <div className="mt-4">
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
              className="text-white hover:text-black text-xs px-6 py-2 bg-black hover:bg-[#a0ff1f] rounded-full border border-white flex justify-center items-center mt-4"
            >
              加入行程
            </button>
          </div>
        </div>
      </dialog>
      <div
        className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
        onClick={() => document.getElementById(modalId).showModal()}
      >
        <p className="text-white text-xl text-center">{altText}</p>
      </div>
    </div>
  );
}
