import React from 'react';
import SideBar from '@/components/date/side-bar';
import InterestCard from '@/components/date/interest-card';
import PageTitle from '@/components/page-title';

export default function SelectInterests() {
  const pageTitle = '找新興趣';
  const initialTabs = [
    { title: '找新興趣', path: '/date/select-interests', active: true },
    { title: '找新朋友', path: '/date/new-friends', active: false },
    { title: '好友列表', path: '/date/friends-list', active: false },
    { title: '聊天室', path: '/date/chat-room', active: false },
  ];

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <SideBar tabs={initialTabs} />
      <div className="flex flex-col items-center justify-center min-h-screen pt-[120px]">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          等你來開啟精彩的相遇！
        </h1>
        <p className="text-base md:text-lg mb-6 text-center px-4">
          以喜愛的酒吧和電影為起點，找到共同興趣的夥伴，共赴酒吧和電影的奇妙時光！
        </p>
        <InterestCard />
      </div>
    </>
  );
}
