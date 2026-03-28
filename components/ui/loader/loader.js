import styles from './loader.module.css';

/**
 * 統一全域載入器元件 (轉圈圈)
 * @param {string} minHeight - 最小高度 (預設 '100vh')
 * @param {string} text - 載入文字 (選擇性)
 * @param {string} className - 額外 CSS 類名
 */
export default function Loader({ minHeight = '100vh', text = '', className = '' }) {
  return (
    <div className={`z-50 flex flex-col justify-center items-center w-full ${className}`} style={{ minHeight }}>
      <div className={styles.spinner}></div>
      {text && <p className="mt-4 text-gray-400 animate-pulse">{text}</p>}
    </div>
  );
}
