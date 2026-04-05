import { useState } from 'react';
import { TripService } from '@/services/trip-service';
import { toast } from '@/lib/toast';

export default function CarouselContentBar({
  barSaved,
  altText,
  onClick,
  trip_plan_id,
  refreshAllDetails,
  newDetail = []
}) {
  const [showDetails, setShowDetails] = useState(false);
  const modalId = `modal_${barSaved.bar_id}`; // 確保每個對話框的 ID 是唯一的
  const [timeOfDay, setTimeOfDay] = useState('1'); // 用於存儲選擇的時段

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
    if (onClick) {
      onClick();
    }
  };

  const handleTimeChange = (event) => {
    setTimeOfDay(event.target.value); // 更新選擇的時段
  };

  const handleSubmit = async () => {
    // 檢查該時段是否已存在「有效內容」的項目
    const isExist = Array.isArray(newDetail) && newDetail.some(item => {
        return String(item.block) === String(timeOfDay) && (Boolean(item.bar_id) || Boolean(item.movie_id));
    });
    
    if (isExist) {
      toast.warning('時段重複', '該時段已有安排其它行程囉！請先刪除原行程再加入新的行程～');
      return;
    }

    try {
      const result = await TripService.addBarToTripBlock(trip_plan_id, {
        bar_id: barSaved.bar_id,
        block: timeOfDay,
      });

      if (result.success) {
        toast.success(`成功加入: ${barSaved.bar_name}`);
        document.getElementById(modalId).close(); // 關閉彈跳視窗
        
        // 發送自遞義事件，通知對應的區塊進行局部重新整理
        window.dispatchEvent(new CustomEvent('trip-detail-refresh', { 
            detail: { block: timeOfDay } 
        }));

        refreshAllDetails();
      } else {
        toast.error('發生錯誤', result.message || '未知錯誤');
      }
    } catch (error) {
      console.error('Error adding bar to trip:', error);
      toast.error('連線失敗', error.message);
    }
  };

  return (
    <div className="relative group animate__animated animate__fadeIn">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg group">
        <img
          src={
            barSaved.bar_img_url
              ? barSaved.bar_img_url
              : barSaved.bar_pic_name
              ? `/barPic/${barSaved.bar_pic_name}`
              : '/unavailable-image.jpg'
          }
          alt={altText}
          className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110 cursor-pointer"
          onClick={() => document.getElementById(modalId).showModal()}
        />
        
        {/* Always Visible Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-5 pointer-events-none"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-neongreen text-black text-[9px] font-black px-2 py-1 rounded shadow-[0_0_10px_#39FF14] uppercase tracking-tighter">HOT</span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{barSaved.bar_area_name}</span>
            </div>
            <div className="flex items-center gap-1 text-neongreen font-black text-xs">
              <span className="text-[10px]">★</span>
              <span>4.{Math.floor(Math.random() * 5) + 5}</span>
            </div>
          </div>
          <h4 className="text-white text-xl font-black tracking-tighter leading-tight uppercase italic line-clamp-1 group-hover:text-neongreen transition-colors">{barSaved.bar_name}</h4>
        </div>
        
        {/* Subtle Glow on Hover */}
        <div className="absolute inset-0 border-2 border-neongreen/0 group-hover:border-neongreen/30 rounded-2xl transition-all duration-300 pointer-events-none"></div>
      </div>

      <dialog id={modalId} className="modal">
        <div className="modal-box bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-white/50 hover:text-white transition-colors">
              ✕
            </button>
          </form>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pt-4">
            <img
              className="w-32 h-32 rounded-2xl object-cover border border-white/10 shadow-lg"
              src={
                barSaved.bar_img_url
                  ? barSaved.bar_img_url
                  : barSaved.bar_pic_name
                  ? `/barPic/${barSaved.bar_pic_name}`
                  : '/unavailable-image.jpg'
              }
              alt={`Image of ${barSaved.bar_name}`}
            />
            <div className="flex flex-col flex-grow w-full">
              <h2 className="text-neongreen text-2xl font-black italic uppercase tracking-tighter mb-2">{barSaved.bar_name}</h2>
              <div className="flex gap-3 mb-6">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">{barSaved.bar_area_name}</span>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">{barSaved.bar_type_name}</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="timeOfDay" className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                    欲安排時段
                  </label>
                  <select
                    name="timeOfDay"
                    value={timeOfDay}
                    onChange={handleTimeChange}
                    className="w-full bg-black/40 text-white border border-white/10 rounded-xl p-3 focus:border-neongreen focus:ring-1 focus:ring-neongreen transition-all outline-none text-sm appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23ffffff66\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem' }}
                  >
                    <option value="1">🌅 早上 (Morning)</option>
                    <option value="2">☀️ 下午 (Noon)</option>
                    <option value="3">🌙 晚上 (Night)</option>
                  </select>
                </div>
                
                <button
                  onClick={handleSubmit}
                  className="w-full relative group/btn bg-neongreen hover:bg-white text-black font-black uppercase italic tracking-tighter text-sm py-4 rounded-xl transition-all duration-300 shadow-[0_5px_15px_rgba(57,255,20,0.2)] hover:shadow-[0_5px_20px_rgba(255,255,255,0.2)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    加入行程表
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
