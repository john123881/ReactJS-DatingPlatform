import Loader from '@/components/ui/loader/loader';

const loaderConfigs = {
  post: { text: '正在載入收藏資料...', minHeight: '400px' },
  collect: { text: '正在載入收藏資料...', minHeight: '400px' },
  edit: { text: '正在載入編輯資料...' },
  index: { text: '正在載入資料中...' },
  profile: { text: '正在載入資料中...' },
  password: { text: '正在載入資料...' },
  game: { text: '正在載入遊戲資料...', minHeight: '582px' },
  record: { text: '正在載入紀錄資料...' },
  points: { text: '正在載入積分紀錄...', minHeight: '520px' },
  game_record: { text: '正在載入遊戲紀錄...', minHeight: '520px' },
};

/**
 * 共用頁面載入器
 * @param {string} type - 載入類型 ('post'|'collect'|'edit'|'index'|'profile'|'password'|'game'|'record'|'points'|'game_record')
 */
export default function PageLoader({ type, ...props }) {
  const config = loaderConfigs[type] || { text: '正在載入資料中...' };
  return <Loader minHeight="400px" {...config} {...props} />;
}
