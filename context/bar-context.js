import { useState, createContext, useContext, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';

// 1. 建立context
const BarContext = createContext();

// 2. 建立一個Context Provider元件
export const BarProvider = ({ children }) => {
  const { auth, getAuthHeader } = useAuth();
  const [savedBars, setSavedBars] = useState({});
  
  //收藏酒吧
    // const isSaved = !!savedBars[bar.bar_id];

    const handleSavedClick = async () => {
      if (auth.id == 0) return;
      const barId = bar.bar_id;
      const userId = auth.id; // Ensure user is defined and has an id

      if (!userId) {
        console.error('User ID is undefined or not set');
        return;
      }

      const wasSaved = isSaved;
      const newSavedState = !wasSaved;

      try {
        const url = wasSaved ? '/unsaved-bar' : '/saved-bar';
        const method = wasSaved ? 'DELETE' : 'POST';
        const res = await fetch(`http://localhost:3001/bar${url}`, {
          method: method,
          headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ barId, userId }),
        });
        const data = await res.json();
        if (res.ok) {
          setSavedBars((prev) => ({ ...prev, [barId]: newSavedState }));
          console.log('Save status updated:', data);
        } else {
          throw new Error(data.message || 'Failed to update save status');
        }
      } catch (error) {
        console.error('Error updating save status:', error);
        setError(error.message);
      }
    };
  
  // 確認收藏狀態
  const checkBarsStatus = async (barIds) => {
    const userId = auth.id;

    if (userId === 0) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/bar/check-bar-status?userId=${userId}&barIds=${barIds}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      const data = await response.json();

      // 初始化來存儲所有酒吧的收藏狀態
      const newSavedBars = { ...savedBars };

      // 遍歷從後端獲取的每個貼文的狀態數據
      data.forEach((status) => {
        // 將每個貼文的收藏狀態存儲到 newSavedBars 對象中
        newSavedBars[status.barId] = status.isSaved;
      });

      // 更新 React 狀態以觸發界面更新，以顯示最新的收藏狀態
      setSavedBars(newSavedBars);
    } catch (error) {
      console.error('無法獲取酒吧狀態:', error);
    }
  };
  return (
    <BarContext.Provider value={{ handleSavedClick,checkBarsStatus }}>
      {children}
    </BarContext.Provider>
  );
}
export const useBarContext = () => useContext(BarContext);

