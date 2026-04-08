import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import { FaTrash } from 'react-icons/fa';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';
import { toast } from '@/lib/toast';

export default function WithContent({
  imageSrc,
  altText,
  onClick,
  tripDetails,
  refreshTripDetails,
  refreshAllDetails,
  setNewDetail,
  isOther = false,
}) {
  const [imgLoading, setImgLoading] = useState(true);

  // 當圖片位址變更時，重新設定載入狀態，並檢查是否已從快取載入完成
  useEffect(() => {
    if (imageSrc) {
      setImgLoading(true);
      
      // 快速檢查：如果圖片已在快取中，Browser 可能不會觸發 onLoad
      const img = new Image();
      img.src = imageSrc;
      if (img.complete) {
        setImgLoading(false);
      }
    } else {
      setImgLoading(false); // 無圖片時不顯示載入圈圈
    }
  }, [imageSrc]);
  const openDeleteModal = () => {
    // 調用 showModal 方法以開啟對話框
    const dialog = document.getElementById(
      `delete-dialog-${tripDetails.trip_detail_id}`,
    );
    if (dialog) {
      dialog.showModal();
    }
  };

  const closeDeleteModal = () => {
    const dialog = document.getElementById(
      `delete-dialog-${tripDetails.trip_detail_id}`,
    );
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  };

  const handleShowDetails = () => {
    onClick && onClick();
  };

  const onConfirmDelete = async () => {
    const detailId = tripDetails.trip_detail_id;
    // 樂觀更新：立即從父組件狀態中移除
    if (setNewDetail) {
      setNewDetail((prev) => {
        if (Array.isArray(prev)) {
          return prev.filter((item) => item.trip_detail_id !== detailId);
        }
        return prev;
      });
    }

    try {
      const result = await TripService.deleteTripDetail(detailId);
      if (result.success) {
        toast.success(`成功移除: ${altText}`);
        closeDeleteModal();
        refreshTripDetails();
        if (refreshAllDetails) refreshAllDetails();
      } else {
        toast.error('刪除失敗', result.message);
        // 失敗時重新整理回原狀
        if (refreshAllDetails) refreshAllDetails();
      }
    } catch (error) {
      toast.error('發生錯誤', error.message);
      if (refreshAllDetails) refreshAllDetails();
    }
  };

  // 確認 tripDetails 是否存在，如果不存在，顯示加載中訊息
  if (!tripDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative group/item flex items-center gap-4">
      <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 border border-white/20 rounded-2xl overflow-hidden relative shadow-inner shadow-black/50 bg-black/20">
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-neongreen/30 border-t-neongreen rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={imageSrc || '/unavailable-image.jpg'}
          alt={altText}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
          className={`object-cover w-full h-full transition-all duration-700 ease-in-out group-hover/item:scale-110 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>

      {/* Delete Trigger - Absolute in Card (provided by parent class 'relative') */}
      {!isOther && (
        <>
          <button 
            onClick={openDeleteModal} 
            className="absolute -top-2 -right-2 w-10 h-10 bg-black/60 backdrop-blur-md text-white/50 hover:text-neongreen hover:bg-black rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl z-20"
          >
            <FaTrash className="text-base" />
          </button>

          <dialog
            id={`delete-dialog-${tripDetails.trip_detail_id}`}
            className="modal"
          >
            <div className="modal-box bg-neutral-900 border border-white/10 rounded-[32px] shadow-2xl backdrop-blur-2xl">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                  <FaTrash className="text-2xl text-red-500" />
                </div>
                <h3 className="font-black text-2xl text-white italic uppercase tracking-tighter mb-2">
                  移除此行程？
                </h3>
                <p className="text-white/40 text-sm mb-8">
                  確定要將 <span className="text-neongreen">{altText || '此項目'}</span> 從「{tripDetails.block === 1 ? '早上' : tripDetails.block === 2 ? '下午' : '晚上'}」中移除嗎？
                </p>
                
                <div className="flex gap-4 w-full">
                  <button
                    type="button"
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
                    onClick={closeDeleteModal}
                  >
                    返回
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-2xl transition-all shadow-[0_5px_15px_rgba(239,68,68,0.3)]"
                    onClick={onConfirmDelete}
                  >
                    確定刪除
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}
