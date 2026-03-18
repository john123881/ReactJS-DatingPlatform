import { apiClient } from './api-client';

export const BookingService = {
  /**
   * 獲取首頁電影卡片列表
   */
  getIndexMovies: () => apiClient('/booking/index-movie-list'),

  /**
   * 獲取電影詳情
   * @param {string|number} mid
   */
  getMovieDetail: (mid) => apiClient(`/booking/get-movie-detail/${mid}`),
};
