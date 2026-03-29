// --- 伺服器設定 ---
export const API_SERVER =
  process.env.NEXT_PUBLIC_API_URL || 'https://taipei-date-node.onrender.com';
export const API_BASE_URL = API_SERVER;
export const SOCKET_SERVER =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'https://taipei-date-node.onrender.com';

// --- 會員與認證 (Account) ---
// 登入與授權
export const CHECK_AUTH = `${API_SERVER}/login-check`; // GET
export const LOGIN_POST = `${API_SERVER}/login`; // POST: email, password
export const GOOGLE_LOGIN = `${API_SERVER}/google-login`; // POST

// 註冊與密碼找回 (OTP)
export const SENDOTP_POST = `${API_SERVER}/register-send-otp`; // POST: email
export const REGISTER_POST = `${API_SERVER}/register`; // POST: username, email, validCode, password
export const SENDOTP_FORGETPWD_POST = `${API_SERVER}/forget-password-send-otp`; // POST: email
export const FORGETPWD_PUT = `${API_SERVER}/forget-password-edit`; // PUT: validCode, email, password, confirmPassword

// 個人資料管理
export const ACCOUNT_GET = `${API_SERVER}/account`; // GET
export const ACCOUNT_EDIT_GET = `${API_SERVER}/account/edit`; // GET
export const ACCOUNT_EDIT_PUT = `${API_SERVER}/account/edit`; // PUT
export const ACCOUNT_EDIT_AVATAR_PUT = `${API_SERVER}/account/try-upload`; // PUT
export const ACCOUNT_CHANGE_PWD_PUT = `${API_SERVER}/account/change-password`; // PUT

// 遊戲與積分紀錄
export const ACCOUNT_GAME_RECORD_POST = `${API_SERVER}/account/game-record-upload`; // POST: auth_id, gameScore, gameTime
export const ACCOUNT_RECORD_POINT_GET = `${API_SERVER}/account/record-point`; // GET
export const ACCOUNT_RECORD_GAME = `${API_SERVER}/account/record-game`; // GET

// 個人收藏 (Collections)
export const ACCOUNT_COLLECT_LIST_GET = `${API_SERVER}/account/collect-list`; // GET: Navbar收藏列表
export const ACCOUNT_COLLECT_POST = `${API_SERVER}/account/collect-post`; // GET
export const ACCOUNT_COLLECT_POST_DELETE = `${API_SERVER}/account/collect-post-delete`; // DELETE
export const ACCOUNT_COLLECT_BAR = `${API_SERVER}/account/collect-bar`; // GET
export const ACCOUNT_COLLECT_BAR_DELETE = `${API_SERVER}/account/collect-bar-delete`; // DELETE
export const ACCOUNT_COLLECT_MOVIE = `${API_SERVER}/account/collect-movie`; // GET
export const ACCOUNT_COLLECT_MOVIE_DELETE = `${API_SERVER}/account/collect-movie-delete`; // DELETE

// --- 社群 (Community) ---
export const COMMUNITY_GET_SUGGEST_USERS = `${API_SERVER}/community/getSuggestUsers`;
export const COMMUNITY_GET_POSTS = `${API_SERVER}/community/posts`;
export const COMMUNITY_GET_FOLLOWS = `${API_SERVER}/community/get-follows`;
export const COMMUNITY_GET_COUNT_POSTS = `${API_SERVER}/community/get-count-posts`;
export const COMMUNITY_GET_USER_INFO = `${API_SERVER}/community/get-userInfo`;
export const COMMUNITY_GET_FOLLOWERS = `${API_SERVER}/community/get-followers`;
export const COMMUNITY_GET_FOLLOWINGS = `${API_SERVER}/community/get-followings`;
export const COMMUNITY_FOLLOW = `${API_SERVER}/community/follow`;
export const COMMUNITY_UNFOLLOW = `${API_SERVER}/community/unfollow`;

// --- 電影訂票 (Booking) ---
export const BOOKING_INDEX_MOVIE_LIST = `${API_SERVER}/booking/index-movie-list`;
export const BOOKING_MOVIE_LIST = `${API_SERVER}/booking/movie-list`;
export const BOOKING_CHECK_MOVIE_STATUS = `${API_SERVER}/booking/check-movie-status`;
export const BOOKING_SAVE_MOVIE = `${API_SERVER}/booking/save-movie`;
export const BOOKING_UNSAVE_MOVIE = `${API_SERVER}/booking/unsave-movie`;
export const BOOKING_SEARCH_MOVIES = `${API_SERVER}/booking/search-movies`;
export const BOOKING_MOVIE_DETAIL = `${API_SERVER}/booking/get-movie-detail`;
export const BOOKING_GET_BOOKING_SYSTEM = `${API_SERVER}/booking/get-booking-system`;
export const BOOKING_DELETE_MOVIE_BOOKING = `${API_SERVER}/booking/delete-movie-booking`;

// --- 酒吧 (Bar) ---
export const BAR_DELETE_BOOKING = `${API_SERVER}/bar/delete-bar`;
export const BAR_BOOKING_LIST_GET = `${API_SERVER}/bar/bar-booking-list`;
export const BAR_DELETE_BOOKING_ITEM = `${API_SERVER}/bar/delete-bar-booking`;
export const BAR_RATING_GET = `${API_SERVER}/bar/bar-rating`;

// --- 約會與配對 (Date) ---
// 興趣設定
export const DATE_GET_BAR_TYPE = `${API_SERVER}/date/bar_type/api`; // GET
export const DATE_GET_MOVIE_TYPE = `${API_SERVER}/date/booking_movie_type/api`; // GET
export const DATE_EDIT_BAR_TYPE = `${API_SERVER}/date/user_interest/edit_bar_type`; // PUT
export const DATE_EDIT_MOVIE_TYPE = `${API_SERVER}/date/user_interest/edit_movie_type`; // PUT

// 好友與配對
export const DATE_GET_FRIENDS_LIST = `${API_SERVER}/date/friends-list`; // GET (用興趣找朋友 / 送出交友邀請)
export const DATE_FRIENDSHIPS_EDIT = `${API_SERVER}/date/friends-list/edit`; // POST (修改好友狀態)
export const DATE_FRIENDSHIPS = `${API_SERVER}/date/friends-list`; // GET (好友狀態與資訊)

// 即時通訊 (Chat)
export const DATE_FRIENDSHIPS_MESSAGE_SENDER = `${API_SERVER}/date/friendships_message/sender_id`; // GET
export const DATE_FRIENDSHIPS_MESSAGE = `${API_SERVER}/date/friendships_message`; // GET
export const DATE_FRIENDSHIPS_MESSAGE_NEW_MSG = `${API_SERVER}/date/friendships_message/api`; // POST
export const DATE_FRIENDSHIPS_MESSAGE_NEW_IMG = `${API_SERVER}/date/friendships_message/uploadImg/api`; // POST
