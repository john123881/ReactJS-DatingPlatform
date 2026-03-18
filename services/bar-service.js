import { apiClient } from './api-client';

export const BarService = {
  /**
   * 獲取酒吧列表
   * @param {object} params - { bar_area_id, bar_type_id }
   */
  getBars: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/bar/bar-list?${query}` : '/bar/bar-list/';
    return apiClient(endpoint);
  },

  /**
   * 搜索酒吧
   * @param {string} searchTerm
   */
  searchBars: (searchTerm) => apiClient(`/bar/search-bars?searchTerm=${searchTerm}`),

  /**
   * 獲取酒吧詳情
   * @param {string|number} barId
   */
  getBarDetail: (barId) => apiClient(`/bar/bar-detail/${barId}`),

  /**
   * 檢查酒吧收藏狀態
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
  saveBar: (userId, barId) => apiClient.post('/bar/saved-bar', { userId, barId }),

  /**
   * 取消收藏酒吧
   * @param {string|number} userId
   * @param {string|number} barId
   */
  unsaveBar: (userId, barId) => apiClient.delete('/bar/unsaved-bar', { body: { userId, barId } }),
};
