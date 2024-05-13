import React, { useState, useEffect } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import Link from 'next/link';
import Swal from 'sweetalert2';

function truncateChinese(title, maxChineseChars = 7) {
  let chineseCharCount = 0;
  let truncated = '';

  for (const char of title) {
    if (char.match(/[\u4e00-\u9fff]/)) {
      chineseCharCount += 1;
      if (chineseCharCount > maxChineseChars) {
        return truncated + '...';
      }
    }
    truncated += char;
  }

  return truncated;
}

export default function TripCardMy({ trip, onDeleteSuccess }) {
  const detailPagePath = `/trip/my-trip/detail/${trip.trip_plan_id}`;
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (trip.trip_pic) {
      const modifiedImageUrl = `${trip.trip_pic}`;
      setImageUrl(modifiedImageUrl);
      console.log('Modified Image URL:', modifiedImageUrl);
    }
  }, [trip]); // 依賴 trip 更新來觸發 useEffect

  const onConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/trip/trip-plans/delete/${trip.trip_plan_id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await response.json();
      if (data.success) {
        onDeleteSuccess(trip.trip_plan_id);
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: `成功將${trip.trip_title}刪除!`,
          confirmButtonColor: '#A0FF1F',
          background: 'rgba(0,0,0,0.85)',
        });
      } else {
        setErrorMessage('刪除失敗。');
      }
    } catch (error) {
      console.error('刪除行程時發生錯誤:', error);
      setErrorMessage('刪除行程時發生錯誤。');
    }
    document.getElementById(`delete-dialog-${trip.trip_plan_id}`).close();
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-40 sm:w-64 pb-2 bg-white border-2 border-white rounded-lg h-60 sm:h-96">
        <RxCrossCircled
          className="absolute right-0 top-0 text-4xl sm:text-6xl text-white hover:text-[#a0ff1f] cursor-pointer z-100"
          onClick={() =>
            document
              .getElementById(`delete-dialog-${trip.trip_plan_id}`)
              .showModal()
          }
        />
        <dialog id={`delete-dialog-${trip.trip_plan_id}`} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-white text-center">
              確定要刪除
              <span className="text-[#a0ff1f]">{trip.trip_title}</span>
              整天的行程嗎？
            </h3>
            {errorMessage && (
              <p className="text-center text-red-500">{errorMessage}</p>
            )}
            <div className="justify-center modal-action">
              <button
                className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                onClick={() =>
                  document
                    .getElementById(`delete-dialog-${trip.trip_plan_id}`)
                    .close()
                }
              >
                取消
              </button>
              <button
                className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                onClick={onConfirmDelete}
              >
                確定
              </button>
            </div>
          </div>
        </dialog>
        {imageUrl ? (
          <img
            className="object-cover w-full h-full mb-2 rounded-lg"
            src={imageUrl}
            alt="Trip Image"
          />
        ) : (
          <img
            className="object-cover w-full h-full mb-2 rounded-lg"
            src="/TD.svg"
            alt="Trip Image"
          />
        )}
        <p
          className="mb-2 text-lg sm:text-2xl text-black tooltip"
          data-tip={trip.trip_title}
        >
          {truncateChinese(trip.trip_title)}
        </p>
        <Link
          href={detailPagePath}
          className=" border-black bg-black hover:bg-[#a0ff1f] text-white hover:text-black border hover:border-black font-medium py-1 px-2 sm:py-2 sm:px-3 rounded-full text-sm sm:text-2xl"
        >
          檢視行程
        </Link>
      </div>
    </>
  );
}
