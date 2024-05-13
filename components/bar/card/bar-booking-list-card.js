import { HiOutlineLocationMarker } from 'react-icons/hi';
import BookingCancelModal from '../modal/booking-cancel-modal';
import Link from 'next/link';

export default function BarBookingListCard({
  booking,
  bookingId,
  onDelete,
  setBookings,
}) {
  console.log(booking);

  const cancelModalId = `cancel_modal_${booking.bar_booking_id}`;
  return (
    <>
      <div className="flex gap-4">
        <div className="bar-booking-card-image">
          <Link href={`/bar/bar-detail/${booking.bar_id}`}>
            <img
              className="h-[100px] w-[100px] lg:h-[120px] lg:w-[120px] object-cover rounded-xl"
              // src="https://damei17.com/wp-content/uploads/2022/08/Fake-Sober-24.jpg"
              src={`/barPic/${booking.bar_pic_name}`}
              // src={booking.bar_id}
              alt={`Image of ${booking.bar_name}`}
            />
          </Link>
        </div>
        <div className="bar-booking-card-detail w-[328px] md:w-[600px] lg:w-[900px]">
          <div className="flex justify-between w-100">
            <div className="text-[15px] lg:text-[16px] text-white">
              {/* Fake Sober Taipei */}
              {booking.bar_name}
            </div>
            <div>
              <div
                type="submit"
                className="badge badge-outline cursor-pointer border-white text-[12px] text-white h-[24px] w-[76px] hover:bg-[#FF03FF] hover:text-black"
                onClick={() =>
                  document.getElementById(cancelModalId).showModal()
                }
              >
                <span>刪除訂位</span>
                <BookingCancelModal
                  booking={booking}
                  modalId={cancelModalId}
                  setBookings={setBookings}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 booking-list-location">
            <HiOutlineLocationMarker />
            <div className="text-[11px] lg:text-[15px] text-white">
              {/* 台北市信義區松壽路20號 */}
              {booking.bar_addr}
            </div>
          </div>
          <div className="flex gap-4 bar-booking-detail">
            <div className="booking-list-title text-[12px] lg:text-[15px] text-white">
              <div className="mb-1 ">預約人數</div>
              <div className="mb-1 ">預約日期</div>
              <div className="mb-1 ">預約時段</div>
            </div>
            <div className="booking-list-value text-[12px] lg:text-[15px] text-white">
              <div className="mb-1 ">
                {/* 2人 */}
                {booking.bar_booking_people_num}
              </div>
              <div className="mb-1 ">
                {/* 2024-03-21 */}
                {/* {booking.bar_booking_time} */}
                {`${new Date(booking.bar_booking_time).getFullYear()}/${(
                  new Date(booking.bar_booking_time).getMonth() + 1
                )
                  .toString()
                  .padStart(2, '0')}/${new Date(booking.bar_booking_time)
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`}
              </div>
              <div className="mb-1 ">
                {/* 20:00 */}
                {booking.bar_start_time}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="w-100" />
    </>
  );
}
