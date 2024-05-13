import React from 'react';
import SearchBar from '@/components/date/search-bar';
import ChatMsg from '@/components/date/chat-msg';
import SideBar from '@/components/date/side-bar';
import { useState } from 'react';
import PageTitle from '@/components/page-title';

export default function ChatRoom() {
  const pageTitle = '聊天室';
  const initialTabs = [
    { title: '找新興趣', path: '/date/select-interests', active: false },
    { title: '找新朋友', path: '/date/new-friends', active: false },
    { title: '好友列表', path: '/date/friends-list', active: false },
    { title: '聊天室', path: '/date/chat-room', active: true },
  ];

  // 定義搜索查詢的狀態
  const [searchQuery, setSearchQuery] = useState('');

  // 建立用於更新搜索查詢的處理
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <SideBar tabs={initialTabs} />
      <div className="flex flex-col mx-4 md:flex-row md-h-[600px]  md:mx-20 mt-10 pt-20">
        {/* 左側 */}
        <div className="overflow-y-auto overflow-x-hidden  bg-[#2C2C2C] border border-gray-500  h-[600px] md:h-[800px] flex-col items-center  rounded-xl  md:w-2/5 md:flex">
          <div
            className="w-full md:w-auto flex flex-col justify-start md:justify-start ml-4 mb-4"
            style={{ position: 'sticky', top: 0, zIndex: 11 }}
          >
            <div
              style={{
                backgroundColor: '#2C2C2C',
                paddingTop: '30px',
                paddingLeft: '100px',
                paddingRight: '100px',
              }}
            >
              <SearchBar onChange={handleSearchChange} className="relative" />
            </div>
          </div>
          <div className="pl-[24px] pr-[24px]">
            <ChatMsg searchQuery={searchQuery} />
          </div>
        </div>

        {/* 右側 */}
        <div className="bg-transparent border border-gray-500 md:p-0 flex flex-col mx-auto w-full md:w-3/5 md:mx-0 rounded-xl h-[650px] md:h-[800px] md:block relative hidden"></div>
      </div>
    </>
  );
}
