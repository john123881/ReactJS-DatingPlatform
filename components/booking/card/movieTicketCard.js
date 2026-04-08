import { useState } from 'react';
import { BookingService } from '@/services/booking-service';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { toast } from '@/lib/toast';
import { getImageUrl, handleImageError } from '@/services/image-utils';

dayjs.extend(customParseFormat);

export default function MovieCard({ movie, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 轉換電影日期為 YYYY-MM-DD 格式
  const formattedMovieDate = dayjs(movie.movie_date).format('YYYY-MM-DD');

  // 轉換電影時間為 hh:mm 格式
  const formattedMovieTime = dayjs(movie.movie_time, 'HH:mm:ss').format(
    'HH:mm',
  );

  // 轉換訂票時間為 YYYY-MM-DD 格式
  const formattedBookingTime = dayjs(movie.created_at).format('YYYY-MM-DD');

  const handleBookingDelete = async (bookingId) => {
    try {
      const result = await BookingService.deleteMovieBooking(bookingId);
      toast.success('刪除成功!', '您的訂位已移除');
    } catch (error) {
      console.error('delete failed:', error);
      toast.error('刪除失敗!', '請稍後再試或聯繫客服');
    }
  };

  const handleHeartClick = () => {
    setIsClicked(!isClicked);
  };
  return (
    <>
      <div className="w-full max-w-5xl mx-auto mb-10 group">
        <figure>
          <div className="card lg:card-side bg-base-300 shadow-2xl overflow-hidden rounded-3xl border border-slate-700 group-hover:border-neongreen transition-all duration-300">
            <figure className="relative min-w-[250px] overflow-hidden">
              <img
                src={movie.movie_img || getImageUrl(movie.poster_img, 'movie')}
                alt={movie.title || '電影票'}
                onError={(e) => handleImageError(e, 'movie')}
                className="w-[280px] h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </figure>
            <div className="card-body p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="card-title text-light font-bold h-auto"
                    style={{ fontSize: '1.8rem' }}
                  >
                    {movie.title || '電影資料 (已從系統移除)'}
                  </h2>
                  <div className="badge badge-secondary py-4 px-6 bg-slate-700 border-none text-white font-medium ml-4">
                    數位
                  </div>
                </div>

                <div className="space-y-4 text-slate-400 text-lg">
                  <div className="flex items-center">
                    <span className="w-24 font-medium">電影日期：</span>
                    <span className="text-neongreen">{formattedMovieDate}</span>
                  </div>
                  <hr className="border-slate-800" />
                  <div className="flex items-center">
                    <span className="w-24 font-medium">電影時間：</span>
                    <span className="text-neongreen">{formattedMovieTime}</span>
                  </div>
                  <hr className="border-slate-800" />
                  <div className="flex items-center">
                    <span className="w-24 font-medium">訂票時間：</span>
                    <span className="text-slate-500">
                      {formattedBookingTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  type="button"
                  className="btn btn-outline border-2 border-slate-600 text-slate-400 rounded-full px-8 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-300"
                  onClick={() => {
                    toast.fire({
                      title: '確定要刪除此訂位嗎?',
                      text: '刪除後將無法還原！',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: '確定刪除',
                      cancelButtonText: '取消',
                      confirmButtonColor: '#A0FF1F',
                      cancelButtonColor: '#475569',
                      customClass: {
                        confirmButton: 'text-black font-bold px-6 py-2 rounded-full',
                        cancelButton: 'text-white font-bold px-6 py-2 rounded-full'
                      }
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleBookingDelete(movie.booking_id);
                      }
                    });
                  }}
                >
                  刪除訂位
                </button>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </>
  );
}
