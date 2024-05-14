import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

function truncateChinese(title, maxChineseChars = 7) {
  if (typeof title !== 'string') {
    return '';
  }

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

export default function TripSidebar3({ tripName }) {
  const router = useRouter();
  // console.log(tripName);

  // const handleBackClick = () => {
  //   router.back();
  // };

  // 為閱讀行程筆記的彈跳視窗設定 state
  const [isReadNoteModalOpen, setIsReadNoteModalOpen] = useState(false);
  // 為彈跳視窗設定開啟和關閉函數（閱讀筆記）
  const openReadNoteModal = () => setIsReadNoteModalOpen(true);
  const closeReadNoteModal = () => setIsReadNoteModalOpen(false);

  return (
    <div className="pt-16 pb-3 border-b-2 border-white sm:ml-20 sm:mr-20">
      <div className="hidden trip-sidebar2 sm:block">
        <p className="mb-2 text-5xl">行程規劃</p>
        <div className="flex justify-between items-center pr-2.5">
          <div className="flex items-center justify-between">
            <h3
              className="mr-8 sm:text-2xl tooltip"
              data-tip={tripName.trip_title}
            >
              {truncateChinese(tripName.trip_title)}
            </h3>
            <h3 className="mr-8 sm:text-2xl">
              {tripName && tripName.trip_date
                ? new Date(tripName.trip_date).toLocaleDateString('en-CA') // 格式化日期為 YYYY-MM-DD
                : 'Loading...'}
            </h3>
            <h3 className="mr-8 sm:text-2xl">分享者：{tripName.username}</h3>
            {/* <button
              className="bg-black px-2 py-1 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
              onClick={openReadNoteModal}
            >
              閱讀行程筆記
            </button> */}
            {/* 以 useState 來控制<dialog> */}
            {isReadNoteModalOpen && (
              <dialog open className="modal">
                <form action="#" method="post">
                  {/* 之後要跟後端路由連結 */}
                  <div className="modal-box w-96 ">
                    <h3 className="mb-4 text-lg font-bold text-white ">
                      行程筆記
                    </h3>
                    <p className="text-white">行程描述</p>
                    {tripName.trip_description ? (
                      <input
                        type="text"
                        className="w-full px-2 py-1 mt-4 mb-4"
                        placeholder={tripName.trip_description}
                        readOnly
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full px-2 py-1 mt-4 mb-4"
                        placeholder="此行程並沒有添加描述"
                        readOnly
                      />
                    )}
                    <p className="text-white">行程筆記</p>
                    {tripName.trip_notes ? (
                      <textarea
                        className="w-full h-32 px-2 py-1 mt-4 mb-4"
                        value={tripName.trip_notes}
                        readOnly
                      />
                    ) : (
                      <textarea
                        className="w-full h-32 px-2 py-1 mt-4 mb-4"
                        value="此行程並沒有任何行程筆記"
                        readOnly
                      />
                    )}
                    <div className="modal-action">
                      {/* 更新按鈕的onClick處理函式，以關閉彈出視窗 */}
                      <button
                        type="button"
                        className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                        onClick={closeReadNoteModal}
                      >
                        關閉
                      </button>
                    </div>
                  </div>
                </form>
              </dialog>
            )}
          </div>
          <div>
            <Link
              className="hover:text-[#a0ff1f] sm:text-2xl"
              href="../../other-trip"
            >
              回到其他人的分享
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start gap-2.5 mx-5 sm:hidden">
        <div className="flex flex-col justify-start items-start gap-2.5">
          <div className="text-base font-normal text-white">
            {tripName.trip_title}
          </div>
          <div className="text-base font-normal text-white">
            {tripName && tripName.trip_date
              ? new Date(tripName.trip_date).toLocaleDateString('en-CA') // 格式化日期為 YYYY-MM-DD
              : 'Loading...'}
          </div>
        </div>
        <div className="text-base font-normal text-white">
          分享者：{tripName.username}
        </div>
        <div className="flex items-start justify-start gap-5">
          <button
            onClick={openReadNoteModal}
            className=" text-xs sm:text-base bg-black px-2 py-1 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
          >
            閱讀行程筆記
          </button>

          {/* 以 useState 來控制<dialog> */}
          {isReadNoteModalOpen && (
            <dialog open className="modal">
              <form action="#" method="post">
                {/* 之後要跟後端路由連結 */}
                <div className="modal-box w-96 ">
                  <h3 className="mb-4 text-lg font-bold text-white ">
                    行程筆記
                  </h3>
                  <p className="text-white">行程描述</p>
                  {tripName.trip_description ? (
                    <input
                      type="text"
                      className="w-full px-2 py-1 mt-4 mb-4"
                      placeholder={tripName.trip_description}
                      readOnly
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full px-2 py-1 mt-4 mb-4"
                      placeholder="此行程並沒有添加描述"
                      readOnly
                    />
                  )}
                  <p className="text-white">行程筆記</p>
                  {tripName.trip_notes ? (
                    <textarea
                      className="w-full h-32 px-2 py-1 mt-4 mb-4"
                      value={tripName.trip_notes}
                      readOnly
                    />
                  ) : (
                    <textarea
                      className="w-full h-32 px-2 py-1 mt-4 mb-4"
                      value="此行程並沒有任何行程筆記"
                      readOnly
                    />
                  )}
                  <div className="modal-action">
                    {/* 更新按鈕的onClick處理函式，以關閉彈出視窗 */}
                    <button
                      type="button"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                      onClick={closeReadNoteModal}
                    >
                      關閉
                    </button>
                  </div>
                </div>
              </form>
            </dialog>
          )}
        </div>
        <div className="flex items-center self-stretch justify-end">
          <Link className="hover:text-[#a0ff1f]" href="../../other-trip">
            回到其他人的分享
          </Link>
        </div>
      </div>
    </div>
  );
}
