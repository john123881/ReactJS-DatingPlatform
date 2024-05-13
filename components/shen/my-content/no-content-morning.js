import { useState, useEffect } from 'react';
import { FaCirclePlus, FaTrash } from 'react-icons/fa6';
import TripRecomendModal from '@/components/shen/add-trip/trip-recomend-modal';
import { useRouter } from 'next/router';

export default function NoContentMorning({
  trip_plan_id,
  refreshTripDetails,
  tripDetails,
}) {
  const [deleteContent, setDeleteContent] = useState(false);
  const openDeleteModal = () => setDeleteContent(true);
  const closeDeleteModal = () => setDeleteContent(false);
  const [newTripDetailId, setNewTripDetailId] = useState(null); // 此狀態用於儲存 trip_detail_id
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    refreshTripDetails();
  };

  const handleAddMorningClick = async () => {
    const { trip_plan_id } = router.query; // 取得路徑中的 trip_plan_id
    console.log(trip_plan_id);

    try {
      const response = await fetch(
        `http://localhost:3001/trip/my-details/add-morning/${trip_plan_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log('Set block = 1 成功');
        setNewTripDetailId(data.trip_detail_id); // 更新 trip_detail_id
        console.log(newTripDetailId);
      } else {
        throw new Error('Set block = 1 失敗');
      }
    } catch (error) {
      console.error('錯誤:', error);
    }
  };
  useEffect(() => {
    if (newTripDetailId) {
      console.log('New Trip Detail ID:', newTripDetailId);
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
            onClick={() => {
              handleAddMorningClick();
              setIsAddModalOpen(true);
            }}
            className="text-2xl mb-1.5 hover:text-[#a0ff1f]"
          >
            <FaCirclePlus />
          </button>
          <h3>早上</h3>
        </div>
        {isAddModalOpen && (
          <dialog id="my_modal_add" open className="modal">
            <div className="modal-box w-11/12 max-w-5xl ">
              <div className="modal-action">
                <form method="dialog" onSubmit={(e) => e.preventDefault()}>
                  {/* <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setIsAddModalOpen(false)} // 使用狀態來關閉彈跳視窗
                  >
                    ✕
                  </button> */}
                </form>
              </div>
              <TripRecomendModal
                trip_detail_id={newTripDetailId}
                refreshTripDetails={refreshTripDetails}
                onClose={handleCloseModal} // 傳遞可以關閉彈跳視窗的函數
              />
            </div>
          </dialog>
        )}
        <button className="pb-2" onClick={openDeleteModal}>
          <FaTrash className="text-2xl hover:text-[#a0ff1f]" />
        </button>
        {deleteContent && (
          <dialog open className="modal">
            <form action="#" method="post">
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
            </form>
          </dialog>
        )}
      </div>
    </>
  );
}
