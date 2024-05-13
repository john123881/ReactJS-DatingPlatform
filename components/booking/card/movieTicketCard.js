import React, { useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Swal from 'sweetalert2';

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
    'HH:mm'
  );

  // 轉換訂票時間為 YYYY-MM-DD 格式
  const formattedBookingTime = dayjs(movie.created_at).format('YYYY-MM-DD');

  const handleBookingDelete = async (bookingId) => {
    try {
      const url = `http://localhost:3001/booking/delete-movie-booking`;
      const r = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({ bookingId }),
        headers: { 'Content-type': 'application/json' },
      });
      const result = await r.json();

      Swal.fire({
        title: '刪除成功!',
        icon: 'success',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      });

      // bookingCancelModalRef.current?.close();

      console.log('delete response:', result);
    } catch (error) {
      console.error('delete failed:', error);

      // bookingCancelModalRef.current?.close();
      Swal.fire({
        title: '刪除失敗!',
        icon: 'error',
        confirmButtonText: '關閉',
        confirmButtonColor: '#A0FF1F',
        background: 'rgba(0, 0, 0, 0.85)',
      });
    }
  };

  const handleHeartClick = () => {
    setIsClicked(!isClicked);
  };
  return (
    <>
      <div style={{ width: '1440px' }}>
        <figure>
          <div className="card lg:card-side bg-transparent shadow-xl">
            <figure>
              <img
                // src={movie.movie_img}
                src={`/movie_img/${movie.poster_img}`}
                alt={movie.title} // 使用動態的 movieName
                className="w-[250px] h-[400px]"
              />

              <div></div>
            </figure>
            <div className="card-body">
              <h2
                className="card-title flex justify-start h-5 pt-10 pb-4"
                style={{ fontSize: '1.5rem' }}
              >
                {movie.title} {/* 使用動態的 movieName */}
                <div
                  className="badge badge-secondary w-20"
                  style={{
                    backgroundColor: 'grey',
                    // border: '1px solid #A0FF1F',
                    color: 'white',
                  }}
                >
                  數位
                </div>
              </h2>
              <p>電影日期： {formattedMovieDate}</p>

              <hr></hr>

              <p>電影時間： {formattedMovieTime}</p>
              <hr></hr>
              <p>訂票時間： {formattedBookingTime}</p>

              {/* <div
                type="submit"
                className="badge badge-outline border-white text-[12px] text-white h-[24px] w-[76px] hover:bg-[#FF03FF] hover:text-black"
                // onClick={() =>
                //   document.getElementById('booking-cancel-modal').showModal()
                // }
                onClick={() => {
                  handleBookingDelete(movie.movie_id);
                }}
              >
                <span>刪除訂位</span>
              </div> */}
            </div>
          </div>
        </figure>
      </div>
    </>
  );
}
