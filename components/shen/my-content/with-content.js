import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';

export default function WithContent({
  imageSrc,
  altText,
  onClick,
  tripDetails,
  refreshTripDetails,
}) {
  const [deleteContent, setDeleteContent] = useState(false);
  const [barName, setBarName] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const { open, close, isLoading } = useLoader();

  useEffect(() => {
    console.log('Received imageSrc in WithContent:', imageSrc);
  }, [imageSrc]);

  useEffect(() => {
    console.log(tripDetails);
  }, [tripDetails]);

  const openDeleteModal = () => {
    setDeleteContent(true);
    // 調用 showModal 方法以開啟對話框
    const dialog = document.getElementById(
      `delete-dialog-${tripDetails.trip_detail_id}`
    );
    if (dialog) {
      dialog.showModal();
    }
  };

  const closeDeleteModal = () => {
    setDeleteContent(false);
    const dialog = document.getElementById(
      `delete-dialog-${tripDetails.trip_detail_id}`
    );
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  };

  const handleShowDetails = () => {
    onClick && onClick();
  };

  const onConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/trip/my-details/delete/${tripDetails.trip_detail_id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      if (data.success) {
        closeDeleteModal();
        refreshTripDetails();
      } else {
        alert('刪除失敗: ' + data.message);
      }
    } catch (error) {
      alert('發生錯誤: ' + error.message);
    }
  };

  // 確認 tripDetails 是否存在，如果不存在，顯示加載中訊息
  if (!tripDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-center items-end gap-9">
        <div className="flex flex-col justify-center items-center w-32 h-32 sm:w-48 sm:h-48 border border-white rounded-2xl overflow-hidden relative group">
          {isLoading ? (
            <Loader />
          ) : (
            <img
              src={imageSrc}
              alt={altText}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300 ease-in-out border border-white rounded-lg cursor-pointer"
            />
          )}

          <div
            className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
            onClick={handleShowDetails}
          >
            <p className="text-white text-xl text-center">{altText}</p>
          </div>
        </div>
        <button onClick={openDeleteModal} className="pb-2">
          <FaTrash className="text-2xl hover:text-[#a0ff1f]" />
        </button>
        {deleteContent && (
          <dialog
            id={`delete-dialog-${tripDetails.trip_detail_id}`}
            className="modal"
          >
            <div className="modal-box w-96 flex flex-col justify-center items-center">
              <h3 className="font-bold text-lg mb-4 text-white text-center">
                確定要刪除 <span className="text-[#a0ff1f]">{altText} </span>
                嗎？
              </h3>
              <h3 className="font-bold text-base mb-4 text-white">
                行程時段：
                {tripDetails.block === 1
                  ? '早上'
                  : tripDetails.block === 2
                  ? '下午'
                  : tripDetails.block === 3
                  ? '晚上'
                  : ''}
              </h3>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                  onClick={closeDeleteModal}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                  onClick={onConfirmDelete}
                >
                  確定
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </>
  );
}
