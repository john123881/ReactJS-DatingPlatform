import { apiClient } from './api-client';

export const BarService = {
  /**
   * 獲取酒吧列表 (可選篩選條件)
   * @param {object} params - { bar_area_id, bar_type_id }
   */
  getBars: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/bar/bar-list?${query}` : '/bar/bar-list';
    return apiClient(endpoint);
  },

  /**
   * 獲取隨機酒吧列表
   */
  getRandomBars: () => apiClient('/bar/bar-list-radom'),

  /**
   * 搜尋酒吧
   * @param {string} searchTerm
   */
  searchBars: (searchTerm) =>
    apiClient(`/bar/search-bars?searchTerm=${searchTerm}`),

  /**
   * 獲取酒吧詳情
   * @param {string|number} barId
   */
  getBarDetail: (barId) => apiClient(`/bar/bar-detail/${barId}`),

  // --- 分類與區域 ---

  /**
   * 獲取所有酒吧類型
   */
  getBarTypes: () => apiClient('/bar/bar-type'),

  /**
   * 獲取所有區域
   */
  getBarAreas: () => apiClient('/bar/bar-area'),

  /**
   * 依分類獲取酒吧 (特定分類)
   * @param {string} category - sport, music, foreign, specialty, others
   * @param {object} params - { area }
   */
  getBarsByCategory: (category, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/bar/bar-list-${category}?${query}` : `/bar/bar-list-${category}`;
    return apiClient(endpoint);
  },

  // --- 評分相關 ---

  /**
   * 獲取酒吧評分列表
   * @param {string|number} barId
   */
  getBarRatings: (barId) => apiClient(`/bar/bar-rating/${barId}`),

  /**
   * 獲取酒吧平均評分
   * @param {string|number} barId
   */
  getAverageRating: (barId) => apiClient(`/bar/bar-rating-average/${barId}`),

  /**
   * 新增評分
   * @param {object} data - { bar_id, bar_rating_star, user_id }
   */
  addRating: (data) => apiClient.post('/bar/bar-rating', data),

  // --- 訂位相關 ---

  /**
   * 獲取用戶的訂位列表
   * @param {string|number} userId
   */
  getUserBookings: (userId) => apiClient(`/bar/bar-booking-list/${userId}`),

  /**
   * 獲取指定酒吧的訂位 (管理用)
   * @param {string|number} barId
   */
  getBarBookings: (barId) => apiClient(`/bar/bar-booking/${barId}`),

  /**
   * 建立新訂位
   * @param {object} data - { user_id, bar_id, bar_booking_time, bar_booking_people_num, bar_time_slot_id }
   */
  createBooking: (data) => apiClient.post('/bar/bar-booking', data),

  // --- 收藏相關 ---

  /**
   * 檢查酒吧是否已收藏
   * @param {string|number} userId
   * @param {string} barIds - 逗號分隔的 ID 字串
   */
  checkBarStatus: (userId, barIds) =>
    apiClient(`/bar/check-bar-status?userId=${userId}&barIds=${barIds}`),

  /**
   * 收藏酒吧
   * @param {string|number} userId
   * @param {string|number} barId
   */
  saveBar: (userId, barId) =>
    apiClient.post('/bar/saved-bar', { userId, barId }),

  /**
   * 取消收藏酒吧
   * @param {string|number} userId
   * @param {string|number} barId
   */
  unsaveBar: (userId, barId) =>
    apiClient.delete('/bar/unsaved-bar', { body: { userId, barId } }),
};
