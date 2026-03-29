import { apiClient } from './api-client';
import {
  ACCOUNT_COLLECT_POST,
  ACCOUNT_COLLECT_POST_DELETE,
  ACCOUNT_COLLECT_BAR,
  ACCOUNT_COLLECT_BAR_DELETE,
  ACCOUNT_COLLECT_MOVIE,
  ACCOUNT_COLLECT_MOVIE_DELETE,
  ACCOUNT_GAME_RECORD_POST,
  ACCOUNT_RECORD_POINT_GET,
  ACCOUNT_RECORD_GAME,
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
   * @param {string|number} sid
   * @param {object} data
   */
  changePassword: (sid, data) => apiClient.put(`/account/change-password/${sid}`, data),

  /**
   * 上傳遊戲紀錄
   * @param {string|number} sid
   * @param {object} record - { gameScore, gameTime }
   */
  uploadGameRecord: (sid, record) =>
    apiClient.post(`${ACCOUNT_GAME_RECORD_POST}/${sid}`, record),

  /**
   * 讀取點數紀錄
   */
  getPointRecord: (sid, query = '') => 
    apiClient(`${ACCOUNT_RECORD_POINT_GET}/${sid}${query}`),

  /**
   * 讀取遊戲紀錄
   */
  getGameRecord: (sid, query = '') => 
    apiClient(`${ACCOUNT_RECORD_GAME}/${sid}${query}`),

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
