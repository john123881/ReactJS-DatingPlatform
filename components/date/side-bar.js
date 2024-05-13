// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';

// function SideBar({ tabs }) {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('home');

//   useEffect(() => {
//     const path = router.pathname.split('/')[2];
//     setActiveTab(path || 'home');
//   }, [router.pathname]);

//   return (
//     <div
//       role="tablist"
//       className="tabs tabs-bordered fixed top-[64px] z-40 bg-dark w-full"
//     >
//       {tabs.map((tab, index) => (
//         <Link
//           key={index}
//           href={tab.path} // 確保每個標籤都有指定路徑
//           role="tab"
//           className={`tab ${activeTab === tab.path ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab(tab.path)}
//         >
//           {tab.title}
//         </Link>
//       ))}
//     </div>
//   );
// }

// export default SideBar;

import React from 'react';
import Link from 'next/link';
import { useDate } from '@/context/date-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';

function SideBar({ tabs }) {
  const { auth, setLoginModalToggle } = useAuth();
  const router = useRouter();
  const { toggleBar, setToggleBar } = useDate();
  const { toggleMovie, setToggleMovie } = useDate();
  const handleClearToggle = (event, bar) => {
    setToggleBar({
      id: 0,
      name: '請選擇一種喜愛的酒吧類型',
    });
    setToggleMovie({
      id: 0,
      name: '請選擇一種喜愛的電影類型',
    });
  };

  const handleTabClick = (event, tab) => {
    if (!auth.id) {
      event.preventDefault();
      setLoginModalToggle(true);

      if (tab.path.includes('select-interests')) {
        router.push('/date/select-interests');
      } else if (tab.path.includes('new-friends')) {
        router.push('/date/new-friends');
      } else if (tab.path.includes('friends-list')) {
        router.push('/date/friends-list');
      } else if (tab.path.includes('chat-room')) {
        router.push('/date/chat-room');
      } else {
        router.push('/date');
      }
    } else {
      if (tab.path.includes('select-interests')) {
        handleClearToggle(); // 只在 /date/select-interests 才執行
      }
    }
  };
  return (
    <>
      <div
        role="tablist"
        className="tabs tabs-bordered fixed top-[64px] z-40 bg-dark w-full"
      >
        {tabs.map((tab, index) => (
          <Link
            key={index}
            href={tab.path}
            role="tab"
            className={`tab ${tab.active ? 'tab-active' : ''}`}
            onClick={(event) => handleTabClick(event, tab)}
          >
            {tab.title}
          </Link>
        ))}
      </div>
    </>
  );
}

export default SideBar;
