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
  onDeleteSuccess,
  onDeleteRollback 
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
    const originalTrip = { ...trip };
    const tripId = trip.trip_plan_id;
    
    // 樂觀執行：立即從 UI 移除
    onDeleteSuccess && onDeleteSuccess(tripId);
    
    // 立即關閉對話框
    const dialog = document.getElementById(`delete-dialog-${tripId}`);
    if (dialog) dialog.close();

    try {
      const result = await TripService.deleteTripPlan(tripId);
      if (result.success) {
        toast.success(`成功刪除: ${originalTrip.trip_title}`);
      } else {
        throw new Error(result.message || '刪除失敗');
      }
    } catch (error) {
      console.error('刪除行程時發生錯誤 (已執行回溯):', error);
      toast.error(`刪除失敗: ${originalTrip.trip_title}。資料已還原。`);
      // 失敗回溯：將資料補回列表
      onDeleteRollback && onDeleteRollback(originalTrip);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
  };

  const spotCount = trip.trip_details?.length || 0;

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[340px] h-[380px] sm:h-[460px] rounded-3xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(160,255,31,0.2)] border border-white/10 hover:border-neongreen/40 flex-shrink-0 bg-[#0a0a0a]">
      {/* 背景圖片層 */}
      <div className="absolute inset-0 z-0">
        <img
          className={`object-cover w-full h-full transition-all duration-700 group-hover:scale-110 ${imageUrl === '/TD.svg' ? 'opacity-20 grayscale brightness-50' : 'opacity-60 group-hover:opacity-75'}`}
          src={imageUrl || '/TD.svg'}
          alt={trip.trip_title || 'Trip Image'}
          onError={(e) => { e.target.src = '/TD.svg'; }}
        />
        {/* 漸層遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
      </div>

      {/* 頂部管理元件 (刪除按鈕) */}
      {isMyTrip && (
        <div className="absolute top-5 right-5 z-30">
          <RxCrossCircled
            className="text-2xl sm:text-3xl text-white/40 hover:text-red-500 cursor-pointer transition-all active:scale-90"
            onClick={() => document.getElementById(`delete-dialog-${trip.trip_plan_id}`).showModal()}
          />
          <dialog id={`delete-dialog-${trip.trip_plan_id}`} className="modal">
            <div className="modal-box bg-[#111] border border-white/10 backdrop-blur-2xl rounded-3xl">
              <h3 className="font-bold text-xl text-white text-center mb-2">
                確定刪除行程？
              </h3>
              <p className="text-white/60 text-center mb-6">「{trip.trip_title}」將被永久移除。</p>
              <div className="flex justify-center gap-4">
                <button 
                  className="btn btn-ghost text-white/60 hover:text-white rounded-full px-8 border border-white/10" 
                  onClick={() => document.getElementById(`delete-dialog-${trip.trip_plan_id}`).close()}
                >
                  取消
                </button>
                <button 
                  className="btn bg-neongreen text-black hover:bg-neongreen/90 rounded-full px-8 border-none font-bold" 
                  onClick={onConfirmDelete}
                >
                  確認刪除
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}

      {/* 景點數標籤 */}
      <div className="absolute top-5 left-5 z-20">
        <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/5 text-white text-xs font-semibold tracking-wider flex items-center gap-2 shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-neongreen shadow-[0_0_8px_rgba(160,255,31,0.8)]"></span>
          {spotCount} 個地點
        </div>
      </div>

      {/* 資訊對話框 (固定底座) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        {/* 毛玻璃底座裝飾 */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-2 min-h-[3rem] group-hover:text-neongreen transition-colors underline-offset-4 decoration-neongreen/30">
              {trip.trip_title}
            </h2>
            <div className="flex items-center gap-2 text-white/40 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              <span>{formatDate(trip.trip_date)}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>Trip Plan</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            {/* 創作者訊息 */}
            {trip.member_user ? (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 ring-2 ring-white/5 shadow-inner bg-slate-800">
                  <img 
                    src={trip.member_user.avatar || '/avatar/defaultAvatar.jpg'} 
                    alt={trip.member_user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/90 text-[10px] font-bold leading-none">{trip.member_user.username}</span>
                  <span className="text-white/30 text-[9px] truncate max-w-[80px]">
                    {isMyTrip ? 'Private Plan' : 'Shared Trip'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-neongreen/60">
                 <span className="text-[10px] font-bold tracking-wide uppercase italic">
                    {isMyTrip ? 'My Personal Trip' : 'Other Trip'}
                 </span>
              </div>
            )}
            
            <Link
              href={detailPagePath}
              className="group/btn flex items-center gap-2 bg-white/5 hover:bg-neongreen text-white hover:text-black font-black py-2 px-5 rounded-full text-xs sm:text-sm transition-all border border-white/10 hover:border-neongreen shadow-xl active:scale-95"
            >
              檢視行程
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TripCard;
