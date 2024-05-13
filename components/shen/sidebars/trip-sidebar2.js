import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiFillPicture } from 'react-icons/ai';
import Swal from 'sweetalert2';

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

export default function TripSidebar2({ tripName, trip_plan_id }) {
  console.log('TripSidebar2 received tripName:', tripName);
  const [trip, setTrip] = useState({}); //用於儲存從trip_plans中獲取的值
  const router = useRouter();
  // const [tripDraft, setTripDraft] = useState(tripName.trip_draft);
  const [tripDescription, setTripDescription] = useState('');
  const [tripNote, setTripNote] = useState('');
  const [actionButton, setActionButton] = useState(null); // 新增 state 來儲存按鈕
  const [noteButton, setNoteButton] = useState(null); // 新增 state 來儲存按鈕

  // 分別為取消分享和閱讀行程筆記的彈跳視窗設定 state
  const [isCancelShareModalOpen, setIsCancelShareModalOpen] = useState(false);
  const [isReadNoteModalOpen, setIsReadNoteModalOpen] = useState(false);
  // 分別為分享行程和新增行程筆記的彈跳視窗設定 state
  const [isShareTripModalOpen, setIsShareTripModalOpen] = useState(false);
  const [isNewTripNoteModalOpen, setIsNewTripNoteModalOpen] = useState(false);

  //新增行程封面的彈跳視窗
  const [isNewTripCoverModalOpen, setIsNewTripCoverModalOpen] = useState(false);

  // 為彈跳視窗設定開啟和關閉函數（取消分享、閱讀筆記）
  const openCancelShareModal = () => {
    setIsCancelShareModalOpen(true);
  };
  const closeCancelShareModal = () => setIsCancelShareModalOpen(false);
  const openReadNoteModal = () => setIsReadNoteModalOpen(true);
  const closeReadNoteModal = () => setIsReadNoteModalOpen(false);
  // 為彈跳視窗設定開啟和關閉函數（分享、新增筆記）
  const openShareTripModal = () => {
    setIsShareTripModalOpen(true);
  };
  const closeShareTripModal = () => {
    setIsShareTripModalOpen(false);
  }; // 取消分享後的 draft 狀態為 0
  const openNewTripNoteModal = () => setIsNewTripNoteModalOpen(true);
  const closeNewTripNoteModal = () => setIsNewTripNoteModalOpen(false);

  //新增行程封面的彈跳視窗的開啟與關閉
  const openNewTripCoverModal = () => setIsNewTripCoverModalOpen(true);
  const closeNewTripCoverModal = () => setIsNewTripCoverModalOpen(false);

  //trip_plans資料
  useEffect(() => {
    if (trip_plan_id) {
      const fetchTrip = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/trip/my-details/trip-plan/${trip_plan_id}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Fetched Trip  Data:', data);
          if (data) {
            setTrip(data);
            console.log('Setting trip to:', data);
          }
        } catch (error) {
          console.error('Fetching trip  error:', error);
        }
      };
      fetchTrip();
    }
  }, [trip_plan_id]);

  const shareTrip = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/trip/my-details/share/${trip_plan_id}`,
        { method: 'POST' }
      );
      if (response.ok) {
        const newTrip = { ...trip, trip_draft: 1 };
        setTrip(newTrip);
      } else {
        throw new Error('Sharing failed');
      }
    } catch (error) {
      console.error('Error sharing the trip:', error);
    }
  };
  const UnShareTrip = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/trip/my-details/unshare/${trip_plan_id}`,
        { method: 'POST' }
      );
      if (response.ok) {
        const newTrip = { ...trip, trip_draft: 0 };
        setTrip(newTrip);
      } else {
        throw new Error('Sharing failed');
      }
    } catch (error) {
      console.error('Error sharing the trip:', error);
    }
  };
  //////上傳圖片測試////////////////
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadTripCover = async () => {
    if (!selectedFile) {
      alert('請選擇一個文件上傳。');
      return;
    }

    const formData = new FormData();
    formData.append('tripPic', selectedFile);
    console.log([...formData]);

    try {
      const response = await fetch(
        `http://localhost:3001/trip/my-details/photo/${trip_plan_id}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        closeNewTripCoverModal(); // 上傳成功後關閉模態框
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: '圖片已成功上傳!',
          confirmButtonColor: '#A0FF1F',
          background: 'rgba(0,0,0,0.85)',
        });
      } else {
        throw new Error(result.message || '網絡響應不正常');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('JSON 解析錯誤:', error);
        alert('服務器返回格式錯誤！');
      } else {
        console.error('上傳圖片出錯:', error);
        alert('上傳圖片失敗！');
      }
    }
  };

  ////////////////////////////////

  ///////編輯行程描述和行程筆記////////////
  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = `http://localhost:3001/trip/my-details/DnN/${trip_plan_id}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_description: tripDescription,
          trip_notes: tripNote,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip details.');
      }
      const result = await response.json();
      console.log('Trip details updated successfully:', result);
      closeNewTripNoteModal();
    } catch (error) {
      console.error('Error updating trip details:', error);
    }
  };
  ////////////////////////////////////

  // 更新 actionButton 按鈕的 useEffect (for sharing)
  useEffect(() => {
    console.log('Trip draft changed:', trip.trip_draft);
    setActionButton(
      trip.trip_draft === 1 ? (
        <button
          onClick={openCancelShareModal}
          className="text-xs sm:text-base bg-[#ff03ff] px-2 sm:py-1 py-1 text-white border border-white rounded-full sm:mr-8 mr-2 hover:bg-[#ff03ff] hover:text-black cursor-pointer"
        >
          取消分享
        </button>
      ) : (
        <button
          onClick={openShareTripModal}
          className="text-xs sm:text-base bg-black px-2 sm:py-1 py-1 border border-white rounded-full sm:mr-8 mr-2 hover:bg-[#a0ff1f] hover:text-black hover:border-white cursor-pointer"
        >
          分享行程
        </button>
      )
    );
  }, [trip]);
  // 更新 noteButton 按鈕的 useEffect (for note)
  useEffect(() => {
    console.log(
      'Checking trip details:',
      trip.trip_description,
      trip.trip_notes
    );
    setNoteButton(
      trip.trip_description || trip.trip_notes ? (
        <button
          className=" text-xs sm:text-base text-black bg-[#a0ff1f] px-2 py-1 sm:mr-8 border border-white rounded-full hover:shadow-xl3 hover:animate-pulse   cursor-pointer"
          onClick={openNewTripNoteModal}
        >
          編輯行程筆記
        </button>
      ) : (
        <button
          className=" text-xs sm:text-base bg-black px-2 py-1 sm:mr-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-white cursor-pointer"
          onClick={openNewTripNoteModal}
        >
          新增行程筆記
        </button>
      )
    );
  }, [trip]);

  return (
    <div className=" sm:ml-20 sm:mr-20 pt-16 border-b-2 border-white pb-3 ">
      <div className="trip-sidebar2 hidden sm:block">
        <p className="text-5xl mb-2 ">行程規劃</p>
        <div className=" justify-between items-center pr-2.5 flex">
          <div className="grid grid-cols-2 sm:block ml-5 sm:ml-0 gap-2">
            <span
              className="text-xs sm:text-2xl mr-8 tooltip"
              data-tip={tripName.trip_title}
            >
              {tripName && tripName.trip_title
                ? truncateChinese(tripName.trip_title)
                : 'Loading...'}
            </span>

            <span className="text-xs sm:text-2xl mr-8 ">
              {tripName && tripName.trip_date
                ? new Date(tripName.trip_date).toLocaleDateString('en-CA') // 格式化日期為 YYYY-MM-DD
                : 'Loading...'}
            </span>

            {actionButton}

            {/* 以 useState 來控制<dialog> */}
            {isShareTripModalOpen && (
              <dialog open className="modal">
                <form>
                  <div className="modal-box w-96 flex flex-col justify-center items-center">
                    <h3 className="font-bold text-lg mb-4 text-white text-center">
                      確定要分享{' '}
                      <span className="text-[#a0ff1f]">
                        {tripName.trip_title}
                      </span>{' '}
                      給其他使用者嗎？
                    </h3>
                    <div className="modal-action">
                      {/* 更新按鈕的onClick，以關閉彈出視窗 */}
                      <button
                        type="button"
                        className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                        onClick={closeShareTripModal}
                      >
                        取消
                      </button>
                      <button
                        className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                        onClick={(e) => {
                          e.preventDefault();
                          shareTrip();
                          closeShareTripModal(); // 關閉彈跳視窗
                        }}
                      >
                        確定
                      </button>
                    </div>
                  </div>
                </form>
              </dialog>
            )}
            {/* 以 useState 來控制<dialog> */}
            {isCancelShareModalOpen && (
              <dialog open className="modal">
                <form>
                  {/* 之後要跟後端路由連結 */}
                  <div className="modal-box w-96 flex flex-col justify-center items-center">
                    <h3 className="font-bold text-lg mb-4 text-[#a0ff1f] text-center">
                      確定要取消分享 {tripName.trip_title} 嗎？
                    </h3>
                    <div className="modal-action">
                      {/* 更新按鈕的onClick，以關閉彈出視窗 */}
                      <button
                        type="button"
                        className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                        onClick={closeCancelShareModal}
                      >
                        取消
                      </button>
                      <button
                        className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                        onClick={(e) => {
                          e.preventDefault();
                          UnShareTrip();
                          closeCancelShareModal(); // 關閉彈跳視窗
                        }}
                      >
                        確定
                      </button>
                    </div>
                  </div>
                </form>
              </dialog>
            )}
            {noteButton}

            {/* 以 useState 來控制<dialog> */}
            {isNewTripNoteModalOpen && (
              <dialog open className="modal">
                <form onSubmit={handleSubmit} className="modal-box w-96">
                  <h3 className="font-bold text-lg mb-4 text-white">
                    行程筆記
                  </h3>

                  <p className="text-white">行程描述</p>
                  {trip.trip_description ? (
                    <input
                      type="text"
                      className="mt-4 mb-4 px-2 py-1 w-full"
                      value={trip.trip_description || tripDescription}
                      onChange={(e) => setTripDescription(e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className="mt-4 mb-4 px-2 py-1 w-full"
                      placeholder="請輸入您的行程描述"
                      value={tripDescription}
                      onChange={(e) => setTripDescription(e.target.value)}
                    />
                  )}

                  <p className="text-white">行程筆記</p>
                  {trip.trip_notes ? (
                    <textarea
                      className="mt-4 mb-4 px-2 py-1 w-full h-32"
                      value={tripNote || trip.trip_notes}
                      onChange={(e) => setTripNote(e.target.value)}
                    />
                  ) : (
                    <textarea
                      className="mt-4 mb-4 px-2 py-1 w-full h-32"
                      value={tripNote}
                      onChange={(e) => setTripNote(e.target.value)}
                      placeholder="請輸入您的行程筆記"
                    />
                  )}

                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                      onClick={closeNewTripNoteModal}
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                    >
                      完成
                    </button>
                  </div>
                </form>
              </dialog>
            )}
            {!trip.trip_pic ? (
              <button
                onClick={openNewTripCoverModal}
                className=" text-xs sm:text-base bg-black px-2 py-1 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-white cursor-pointer"
              >
                新增行程封面
              </button>
            ) : (
              <button
                onClick={openNewTripCoverModal}
                className=" text-xs sm:text-base bg-black px-2 py-1 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-white cursor-pointer"
              >
                更改行程封面
              </button>
            )}
            {isNewTripCoverModalOpen && (
              <dialog open className="modal">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  method="post"
                  enctype="multipart/form-data"
                >
                  <div className="modal-box w-96">
                    <h3 className="font-bold text-lg mb-4 text-white">
                      新增行程封面
                    </h3>
                    <p className="text-white">請選擇封面圖片</p>
                    <input
                      type="file"
                      name="tripPic"
                      className="mt-4 mb-4 px-2 py-1 w-full"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className="modal-action">
                      <button
                        type="button"
                        className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                        onClick={closeNewTripCoverModal}
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                        onClick={uploadTripCover}
                      >
                        完成
                      </button>
                    </div>
                  </div>
                </form>
              </dialog>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href="/trip"
              className="text-xs sm:text-2xl hover:text-[#a0ff1f] "
            >
              回到我的月曆
            </Link>
            <Link
              href="/trip/my-trip"
              className="text-xs sm:text-2xl hover:text-[#a0ff1f]"
            >
              回到我的行程
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-5 flex flex-col justify-start items-start gap-2.5 sm:hidden">
        <div className="flex flex-col justify-start items-start gap-2.5">
          <div className="text-white text-base font-normal">
            {tripName && tripName.trip_title
              ? tripName.trip_title
              : 'Loading...'}
          </div>
          <div className="text-white text-base font-normal">
            {tripName && tripName.trip_date
              ? new Date(tripName.trip_date).toLocaleDateString('en-CA') // 格式化日期為 YYYY-MM-DD
              : 'Loading...'}
          </div>
        </div>
        <div className="flex justify-start items-start gap-1">
          {actionButton}

          {/* 以 useState 來控制<dialog> */}
          {isShareTripModalOpen && (
            <dialog open className="modal">
              <form action="#" method="post">
                {/* 之後要跟後端路由連結 */}
                <div className="modal-box w-96 flex flex-col justify-center items-center">
                  <h3 className="font-bold text-lg mb-4 text-white text-center">
                    確定要分享{' '}
                    <span className="text-[#a0ff1f]">
                      {tripName.trip_title}
                    </span>{' '}
                    給其他使用者嗎？
                  </h3>
                  <div className="modal-action">
                    {/* 更新按鈕的onClick，以關閉彈出視窗 */}
                    <button
                      type="button"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                      onClick={closeShareTripModal}
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                      onClick={() => {
                        shareTrip();
                      }}
                    >
                      確定
                    </button>
                  </div>
                </div>
              </form>
            </dialog>
          )}
          {/* 以 useState 來控制<dialog> */}
          {isCancelShareModalOpen && (
            <dialog open className="modal">
              <form action="#" method="post">
                {/* 之後要跟後端路由連結 */}
                <div className="modal-box w-96 flex flex-col justify-center items-center">
                  <h3 className="font-bold text-lg mb-4 text-[#a0ff1f] text-center">
                    確定要取消分享 {tripName.trip_title} 嗎？
                  </h3>
                  <div className="modal-action">
                    {/* 更新按鈕的onClick，以關閉彈出視窗 */}
                    <button
                      type="button"
                      className="btn"
                      onClick={closeShareTripModal}
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="btn ml-4"
                      onClick={() => {
                        UnShareTrip();
                      }}
                    >
                      確定
                    </button>
                  </div>
                </div>
              </form>
            </dialog>
          )}
          {noteButton}
          {/* 以 useState 來控制<dialog> */}
          {isNewTripNoteModalOpen && (
            <dialog open className="modal">
              <form onSubmit={handleSubmit} className="modal-box w-96">
                <h3 className="font-bold text-lg mb-4 text-white">行程筆記</h3>

                <p className="text-white">行程描述</p>
                {trip.trip_description ? (
                  <input
                    type="text"
                    className="mt-4 mb-4 px-2 py-1 w-full"
                    value={trip.trip_description || tripDescription}
                    onChange={(e) => setTripDescription(e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="mt-4 mb-4 px-2 py-1 w-full"
                    placeholder="請輸入您的行程描述"
                    value={tripDescription}
                    onChange={(e) => setTripDescription(e.target.value)}
                  />
                )}

                <p className="text-white">行程筆記</p>
                {trip.trip_notes ? (
                  <textarea
                    className="mt-4 mb-4 px-2 py-1 w-full h-32"
                    value={tripNote || trip.trip_notes}
                    onChange={(e) => setTripNote(e.target.value)}
                  />
                ) : (
                  <textarea
                    className="mt-4 mb-4 px-2 py-1 w-full h-32"
                    value={tripNote}
                    onChange={(e) => setTripNote(e.target.value)}
                    placeholder="請輸入您的行程筆記"
                  />
                )}

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                    onClick={closeNewTripNoteModal}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                  >
                    完成
                  </button>
                </div>
              </form>
            </dialog>
          )}
          <button
            onClick={openNewTripCoverModal}
            className=" text-xs sm:text-base bg-black px-2 py-1 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-white cursor-pointer"
          >
            新增行程封面
          </button>
          {isNewTripCoverModalOpen && (
            <dialog open className="modal">
              <form
                onSubmit={(e) => e.preventDefault()}
                method="post"
                enctype="multipart/form-data"
              >
                <div className="modal-box w-96">
                  <h3 className="font-bold text-lg mb-4 text-white">
                    新增行程封面
                  </h3>
                  <p className="text-white">請選擇封面圖片</p>
                  <input
                    type="file"
                    name="tripPic"
                    className="mt-4 mb-4 px-2 py-1 w-full"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                      onClick={closeNewTripCoverModal}
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className="btn text-base bg-black px-8 border border-white rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-black"
                      onClick={uploadTripCover}
                    >
                      完成
                    </button>
                  </div>
                </div>
              </form>
            </dialog>
          )}
        </div>
        <div className="flex self-stretch justify-end items-center gap-2">
          <Link
            href="/trip/my-trip"
            className="text-xs sm:text-base hover:text-[#a0ff1f]"
          >
            回到我的月曆
          </Link>
          <Link
            href="/trip/my-trip"
            className="text-xs sm:text-base hover:text-[#a0ff1f]"
          >
            回到我的行程
          </Link>
        </div>
      </div>
    </div>
  );
}
