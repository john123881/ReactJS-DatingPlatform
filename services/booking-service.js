import { apiClient } from './api-client';
import {
  BOOKING_INDEX_MOVIE_LIST,
  BOOKING_MOVIE_LIST,
  BOOKING_CHECK_MOVIE_STATUS,
  BOOKING_SAVE_MOVIE,
  BOOKING_UNSAVE_MOVIE,
  BOOKING_SEARCH_MOVIES,
  BOOKING_MOVIE_DETAIL,
  BOOKING_GET_BOOKING_SYSTEM,
} from '@/configs/api-config';

export const BookingService = {
  /**
   * 獲取用戶訂票系統資訊
   */
  getBookingSystem: () => apiClient(BOOKING_GET_BOOKING_SYSTEM),

  /**
   * 獲取首頁電影卡片列表
   */
  getIndexMovies: () => apiClient(BOOKING_INDEX_MOVIE_LIST),

  /**
   * 獲取電影清單
   */
  getMovieList: () => apiClient(BOOKING_MOVIE_LIST),

  /**
   * 搜尋電影
   */
  searchMovies: (searchTerm) =>
    apiClient(`${BOOKING_SEARCH_MOVIES}?searchTerm=${searchTerm}`),

  /**
   * 獲取電影詳情
   * @param {string|number} mid
   */
  getMovieDetail: (mid) => apiClient(`${BOOKING_MOVIE_DETAIL}/${mid}`),

  /**
   * 檢查電影收藏狀態
   * @param {string|number} userId
   * @param {string} movieIds - 逗號分隔的 ID 字串
   */
  checkMovieStatus: (userId, movieIds) =>
    apiClient(
      `${BOOKING_CHECK_MOVIE_STATUS}?userId=${userId}&movieIds=${movieIds}`,
    ),

  /**
   * 收藏電影
   * @param {string|number} userId
   * @param {string|number} movieId
   */
  saveMovie: (userId, movieId) =>
    apiClient.post(BOOKING_SAVE_MOVIE, { userId, movieId }),

  /**
   * 取消收藏電影
   * @param {string|number} userId
   * @param {string|number} movieId
   */
  unsaveMovie: (userId, movieId) =>
    apiClient.delete(BOOKING_UNSAVE_MOVIE, { body: { userId, movieId } }),
};
