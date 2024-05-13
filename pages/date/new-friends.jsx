import React from 'react';
import NewFriendsModule from '@/components/date/new-friend-module';
import SideBar from '@/components/date/side-bar';
import PageTitle from '@/components/page-title';

export default function NewFriendsPage() {
  const pageTitle = '找新朋友';
  const initialTabs = [
    { title: '找新興趣', path: '/date/select-interests', active: false },
    { title: '找新朋友', path: '/date/new-friends', active: true },
    { title: '好友列表', path: '/date/friends-list', active: false },
    { title: '聊天室', path: '/date/chat-room', active: false },
  ];
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <SideBar tabs={initialTabs} />
      <div className="h-screen flex items-center justify-center pt-20">
        <NewFriendsModule />
      </div>
    </>
  );
}
