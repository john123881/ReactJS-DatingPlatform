import { apiClient } from './api-client';

export const TripService = {
  /**
   * 獲取我的行程列表
   */
  getTripPlans: () => apiClient('/trip/trip-plans'),

  /**
   * 獲取其他人的推薦行程
   */
  getOtherPlans: () => apiClient('/trip/other-plans'),

  /**
   * 獲取單個行程詳情
   * @param {string|number} tripPlanId
   */
  getTripDetail: (tripPlanId) => apiClient(`/trip/other-plans/${tripPlanId}`),

  /**
   * 新增行程
   * @param {object} data
   */
  addTripPlan: (data) => apiClient.post('/trip/trip-plans/add', data),

  /**
   * 刪除行程
   * @param {string|number} tripPlanId
   */
  deleteTripPlan: (tripPlanId) => apiClient.delete(`/trip/trip-plans/delete/${tripPlanId}`),

  /**
   * 獲取行程內容 (早/中/晚)
   * @param {string|number} tripPlanId
   */
  getTripContent: (tripPlanId) => apiClient(`/trip/my-content/${tripPlanId}`),

  /**
   * 獲取特定時段內容 (我的行程)
   */
  getMorningContent: (tripPlanId) => apiClient(`/trip/my-details/morning-content/${tripPlanId}`),
  getNoonContent: (tripPlanId) => apiClient(`/trip/my-details/noon-content/${tripPlanId}`),
  getNightContent: (tripPlanId) => apiClient(`/trip/my-details/night-content/${tripPlanId}`),

  /**
   * 獲取特定時段內容 (別人的行程)
   */
  getOtherMorningContent: (tripPlanId) => apiClient(`/trip/other-details/morning-content/${tripPlanId}`),
  getOtherNoonContent: (tripPlanId) => apiClient(`/trip/other-details/noon-content/${tripPlanId}`),
  getOtherNightContent: (tripPlanId) => apiClient(`/trip/other-details/night-content/${tripPlanId}`),

  /**
   * 行程內容管理
   */
  addBarToTrip: (data) => apiClient.post('/trip/my-details/addbar', data),
  addMovieToTrip: (data) => apiClient.post('/trip/my-details/addmovie', data),

  addMovieToTripBlock: (tripPlanId, data) => apiClient.post(`/trip/my-details/add-movie/${tripPlanId}`, data),
  addBarToTripBlock: (tripPlanId, data) => apiClient.post(`/trip/my-details/add-bar/${tripPlanId}`, data),

  /**
   * 時段區塊管理
   */
  addMorningBlock: (tripPlanId) => apiClient.post(`/trip/my-details/add-morning/${tripPlanId}`),
  addNoonBlock: (tripPlanId) => apiClient.post(`/trip/my-details/add-noon/${tripPlanId}`),
  addNightBlock: (tripPlanId) => apiClient.post(`/trip/my-details/add-night/${tripPlanId}`),

  /**
   * 刪除行程細節
   */
  deleteTripDetail: (tripDetailId) => apiClient.delete(`/trip/my-details/delete/${tripDetailId}`),

  /**
   * 行程內容圖片與名稱
   */
  getBarPhoto: (tripPlanId) => apiClient(`/trip/my-details/bar-photo/${tripPlanId}`),
  getBarName: (tripPlanId) => apiClient(`/trip/my-details/bar-name/${tripPlanId}`),
  getMoviePhoto: (tripPlanId) => apiClient(`/trip/my-details/movie-photo/${tripPlanId}`),

  /**
   * 推薦
   */
  getRecommendBars: () => apiClient('/trip/my-details/recommend/bar'),
  getRecommendMovies: () => apiClient('/trip/my-details/recommend/movie'),

  /**
   * 拿取一整天的行程細節
   */
  getAlldayDetails: (tripPlanId) => apiClient(`/trip/my-details/allday-content/${tripPlanId}`),

  /**
   * 拿取特定行程基本資訊
   */
  getTripPlanInfo: (tripPlanId) => apiClient(`/trip/my-details/trip-plan/${tripPlanId}`),

  /**
   * 將別人的行程加入我的日曆 (含細節)
   */
  addOtherPlan: (data) => apiClient.post('/trip/other-plans/add', data),

  /**
   * 檢查收藏狀態 (行程相關)
   * @param {string|number} userId
   * @param {string} tripId
   */
  checkTripStatus: (userId, tripId) => apiClient(`/trip/check-trip-status?userId=${userId}&tripId=${tripId}`),
};
