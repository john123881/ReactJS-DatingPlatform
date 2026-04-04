import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import { FaCirclePlus, FaTrash } from 'react-icons/fa6';
import TripRecomendModal from '@/components/trip/add-trip/trip-recomend-modal';

export default function NoContentBase({ trip_plan_id, refreshTripDetails, refreshAllDetails, block, label, trip_detail_id, isGhost }) {
  const [deleteContent, setDeleteContent] = useState(false);
  const [newTripDetailId, setNewTripDetailId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openDeleteModal = () => setDeleteContent(true);
  const closeDeleteModal = () => setDeleteContent(false);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    refreshTripDetails();
    if (refreshAllDetails) refreshAllDetails();
  };

  const handleAddClick = async () => {
    if (!trip_plan_id) {
      console.error('Missing trip_plan_id');
      return;
    }

    try {
      let result;
      if (block === 1) {
        result = await TripService.addMorningBlock(trip_plan_id);
      } else if (block === 2) {
        result = await TripService.addNoonBlock(trip_plan_id);
      } else {
        result = await TripService.addNightBlock(trip_plan_id);
      }

      if (result && result.success !== false) {
        setNewTripDetailId(result.trip_detail_id || result.insertId || result.id);
      } else {
        throw new Error(result?.error || result?.message || result?.msg || `Set block = ${block} 失敗`);
      }
    } catch (error) {
      console.error('錯誤:', error);
      customToast.error('新增失敗', error.message);
    }
  };

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
        customToast.success('刪除成功', '幽靈記錄已清除');
        refreshTripDetails();
        if (refreshAllDetails) refreshAllDetails();
      } else {
        throw new Error(result.message || '刪除失敗');
      }
    } catch (error) {
      console.error('Delete ghost record error:', error);
      customToast.error('刪除失敗', error.message);
      // 失敗時重新整理回原狀
      if (refreshAllDetails) refreshAllDetails();
    }
  };

  useEffect(() => {
    if (newTripDetailId) {
      setIsAddModalOpen(true);
    }
  }, [newTripDetailId]);

  return (
    <>
      <div className="flex justify-center items-end gap-9">
        <a href="#" className="hidden">
          <FaTrash className="text-2xl hover:text-[#a0ff1f]" />
        </a>
        <div className="flex flex-col justify-center items-center w-32 h-32 sm:w-48 sm:h-48 border border-white rounded-2xl">
          <button
            onClick={handleAddClick}
            className="text-2xl mb-1.5 hover:text-[#a0ff1f]"
          >
            <FaCirclePlus />
          </button>
          <h3>{label}</h3>
        </div>
        {isAddModalOpen && (
          <dialog id="my_modal_add" open className="modal">
            <div className="modal-box w-11/12 max-w-5xl ">
              <div className="modal-action">
                <form method="dialog" onSubmit={(e) => e.preventDefault()} />
              </div>
              <TripRecomendModal
                trip_detail_id={newTripDetailId}
                refreshTripDetails={refreshTripDetails}
                onClose={handleCloseModal}
              />
            </div>
          </dialog>
        )}
        <button className="pb-2" onClick={isGhost ? handleRealDelete : openDeleteModal}>
          <FaTrash className={`text-2xl ${isGhost ? 'text-red-500 animate-pulse' : ''} hover:text-[#a0ff1f]`} />
        </button>
        {deleteContent && (
          <dialog open className="modal">
            <div className="modal-box w-96 flex flex-col justify-center items-center">
              <h3 className="font-bold text-lg mb-4 text-[#a0ff1f] ">
                無法刪除不存在的行程 :P
              </h3>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn text-white bg-black px-8 py-1 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                  onClick={closeDeleteModal}
                >
                  關閉
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </>
  );
}
