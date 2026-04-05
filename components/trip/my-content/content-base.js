import { useState, useEffect } from 'react';
import BarPhotoMy from './bar-photo-my';
import MoviePhotoMy from './movie-photo-my';
import InPlaceSearch from '../add-trip/in-place-search';

export default function ContentBase({
  trip_plan_id,
  newDetail,
  block,
  fetchMethod,
  NoContentComponent,
  refreshAllDetails,
  setNewDetail,
  barPhotos,
  barNames,
  moviePhotos,
}) {
  const [tripDetailsList, setTripDetailsList] = useState([]);

  useEffect(() => {
    if (newDetail && Array.isArray(newDetail)) {
      const filtered = newDetail.filter(d => d.block === block);
      setTripDetailsList(filtered);
    }
  }, [newDetail, block]);

  const refreshTripDetails = async () => {
    if (refreshAllDetails) {
      await refreshAllDetails();
    }
  };

  // 監聽來自側邊欄或其它組件的「局部重新整理」請求
  useEffect(() => {
    const handleRefresh = (event) => {
      const targetBlock = event.detail?.block;
      if (!targetBlock || String(targetBlock) === String(block)) {
        refreshTripDetails();
      }
    };

    window.addEventListener('trip-detail-refresh', handleRefresh);
    return () => window.removeEventListener('trip-detail-refresh', handleRefresh);
  }, [block, refreshAllDetails]); 

  return (
    <div className="flex flex-col items-center sm:flex-row sm:flex-wrap gap-6 sm:gap-10 justify-center w-full transition-all duration-300 overflow-visible">
      {tripDetailsList.length === 0 ? (
        <NoContentComponent
          trip_plan_id={trip_plan_id}
          refreshTripDetails={refreshTripDetails}
          refreshAllDetails={refreshAllDetails}
        />
      ) : (
        <>
          {tripDetailsList.map((details, index) => {
            // 如果此項目既無電影也無酒吧 ID，視為尚未填充的內容 (幽靈紀錄)
            // 在有列表內容的情況下，我們略過它不在此處顯式渲染 NoContentComponent，
            // 因為末尾已經有一個全局的 InPlaceSearch。
            if (!details.movie_id && !details.bar_id) return null;

            return (
              <div key={details.trip_detail_id || index} className="w-full sm:w-auto flex-shrink transition-transform duration-300 animate__animated animate__fadeInUp">
                {details.movie_id ? (
                  <MoviePhotoMy
                    trip_plan_id={trip_plan_id}
                    tripDetails={details}
                    refreshTripDetails={refreshTripDetails}
                    refreshAllDetails={refreshAllDetails}
                    setNewDetail={setNewDetail}
                    moviePhotos={moviePhotos}
                  />
                ) : (
                  <BarPhotoMy
                    trip_plan_id={trip_plan_id}
                    tripDetails={details}
                    refreshTripDetails={refreshTripDetails}
                    refreshAllDetails={refreshAllDetails}
                    setNewDetail={setNewDetail}
                    barPhotos={barPhotos}
                    barNames={barNames}
                  />
                )}
              </div>
            );
          })}
          {/* 在已有的卡片下方加入一個統一的新增搜尋入口 */}
          <div className="w-full flex items-center justify-center p-4 mt-2">
            <InPlaceSearch 
              trip_plan_id={trip_plan_id}
              block={block}
              refreshTripDetails={refreshTripDetails}
              refreshAllDetails={refreshAllDetails}
            />
          </div>
        </>
      )}
    </div>
  );
}
