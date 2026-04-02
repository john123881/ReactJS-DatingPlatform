import { useRef } from 'react';
import { toast as customToast } from '@/lib/toast';

export default function ShareEventModal({ event, eventId, modalId }) {
  const shareEventModalRef = useRef(null);

  const shareUrl =
    typeof window !== 'undefined' && event
      ? `${window.location.origin}/community/event/${eventId}`
      : '';

  // React 複製連結到剪貼板的函數
  const copyToClipboard = () => {
    if (!shareUrl) return;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        if (shareEventModalRef.current) {
          shareEventModalRef.current.close();
        }
        customToast.success('複製連結成功!');
      })
      .catch((err) => {
        if (shareEventModalRef.current) {
          shareEventModalRef.current.close();
        }
        console.error('無法複製連結: ', err);
        customToast.error('複製連結失敗!');
      });
  };

  return (
    <>
      <dialog
        id={modalId}
        ref={shareEventModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div
          className="modal-box sm:w-auto md:w-[500px] h-[300px] "
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <p className="font-bold text-lg mb-5 text-h5 flex justify-center">
            分享
          </p>

          <div className="mb-4">
            <input
              type="text"
              className="input input-bordered w-full my-5"
              readOnly
              value={shareUrl}
              onClick={copyToClipboard}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="btn bg-neongreen hover:bg-neongreen/80 text-black border-none rounded-full shadow-neon font-bold"
              onClick={copyToClipboard} // 點擊按鈕以複製連結
            >
              複製連結
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
