import { useState, memo, useRef } from 'react';
import { BarService } from '@/services/bar-service';
import { IoMdStar } from 'react-icons/io';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/lib/toast';

import { useCollect } from '@/context/use-collect';

const BarCard = memo(({ bar, savedBars, setSavedBars, index = 0 }) => {
  // save bar
  const interactingItems = useRef(new Set());

  const handleSavedClick = async () => {
    if (auth.id === 0) {
      setLoginModalToggle(true);
      return;
    }
    const barId = bar.bar_id;
    const userId = auth.id;

    if (interactingItems.current.has(`save-${barId}`)) return;
    interactingItems.current.add(`save-${barId}`);

    if (!userId) {
      console.error('User ID is undefined or not set');
      interactingItems.current.delete(`save-${barId}`);
      return;
    }

    const wasSaved = isSaved || false;
    const newSavedState = !wasSaved;

    // 樂觀更新 UI (單個卡片)
    setSavedBars((prev) => ({ ...prev, [barId]: newSavedState }));
    toast.success(newSavedState ? '收藏成功!' : '已取消收藏!');

    // 樂觀更新全域收藏清單 (Sidebar)
    if (newSavedState) {
      const newItem = {
        saved_id: Date.now(),
        item_id: barId,
        title: bar.bar_name,
        img:
          bar?.bar_img_url ||
          (bar?.bar_pic_name ? `/barPic/${bar.bar_pic_name}` : ''),
        item_type: 'bar',
        content: '', // 補上 content 避免傳入 undefined
        created_at: new Date().toISOString(),
        subtitle: bar.bar_area_name,
      };
      setAllCollectList((prev) => [newItem, ...prev]);
    } else {
      setAllCollectList((prev) =>
        prev.filter(
          (item) => !(item.item_id == barId && item.item_type === 'bar'),
        ),
      );
    }

    try {
      if (wasSaved) {
        await BarService.unsaveBar(userId, barId);
      } else {
        await BarService.saveBar(userId, barId);
      }

      // 觸發全域重新渲染
      setRerender(!rerender);
      // 觸發 Navbar 重新獲取收藏清單 (背景同步)
      refreshCollectList();
    } catch (error) {
      console.error('Error updating save status:', error);
      // 發生錯誤時還原所有狀態
      setSavedBars((prev) => ({ ...prev, [barId]: wasSaved }));
      setAllCollectList((prev) =>
        wasSaved
          ? [...prev]
          : prev.filter((item) => item.item_id != barId),
      );
      toast.error('操作失敗，請稍後再試');
    } finally {
      interactingItems.current.delete(`save-${barId}`);
    }
  };

  // 檢查儲存酒吧狀態
  // const checkBarsStatus = async (barIds) => {
  //   const userId = auth.id;

  //   if (userId === 0) {
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `http://localhost:3001/bar/check-bar-status?userId=${userId}&barIds=${barIds}`,
  //       {
  //         headers: {
  //           ...getAuthHeader(),
  //         },
  //       }
  //     );
  //     const data = await response.json();

  //     // 初始化來存儲所有酒吧的收藏狀態
  //     const newSavedBars = { ...savedBars };

  //     // 遍歷從後端獲取的每個貼文的狀態數據
  //     data.forEach((status) => {
  //       // 將每個貼文的收藏狀態存儲到 newSavedBars 對象中
  //       newSavedBars[status.barId] = status.isSaved;
  //     });

  //     // 更新 React 狀態以觸發界面更新，以顯示最新的收藏狀態
  //     setSavedBars(newSavedBars);
  //   } catch (error) {
  //     console.error('無法獲取酒吧狀態:', error);
  //   }
  // };

  // const currentPage = 'Fake Sober';

  // const imgUrl = useMemo(() => {
  //   if (bar.bar_img) {
  //     return URL.createObjectURL(bar.bar_img);
  //   }
  //   return '';
  // }, [bar]);
  // // const imgUrl = bar.bar_img && URL.createObjectURL(bar.bar_img);
  // console.log('test', bar);
  return (
    <>
      <div
        className="glass-card-neon w-full max-w-[340px] lg:max-w-none h-[300px] lg:h-[380px] overflow-hidden group transition-[transform,shadow] duration-300 hover:shadow-[0_0_30px_rgba(160,255,31,0.15)] transform-gpu"
      >
        <figure className="relative overflow-hidden h-[146px] lg:h-[205px]">
          <Link href={`/bar/bar-detail/${bar.bar_id}`}>
            <div className="relative w-full h-full cursor-pointer group-hover:scale-110 transition-transform duration-500 transform-gpu">
              <Image
                src={
                  bar?.bar_img_url
                    ? bar.bar_img_url
                    : bar?.bar_pic_name
                    ? `/barPic/${bar.bar_pic_name}`
                    : '/unavailable-image.jpg'
                }
                alt={`Image of ${bar.bar_name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 340px, 223px"
                priority={index < 3}
              />
            </div>
          </Link>

          <div className="absolute top-3 right-3 z-10">
            <div 
              className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-[background,border,shadow] duration-300 cursor-pointer ${
                isSaved 
                  ? 'bg-[#A0FF1F]/20 border border-[#A0FF1F]/50 shadow-[0_0_15px_rgba(160,255,31,0.3)]' 
                  : 'bg-black/40 border border-white/20 hover:border-[#A0FF1F] hover:bg-[#A0FF1F]/10'
              }`}
              onClick={handleSavedClick}
            >
              {isSaved ? (
                <FaBookmark
                  className="text-[16px] lg:text-[18px] transition-transform duration-300 active:scale-125 hover:scale-110"
                  color="#A0FF1F"
                />
              ) : (
                <FaRegBookmark
                  className="text-[16px] lg:text-[18px] text-white transition-transform duration-300 hover:scale-110 hover:text-[#A0FF1F]"
                />
              )}
            </div>
          </div>
        </figure>
        <div className="bar-card-content p-4 lg:p-5 flex flex-col h-[calc(100%-146px)] lg:h-[calc(100%-205px)]">
          <div className="text-[16px] lg:text-[20px] text-white font-bold truncate mb-2 group-hover:text-[#A0FF1F] transition-colors">
            {bar.bar_name}
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/bar/bar-rating-list/${bar.bar_id}`}>
              <div className="flex px-3 py-1 rounded-full bg-[#A0FF1F]/10 justify-center items-center border border-[#A0FF1F]/30 hover:border-[#A0FF1F] transition-[border,background] duration-300">
                <span className="text-[12px] lg:text-[14px] text-[#A0FF1F] font-bold mr-1">
                  {bar.rating}
                </span>
                <IoMdStar className="text-[14px] lg:text-[18px] text-[#A0FF1F]" />
              </div>
            </Link>
            <div className="flex items-center gap-1 text-white/50">
              <span className="text-[12px] lg:text-[15px]">
                {bar.bar_area_name}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5">
            <span className="text-[11px] lg:text-[14px] text-white/60 font-medium tracking-wide uppercase">
              {bar.bar_type_name}
            </span>
            <Link
              className="text-[11px] lg:text-[13px] bg-[#A0FF1F] text-black font-bold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(160,255,31,0.3)] hover:shadow-[0_0_25px_rgba(160,255,31,0.5)] hover:scale-105 transition-all duration-300"
              onClick={(e) => {
                if (auth.id === 0) {
                  e.preventDefault();
                  setLoginModalToggle(true);
                }
              }}
              href={`/under-construction`}
            >
              立即訂位
            </Link>
          </div>
        </div>
      </div>
    </>
  );
});

export default BarCard;
