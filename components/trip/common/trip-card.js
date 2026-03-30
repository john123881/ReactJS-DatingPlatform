import React, { memo, useState, useEffect } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import Link from 'next/link';
import { TripService } from '@/services/trip-service';
import { toast } from '@/lib/toast';

function truncateChinese(title, maxChineseChars = 7) {
  if (typeof title !== 'string') return '無標題';
  let count = 0;
  let res = '';
  for (const char of title) {
    if (char.match(/[\u4e00-\u9fff]/)) count++;
    if (count > maxChineseChars) return res + '...';
    res += char;
  }
  return res;
}

const TripCard = memo(function TripCard({ 
  trip, 
  isMyTrip = false, 
  onDeleteSuccess 
}) {
  const detailPagePath = isMyTrip 
    ? `/trip/my-trip/detail/${trip.trip_plan_id}`
    : `/trip/other-trip/detail/${trip.trip_plan_id}`;
    
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrl, setImageUrl] = useState(trip?.trip_pic || '/TD.svg');

  useEffect(() => {
    if (trip?.trip_pic) {
      setImageUrl(trip.trip_pic);
    }
  }, [trip?.trip_pic]);

  const onConfirmDelete = async () => {
    try {
      const result = await TripService.deleteTripPlan(trip.trip_plan_id);
      if (result.success) {
        onDeleteSuccess && onDeleteSuccess(trip.trip_plan_id);
        toast.success(`成功刪除: ${trip.trip_title}`);
      } else {
        setErrorMessage('刪除失敗。');
      }
    } catch (error) {
      console.error('刪除行程時發生錯誤:', error);
      setErrorMessage('刪除行程時發生錯誤。');
    }
    const dialog = document.getElementById(`delete-dialog-${trip.trip_plan_id}`);
    if (dialog) dialog.close();
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[220px] sm:max-w-[340px] pb-4 bg-black/60 backdrop-blur-md border border-neongreen/30 rounded-2xl h-72 sm:h-[480px] group transition-all duration-500 hover:scale-105 hover:border-neongreen/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(160,255,31,0.3)] overflow-hidden flex-shrink-0">
      {isMyTrip && (
        <>
          <RxCrossCircled
            className="absolute right-0 top-0 text-4xl sm:text-6xl text-white hover:text-[#a0ff1f] cursor-pointer z-10"
            onClick={() => document.getElementById(`delete-dialog-${trip.trip_plan_id}`).showModal()}
          />
          <dialog id={`delete-dialog-${trip.trip_plan_id}`} className="modal">
            <div className="modal-box bg-slate-900 border border-white">
              <h3 className="font-bold text-lg text-white text-center">
                確定要刪除 <span className="text-[#a0ff1f]">{trip.trip_title}</span> 整天的行程嗎？
              </h3>
              {errorMessage && <p className="text-center text-red-500 mt-2">{errorMessage}</p>}
              <div className="justify-center modal-action mt-6">
                <button 
                  className="btn btn-outline text-white hover:bg-gray-700 rounded-full px-8" 
                  onClick={() => document.getElementById(`delete-dialog-${trip.trip_plan_id}`).close()}
                >
                  取消
                </button>
                <button 
                  className="btn bg-[#a0ff1f] text-black hover:bg-[#8edb1a] rounded-full px-8 border-none" 
                  onClick={onConfirmDelete}
                >
                  確定
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}

      {imageUrl ? (
        <img
          className="object-cover w-full h-full mb-2 rounded-lg"
          src={imageUrl}
          alt={trip.trip_title || 'Trip Image'}
          onError={(e) => { e.target.src = '/TD.svg'; }}
        />
      ) : (
        <img
          className="object-cover w-full h-full mb-2 rounded-lg"
          src="/TD.svg"
          alt="Default Trip Image"
        />
      )}
      
      <p className="mb-3 text-lg sm:text-2xl font-bold text-white group-hover:text-neongreen transition-colors tooltip" data-tip={trip.trip_title}>
        {truncateChinese(trip.trip_title)}
      </p>
      
      <Link
        href={detailPagePath}
        className="bg-neongreen text-black hover:bg-white font-bold py-1.5 px-4 sm:py-2.5 sm:px-6 rounded-full text-sm sm:text-lg transition-all shadow-[0_0_10px_rgba(160,255,31,0.4)]"
      >
        檢視行程
      </Link>
    </div>
  );
});

export default TripCard;
