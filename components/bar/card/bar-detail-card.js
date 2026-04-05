import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BarService } from '@/services/bar-service';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdStar } from 'react-icons/io';
import { BsTelephone } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import BarRatingModal from '@/components/bar/modal/bar-rating-modal';
import { useAuth } from '@/context/auth-context';
import { useCollect } from '@/context/use-collect';
import { toast } from '@/lib/toast';

export default function BarDetailCard() {
  const router = useRouter();
  const { bar_id } = router.query;
  const [bar, setBar] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const { auth, rerender, setRerender, setLoginModalToggle } = useAuth();
  const { refreshCollectList } = useCollect();

  const getBarDetail = async (id) => {
    try {
      const data = await BarService.getBarDetail(id);
      setBar(data);
    } catch (error) {
      console.error('Failed to fetch bar detail:', error);
    }
  };

  const checkSaveStatus = async (id) => {
    if (auth.id === 0) return;
    try {
      const response = await BarService.checkBarStatus(auth.id, id);
      // Assuming response is an array of objects like [{barId, isSaved}]
      const status = response.find(s => String(s.barId) === String(id));
      if (status) {
        setIsSaved(status.isSaved);
      }
    } catch (error) {
      console.error('Failed to check save status:', error);
    }
  };

  const handleSavedClick = async () => {
    if (auth.id === 0) {
      setLoginModalToggle(true);
      return;
    }

    const wasSaved = isSaved;
    const newSavedState = !wasSaved;

    // 樂觀更新 UI
    setIsSaved(newSavedState);
    toast.success(newSavedState ? '收藏成功!' : '已取消收藏!');

    try {
      if (wasSaved) {
        await BarService.unsaveBar(auth.id, bar_id);
      } else {
        await BarService.saveBar(auth.id, bar_id);
      }
      // 觸發全域重新渲染
      setRerender(!rerender);
      // 觸發 Navbar 重新獲取收藏清單
      refreshCollectList();
    } catch (error) {
      console.error('Error updating save status:', error);
      setIsSaved(wasSaved);
      toast.error('操作失敗');
    }
  };

  useEffect(() => {
    if (bar_id) {
      getBarDetail(bar_id);
      checkSaveStatus(bar_id);
    }
  }, [bar_id, auth.id]);

  if (!bar) return <div className="text-white text-center py-20">載入中...</div>;

  return (
    <>
      <div className="md:space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bar-detail-content text-white space-y-5">
            <div className="space-y-1 md:w-full">
              <div className="text-h4 md:text-h3">{bar.bar_name}</div>
              <div className="review flex gap-2 items-center">
                <p className="text-h4 md:text-[20px]">{bar.rating || '0.0'}</p>
                <div className="bar-detail-stars flex gap-1 rating rating-sm">
                  {[...Array(5)].map((_, i) => (
                    <input
                      key={i}
                      type="radio"
                      className={`mask mask-star-2 ${i < Math.floor(bar.rating || 0) ? 'bg-[#A0FF1F]' : 'bg-gray-400'}`}
                      checked={i === Math.floor(bar.rating || 0) - 1}
                      readOnly
                    />
                  ))}
                </div>
                <p className="text-[13px] md:text-h6">
                  {'('}{bar.review_count || 0} 則評論{')'}
                </p>
              </div>
              <div className="flex gap-4 text-[13px] md:text-h6">
                <div className="text-white">{bar.bar_area_name}</div>
                <div className="text-white">{bar.bar_type_name}</div>
              </div>
              <div className="flex telephone gap-4">
                <BsTelephone />
                <div className="text-white text-[13px] md:text-h6">
                  {bar.bar_phone || '無電話資訊'}
                </div>
              </div>
              <div className="flex address gap-4">
                <HiOutlineLocationMarker />
                <div className="text-white text-[13px] md:text-h6">
                  {bar.bar_addr}
                </div>
              </div>
              <div className="text-white text-[13px] md:text-h6 text-justify md:w-full">
                {bar.bar_description}
              </div>
            </div>
            <div className="bar-detail-button-group flex items-center gap-4">
              <button onClick={handleSavedClick}>
                <div className={`badge badge-outline ${isSaved ? 'bg-[#A0FF1F] text-black' : 'border-[#A0FF1F] text-white'} h-[28px]`}>
                  {isSaved ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
                  {isSaved ? '已收藏' : '加入收藏'}
                </div>
              </button>
              <button>
                <div className="badge badge-outline border-[#A0FF1F] text-white h-[28px]">
                  加入行程
                </div>
              </button>
              <div
                type="button"
                onClick={() =>
                  document.getElementById('bar-rating-modal').showModal()
                }
              >
                <div className="badge badge-outline border-[#A0FF1F] text-white h-[28px] cursor-pointer">
                  留下評論
                </div>
                <BarRatingModal />
              </div>
            </div>
            <Link
              href={`/bar/bar-booking/${bar.bar_id}`}
              className="btn w-[320px] text-black text-[15px] bg-[#A0FF1F] border-none rounded-[20px] flex items-center justify-center"
            >
              立即訂位
            </Link>
          </div>
          <div className="bar-detail-img">
            <Image
              className="object-cover rounded-[10px] w-full h-[300px] md:w-[440px] md:h-[400px]"
              src={
                bar?.bar_img_url
                  ? bar.bar_img_url
                  : bar?.bar_pic_name
                  ? `/barPic/${bar.bar_pic_name}`
                  : '/unavailable-image.jpg'
              }
              alt={bar.bar_name}
              width={440}
              height={400}
            />
          </div>
        </div>
        <div className="google-map hidden md:flex">
          <Image
            src="/images/googleMap.png"
            width={1062}
            height={741}
            alt="map"
            className="rounded-[20px]"
          />
        </div>
      </div>
    </>
  );
}

