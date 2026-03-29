import { useState } from 'react';

export default function TripRecommendTabbar({ onTabChange }) {
  const [activeTab, setActiveTab] = useState('addMovie');

  const handleClick = (newTab) => {
    onTabChange(newTab);
    setActiveTab(newTab);
  };

  const getButtonStyle = (tabName) => ({
    backgroundColor: activeTab === tabName ? '#a0ff1f' : 'black',
    color: activeTab === tabName ? 'black' : 'white',
    border: '1px solid white',
  });

  return (
    <div className="flex flex-col items-center justify-center gap-2.5">
      <div className="flex justify-start items-start gap-3.5">
        <button
          style={getButtonStyle('addMovie')}
          className="text-xs sm:text-lg px-4 sm:px-7 py-1 rounded-full flex justify-center items-center transition-all"
          onClick={() => handleClick('addMovie')}
        >
          選擇電影
        </button>

        <button
          style={getButtonStyle('addBar')}
          className="text-xs sm:text-lg px-4 sm:px-7 py-1 rounded-full flex justify-center items-center transition-all"
          onClick={() => handleClick('addBar')}
        >
          選擇酒吧
        </button>
      </div>
    </div>
  );
}
