import { useState, useEffect, useCallback } from 'react';
import { BarService } from '@/services/bar-service';
import Head from 'next/head';
import Loader from '@/components/ui/loader/loader';
import BarLayout from '@/components/bar/layout/bar-layout';
import BarMapContainer from '@/components/bar/bar/bar-map-container';
import BarFloatingCard from '@/components/bar/card/bar-floating-card';
import { useAuth } from '@/context/auth-context';

export default function BarMap({ onPageChange }) {
  const { auth } = useAuth();
  const [bars, setBars] = useState([]);
  const [savedBars, setSavedBars] = useState({});
  const [isCheckingSaved, setIsCheckingSaved] = useState(true);
  const [selectedBar, setSelectedBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageTitle = '酒吧地圖';

  // 檢查儲存狀態
  const checkBarsStatus = useCallback(async (barIds) => {
    const userId = auth.id;
    if (userId === 0 || !barIds) return;
    try {
      setIsCheckingSaved(true);
      const data = await BarService.checkBarStatus(userId, barIds);
      const savedMap = {};
      data.forEach(status => {
        savedMap[status.barId] = status.isSaved;
      });
      setSavedBars(savedMap);
    } catch (error) {
      console.error('Failed to fetch bar categories status:', error);
    } finally {
      setIsCheckingSaved(false);
    }
  }, [auth.id]);

  useEffect(() => {
    // 同步 Navbar 標題
    if (onPageChange) {
      onPageChange(pageTitle);
    }

    const fetchBars = async () => {
      try {
        setLoading(true);
        const response = await BarService.getBars();
        if (response.success) {
          setBars(response.data);
          
          // 獲取所有酒吧 ID 並檢查狀態
          const barIds = response.data.map(b => b.bar_id || b.id).join(',');
          if (barIds && auth.id !== 0) {
            checkBarsStatus(barIds);
          }
        }
      } catch (error) {
        console.error('Failed to fetch bars for map:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, [onPageChange, checkBarsStatus, auth.id]);

  const handleMarkerClick = (bar) => {
    setSelectedBar(bar);
  };

  const handleCloseCard = () => {
    setSelectedBar(null);
  };

  return (
    <BarLayout title={pageTitle}>
      <main className="relative bg-black min-h-[calc(100vh-64px)]">
        {loading ? (
          <Loader minHeight="80vh" text="正在繪製微醺地圖..." />
        ) : (
          <div className="relative h-[calc(100vh-64px-44px)]">
            <BarMapContainer 
              bars={bars} 
              savedBars={savedBars}
              isCheckingSaved={isCheckingSaved}
              onMarkerClick={handleMarkerClick} 
            />
            
            {/* 透明遮罩與浮動卡片 */}
            {selectedBar && (
              <BarFloatingCard 
                bar={selectedBar} 
                onClose={handleCloseCard} 
              />
            )}
            
            {/* 地圖標誌懸浮 */}
            <div className="absolute top-8 left-6 z-10 hidden md:block pointer-events-none">
              <h1 className="text-3xl font-black text-neon-green drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                TAIPEI BAR MAP
              </h1>
              <p className="text-white/60 text-sm">探索台北最驚喜的微醺角落</p>
            </div>
          </div>
        )}
      </main>
    </BarLayout>
  );
}
