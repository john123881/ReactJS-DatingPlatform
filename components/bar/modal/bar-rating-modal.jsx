import Link from 'next/link';
import { useState } from 'react';

export default function BarRatingModal(bar) {
  const [rating, setRating] = useState(0); // 初始化評分值為0

  const handleRatingChange = (event) => {
    const newRating = parseInt(event.target.value); // 將選擇的評分值轉換為整數
    setRating(newRating); // 更新評分值
  };
  return (
    <>
      <dialog
        id="bar-rating-modal"
        className="modal modal-bottom sm:modal-middle text-white"
      >
        <div
          className="modal-box h-[365px] border border-white space-y-8 flex flex-col justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div className="flex items-center justify-center">
            <img
              className="w-[99px] h-[99px] object-cover rounded-full"
              src="https://damei17.com/wp-content/uploads/2022/08/Fake-Sober-24.jpg"
              alt="bar pic"
            ></img>
          </div>
          <div className="col-span-10 flex justify-center items-center">
            <div>
              留下您對{' '}
              <span>
                Fake Sober Taipei
                {/* {bar.bar_name} */}
              </span>{' '}
              的整體滿意度
            </div>
          </div>
          <div className="bar-detail-stars flex justify-center items-center gap-3 rating rating-md">
            {/* <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-[#A0FF1F]"
            />
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-[#A0FF1F]"
            />
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-[#A0FF1F]"
            />
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-[#A0FF1F]"
            />
            <input
              type="radio"
              name="rating-6"
              className="mask mask-star-2 bg-[#A0FF1F]"
            /> */}
            {[...Array(5)].map((_, index) => (
              <input
                key={index}
                type="radio"
                name="rating"
                className="mask mask-star-2 bg-[#A0FF1F]"
                value={index + 1}
                checked={index + 1 === rating}
                onChange={handleRatingChange}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button className="btn w-[320px] text-black text-[15px] border-[#A0FF1F] rounded-[20px]">
              <Link href="/bar/bar-rating-list" className="text-white">
                送出評論
              </Link>
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
