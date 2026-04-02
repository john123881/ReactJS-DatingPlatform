import React from 'react';

/**
 * 統一的社群標籤組件
 * @param {string} text - 標籤文字 (例如: '# 愛情')
 */
const CommunityTag = ({ text }) => {
  // 去除 # 號並清理空格
  const cleanText = text.replace('#', '').trim();
  
  // 定義顏色對應表
  const colorMap = {
    '愛情': { border: 'border-[#ff03ff]', text: 'text-[#ff03ff]' },
    '酒吧': { border: 'border-[#00d4ff]', text: 'text-[#00d4ff]' },
    '電影': { border: 'border-[#a0ff1f]', text: 'text-[#a0ff1f]' },
    '慶祝時刻': { border: 'border-[#ff03ff]', text: 'text-[#ff03ff]' },
    '新年派對': { border: 'border-[#a0ff1f]', text: 'text-[#a0ff1f]' },
    // 預設顏色 (綠色)
    'default': { border: 'border-[#a0ff1f]', text: 'text-[#a0ff1f]' }
  };

  const styles = colorMap[cleanText] || colorMap['default'];

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${styles.border} ${styles.text} bg-black/50 backdrop-blur-sm shadow-sm transition-all hover:scale-105`}>
      # {cleanText}
    </span>
  );
};

export default CommunityTag;
