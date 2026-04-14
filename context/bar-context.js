import { useState, createContext, useContext, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '@/configs/api-config';

// 1. 建立context
const BarContext = createContext();

// 2. 建立一個Context Provider元件
export const BarProvider = ({ children }) => {
  const { auth, getAuthHeader } = useAuth();
  const [savedBars, setSavedBars] = useState({});

  const interactingItems = useRef(new Set());

  const handleSavedClick = async (bar) => {
    if (auth.id == 0 || !bar?.bar_id) return;
    const barId = bar.bar_id;
    const userId = auth.id;

    if (interactingItems.current.has(`save-${barId}`)) return;
    interactingItems.current.add(`save-${barId}`);

    const isSaved = !!savedBars[barId];
    const wasSaved = isSaved;
    const newSavedState = !wasSaved;

    try {
      const url = wasSaved ? '/unsaved-bar' : '/saved-bar';
      const method = wasSaved ? 'DELETE' : 'POST';
      const res = await fetch(`${API_BASE_URL}/bar${url}`, {
        method: method,
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ barId, userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSavedBars((prev) => ({ ...prev, [barId]: newSavedState }));
      } else {
        throw new Error(data.message || 'Failed to update save status');
      }
    } catch (error) {
      console.error('Error updating save status:', error);
    } finally {
      interactingItems.current.delete(`save-${barId}`);
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
        `${API_BASE_URL}/bar/check-bar-status?userId=${userId}&barIds=${barIds}`,
        {
          headers: {
            ...getAuthHeader(),
          },
        },
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
    <BarContext.Provider value={{ handleSavedClick, checkBarsStatus }}>
      {children}
    </BarContext.Provider>
  );
};
export const useBarContext = () => useContext(BarContext);
