import { API_SERVER } from '@/configs/api-config';

/**
 * 取得圖片完整 URL，處理硬編碼 IP 替換與路徑拼接
 * @param {string} url - 原始圖片路徑或網址
 * @param {string} type - 圖片類型 ('avatar' | 'post' | 'event')
 * @returns {string} - 完整可用的網址
 */
export const getImageUrl = (url, type = 'avatar') => {
  if (!url) {
    return type === 'avatar' ? '/unknown-user-image.jpg' : '/unavailable-image.jpg';
  }

  let finalUrl = url;

  // 1. 處理硬編碼的舊 IP 位址 (強化修復)
  // 使用正則表達式匹配 119.14.x.x 系列的硬編碼網址並替換為當前的 API_SERVER
  const ipRegex = /http:\/\/119\.14\.\d{1,3}\.\d{1,3}:3001/g;
  if (ipRegex.test(finalUrl)) {
    finalUrl = finalUrl.replace(ipRegex, API_SERVER);
  }

  // 2. 如果已經是完整網址 (http/https)，直接回傳
  if (finalUrl.startsWith('http')) {
    return finalUrl;
  }

  // 3. 處理相對路徑或純檔名，根據類型拼接對應目錄
  let folder = 'avatar';
  if (type === 'post') folder = 'community/post-img';
  if (type === 'event') folder = 'community/event-img';

  // 確保路徑開頭沒有多餘的斜線
  const cleanUrl = finalUrl.startsWith('/') ? finalUrl.slice(1) : finalUrl;
  
  return `${API_SERVER}/${folder}/${cleanUrl}`;
};
