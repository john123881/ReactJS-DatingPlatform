import { useState } from 'react';

export default function TripNoteModal({ isOpen, onClose, tripName }) {
  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box w-96">
        <h3 className="mb-4 text-lg font-bold text-white">行程筆記</h3>
        
        <p className="text-white">行程描述</p>
        <div className="w-full px-2 py-2 mt-2 mb-4 bg-gray-800 rounded text-sm text-gray-300 min-h-[40px]">
          {tripName.trip_description || '此行程並沒有添加描述'}
        </div>

        <p className="text-white">行程筆記</p>
        <div className="w-full h-32 px-2 py-2 mt-2 mb-4 bg-gray-800 rounded text-sm text-gray-300 overflow-y-auto">
          {tripName.trip_notes || '此行程並沒有任何行程筆記'}
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
            onClick={onClose}
          >
            關閉
          </button>
        </div>
      </div>
    </dialog>
  );
}
