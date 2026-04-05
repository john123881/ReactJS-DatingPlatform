import { useState, useEffect, useMemo } from 'react';
import { useLoader } from '@/context/use-loader';
import { TripService } from '@/services/trip-service';
import { FaTrash } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function TripMediaBase({
  trip_plan_id,
  tripDetails,
  refreshTripDetails,
  refreshAllDetails,
  setNewDetail,
  type, // 'bar' 或 'movie'
  ContentComponent,
  NoContentComponents = {},
  isOther = false,
  barPhotos = [],
  barNames = [],
  moviePhotos = [],
}) {
  const [showDetails, setShowDetails] = useState(isOther);
  const { open, close } = useLoader();

  // 使用 useMemo 同步計算衍生資料，從預處理過的 props 中直接提取
  const { imageSrc, details, isEmpty } = useMemo(() => {
    if (!tripDetails?.trip_detail_id) {
      return { imageSrc: '', details: {}, isEmpty: true };
    }

    let foundImage = '';
    let foundDetails = {};

    if (type === 'bar') {
      const imageData = barPhotos.find(p => p.trip_detail_id == tripDetails.trip_detail_id);
      const nameData = barNames.find(n => n.trip_detail_id == tripDetails.trip_detail_id);

      if (imageData) {
        foundImage = imageData.processedSrc || '';
      }

      if (nameData) {
        foundDetails = {
          name: nameData.bar_name || '',
          description: nameData.bar_description || '',
        };
      }
    } else {
      const movieData = moviePhotos.find(m => m.trip_detail_id == tripDetails.trip_detail_id);
      if (movieData) {
        foundImage = movieData.processedSrc || '';
        foundDetails = {
          name: movieData.title || '',
          description: movieData.movie_description || '',
        };
      }
    }

    return {
      imageSrc: foundImage,
      details: foundDetails,
      isEmpty: !foundImage && Object.keys(foundDetails).length === 0
    };
  }, [tripDetails, type, barPhotos, barNames, moviePhotos]);

  const handleDelete = async () => {
    if (isOther) return;

    Swal.fire({
      title: '確定要刪除行程嗎？',
      text: '此動作無法還原，該項目將從計畫中永久移除。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認刪除',
      cancelButtonText: '再考慮一下',
      confirmButtonColor: '#ff4d4d', // 霓虹紅
      cancelButtonColor: '#333333',
      background: 'rgba(15, 15, 15, 0.95)',
      color: '#fff',
      backdrop: `rgba(0,0,0,0.8) blur(4px)`,
      customClass: {
        popup: 'border border-white/10 rounded-2xl shadow-2xl',
        title: 'text-xl font-bold pt-4',
        htmlContainer: 'text-gray-400 text-sm pb-2',
        confirmButton: 'rounded-xl px-6 py-2 font-bold',
        cancelButton: 'rounded-xl px-6 py-2 font-bold border border-white/10'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const confirmDelete = await TripService.deleteTripDetail(tripDetails.trip_detail_id);
        if (confirmDelete.success) {
          toast.success('已刪除該行程項目');
          refreshTripDetails();
          if (refreshAllDetails) refreshAllDetails();
        } else {
          toast.error('刪除失敗：' + confirmDelete.message);
        }
      }
    });
  };

  // Fallback 邏輯 (僅限我的行程)
  if (!isOther && isEmpty) {
    const NC = NoContentComponents[tripDetails.block] || NoContentComponents[1];
    if (NC) {
      return (
        <NC
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
          refreshAllDetails={refreshAllDetails}
          trip_detail_id={tripDetails.trip_detail_id}
          isGhost={true}
          setNewDetail={setNewDetail}
        />
      );
    }
  }

  // 如果是他人行程且完全沒資料，這裡可以選擇回傳 null 或空 div (目前保持原樣)
  if (isOther && isEmpty) {
    return <div className="flex gap-2"><ContentComponent imageSrc="" altText="" /></div>;
  }

  return (
    <div
      className="flex flex-col sm:flex-row items-center sm:items-start justify-start w-full max-w-2xl gap-5 sm:gap-8 p-4 sm:p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[24px] sm:rounded-[32px] hover:border-neongreen/40 transition-all duration-500 group/card shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden mx-auto sm:mx-0"
    >
      {/* Background Accent Gradient */}
      <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-neongreen shadow-[0_0_20px_#39FF14] opacity-40 group-hover/card:opacity-100 transition-opacity duration-500"></div>
      
      {/* Delete Button (Only for Owners) */}
      {!isOther && (
        <button 
          onClick={handleDelete}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-black/20 text-white/20 hover:bg-red-500 hover:text-white transition-all duration-300 z-10 opacity-0 group-hover/card:opacity-100"
          title="刪除此項目"
        >
          <FaTrash className="text-sm sm:text-base" />
        </button>
      )}

      <div className="flex-shrink-0 transition-transform duration-700 group-hover/card:scale-110">
        <ContentComponent
          imageSrc={imageSrc}
          altText={details.name}
          onClick={null}
          tripDetails={tripDetails}
          refreshTripDetails={refreshTripDetails}
          refreshAllDetails={refreshAllDetails}
          setNewDetail={setNewDetail}
        />
      </div>
      
      <div className="flex flex-col flex-grow w-full min-w-0 pt-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-3 mb-4">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm ${type === 'bar' ? 'bg-neongreen text-black' : 'bg-white/10 text-white/80 border border-white/10'}`}>
            {type === 'bar' ? 'Bar' : 'Movie'}
          </span>
          <h4 className="text-white text-xl sm:text-3xl font-black tracking-tighter uppercase italic break-words w-full pr-8">
            {details.name || '載入中...'}
          </h4>
        </div>
        
        {details.description && (
          <div className="relative w-full mt-2">
            <div 
              className="text-white/50 text-xs sm:text-[13px] leading-relaxed italic bg-white/5 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/5 transition-colors group-hover/card:text-white/80 break-words text-left relative"
            >
              <span className="text-neongreen/40 text-lg sm:text-xl font-serif absolute -top-1 -left-1">“</span>
              {details.description}
              <span className="text-neongreen/40 text-lg sm:text-xl font-serif absolute -bottom-4 -right-1">”</span>
            </div>
          </div>
        )}
        
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-4">
          <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-neongreen/30 rounded-full animate-pulse shadow-[0_0_5px_#39FF14]"></div>
            <span>Verified Entry</span>
          </div>
          <span className="text-white/10 text-[8px] sm:text-[9px] font-bold">UID: {tripDetails.trip_detail_id}</span>
        </div>
      </div>
    </div>
  );
}
