import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { useAccountAuth } from '@/hooks/use-account-auth';
import { AccountService } from '@/services/account-service';
import { getImageUrl } from '@/services/image-utils';
import { toast as customToast } from '@/lib/toast';

/**
 * useAccountProfile - 處理會員中心共用的授權與資料拉取邏輯
 * @returns {object} 包含 profile, isLoading, checkAndFetch 等功能
 */
export const useAccountProfile = () => {
  const router = useRouter();
  const { auth, userAvatar, setUserAvatar } = useAuth();
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async (sid) => {
    try {
      const result = await AccountService.getEditProfile(sid);
      if (result.success) {
        setProfile(result.data);
        if (result.data.avatar) {
          setUserAvatar(getImageUrl(result.data.avatar, 'avatar'));
        }
        return result;
      } else {
        customToast.error(result.error || '獲取資料失敗');
        router.push('/');
      }
    } catch (error) {
      console.error('fetchProfile error:', error);
    }
  }, [router, setUserAvatar]);

  const { isLoading } = useAccountAuth(async (sid) => {
    await fetchProfile(sid);
  });

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
