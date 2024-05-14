//export const API_SERVER = `http://192.168.0.15:3001`;
// export const API_SERVER = `http://119.14.42.80:3443`;
export const API_SERVER = `http://119.14.42.80:3001`;
//const API_SERVER = `http://localhost:3001`;

//account路徑:登入授權確認路徑 方法:GET
export const CHECK_AUTH = `${API_SERVER}/login-check`;

//account路徑:登入路徑 方法:POST  鍵值: email and password
export const LOGIN_POST = `${API_SERVER}/login`;

//account路徑:註冊前發送OTP路徑 方法:POST  鍵值:email
export const SENDOTP_POST = `${API_SERVER}/register-send-otp`;

//account路徑:註冊路徑 方法:POST  鍵值: username email validCode password
export const REGISTER_POST = `${API_SERVER}/register`;

//account路徑:忘記密碼發送OTP路徑 方法:POST  鍵值:email
export const SENDOTP_FORGETPWD_POST = `${API_SERVER}/forget-password-send-otp`;

//account路徑:註冊路徑 方法:PUT  鍵值: validCode email password confirmPassword
export const FORGETPWD_PUT = `${API_SERVER}/forget-password-edit`;

//account路徑:google登入 方法:POST
export const GOOGLE_LOGIN = `${API_SERVER}/google-login`;

//account路徑:讀取個人資料 方法:GET
export const ACCOUNT_GET = `${API_SERVER}/account`;

//account路徑:編輯-讀取個人資料 方法:GET
export const ACCOUNT_EDIT_GET = `${API_SERVER}/account/edit`;

//account路徑:編輯 方法:PUT
export const ACCOUNT_EDIT_PUT = `${API_SERVER}/account/edit`;

//account路徑:編輯大頭照 方法:PUT
export const ACCOUNT_EDIT_AVATAR_PUT = `${API_SERVER}/account/try-upload`;

//account路徑:更改密碼 方法:PUT
export const ACCOUNT_CHANGE_PWD_PUT = `${API_SERVER}/account/change-password`;

//account路徑:上傳遊戲紀錄 方法:POST 鍵值: auth_id gameScore gameTime
export const ACCOUNT_GAME_RECORD_POST = `${API_SERVER}/account/game-record-upload`;

//account路徑:紀錄查訊-讀取POINT 方法:GET
export const ACCOUNT_RECORD_POINT_GET = `${API_SERVER}/account/record-point`;

//account路徑:紀錄查訊-讀取GAME 方法:GET
export const ACCOUNT_RECORD_GAME = `${API_SERVER}/account/record-game`;

//account路徑:個人收藏-讀取POST收藏 方法:GET
export const ACCOUNT_COLLECT_POST = `${API_SERVER}/account/collect-post`;

//account路徑:個人收藏-刪除POST收藏 方法:DELETE
export const ACCOUNT_COLLECT_POST_DELETE = `${API_SERVER}/account/collect-post-delete`;

//account路徑:個人收藏-讀取BAR收藏 方法:GET
export const ACCOUNT_COLLECT_BAR = `${API_SERVER}/account/collect-bar`;

//account路徑:個人收藏-刪除BAR收藏 方法:DELETE
export const ACCOUNT_COLLECT_BAR_DELETE = `${API_SERVER}/account/collect-bar-delete`;

//account路徑:個人收藏-讀取MOVIE收藏 方法:GET
export const ACCOUNT_COLLECT_MOVIE = `${API_SERVER}/account/collect-movie`;

//account路徑:個人收藏-刪除MOVIE收藏 方法:DELETE
export const ACCOUNT_COLLECT_MOVIE_DELETE = `${API_SERVER}/account/collect-movie-delete`;

//account路徑:個人收藏-NAVBAR收藏列表 方法:GET
export const ACCOUNT_COLLECT_LIST_GET = `${API_SERVER}/account/collect-list`;

// Date路徑，拿bar type 方法：GET
export const DATE_GET_BAR_TYPE = `${API_SERVER}/date/bar_type/api`;

// Date路徑，拿bar type 方法：GET
export const DATE_GET_MOVIE_TYPE = `${API_SERVER}/date/booking_movie_type/api`;

// Date路徑，用興趣找朋友 方法：GET
// Date路徑，送出交友邀請 方法：PUT
export const DATE_GET_FRIENDS_LIST = `${API_SERVER}/date/friends-list`;

// 編輯使用者喜愛的Bar類型
export const DATE_EDIT_BAR_TYPE = `${API_SERVER}/date/user_interest/edit_bar_type`;

// 編輯使用者喜愛的Movie類型
export const DATE_EDIT_MOVIE_TYPE = `${API_SERVER}/date/user_interest/edit_movie_type`;

// 拿到朋友傳送的訊息
export const DATE_FRIENDSHIPS_MESSAGE_SENDER = `${API_SERVER}/date/friendships_message/sender_id`;

// 拿到朋友訊息
export const DATE_FRIENDSHIPS_MESSAGE = `${API_SERVER}/date/friendships_message`;

// 新增一筆訊息 方法: POST
export const DATE_FRIENDSHIPS_MESSAGE_NEW_MSG = `${API_SERVER}/date/friendships_message/api`;

// 修改好友狀態 方法：POST
export const DATE_FRIENDSHIPS_EDIT = `${API_SERVER}/date/friends-list/edit`;

// 拿到好友狀態與資訊
export const DATE_FRIENDSHIPS = `${API_SERVER}/date/friends-list`;

// 新增一筆訊息（圖片）方法: POST
export const DATE_FRIENDSHIPS_MESSAGE_NEW_IMG = `${API_SERVER}/date/friendships_message/uploadImg/api`;
