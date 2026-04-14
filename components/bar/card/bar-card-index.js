import { IoMdStar } from 'react-icons/io';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { BarService } from '@/services/bar-service';
import { useCollect } from '@/context/use-collect';
import { toast } from '@/lib/toast';
import { useRef } from 'react';

export default function BarCardIndex({ randomBar, savedBars, setSavedBars }) {
  const { auth, setLoginModalToggle } = useAuth();
  const { refreshCollectList } = useCollect();
  const isSaved = savedBars && savedBars[randomBar.bar_id];
  const interactingItems = useRef(new Set());

  const handleSavedClick = async (e) => {
    e.preventDefault();
    if (auth.id === 0) {
      setLoginModalToggle(true);
      return;
    }
    const barId = randomBar.bar_id;
    const userId = auth.id;

    if (interactingItems.current.has(`save-${barId}`)) return;
    interactingItems.current.add(`save-${barId}`);

    const wasSaved = isSaved || false;
    const newSavedState = !wasSaved;

    // 樂觀更新
    setSavedBars((prev) => ({ ...prev, [barId]: newSavedState }));
    toast.success(newSavedState ? '收藏成功!' : '已取消收藏!');

    try {
      if (wasSaved) {
        await BarService.unsaveBar(userId, barId);
      } else {
        await BarService.saveBar(userId, barId);
      }
      // 成功後刷新全局收藏列表
      refreshCollectList();
    } catch (error) {
      console.error('Error updating save status:', error);
      setSavedBars((prev) => ({ ...prev, [barId]: wasSaved }));
      toast.error('操作失敗，請稍後再試');
    } finally {
      interactingItems.current.delete(`save-${barId}`);
    }
  };

  return (
    <div className="py-2 group">
      <div className="py-2">
        <div className="bar-card-index-img cursor-pointer relative overflow-hidden rounded-[15px]">
          <Link href={`/bar/bar-detail/${randomBar.bar_id}`}>
            <div className="relative overflow-hidden w-[159px] h-[155px] md:w-[241px] md:h-[230px]">
              <Image
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                src={
                  randomBar?.bar_img_url
                    ? randomBar.bar_img_url
                    : randomBar?.bar_pic_name
                    ? `/barPic/${randomBar.bar_pic_name}`
                    : '/unavailable-image.jpg'
                }
                alt={`Image of ${randomBar.bar_name}`}
                fill
                sizes="(max-width: 768px) 159px, 241px"
              />
            </div>
          </Link>
          <div className="absolute top-2 right-2 z-10">
            <div 
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer ${
                isSaved 
                  ? 'bg-[#A0FF1F]/20 border border-[#A0FF1F]/50 shadow-[0_0_15px_rgba(160,255,31,0.3)]' 
                  : 'bg-black/20 border border-white/20 hover:border-[#A0FF1F] hover:bg-[#A0FF1F]/10'
              }`}
              onClick={handleSavedClick}
            >
              {isSaved ? (
                <FaBookmark
                  className="text-[14px] md:text-[16px] transition-transform duration-300 active:scale-125 hover:scale-110"
                  color="#A0FF1F"
                />
              ) : (
                <FaRegBookmark
                  className="text-[14px] md:text-[16px] text-white transition-transform duration-300 hover:scale-110 hover:text-[#A0FF1F]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pb-0 pt-2 flex-col items-start text-white">
        <p className="text-[16px] md:text-[20px] font-outfit font-bold mb-2 group-hover:text-[#A0FF1F] transition-colors truncate w-full">
          {randomBar?.bar_name || 'Default Bar Name'}
        </p>
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/bar/bar-rating-list/${randomBar.bar_id}`}>
            <div className="flex px-3 py-1 rounded-full bg-[#A0FF1F]/10 backdrop-blur-md justify-center items-center border border-[#A0FF1F]/30 hover:border-[#A0FF1F] transition-all duration-300">
              <span className="text-[12px] lg:text-[14px] text-[#A0FF1F] font-bold mr-1">
                {randomBar?.rating}
              </span>
              <IoMdStar className="text-[14px] lg:text-[18px] text-[#A0FF1F]" />
            </div>
          </Link>
          <span className="text-[12px] lg:text-[15px] text-white/50 font-inter">
            {randomBar?.bar_area_name}
          </span>
        </div>
        <div className="w-[159px] md:w-[241px] flex justify-between items-center mt-auto pt-2 border-t border-white/5">
          <p className="text-[11px] lg:text-[14px] text-white/60 font-inter font-medium tracking-wide uppercase">
            {randomBar?.bar_type_name}
          </p>
          <Link
            className="text-[11px] lg:text-[13px] bg-[#A0FF1F] text-black font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(160,255,31,0.3)] hover:shadow-[0_0_25px_rgba(160,255,31,0.5)] hover:scale-105 transition-all duration-300 font-inter"
            href={`/under-construction`}
            onClick={(e) => {
              if (auth.id === 0) {
                e.preventDefault();
                setLoginModalToggle(true);
              }
            }}
          >
            立即訂位
          </Link>
        </div>
      </div>
    </div>
  );
}
