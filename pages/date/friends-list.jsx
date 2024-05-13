import React from 'react';
import SideBar from '@/components/date/side-bar';
import Friends from '@/components/date/friends';
import NewFriends from '@/components/date/new-friend-module';
import SearchBar from '@/components/date/search-bar';
import { useState } from 'react';
import PageTitle from '@/components/page-title';

export default function FriendsList() {
  const pageTitle = '好友列表';
  const initialTabs = [
    { title: '找新興趣', path: '/date/select-interests', active: false },
    { title: '找新朋友', path: '/date/new-friends', active: false },
    { title: '好友列表', path: '/date/friends-list', active: true },
    { title: '聊天室', path: '/date/chat-room', active: false },
  ];

  // 定義搜索關鍵字的狀態
  const [searchQuery, setSearchQuery] = useState('');

  // 更新搜索關鍵字
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <SideBar tabs={initialTabs} />
      <div className="flex flex-col mx-4 md:flex-row md-h-[600px]  md:mx-20 mt-10 pt-20 ">
        {/* 左側 */}
        <div className=" overflow-y-auto overflow-x-hidden bg-[#2C2C2C] border border-gray-500  h-[600px] md:h-[800px] flex-col  items-center rounded-xl md:w-2/5 md:flex">
          <div
            className="w-full md:w-auto flex flex-col justify-start md:justify-start ml-4"
            style={{ position: 'sticky', top: 0, zIndex: 11 }}
          >
            <div
              style={{
                backgroundColor: '#2C2C2C',
                paddingTop: '30px',
              }}
            >
              <SearchBar onChange={handleSearchChange} className="relative" />
            </div>
          </div>
          <div className=" w-full md:w-full flex flex-col justify-center ml-4 items-center">
            <Friends searchQuery={searchQuery} />
          </div>
        </div>

        {/* 右側*/}
        <div className="bg-transparent border border-gray-500 p-[100px] justify-center items-center mx-auto rounded-xl flex-grow  h-[700px] md:h-[800px] hidden md:block">
          <NewFriends />
        </div>
      </div>
    </>
  );
}
