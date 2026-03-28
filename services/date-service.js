import { apiClient } from './api-client';

export const DateService = {
  /**
   * 獲取酒吧類型
   */
  getBarTypes: () => apiClient('/date/bar_type/api'),

  /**
   * 獲取電影類型
   */
  getMovieTypes: () => apiClient('/date/booking_movie_type/api'),

  /**
   * 獲取好友列表 (基於興趣)
   * @param {string|number} userId
   * @param {string|number} barTypeId
   * @param {string|number} movieTypeId
   */
  getRecommendedFriends: (userId, barTypeId, movieTypeId) =>
    apiClient(`/date/friends-list/${userId}/${barTypeId}/${movieTypeId}`),

  /**
   * 編輯感興趣的酒吧類型
   * @param {object} data
   */
  editBarInterest: (data) =>
    apiClient.put('/date/user_interest/edit_bar_type', data),

  /**
   * 編輯感興趣的電影類型
   * @param {object} data
   */
  editMovieInterest: (data) =>
    apiClient.put('/date/user_interest/edit_movie_type', data),

  /**
   * 根據發送者 ID 獲取好友關係訊息
   * @param {string|number} senderId
   */
  getMessagesBySender: (senderId) =>
    apiClient(`/date/friendships_message/sender_id/${senderId}`),

  /**
   * 獲取特定好友關係的訊息
   * @param {string|number} friendshipId
   */
  getFriendshipMessages: (friendshipId) =>
    apiClient(`/date/friendships_message/${friendshipId}`),

  /**
   * 發送新訊息
   * @param {object} messageData
   */
  sendMessage: (messageData) =>
    apiClient.post('/date/friendships_message/api', messageData),

  /**
   * 上傳圖片訊息
   * @param {FormData} formData
   */
  sendImageMessage: (formData) =>
    apiClient.post('/date/friendships_message/uploadImg/api', formData, {
      headers: { 'Content-Type': undefined },
    }),

  /**
   * 修改好友狀態 (接受/拒絕等)
   * @param {object} data - { user_id1, user_id2, friendship_status }
   */
  editFriendshipStatus: (data) =>
    apiClient.post('/date/friends-list/edit', data),

  /**
   * 發送好友邀請
   * @param {object} data - { user_id1, user_id2, friendship_status }
   */
  sendFriendRequest: (data) => apiClient.post('/date/friends-list', data),

  /**
   * 獲取已接受的好友列表
   * @param {string|number} userId
   */
  getAcceptedFriends: (userId) =>
    apiClient(`/date/friends-list/accepted/${userId}`),
};
