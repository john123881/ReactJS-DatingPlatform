import React from 'react';
import { useEffect, useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import Link from 'next/link';

function truncateChinese(title, maxChineseChars = 7) {
  let chineseCharCount = 0;
  let truncated = '';

  for (const char of title) {
    if (char.match(/[\u4e00-\u9fff]/)) {
      chineseCharCount += 1;
      if (chineseCharCount > maxChineseChars) {
        return truncated + '...';
      }
    }
    truncated += char;
  }

  return truncated;
}

export default function TripCard({ otherTrip }) {
  console.log(otherTrip);
  // 使用動態生成路徑
  const detailPagePath = `/trip/other-trip/detail/${otherTrip.trip_plan_id}`;

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (otherTrip.trip_pic) {
      const modifiedImageUrl = `${otherTrip.trip_pic}`;
      setImageUrl(modifiedImageUrl);
      console.log('Modified Image URL:', modifiedImageUrl);
    }
  }, [otherTrip]); // 依賴 otherTrip 更新來觸發 useEffect

  return (
    <>
      <div className="relative bg-white border-2 border-white rounded-lg pb-2 flex flex-col items-center justify-center w-40 h-60 sm:w-64 sm:h-96">
        {/* <button
          onClick={() => document.getElementById('my_modal_4').showModal()}
        >
          <FaCircleInfo className="absolute right-[-1.35rem] top-[-1.7rem] text-4xl text-gray hover:shadow-xl3 hover:animate-pulse hover:text-neongreen rounded-3xl" />
        </button> */}
        <dialog id="my_modal_4" className="modal">
          <div className="modal-box w-11/12 max-w-5xl ">
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
            </div>
          </div>
        </dialog>

        {imageUrl ? (
          <img
            className="w-full h-full object-cover rounded-lg mb-2"
            src={imageUrl}
            alt="Trip Image"
          />
        ) : (
          <img
            className="w-full h-full object-cover rounded-lg mb-2"
            src="/TD.svg"
            alt="Trip Image"
          />
        )}
        <div className="flex flex-col items-center justify-center">
          <p
            className="text-black text-lg sm:text-2xl mb-2 tooltip"
            data-tip={otherTrip.trip_title}
          >
            {truncateChinese(otherTrip.trip_title)}
          </p>
          <Link
            href={detailPagePath}
            className=" border-black border bg-black text-white  sm:text-2xl font-medium py-1 px-2 sm:py-2 sm:px-3 rounded-full text-sm hover:bg-[#a0ff1f] hover:border-black hover:border hover:text-black"
          >
            檢視行程
          </Link>
        </div>
      </div>
    </>
  );
}
