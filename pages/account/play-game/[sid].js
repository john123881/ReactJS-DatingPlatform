import { useState, useEffect } from 'react';
import Sidebar from '@/components/account-center/sidebar/sidebar';
import PageTitle from '@/components/page-title';
import Breadcrumbs from '@/components/account-center/breadcrumbs/breadcrumbs';
import BurgerMenu from '@/components/account-center/burgermenu/burger-menu';
import GameComponent from '@/components/account-center/game-component/game-component';
import { useLoader } from '@/context/use-loader';
import PGLoader from '@/components/account-center/loader/play-game-loader';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function AccountPlayGame({ onPageChange }) {
  const { close, isLoading } = useLoader();
  const { checkAuth } = useAuth();
  const router = useRouter();

  const pageTitle = '會員中心';
  const currentPage = '遊玩遊戲';

  useEffect(() => {
    if (!router.isReady) return;
    //進頁面做授權確認，router的query有改會調用fetchCheck
    const fetchCheck = async () => {
      const result = await checkAuth(router.query.sid);
      if (!result.success) {
        toast.error(result.error, { duration: 1500 });
        router.push('/');
        return;
      }
      close(1.5);
    };
    fetchCheck();
  }, [router.query]);

  useEffect(() => {
    onPageChange(pageTitle);
  }, []);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex min-h-screen pt-10 bg-dark ">
        <Sidebar currentPage={currentPage} />

        <div className="w-screen px-1 py-12 sm:px-6 md:px-8 lg:ps-14 lg:pe-44 xl:pe-60">
          <div className="flex flex-col w-full ">
            <BurgerMenu currentPage={currentPage} />
            <Breadcrumbs currentPage={currentPage} />

            {/* CONTENT1 START */}
            <div className="relative p-1 mx-auto mockup-phone">
              <div className="absolute top-0 left-0 camera"></div>
              <div className="min-h-[582px] flex flex-col min-w-[350px]  display w-full border  bg-base-300  border-slate-700 rounded-box">
                {isLoading ? <PGLoader /> : <GameComponent />}
              </div>
            </div>
            {/* CONTENT1 END */}
          </div>
        </div>
      </div>
    </>
  );
}
