import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import { FaTrash } from 'react-icons/fa6';
import InPlaceSearch from '../add-trip/in-place-search';
import { toast } from 'react-hot-toast';

export default function NoContentBase({ trip_plan_id, refreshTripDetails, refreshAllDetails, block, label, trip_detail_id, isGhost, setNewDetail }) {
  const [deleteContent, setDeleteContent] = useState(false);

  const openDeleteModal = () => setDeleteContent(true);
  const closeDeleteModal = () => setDeleteContent(false);

  const handleRealDelete = async () => {
    const targetId = trip_detail_id;
    if (!targetId) return;

    // 樂觀更新：立即從父組件狀態中移除
    if (setNewDetail) {
      setNewDetail((prev) => {
        if (Array.isArray(prev)) {
          return prev.filter((item) => item.trip_detail_id !== targetId);
        }
        return prev;
      });
    }

    try {
      const result = await TripService.deleteTripDetail(targetId);
      if (result.success) {
        toast.success('幽靈記錄已清除');
        refreshTripDetails();
        if (refreshAllDetails) refreshAllDetails();
      } else {
        throw new Error(result.message || '刪除失敗');
      }
    } catch (error) {
      console.error('Delete ghost record error:', error);
      toast.error(error.message);
      // 失敗時重新整理回原狀
      if (refreshAllDetails) refreshAllDetails();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-4">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10"></div>
        <h3 className="text-white/20 text-xs font-black uppercase tracking-[0.5em]">{label}尚未安排</h3>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10"></div>
      </div>

      <InPlaceSearch 
        trip_plan_id={trip_plan_id}
        block={block}
        refreshTripDetails={refreshTripDetails}
        refreshAllDetails={refreshAllDetails}
      />

      {isGhost && (
        <button 
          onClick={handleRealDelete}
          className="flex items-center gap-2 text-[10px] font-bold text-red-400/50 hover:text-red-400 transition-colors uppercase tracking-widest mt-2"
        >
          <FaTrash className="animate-pulse" /> Clear Ghost Record
        </button>
      )}

      {deleteContent && (
        <dialog open className="modal">
          <div className="modal-box w-96 flex flex-col justify-center items-center backdrop-blur-3xl bg-black/80 border border-white/10">
            <h3 className="font-black text-lg mb-4 text-neongreen italic uppercase tracking-tighter">
              無法刪除不存在的行程 :P
            </h3>
            <div className="modal-action">
              <button
                type="button"
                className="btn text-white bg-white/10 px-8 py-2 border border-white/10 rounded-full hover:bg-neongreen hover:text-black transition-all font-black uppercase text-xs tracking-widest"
                onClick={closeDeleteModal}
              >
                我知道了
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
