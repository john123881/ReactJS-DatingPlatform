import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import { toast } from '@/lib/toast';
import Swal from 'sweetalert2';
import { FaGlobe, FaLock } from 'react-icons/fa6';

export default function MyTripDetailSection({ tripName, onUpdateSuccess, isEmbedded = false }) {
  const [formData, setFormData] = useState({
    trip_title: '',
    trip_date: '',
    trip_description: '',
    trip_notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);

  useEffect(() => {
    if (tripName) {
      setFormData({
        trip_title: tripName.trip_title || '',
        trip_date: tripName.trip_date ? new Date(tripName.trip_date).toLocaleDateString('en-CA') : '',
        trip_description: tripName.trip_description || '',
        trip_notes: tripName.trip_notes || '',
      });
      setIsShared(Boolean(tripName.trip_draft));
    }
  }, [tripName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!tripName?.trip_plan_id) return;
    
    setIsSaving(true);
    try {
      const response = await TripService.updateTripPlan(tripName.trip_plan_id, formData);
      if (response.success) {
        toast.success('行程資訊更新成功', '您的描述與筆記已儲存。');
        if (onUpdateSuccess) onUpdateSuccess();
      } else {
        throw new Error(response.error || '更新失敗');
      }
    } catch (error) {
      console.error('Update trip error:', error);
      toast.error('更新失敗', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleShare = async () => {
    if (!tripName?.trip_plan_id) return;
    
    const newStatus = !isShared;
    const title = newStatus ? '公開分享行程？' : '取消公開分享？';
    const text = newStatus 
      ? '開啟後，其他使用者將能在「探索行程」中看到並收藏您的規劃。' 
      : '關閉後，此行程將變回私人狀態，其他使用者將無法看到。';

    Swal.fire({
      title,
      text,
      icon: newStatus ? 'info' : 'warning',
      showCancelButton: true,
      confirmButtonText: newStatus ? '立即公開' : '確認私有',
      cancelButtonText: '再想想',
      confirmButtonColor: newStatus ? '#a0ff1f' : '#ff4d4d',
      cancelButtonColor: '#333333',
      background: 'rgba(15, 15, 15, 0.95)',
      color: '#fff',
      backdrop: `rgba(0,0,0,0.8) blur(4px)`,
      scrollbarPadding: false,
      heightAuto: false,
      customClass: {
        popup: 'border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl',
        confirmButton: 'rounded-xl px-6 py-2 font-bold text-black',
        cancelButton: 'rounded-xl px-6 py-2 font-bold border border-white/10'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsShareLoading(true);
        try {
          const response = newStatus 
            ? await TripService.shareTrip(tripName.trip_plan_id)
            : await TripService.unshareTrip(tripName.trip_plan_id);
          
          if (response.success) {
            setIsShared(newStatus);
            toast.success(newStatus ? '行程已公開' : '已恢復私人狀態');
            if (onUpdateSuccess) onUpdateSuccess();
          } else {
            throw new Error(response.message || '操作失敗');
          }
        } catch (error) {
          console.error('Toggle share error:', error);
          toast.error('操作失敗', error.message);
        } finally {
          setIsShareLoading(false);
        }
      }
    });
  };

  const containerClasses = isEmbedded
    ? "flex flex-col justify-start items-center h-auto w-full py-4 sm:py-6 px-3 sm:px-4 bg-transparent animate__animated animate__fadeIn"
    : "flex flex-col justify-start items-center h-auto w-full lg:w-[450px] border border-white/10 rounded-3xl py-8 sm:py-12 px-5 sm:px-8 flex-shrink-0 bg-white/5 backdrop-blur-3xl shadow-2xl animate__animated animate__fadeInRight";

  return (
    <div className={containerClasses}>
      <h3 className={`${isEmbedded ? 'mb-6 sm:mb-8 text-2xl sm:text-3xl' : 'mb-8 sm:mb-10 text-3xl sm:text-4xl'} font-black text-neongreen text-center tracking-tighter uppercase italic px-4`}>
        {isEmbedded ? '編輯行程細節' : '行程細節編輯'}
      </h3>
      
      {/* 行程標題 */}
      <div className="w-full mb-5 sm:mb-6">
        <label className="flex items-center mb-2 sm:mb-3 text-[10px] sm:text-xs font-black text-neongreen/80 uppercase tracking-[0.3em] pl-2">
          <div className="w-1.5 h-1.5 bg-neongreen rounded-full mr-2 sm:mr-3 shadow-[0_0_8px_#39FF14]"></div>
          行程標題
        </label>
        <input
          type="text"
          name="trip_title"
          className="w-full bg-white/5 text-white border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 sm:p-5 focus:border-neongreen/50 focus:bg-white/10 transition-all duration-300 outline-none text-base sm:text-lg shadow-inner"
          placeholder="輸入行程名稱..."
          value={formData.trip_title}
          onChange={handleChange}
        />
      </div>

      {/* 規劃日期 */}
      <div className="w-full mb-6 sm:mb-8">
        <label className="flex items-center mb-2 sm:mb-3 text-[10px] sm:text-xs font-black text-neongreen/80 uppercase tracking-[0.3em] pl-2">
          <div className="w-1.5 h-1.5 bg-neongreen rounded-full mr-2 sm:mr-3 shadow-[0_0_8px_#39FF14]"></div>
          規劃日期
        </label>
        <input
          type="date"
          name="trip_date"
          className="w-full bg-white/5 text-white border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 sm:p-5 focus:border-neongreen/50 focus:bg-white/10 transition-all duration-300 outline-none text-base sm:text-lg shadow-inner color-scheme-dark"
          value={formData.trip_date}
          onChange={handleChange}
        />
      </div>

      {/* 公開分享切換 */}
      <div className="w-full mb-6 sm:mb-8 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between group/share hover:border-neongreen/30 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isShared ? 'bg-neongreen shadow-[0_0_20px_rgba(57,255,20,0.4)]' : 'bg-white/5 border border-white/10'}`}>
            {isShared ? (
              <FaGlobe className="text-black text-xl sm:text-2xl animate-spin-slow" />
            ) : (
              <FaLock className="text-white/40 text-lg sm:text-xl" />
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm sm:text-base font-black uppercase tracking-tight ${isShared ? 'text-neongreen' : 'text-white/80'}`}>
              {isShared ? '行程已公開' : '私人存檔中'}
            </span>
            <span className="text-[9px] sm:text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
              {isShared ? 'Publicly Shared' : 'Private Mode'}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleShare}
          disabled={isShareLoading}
          className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-all duration-500 ${isShared ? 'bg-neongreen shadow-[0_0_15px_rgba(57,255,20,0.5)]' : 'bg-white/10 border border-white/20'}`}
        >
          <div className={`absolute top-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition-all duration-500 shadow-lg ${isShared ? 'left-8 sm:left-9 scale-110' : 'left-1'}`}>
            {isShareLoading && (
              <div className="absolute inset-0 border-2 border-neongreen/30 border-t-neongreen rounded-full animate-spin"></div>
            )}
          </div>
        </button>
      </div>

      <div className="w-full mb-5 sm:mb-6">
        <label className="flex items-center mb-2 sm:mb-3 text-[10px] sm:text-xs font-black text-neongreen/80 uppercase tracking-[0.3em] pl-2">
          <div className="w-1.5 h-1.5 bg-neongreen rounded-full mr-2 sm:mr-3 shadow-[0_0_8px_#39FF14]"></div>
          行程描述
        </label>
        <textarea
          name="trip_description"
          className="w-full h-24 sm:h-32 bg-white/5 text-white border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 focus:border-neongreen/50 focus:bg-white/10 transition-all duration-300 outline-none text-base sm:text-lg leading-relaxed resize-none shadow-inner"
          placeholder="分享這趟行程的精彩之處..."
          value={formData.trip_description}
          onChange={handleChange}
        />
      </div>
      
      <div className="w-full mb-8 sm:mb-10 flex-grow">
        <label className="flex items-center mb-2 sm:mb-3 text-[10px] sm:text-xs font-black text-neongreen/80 uppercase tracking-[0.3em] pl-2">
          <div className="w-1.5 h-1.5 bg-neongreen rounded-full mr-2 sm:mr-3 shadow-[0_0_8px_#39FF14]"></div>
          行程筆記 <span className="ml-2 text-[9px] sm:text-[10px] text-white/30 font-medium normal-case tracking-normal">(僅自己可見)</span>
        </label>
        <textarea
          name="trip_notes"
          className="w-full h-32 sm:h-44 bg-white/5 text-white border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 focus:border-neongreen/50 focus:bg-white/10 transition-all duration-300 outline-none text-base sm:text-lg leading-relaxed resize-none shadow-inner"
          placeholder="記下私人提醒，例如預約編號或特別叮嚀..."
          value={formData.trip_notes}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`group relative flex items-center justify-center w-full bg-neongreen hover:bg-white text-black font-black text-lg sm:text-xl py-4 sm:py-6 rounded-xl sm:rounded-2xl transition-all duration-500 shadow-[0_10px_30px_rgba(57,255,20,0.3)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)] overflow-hidden ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <span className="relative z-10 tracking-widest uppercase">{isSaving ? '正在儲存...' : '儲存行程變更'}</span>
        {!isSaving && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>}
      </button>
      
      <p className="mt-4 sm:mt-6 text-white/20 text-[9px] sm:text-[10px] text-center font-bold uppercase tracking-[0.4em]">
        SYNCED: {new Date().toLocaleTimeString()}
      </p>

      <style jsx>{`
        .color-scheme-dark {
          color-scheme: dark;
        }
        :global(body.swal2-shown) {
          padding-right: 0 !important;
        }
      `}</style>
    </div>
  );
}
