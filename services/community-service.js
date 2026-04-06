import { apiClient, uploadFile } from './api-client';
import {
  COMMUNITY_GET_SUGGEST_USERS,
  COMMUNITY_GET_POSTS,
  COMMUNITY_GET_FOLLOWS,
  COMMUNITY_GET_COUNT_POSTS,
  COMMUNITY_GET_COUNT_EVENTS,
  COMMUNITY_GET_USER_INFO,
  COMMUNITY_GET_FOLLOWERS,
  COMMUNITY_GET_FOLLOWINGS,
  COMMUNITY_FOLLOW,
  COMMUNITY_UNFOLLOW,
} from '@/configs/api-config';

export const CommunityService = {
  /**
   * 獲取推薦用戶列表
   */
  getSuggestUsers: () => apiClient(COMMUNITY_GET_SUGGEST_USERS),

  /**
   * 獲取用戶追蹤狀態與計數
   * @param {string|number} uid
   */
  getFollows: (uid) => apiClient(`${COMMUNITY_GET_FOLLOWS}/${uid}`),

  /**
   * 獲取用戶貼文總數
   * @param {string|number} uid
   */
  getCountPosts: (uid) => apiClient(`${COMMUNITY_GET_COUNT_POSTS}/${uid}`),

  getCountEvents: (uid) => apiClient(`${COMMUNITY_GET_COUNT_EVENTS}/${uid}`),

  /**
   * 獲取用戶基本資料
   * @param {string|number} uid
   */
  getUserInfo: (uid) => apiClient(`${COMMUNITY_GET_USER_INFO}/${uid}`),

  /**
   * 獲取用戶的粉絲列表
   * @param {string|number} uid
   */
  getFollowers: (uid) => apiClient(`${COMMUNITY_GET_FOLLOWERS}/${uid}`),

  /**
   * 獲取用戶正在追蹤的列表
   * @param {string|number} uid
   */
  getFollowings: (uid) => apiClient(`${COMMUNITY_GET_FOLLOWINGS}/${uid}`),

  // --- 貼文相關 ---

  getPosts: (page, limit, seed = null) =>
    apiClient(`${COMMUNITY_GET_POSTS}?page=${page}&limit=${limit}${seed !== null ? `&seed=${seed}` : ''}`),

  getPostsByUser: (uid, page, limit) =>
    apiClient(`${COMMUNITY_GET_POSTS}/${uid}?page=${page}&limit=${limit}`),

  getPostsByKeyword: (keyword, page, limit) =>
    apiClient(
      `/community/get-posts-by-keyword?keyword=${keyword}&page=${page}&limit=${limit}`,
    ),

  getRandomPosts: (page, limit, seed = null) =>
    apiClient(`/community/get-random-posts?page=${page}&limit=${limit}${seed !== null ? `&seed=${seed}` : ''}`),

  getPostDetail: (pid) => apiClient(`/community/get-post-page/${pid}`),

  checkPostStatus: (userId, postIds) =>
    apiClient(`/community/check-post-status?userId=${userId}&postIds=${postIds}`),

  createPost: (data) => apiClient.post('/community/create-post', data),

  uploadPostPhoto: (formData) => apiClient.post('/community/upload-photo', formData),

  uploadPostPhotoWithProgress: (formData, onProgress) =>
    uploadFile('/community/upload-photo', formData, onProgress),

  updatePost: (data) => apiClient.put('/community/edit-post', data),

  updatePostPhoto: (formData) => apiClient.post('/community/edit-post-photo', formData),

  updatePostPhotoWithProgress: (formData, onProgress) =>
    uploadFile('/community/edit-post-photo', formData, onProgress),

  deletePost: (postId) =>
    apiClient.delete('/community/delete-post', { body: { postId } }),

  // --- 評論相關 ---

  getComments: (postIds) =>
    apiClient(`/community/get-comments?postIds=${postIds}`),

  addComment: (data) => apiClient.post('/community/add-comment', data),

  deleteComment: (commentId) =>
    apiClient.delete('/community/delete-comment', { body: { commentId } }),

  updateComment: (commentId, context) =>
    apiClient.put('/community/edit-comment', { commentId, context }),

  // --- 活動相關 ---

  getEvents: (page, limit, seed = null) =>
    apiClient(`/community/events?page=${page}&limit=${limit}${seed !== null ? `&seed=${seed}` : ''}`),

  getEventDetail: (eid) => apiClient(`/community/get-event-page/${eid}`),

  checkEventStatus: (userId, eventIds) =>
    apiClient(
      `/community/check-event-status?userId=${userId}&eventIds=${eventIds}`,
    ),

  getEventsByUser: (uid, page, limit) =>
    apiClient(`/community/get-user-events/${uid}?page=${page}&limit=${limit}`),

  createEvent: (data) => apiClient.post('/community/create-event', data),

  uploadEventPhoto: (formData) => apiClient.post('/community/upload-event-photo', formData),

  uploadEventPhotoWithProgress: (formData, onProgress) =>
    uploadFile('/community/upload-event-photo', formData, onProgress),

  updateEvent: (data) => apiClient.put('/community/edit-event', data),

  updateEventPhoto: (formData) => apiClient.post('/community/edit-event-photo', formData),

  updateEventPhotoWithProgress: (formData, onProgress) =>
    uploadFile('/community/edit-event-photo', formData, onProgress),

  attendEvent: (userId, eventId) =>
    apiClient.post('/community/attend-event', { userId, eventId }),

  notAttendEvent: (userId, eventId) =>
    apiClient.delete('/community/notattend-event', {
      body: { userId, eventId },
    }),

  deleteEvent: (eventId) =>
    apiClient.delete('/community/delete-event', { body: { eventId } }),

  getParticipants: (eventId) => apiClient(`/community/get-participants/${eventId}`),

  // --- 互動相關 ---

  likePost: (userId, postId) =>
    apiClient.post('/community/like-post', { userId, postId }),

  unlikePost: (userId, postId) =>
    apiClient.delete('/community/unlike-post', { body: { userId, postId } }),

  savePost: (userId, postId) =>
    apiClient.post('/community/save-post', { userId, postId }),

  unsavePost: (userId, postId) =>
    apiClient.delete('/community/unsave-post', { body: { userId, postId } }),

  followUser: (userId, followingId) =>
    apiClient.post(COMMUNITY_FOLLOW, { userId, followingId }),

  unfollowUser: (userId, followingId) =>
    apiClient.delete(COMMUNITY_UNFOLLOW, { body: { userId, followingId } }),

  checkFollowStatus: (userId, followingId) =>
    apiClient(
      `/community/check-follow-status?userId=${userId}&followingId=${followingId}`,
    ),

  searchUsers: (searchTerm) =>
    apiClient(`/community/search-users?searchTerm=${searchTerm}`),

  // --- 通知相關 ---

  getNotifications: (userId) => apiClient(`/community/get-noti/${userId}`),

  markNotiAsRead: (notiId, userId) =>
    apiClient.post(`/community/mark-noti-as-read/${notiId}`, { userId }),
};
