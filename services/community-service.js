import { apiClient } from './api-client';

export const CommunityService = {
  // --- User Info ---
  getUserInfo: (userId) => apiClient(`/community/get-userInfo/${userId}`),
  searchUsers: (searchTerm) => apiClient(`/community/search-users?searchTerm=${searchTerm}`),

  // --- Posts ---
  getPosts: (page = 1, limit = 12) => apiClient(`/community/posts?page=${page}&limit=${limit}`),
  getPostsByKeyword: (keyword, page = 1, limit = 12) => 
    apiClient(`/community/get-posts-by-keyword?keyword=${keyword}&page=${page}&limit=${limit}`),
  getRandomPosts: (page = 1, limit = 12) => 
    apiClient(`/community/get-random-posts?page=${page}&limit=${limit}`),
  getPostDetail: (postId) => apiClient(`/community/get-post-page/${postId}`),
  createPost: (data) => apiClient.post('/community/create-post', data),
  updatePost: (data) => apiClient.put('/community/edit-post', data),
  deletePost: (postId) => apiClient.delete('/community/delete-post', { body: { postId } }),
  uploadPostPhoto: (formData) => apiClient.post('/community/upload-photo', formData, {
    headers: { 'Content-Type': undefined }
  }),
  updatePostPhoto: (formData) => apiClient.put('/community/edit-post-photo', formData, {
    headers: { 'Content-Type': undefined }
  }),

  // --- Events ---
  getEvents: (page = 1, limit = 12) => apiClient(`/community/events?page=${page}&limit=${limit}`),
  getEventDetail: (eventId) => apiClient(`/community/get-event-page/${eventId}`),
  createEvent: (data) => apiClient.post('/community/create-event', data),
  updateEvent: (data) => apiClient.put('/community/edit-event', data),
  deleteEvent: (eventId) => apiClient.delete('/community/delete-event', { body: { eventId } }),
  uploadEventPhoto: (formData) => apiClient.post('/community/upload-event-photo', formData, {
    headers: { 'Content-Type': undefined }
  }),
  updateEventPhoto: (formData) => apiClient.put('/community/edit-event-photo', formData, {
    headers: { 'Content-Type': undefined }
  }),

  // --- Comments ---
  getComments: (postIds) => apiClient(`/community/get-comments?postIds=${postIds}`),
  addComment: (data) => apiClient.post('/community/add-comment', data),
  deleteComment: (commentId) => apiClient.delete('/community/delete-comment', { body: { commentId } }),

  // --- Social Interactions ---
  checkPostStatus: (userId, postIds) => 
    apiClient(`/community/check-post-status?userId=${userId}&postIds=${postIds}`),
  checkEventStatus: (userId, eventIds) => 
    apiClient(`/community/check-event-status?userId=${userId}&eventIds=${eventIds}`),
  checkFollowStatus: (userId, followingId) => 
    apiClient(`/community/check-follow-status?userId=${userId}&followingId=${followingId}`),
    
  likePost: (userId, postId) => apiClient.post('/community/like-post', { userId, postId }),
  unlikePost: (userId, postId) => apiClient.delete('/community/unlike-post', { body: { userId, postId } }),
  
  attendEvent: (userId, eventId) => apiClient.post('/community/attend-event', { userId, eventId }),
  notAttendEvent: (userId, eventId) => apiClient.delete('/community/notattend-event', { body: { userId, eventId } }),
  
  savePost: (userId, postId) => apiClient.post('/community/save-post', { userId, postId }),
  unsavePost: (userId, postId) => apiClient.delete('/community/unsave-post', { body: { userId, postId } }),
  
  followUser: (userId, FollowingId) => apiClient.post('/community/follow', { userId, FollowingId }),
  unfollowUser: (userId, FollowingId) => apiClient.delete('/community/unfollow', { body: { userId, FollowingId } }),
};
