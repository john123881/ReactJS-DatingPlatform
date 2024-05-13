import Link from 'next/link';
import { useRef } from 'react';
import Swal from 'sweetalert2';

export default function BookingCancelModal({ booking, modalId, setBookings }) {
  const bookingCancelModalRef = useRef(null);

  console.log('modal booking data:', booking);

  // booking時間格式設定
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleBookingDelete = async (barBookingId) => {
    try {
      const url = `http://localhost:3001/bar/delete-bar`;
      const r = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({ barBookingId }),
        headers: { 'Content-type': 'application/json' },
      });

      const result = await r.json();

      if (r.ok) {
        // 檢查是否成功刪除
        setBookings((prevBookings) =>
          prevBookings.filter(
            (booking) => booking.bar_booking_id !== barBookingId
          )
        );
        console.log(result);

        Swal.fire({
          title: '刪除成功!',
          icon: 'success',
          confirmButtonText: '關閉',
          confirmButtonColor: '#A0FF1F',
          background: 'rgba(0, 0, 0, 0.85)',
        });
      }

      bookingCancelModalRef.current?.close();

      console.log('delete response:', result);
    } catch (error) {
      console.error('delete failed:', error);

      bookingCancelModalRef.current?.close();
      Swal.fire({
        title: '刪除失敗!',
        icon: 'error',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      });
    }
  };

  return (
    <>
      <dialog
        ref={bookingCancelModalRef}
        id={modalId}
        className="modal modal-bottom sm:modal-middle text-white"
      >
        <div
          className="modal-box h-[500px] border border-white grid grid-cols-2"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div className="col-span-1"></div>
          <div className="col-span-10 space-y-4 text-center">
            <div className="font-bold text-h5">確定要刪除訂位?</div>
            <div className="font-bold text-h6">以下是您的訂位資訊：</div>
            <div className="text-h6 space-y-4 h-[258px]  border border-white rounded-lg p-6">
              <div className="">
                {/* Fake Sober Taipei */}
                {booking.bar_name}
              </div>
              <div className="telephone">
                {/* 0227220723 */}
                {booking.bar_contact}
              </div>
              <div className="address">
                {/* 台北市信義區松壽路20號 */}
                {booking.bar_addr}
              </div>
              <hr />
              <div className="text-h6 items-center space-y-4">
                <div className="grid grid-cols-2">
                  <div className="col-span-1">預約人數</div>
                  <div className="col-span-1">
                    {/* 2人 */}
                    {booking.bar_booking_people_num}人
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="col-span-1">預約日期</div>
                  <div className="col-span-1">
                    {/* 2024/05/10 (五) */}
                    {formatDate(booking.bar_booking_time)}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="col-span-1">預約時段</div>
                  <div className="col-span-1">
                    {/* 20:00 */}
                    {booking.bar_start_time}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center col-span-1 space-y-4">
              <button
                className="btn w-[320px] text-[15px] border-[#FF03FF] rounded-[20px] text-white my-5"
                onClick={() => {
                  handleBookingDelete(booking.bar_booking_id);
                  // console.log(booking.bar_booking_id);
                }}
              >
                刪除訂位
              </button>
              {/* <form
                method="dialog"
                className="flex modal-backdrop cursor-pointer justify-center items-center"
              >
                <button className="flex btn w-[320px] text-[15px] border-[#A0FF1F] rounded-[20px] text-white cursor-pointer">
                  返回訂位紀錄
                </button>
              </form> */}
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
