import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { useLoader } from '@/context/use-loader';
import { AccountService } from '@/services/account-service';
import toast from 'react-hot-toast';

/**
 * useAccountProfile - 處理會員中心共用的授權與資料拉取邏輯
 * @returns {object} 包含 profile, isLoading, checkAndFetch 等功能
 */
export const useAccountProfile = () => {
  const router = useRouter();
  const { auth, checkAuth, userAvatar, setUserAvatar, rerender } = useAuth();
  const { open, close, isLoading } = useLoader();
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async (sid) => {
    try {
      const result = await AccountService.getEditProfile(sid);
      if (result.success) {
        setProfile(result.data);
        if (result.data.avatar) {
          setUserAvatar(result.data.avatar);
        }
        return result;
      } else {
        toast.error(result.error || '獲取資料失敗');
        router.push('/');
      }
    } catch (error) {
      console.error('fetchProfile error:', error);
    }
  }, [router, setUserAvatar]);

  useEffect(() => {
    if (!router.isReady || !router.query.sid || auth.id === 0) return;

    const init = async () => {
      open();
      try {
        const authResult = await checkAuth(router.query.sid);
        if (authResult.success) {
          await fetchProfile(router.query.sid);
        } else {
          router.push('/');
          toast.error(authResult.message || '驗證失敗');
        }
      } catch (error) {
        console.error('Account init error:', error);
      } finally {
        close(0.5);
      }
    };

    init();
  }, [router.isReady, router.query.sid, auth.id, rerender, checkAuth, open, close, fetchProfile]);

  return {
    profile,
    isLoading,
    sid: router.query.sid,
    auth,
    userAvatar,
    setUserAvatar,
    refreshProfile: () => fetchProfile(router.query.sid)
  };
};
