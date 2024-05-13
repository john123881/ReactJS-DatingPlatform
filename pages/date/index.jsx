import React from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import PageTitle from '@/components/page-title';
import { useRouter } from 'next/router';
import { useDate } from '@/context/date-context';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';

export default function Index({ onPageChange }) {
  const pageTitle = '配對交友';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const { auth, setLoginModalToggle } = useAuth();
  const { toggleBar, setToggleBar } = useDate();
  const { toggleMovie, setToggleMovie } = useDate();
  const [redirectPath, setRedirectPath] = useState('/'); // 局部重定

  useEffect(() => {
    if (!auth.id) {
      setLoginModalToggle(true);
    }
  }, [auth.id, setLoginModalToggle]);

  // 在 "開始填寫" 按鈕也檢查登入狀態
  const handleStartClick = (event) => {
    if (!auth.id) {
      event.preventDefault();
      setLoginModalToggle(true);
    } else {
      handleClearToggle(event);
    }
  };

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

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col justify-center items-center min-h-screen pt-16">
        <h1 className="text-3xl font-bold mb-6">WANT TO DATE?</h1>
        <p className="text-lg mb-6 sm:text-center sm:px-4 sm:mx-auto max-w-screen-md px-4">
          <span className="inline-block text-center">
            Taipei Date 與你共赴奇遇，交友輕鬆又有趣，創造屬於你的精彩時光！
          </span>
        </p>
        <Link
          className="text-black border-2 rounded-full btn-primary bg-primary border-primary hover:shadow-xl3 font-bold py-2 px-6 sm:px-8 sm:w-1/2 text-center"
          href="/date/select-interests"
          onClick={handleStartClick}
        >
          {/* <Link > */}
          開始填寫！
          {/* </Link> */}
        </Link>
      </div>
    </>
  );
}
