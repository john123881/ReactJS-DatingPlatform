import { useState, useEffect, useRef } from 'react';
import { TripService } from '@/services/trip-service';
import { BarService } from '@/services/bar-service';
import { BookingService } from '@/services/booking-service';
import { FaCirclePlus, FaMagnifyingGlass, FaXmark, FaWineGlass, FaFilm } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';

export default function InPlaceSearch({ 
  trip_plan_id, 
  block, 
  refreshTripDetails, 
  refreshAllDetails,
  className = "" 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [category, setCategory] = useState('bar'); // 'bar' | 'movie'
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // 監聽點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 搜尋關鍵字邏輯
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        let data = [];
        if (category === 'bar') {
          data = await BarService.searchBars(searchTerm);
        } else {
          data = await BookingService.searchMovies(searchTerm);
        }
        setResults(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category]);

  // 加入行程邏輯
  const handleSelectItem = async (item) => {
    if (!trip_plan_id) return;
    
    const loadingToast = toast.loading('正在加入行程...');
    try {
      // 1. 建立 Block (取得 trip_detail_id)
      let blockResult;
      if (block === 1) blockResult = await TripService.addMorningBlock(trip_plan_id);
      else if (block === 2) blockResult = await TripService.addNoonBlock(trip_plan_id);
      else blockResult = await TripService.addNightBlock(trip_plan_id);

      const trip_detail_id = blockResult.trip_detail_id || blockResult.insertId || blockResult.id;
      
      if (!trip_detail_id) throw new Error('無法建立行程區塊');

      // 2. 將項目填入該 ID
      const addData = {
        trip_detail_id,
        [category === 'bar' ? 'bar_id' : 'movie_id']: item[category === 'bar' ? 'bar_id' : 'movie_id']
      };

      const finalResult = category === 'bar' 
        ? await TripService.addBarToTrip(addData)
        : await TripService.addMovieToTrip(addData);

      if (finalResult.success) {
        toast.success(`已加入：${item[category === 'bar' ? 'bar_name' : 'title']}`, { id: loadingToast });
        setIsExpanded(false);
        setSearchTerm('');
        refreshTripDetails();
        if (refreshAllDetails) refreshAllDetails();
      } else {
        throw new Error(finalResult.message || '加入失敗');
      }
    } catch (error) {
      console.error('Add item error:', error);
      toast.error(`加入失敗：${error.message}`, { id: loadingToast });
    }
  };

  return (
    <div ref={searchRef} className={`relative ${isExpanded ? 'z-[100]' : 'z-10'} ${className}`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-center gap-4 w-full sm:w-auto min-w-[280px] h-auto p-5 sm:p-6 bg-black/40 backdrop-blur-3xl border border-dashed border-white/20 rounded-2xl sm:rounded-3xl hover:border-neongreen/40 hover:bg-neongreen/5 transition-all duration-500 group shadow-lg"
        >
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-neongreen/20 transition-colors duration-500">
            <FaCirclePlus className="text-2xl text-white/40 group-hover:text-neongreen group-hover:rotate-90 transition-all duration-500" />
          </div>
          <div className="flex flex-col items-start translate-y-[-1px]">
            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-neongreen transition-colors">Add Activity</span>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.1em]">Enhance your itinerary</span>
          </div>
        </button>
      ) : (
        <div className="flex flex-col gap-3 w-full sm:w-[400px] animate__animated animate__fadeInDown">
          {/* 切換與搜尋框 */}
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-1 mb-2 bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setCategory('bar')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${category === 'bar' ? 'bg-neongreen text-black shadow-[0_0_15px_#39FF14]' : 'text-white/40 hover:bg-white/5'}`}
              >
                <FaWineGlass className={category === 'bar' ? 'animate-bounce' : ''} /> Bar
              </button>
              <button 
                onClick={() => setCategory('movie')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${category === 'movie' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'text-white/40 hover:bg-white/5'}`}
              >
                <FaFilm className={category === 'movie' ? 'animate-bounce' : ''} /> Movie
              </button>
            </div>
            
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
              <input 
                autoFocus
                type="text"
                placeholder={category === 'bar' ? "搜尋酒吧名稱..." : "搜尋電影標題..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-neongreen/50 transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                  <FaXmark />
                </button>
              )}
            </div>
          </div>

          {/* 搜尋結果 */}
          {(searchTerm.trim() !== '' || isLoading) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,1)] animate__animated animate__fadeIn">
              {isLoading ? (
                <div className="p-8 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-neongreen border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Searching...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col">
                  {results.map((item) => (
                    <button
                      key={item[category === 'bar' ? 'bar_id' : 'movie_id']}
                      onClick={() => handleSelectItem(item)}
                      className="flex items-center gap-4 p-4 hover:bg-white/10 transition-colors border-b border-white/5 last:border-none group/result"
                    >
                      <img 
                        src={category === 'bar' ? `/barPic/${item.bar_pic_name}` : `/movie_img/${item.poster_img}`}
                        alt=""
                        className="w-12 h-16 rounded-lg object-cover border border-white/10 group-hover/result:border-neongreen/50 transition-colors shadow-lg"
                        onError={(e) => e.target.src = '/unavailable-image.jpg'}
                      />
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-white text-sm font-bold truncate w-full group-hover/result:text-neongreen transition-colors">
                          {item[category === 'bar' ? 'bar_name' : 'title']}
                        </span>
                        <span className="text-white/40 text-[10px] uppercase tracking-wider">
                          {category === 'bar' ? item.bar_area_name : item.movie_type}
                        </span>
                      </div>
                      <div className="ml-auto opacity-0 group-hover/result:opacity-100 transition-opacity">
                        <FaCirclePlus className="text-neongreen text-lg" />
                      </div>
                    </button>
                  ))}
                  <div className="p-3 bg-white/5 text-center">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">End of search records</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-white/40 text-sm italic">未找到相關結果 :P</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
