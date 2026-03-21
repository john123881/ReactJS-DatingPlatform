import { apiClient } from './api-client';
import {
  ACCOUNT_COLLECT_POST,
  ACCOUNT_COLLECT_POST_DELETE,
  ACCOUNT_COLLECT_BAR,
  ACCOUNT_COLLECT_BAR_DELETE,
  ACCOUNT_COLLECT_MOVIE,
  ACCOUNT_COLLECT_MOVIE_DELETE,
} from '@/configs/api-config';

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

  getCollectList: (sid) =>
    apiClient(sid ? `/account/collect-list/${sid}` : '/account/collect-list'),

  /**
   * 收藏管理 - POST
   */
  collectPost: {
    get: (sid, query = '') =>
      apiClient(`${ACCOUNT_COLLECT_POST}/${sid}${query}`),
    delete: (saveId) => apiClient.delete(`${ACCOUNT_COLLECT_POST_DELETE}/${saveId}`),
  },

  /**
   * 收藏管理 - BAR
   */
  collectBar: {
    get: (sid, query = '') => apiClient(`${ACCOUNT_COLLECT_BAR}/${sid}${query}`),
    delete: (saveId) => apiClient.delete(`${ACCOUNT_COLLECT_BAR_DELETE}/${saveId}`),
  },

  /**
   * 收藏管理 - MOVIE
   */
  collectMovie: {
    get: (sid, query = '') =>
      apiClient(`${ACCOUNT_COLLECT_MOVIE}/${sid}${query}`),
    delete: (saveId) =>
      apiClient.delete(`${ACCOUNT_COLLECT_MOVIE_DELETE}/${saveId}`),
  },
};
