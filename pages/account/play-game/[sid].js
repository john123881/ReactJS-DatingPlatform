/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react';
import AccountLayout from '@/components/account-center/account-layout';
import GameComponent from '@/components/account-center/game-component/game-component';
import { useLoader } from '@/context/use-loader';
import PageLoader from '@/components/ui/loader/page-loader';
import { useAuth } from '@/context/auth-context';
import { toast as customToast } from '@/lib/toast';
import { useRouter } from 'next/router';

export default function AccountPlayGame({ onPageChange }) {
  const { open, close, isLoading } = useLoader();
  const { auth, checkAuth } = useAuth();
  const router = useRouter();

  const pageTitle = '會員中心';
  const currentPage = '遊玩遊戲';

  useEffect(() => {
    if (!router.isReady || !router.query.sid) return;

    //進頁面做授權確認，router的query有改會調用fetchCheck
    const fetchCheck = async () => {
      open();
      try {
        if (auth.id === 0) {
          return;
        }
        const result = await checkAuth(router.query.sid);
        if (!result.success) {
          customToast.error(result.message || '驗證失敗');
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('fetchCheck error:', error);
      } finally {
        close(0.5);
      }
    };
    
    fetchCheck();
  }, [router.isReady, router.query.sid, checkAuth, close, open, auth.id, router]);

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  return (
    <AccountLayout currentPage={currentPage}>
      <div className="flex justify-center w-full">
        {/* CONTENT1 START */}
        <div className="relative p-1 mx-auto mockup-phone">
          <div className="absolute top-0 left-0 camera"></div>
          <div className="min-h-[582px] flex flex-col min-w-[350px]  display w-full border  bg-base-300  border-slate-700 rounded-box">
            {isLoading ? <PageLoader type="game" /> : <GameComponent />}
          </div>
        </div>
        {/* CONTENT1 END */}
      </div>
    </AccountLayout>
  );
}
