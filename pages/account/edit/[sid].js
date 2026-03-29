import { useState, useEffect } from 'react';
import AccountLayout from '@/components/account-center/account-layout';
import PageLoader from '@/components/ui/loader/page-loader';
import AvatarUpload from '@/components/account-center/edit/avatar-upload';
import ProfileForm from '@/components/account-center/edit/profile-form';
import { useAccountProfile } from '@/hooks/account/use-account-profile';
import { AccountService } from '@/services/account-service';
import { useNotify } from '@/context/use-notify';
import { useRouter } from 'next/router';

export default function AccountEdit({ onPageChange }) {
  const currentPage = '資料編輯';
  const router = useRouter();
  const { notifyPromise, notifySuccess, notifyError } = useNotify();
  const { 
    profile, 
    isLoading, 
    sid, 
    userAvatar, 
    setUserAvatar, 
    refreshProfile 
  } = useAccountProfile();

  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [favBarList, setFavBarList] = useState([]);
  const [favMovieList, setFavMovieList] = useState([]);

  useEffect(() => {
    onPageChange('會員中心');
  }, [onPageChange]);

  // 當 profile 資料載入後，處理喜好清單
  useEffect(() => {
    if (profile) {
      if (profile.barType) {
        if (profile.barType[0] && Array.isArray(profile.barType[0])) {
           setFavBarList(profile.barType[0].map(b => b.bar_type_name));
        } else {
           setFavBarList(profile.barType.map(b => b.bar_type_name));
        }
      }
      if (profile.movieType) {
        if (profile.movieType[0] && Array.isArray(profile.movieType[0])) {
          setFavMovieList(profile.movieType[0].map(m => m.movie_type));
        } else {
          setFavMovieList(profile.movieType.map(m => m.movie_type));
        }
      }
    }
  }, [profile]);

  const handleFileChange = async (file) => {
    const fileUrl = URL.createObjectURL(file);
    setUserAvatar(fileUrl);
    
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', sid);

    try {
      const result = await AccountService.uploadAvatar(sid, formData);
      if (result.success) {
        notifySuccess('頭像上傳成功');
        refreshProfile();
      } else {
        notifyError(result.error || '上傳失敗');
      }
    } catch (e) {
      notifyError('系統錯誤');
    }
  };

  if (isLoading && !profile) {
    return (
      <AccountLayout currentPage={currentPage}>
        <PageLoader type="edit" />
      </AccountLayout>
    );
  }

  const initialValues = {
    email: profile?.email || '',
    username: profile?.username || '',
    gender: profile?.gender || '請選擇',
    mobile: profile?.mobile || '',
    birthday: profile?.birthday || '',
    fav1: profile?.bar_type_name || '請選擇',
    fav2: profile?.movie_type || '請選擇',
    profile: profile?.profile_content || '',
    avatar: userAvatar,
  };

  return (
    <AccountLayout currentPage={currentPage}>
      <div className="relative">
        <ProfileForm 
          sid={sid}
          initialValues={initialValues}
          favBarList={favBarList}
          favMovieList={favMovieList}
          currentDate={currentDate}
          userAvatar={userAvatar}
          handleFileChange={handleFileChange}
          onSubmit={async (values) => {
            const fetchData = () => AccountService.updateProfile(sid, values);
            notifyPromise(fetchData, {
              loading: '正在保存...',
              success: (result) => {
                if (!result.success) throw result.error;
                router.push(`/account/index/${sid}`);
                return '修改成功';
              },
              error: (err) => `修改失敗: ${err.toString()}`
            });
          }}
        />
      </div>
    </AccountLayout>
  );
}
