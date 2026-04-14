import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarRatingModal from '@/components/bar/modal/bar-rating-modal';
import Link from 'next/link';
import { FaRegBookmark, FaBookmark, FaStar, FaPhoneAlt } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoMdStar } from 'react-icons/io';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import PageTitle from '@/components/page-title';
import { BarService } from '@/services/bar-service';
import { useCollect } from '@/context/use-collect';
import Loader from '@/components/ui/loader/loader';
import { toast } from '@/lib/toast';

export default function Detail({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  const { auth, setLoginModalToggle } = useAuth();
  const { refreshCollectList } = useCollect();
  const [savedBars, setSavedBars] = useState({});

  const { bar_id } = router.query;
  const interactingItems = useRef(new Set());

  // 使用 SWR 抓取詳情
  const { data: bar, error, isLoading } = useSWR(
    router.isReady && bar_id ? ['bar-detail', bar_id] : null,
    () => BarService.getBarDetail(bar_id),
    { revalidateOnFocus: false }
  );

  const currentPage = bar?.bar_name;

  // save bar
  const isSaved = bar && savedBars[bar?.bar_id];

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

    // 樂觀更新 UI
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
      // 還原狀態
      setSavedBars((prev) => ({ ...prev, [barId]: wasSaved }));
      toast.error('操作失敗，請稍後再試');
    } finally {
      interactingItems.current.delete(`save-${barId}`);
    }
  };

  // 檢查儲存酒吧狀態
  const checkBarsStatus = useCallback(
    async (barId) => {
      const userId = auth.id;
      if (userId === 0 || !barId) return;

      try {
        const data = await BarService.checkBarStatus(userId, barId);
        if (data && data.length > 0) {
          setSavedBars((prev) => ({ ...prev, [barId]: data[0].isSaved }));
        }
      } catch (error) {
        console.error('無法獲取酒吧狀態:', error);
      }
    },
    [auth.id],
  );

  useEffect(() => {
    if (bar?.bar_id && auth.id !== 0) {
      checkBarsStatus(bar.bar_id);
    }
  }, [bar?.bar_id, auth.id, checkBarsStatus]);

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const handleLeaveReviewClick = () => {
    if (auth.id === 0) {
      setLoginModalToggle(true);
      return;
    }
    document.getElementById('bar-rating-modal').showModal();
  };

  if (error) return <div className="pt-28 text-center text-white text-h3">載入失敗，請稍後再試</div>;

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      
      {/* 沉浸式背景圖層 - 使用酒吧照片作為模糊背景，營造氣氛 */}
      <div className="fixed inset-0 z-0">
        <Image
          src={
            bar?.bar_pic_name
              ? `/barPic/${bar.bar_pic_name}`
              : '/unavailable-image.jpg'
          }
          alt="Background"
          fill
          className="object-cover opacity-20 blur-md scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
      </div>

      <div className="relative z-10 min-h-screen pt-24 pb-20 px-4 md:px-0">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="mb-8 opacity-60 hover:opacity-100 transition-opacity text-sm breadcrumbs">
            <Breadcrumbs currentPage={currentPage} />
          </div>

          {isLoading || !bar ? (
            <div className="flex justify-center items-center min-h-[600px]">
              <Loader minHeight="400px" text="正在為您調製專屬視覺..." />
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              
              {/* 上半部：沉浸式內容區塊 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* 左側：詳情面板 (Glassmorphism) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
                  <div className="glass-card-neon p-8 lg:p-12 rounded-[30px] border border-white/10 backdrop-blur-xl bg-white/5 relative overflow-hidden group">
                    {/* 裝飾性霓虹光暈 */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#A0FF1F]/10 blur-[100px] pointer-events-none"></div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full bg-[#A0FF1F]/10 text-[#A0FF1F] text-[12px] font-bold tracking-widest uppercase border border-[#A0FF1F]/30">
                          {bar?.bar_type_name}
                        </span>
                        <span className="text-white/40 text-sm font-medium tracking-wide">
                          {bar?.bar_area_name}
                        </span>
                      </div>

                      <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-2">
                        {bar?.bar_name}
                      </h1>

                      <div className="flex flex-wrap items-center gap-6 mb-4 font-medium">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                          <span className="text-2xl font-black text-[#A0FF1F]">{bar?.rating}</span>
                          <div className="flex gap-0.5 text-[#A0FF1F]">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <IoMdStar key={i} className={`text-xl ${i <= Math.round(bar?.rating || 0) ? 'opacity-100' : 'opacity-20'}`} />
                            ))}
                          </div>
                          <Link href={`/bar/bar-rating-list/${bar?.bar_id}`} className="ml-2 text-white/40 hover:text-white transition-colors text-sm underline underline-offset-4">
                            2 則評論
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 text-white/80 group/info">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/info:border-[#A0FF1F]/50 transition-colors">
                            <FaPhoneAlt className="text-[#A0FF1F]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[12px] text-white/40 font-bold uppercase tracking-wider">聯絡方式</span>
                            <span className="text-lg lg:text-xl font-medium">{bar?.bar_contact}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 text-white/80 group/info">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/info:border-[#A0FF1F]/50 transition-colors">
                            <HiOutlineLocationMarker className="text-2xl text-[#A0FF1F]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[12px] text-white/40 font-bold uppercase tracking-wider">店鋪位址</span>
                            <span className="text-lg lg:text-xl font-medium">{bar?.bar_addr}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-white/80 text-lg leading-relaxed text-justify mb-8 italic font-light">
                        「 {bar?.bar_description} 」
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <Link 
                          href="/under-construction"
                          className="flex-1 lg:flex-none flex items-center justify-center gap-2 btn btn-lg h-[65px] px-6 md:px-12 bg-[#A0FF1F] text-black font-black text-xl border-none rounded-2xl shadow-[0_0_30px_rgba(160,255,31,0.3)] hover:shadow-[0_0_50px_rgba(160,255,31,0.5)] hover:scale-[1.02] transition-all duration-300 whitespace-nowrap"
                        >
                          立即訂位
                        </Link>
                        
                        <button 
                          onClick={handleSavedClick}
                          className={`w-[65px] h-[65px] rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-300 border ${
                            isSaved 
                              ? 'bg-[#A0FF1F]/20 border-[#A0FF1F]/50 shadow-[0_0_20px_rgba(160,255,31,0.3)]' 
                              : 'bg-white/5 border-white/10 hover:border-[#A0FF1F] hover:bg-[#A0FF1F]/10 text-white'
                          }`}
                        >
                          {isSaved ? (
                            <FaBookmark className="text-2xl text-[#A0FF1F]" />
                          ) : (
                            <FaRegBookmark className="text-2xl" />
                          )}
                        </button>

                        <button 
                          onClick={handleLeaveReviewClick}
                          className="w-[65px] h-[65px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#A0FF1F] hover:bg-[#A0FF1F]/10 transition-all duration-300"
                          title="留下評論"
                        >
                          <FaStar className="text-2xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右側：主視覺大圖 */}
                <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
                  <div className="relative aspect-[4/5] lg:aspect-square group overflow-hidden rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10">
                    <Image
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      src={
                        bar?.bar_img_url
                          ? bar.bar_img_url
                          : bar?.bar_pic_name
                          ? `/barPic/${bar.bar_pic_name}`
                          : '/unavailable-image.jpg'
                      }
                      alt={bar?.bar_name}
                      fill
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

              </div>

              {/* 下半部：地圖指南 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-[#A0FF1F] rounded-full shadow-[0_0_15px_rgba(160,255,31,0.8)]"></div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider">交通指南 / <span className="text-[#A0FF1F]">Map Guidance</span></h2>
                </div>
                
                <div className="relative group p-1.5 rounded-[35px] bg-white/5 border border-white/10 overflow-hidden shadow-2xl">
                  {/* 地圖容器上的裝飾邊框 */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#A0FF1F]/10 via-transparent to-transparent pointer-events-none rounded-[35px]"></div>
                  
                  <div className="relative rounded-[30px] overflow-hidden grayscale-[0.3] contrast-[1.1] hover:grayscale-0 transition-all duration-500 shadow-inner">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(bar?.bar_addr)}&output=embed`}
                      width="100%"
                      height="500"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Store Location"
                      className="filter brightness-[0.85] invert-[0.9] hue-rotate-[160deg] saturate-[0.5]"
                    ></iframe>
                  </div>
                </div>
              </div>

              <BarRatingModal bar={bar} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
