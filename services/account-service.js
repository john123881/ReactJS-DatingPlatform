import { apiClient } from './api-client';

export const AccountService = {
  /**
   * 讀取個人資料
   * @param {string|number} sid
   */
  getProfile: (sid) => apiClient(`/account/${sid}`),

  /**
   * 讀取編輯用的個人資料
   * @param {string|number} sid
   */
  getEditProfile: (sid) => apiClient(`/account/edit/${sid}`),

  /**
   * 編輯個人資料
   * @param {string|number} sid
   * @param {object} data
   */
  updateProfile: (sid, data) => apiClient.put(`/account/edit/${sid}`, data),

  /**
   * 上傳大頭照
   * @param {string|number} sid
   * @param {FormData} formData
   */
  uploadAvatar: (sid, formData) => {
    return apiClient.post(`/account/try-upload/${sid}`, formData);
  },

  /**
   * 更改密碼
   * @param {object} data
   */
  changePassword: (data) => apiClient.put('/account/change-password', data),

  /**
   * 上傳遊戲紀錄
   * @param {object} record - { auth_id, gameScore, gameTime }
   */
  uploadGameRecord: (record) =>
    apiClient.post('/account/game-record-upload', record),

  /**
   * 讀取點數紀錄
   */
  getPointRecord: () => apiClient('/account/record-point'),

  /**
   * 讀取遊戲紀錄
   */
  getGameRecord: () => apiClient('/account/record-game'),

  /**
   * 讀取收藏列表 (Navbar 用)
   */
  getCollectList: () => apiClient('/account/collect-list'),

  /**
   * 收藏管理 - POST
   */
  collectPost: {
    get: () => apiClient('/account/collect-post'),
    delete: (data) =>
      apiClient.delete('/account/collect-post-delete', { body: data }),
  },

  /**
   * 收藏管理 - BAR
   */
  collectBar: {
    get: () => apiClient('/account/collect-bar'),
    delete: (data) =>
      apiClient.delete('/account/collect-bar-delete', { body: data }),
  },

  /**
   * 收藏管理 - MOVIE
   */
  collectMovie: {
    get: () => apiClient('/account/collect-movie'),
    delete: (data) =>
      apiClient.delete('/account/collect-movie-delete', { body: data }),
  },
};
