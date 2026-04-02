import { API_SERVER } from '@/configs/api-config';

/**
 * 取得圖片完整 URL，處理硬編碼 IP 替換與路徑拼接
 * @param {string} url - 原始圖片路徑或網址
 * @param {string} type - 圖片類型 ('avatar' | 'post' | 'event')
 * @returns {string} - 完整可用的網址
 */
export const getImageUrl = (url, type = 'avatar') => {
  if (!url || url === 'undefined' || url === 'null') {
    return type === 'avatar' ? `${API_SERVER}/avatar/defaultAvatar.jpg` : '/unavailable-image.jpg';
  }

  let finalUrl = url;

  // 1. 處理硬編碼的舊 IP 或 localhost 位址 (強化修復)
  // 將舊 IP 119.14.x.x 或 localhost:3001 替換為當前的 API_SERVER
  const legacyHostsRegex = /http:\/\/(119\.14\.\d{1,3}\.\d{1,3}|localhost):3001/g;
  if (legacyHostsRegex.test(finalUrl)) {
    finalUrl = finalUrl.replace(legacyHostsRegex, API_SERVER);
  }

  // 2. 如果已經是完整網址 (http/https) 或 Base64 資料，直接回傳
  if (finalUrl.startsWith('http') || finalUrl.startsWith('data:')) {
    // 額外檢查：如果 API_SERVER 是 https，則強制將回傳的 http 升級為 https (解決 mixed-content)
    if (API_SERVER.startsWith('https') && finalUrl.startsWith('http:')) {
      return finalUrl.replace('http:', 'https:');
    }
    return finalUrl;
  }

  // 3. 處理相對路徑或純檔名，根據類型拼接對應目錄
  let folder = 'avatar';
  if (type === 'post') folder = 'community/post-img';
  if (type === 'event') folder = 'community/event-img';
  if (type === 'chat') folder = 'chat';
  if (type === 'movie') folder = 'movie_img';

  // 確保路徑開頭沒有多餘的斜線
  const cleanUrl = finalUrl.startsWith('/') ? finalUrl.slice(1) : finalUrl;
  
  return `${API_SERVER}/${folder}/${cleanUrl}`;
};

/**
 * 處理圖片載入失敗 (404)，替換為本地預設圖
 * @param {Event} e - 錯誤事件
 * @param {string} type - 圖片類型
 */
export const handleImageError = (e, type = 'avatar') => {
  e.target.onerror = null; // 防止無限迴圈
  e.target.src = type === 'avatar' ? '/unknown-user-image.jpg' : '/unavailable-image.jpg';
};
/**
 * 格式化聊天時間為 HH:mm
 * @param {string} dateStr - 原始日期字串 (ISO 或其他格式)
 * @returns {string} - 格式化後的時間
 */
export const formatChatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    // 檢查是否為有效日期
    if (isNaN(date.getTime())) return dateStr;
    
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch (e) {
    return dateStr;
  }
};
