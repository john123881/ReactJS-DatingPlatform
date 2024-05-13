import { useState } from 'react';
import Link from 'next/link';

export default function Recomendbar({ onTabChange }) {
  const [selectedTab, setSelectedTab] = useState('favorites');
  const [activeTab, setActiveTab] = useState('addMovie'); // 初始化为 'addMovie'

  const handleClick = (newTab) => {
    onTabChange(newTab); // 切换标签内容
    setActiveTab(newTab); // 更新活动标签的状态
  };

  // 自定义样式
  const linkStyle = (tabName) => ({
    backgroundColor: activeTab === tabName ? '#a0ff1f' : 'black',
    color: activeTab === tabName ? 'black' : 'white',
    border: `1px solid ${activeTab === tabName ? 'white' : 'white'}`,
  });

  // render 可選擇的内容
  const renderFavorites = () => (
    <div className="flex justify-start items-start gap-3.5">
      <button
        style={linkStyle('addMovie')}
        className="text-xs sm:text-lg px-4 sm:px-7 py-1 rounded-full flex justify-center items-center"
        onClick={() => handleClick('addMovie')}
      >
        選擇電影
      </button>

      <button
        style={linkStyle('addBar')}
        className="text-xs sm:text-lg px-4 sm:px-7 py-1 rounded-full flex justify-center items-center"
        onClick={() => handleClick('addBar')}
      >
        選擇酒吧
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <div className="flex justify-start items-start gap-3.5">
        {selectedTab === 'favorites' && renderFavorites()}
        {selectedTab === 'recommendations' && renderRecommendations()}
      </div>
    </div>
  );
}
