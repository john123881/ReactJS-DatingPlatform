import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BsTelephone, HiOutlineLocationMarker } from '@/lib/react-icons';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarRatingModal from '@/components/bar/modal/bar-rating-modal';
import Link from 'next/link';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function Detail({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const [error, setError] = useState(null);
  const [bar, setBar] = useState(null);
  const currentPage = bar?.bar_name;
  const [savedBars, setSavedBars] = useState({});

  const { auth, getAuthHeader } = useAuth();

  //酒吧收藏
  // 檢查儲存酒吧狀態
  const checkBarsStatus = async (barIds) => {
    const userId = auth.id;

    if (userId === 0) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/bar/check-bar-status?userId=${userId}&barIds=${barIds}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      const data = await response.json();
      // console.log('checkBarsStatus 的 data:', data);

      // 初始化來存儲所有酒吧的收藏狀態
      const newSavedBars = { ...savedBars };
      console.log('checkBarsStatus 的 newSavedBars:', newSavedBars);

      // 遍歷從後端獲取的每個貼文的狀態數據
      data.forEach((status) => {
        // 將每個貼文的收藏狀態存儲到 newSavedBars 對象中
        newSavedBars[status.barId] = status.isSaved;
      });
      // console.log('checkBarsStatus 的 newSavedBars2:', newSavedBars);

      // 更新 React 狀態以觸發界面更新，以顯示最新的收藏狀態
      setSavedBars(newSavedBars);
    } catch (error) {
      console.error('無法獲取酒吧狀態:', error);
    }
  };

  // save bar
  const isSaved = bar && savedBars[bar?.bar_id]; // Using optional chaining to safely access bar_id

  const handleSavedClick = async () => {
    if (auth.id == 0) return;
    const barId = bar.bar_id;
    const userId = auth.id; // Ensure user is defined and has an id

    if (!userId) {
      console.error('User ID is undefined or not set');
      return;
    }

    const wasSaved = isSaved;
    const newSavedState = !wasSaved;

    try {
      const url = wasSaved ? '/unsaved-bar' : '/saved-bar';
      const method = wasSaved ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:3001/bar${url}`, {
        method: method,
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ barId, userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSavedBars((prev) => ({ ...prev, [barId]: newSavedState }));
        setRerender(!rerender);
        console.log('Save status updated:', data);
      } else {
        throw new Error(data.message || 'Failed to update save status');
      }
    } catch (error) {
      console.error('Error updating save status:', error);
      setError(error.message);
    }
  };

  //FETCH GET 酒吧資料
  const getBarDetailById = async (bar_id) => {
    const url = `http://localhost:3001/bar/bar-detail/${bar_id}`;
    const response = await fetch(url);
    const data = await response.json();
    // // console.log('getBarListDynamicById 的 data:', data);

    // const barIds = data.map((bar) => bar.bar_id).join(',');
    // checkBarsStatus(barIds); //確認Saved or not 狀態的fetch
    setBar(data);
    // setBar({ bar_name :'fake data', aaaa: '', xxxx:''});
  };

  useEffect(() => {
    if (router.isReady) {
      //確保能得到bar_id
      const { bar_id } = router.query;
      // 有bar_id後，向伺服器要求資料
      getBarDetailById(bar_id);
    }
  }, [router.isReady, router.query]);

  // bar-rating-modal
  const handleLeaveReviewClick = () => {
    document.getElementById('bar-rating-modal').showModal();
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-row justify-center pt-28">
        {/* 留 2/12 空白 */}
        <div className="w-1/12 md:w-2/12"></div>
        <div className="w-10/12 md:w-8/12">
          <div className="text-sm breadcrumbs">
            <Breadcrumbs currentPage={currentPage} />
          </div>
          <div className="md:space-y-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-5 text-white bar-detail-content">
                <div className="space-y-1 md:w-full">
                  <div className="text-[18px] md:text-h3">
                    {/* Fake Sober Taipei */}
                    {bar?.bar_name}
                  </div>
                  <div className="flex items-center gap-2 review">
                    <Link
                      className="text-[13px] md:text-h6"
                      href={`/bar/bar-rating-list/${bar?.bar_id}`}
                    >
                      {/* 4.6 */}
                      {bar?.rating}
                    </Link>
                    <div className="flex gap-1 bar-detail-stars rating rating-sm">
                      <input
                        type="radio"
                        name="rating-6"
                        className="mask mask-star-2 bg-[#A0FF1F]"
                        checked={true} // 這裡可以用來控制是否選中
                        onChange={() => {}} // 只是個空處理程序
                      />
                      <input
                        type="radio"
                        name="rating-6"
                        className="mask mask-star-2 bg-[#A0FF1F]"
                        checked={true} // 這裡可以用來控制是否選中
                        onChange={() => {}} // 只是個空處理程序
                      />
                      <input
                        type="radio"
                        name="rating-6"
                        className="mask mask-star-2 bg-[#A0FF1F]"
                        checked={true} // 這裡可以用來控制是否選中
                        onChange={() => {}} // 只是個空處理程序
                      />
                      <input
                        type="radio"
                        name="rating-6"
                        className="mask mask-star-2 bg-[#A0FF1F]"
                        checked={true} // 這裡可以用來控制是否選中
                        onChange={() => {}} // 只是個空處理程序
                      />
                      <input
                        type="radio"
                        name="rating-6"
                        className="mask mask-star-2 bg-[#A0FF1F]"
                        checked={true} // 這裡可以用來控制是否選中
                        onChange={() => {}} // 只是個空處理程序
                      />
                    </div>
                    <p className="text-[13px] md:text-h6">
                      {'('}2 則評論{')'}
                    </p>
                  </div>
                  <div className="flex gap-4 text-[13px] md:text-h6">
                    <div className="text-white">
                      {/* 大安區 */}
                      {bar?.bar_area_name}
                    </div>
                    <div className="text-white">
                      {/* 特色酒吧 */}
                      {bar?.bar_type_name}
                    </div>
                  </div>
                  <div className="flex gap-4 telephone">
                    <BsTelephone />
                    <div className="text-white text-[13px] md:text-h6">
                      {/* 0227220723 */}
                      {bar?.bar_contact}
                    </div>
                  </div>
                  <div className="flex gap-4 address">
                    <HiOutlineLocationMarker />
                    <div className="text-white text-[13px] md:text-h6">
                      {/* 台北市信義區松壽路20號 */}
                      {bar?.bar_addr}
                    </div>
                  </div>
                  <div className="text-white text-[13px] md:text-h6 text-justify md:w-full">
                    {/* Fake Sober 位在信義威秀後方，
                    許多人說他有美國又或是韓國感的咖啡館，半開放式的空間到了夜晚還有
                    DJ 表演，甚至供應雞尾酒、啤酒與披薩，不趕時間的話可以很
                    Chill
                    的在這裡從白天待到晚間時刻，雖然那日是下午到訪，不過我們也舒服待上幾小時呢！ */}
                    {bar?.bar_description}
                  </div>
                </div>
                <div className="flex items-center gap-4 bar-detail-button-group">
                  <button onClick={handleSavedClick}>
                    <div className="badge badge-outline border-[#A0FF1F] text-white h-[28px]">
                      {isSaved ? (
                        <FaHeart className="card-icon hover:text-neongreen" />
                      ) : (
                        <FaRegHeart className="card-icon hover:text-neongreen" />
                      )}
                      加入收藏
                    </div>
                  </button>
                  {/* <button>
                    <div className="badge badge-outline border-[#A0FF1F] text-white h-[28px]">
                      加入行程
                    </div>
                  </button> */}
                  <div
                    type="submit"
                    // onClick={() =>
                    //   document.getElementById('bar-rating-modal').showModal()
                    // }
                    onClick={handleLeaveReviewClick}
                  >
                    <div className="badge badge-outline border-[#A0FF1F] text-white h-[28px] cursor-pointer">
                      留下評論
                    </div>
                    <BarRatingModal bar={bar} />
                  </div>
                </div>
                <button className="btn w-[320px] text-black text-[15px] bg-[#A0FF1F] border-none rounded-[20px]">
                  <Link href={`/bar/bar-booking/${bar?.bar_id}`}>立即訂位</Link>
                </button>
              </div>
              <div className="bar-detail-img">
                <img
                  className="object-cover rounded-[10px] w-[328px] h-[300px] md:w-[440px] md:h-[400px]"
                  // src="https://damei17.com/wp-content/uploads/2022/08/Fake-Sober-24.jpg"
                  // src={bar?.bar_img}
                  src={`/barPic/${bar?.bar_pic_name}`}
                  alt={`Image of ${bar?.bar_name}`}
                />
              </div>
            </div>
            <div className="flex my-4 google-map md:hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  bar?.bar_addr
                )}&output=embed`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Store Location"
              ></iframe>
            </div>
            <div className="hidden google-map md:flex">
              {/* <Image
                src="/images/googleMap.png"
                width={1062}
                height={741}
                alt="map"
                className="rounded-[20px]"
              /> */}
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  bar?.bar_addr
                )}&output=embed`}
                width="100%"
                height="700"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Store Location"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="w-1/12 md:w-2/12"></div>
      </div>
    </>
  );
}
