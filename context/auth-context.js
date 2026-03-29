import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { API_SERVER } from '@/configs/api-config';
import { AuthService } from '@/services/auth-service';

const AuthContext = createContext();
const emptyAuth = {
  id: 0,
  email: '',
  password: '',
  token: '',
  avatar: '',
};

export function AuthContextProvider({ children }) {
  const [rerender, setRerender] = useState(false);

  const [auth, setAuth] = useState(emptyAuth);
  const router = useRouter();
  const [loginModalToggle, setLoginModalToggle] = useState(false);
  const [userAvatar, setUserAvatar] = useState(
    `${API_SERVER}/avatar/defaultAvatar.jpg`,
  );
  const [isOnLogin, setIsOnLogin] = useState(true);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const storageKey = 'TD_auth';

  const switchHandler = () => {
    setIsOnLogin(!isOnLogin);
  };

  const register = useCallback(async (email, validCode, username, password) => {
    try {
      return await AuthService.register({
        email,
        validCode,
        username,
        password,
      });
    } catch (error) {
      console.error('註冊時發生錯誤', error);
      return { success: false, error: error.message || '註冊時發生錯誤' };
    }
  }, []);


  const login = useCallback(async (email, password) => {
    try {
      const result = await AuthService.login({ email, password });

      const authData = {
        ...result.data,
        avatar: result.data.avatar || `${API_SERVER}/avatar/defaultAvatar.jpg`,
      };
      
      localStorage.setItem(storageKey, JSON.stringify(authData));
      setAuth(authData);
      if (authData.avatar) {
        setUserAvatar(authData.avatar);
      }

      return result;
    } catch (error) {
      console.error('登入時發生錯誤', error);
      return { success: false, error: error.message || '登入時發生錯誤' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout(); // 呼叫後端清除 Cookie
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    localStorage.removeItem(storageKey);
    setAuth(emptyAuth);
    await router.push('/');
  }, [router]);

  const getAuthHeader = useCallback(() => {
    if (auth.token) {
      return { Authorization: 'Bearer ' + auth.token };
    }
  }, [auth.token]);

  //做授權測試，返回值:
  //1.沒此ID {
  //     status: 'error',
  //     error: '無授權token，請進行登入',
  //     success: false,
  //     msg: '無授權token，請進行登入',
  // }
  // 2.授權成功:{success: true, msg:'確認成功，有Token，UserID也符合'}
  const checkAuth = useCallback(async (sid) => {
    try {
      return await AuthService.checkAuth(sid);
    } catch (error) {
      console.error('CheckAuth error:', error);
      return { success: false, error: error.message || '驗證失敗' };
    }
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      console.warn('Auth session expired globally - resetting state.');
      setAuth(emptyAuth);
      setLoginModalToggle(true);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [setAuth, setLoginModalToggle]);

  useEffect(() => {
    const initAuth = async () => {
      const str = localStorage.getItem(storageKey);
      try {
        const data = JSON.parse(str);
        if (data && data.id) {
          // 向後端確認 Cookie 是否仍然有效
          // 注意：checkAuth 回傳的是 { success: true, message: '...' }
          const result = await checkAuth(data.id);
          if (result && result.success) {
            setAuth(data);
            if (data.avatar) {
              setUserAvatar(data.avatar);
            }
          } else {
            // Cookie 無效，清除本地資料
            localStorage.removeItem(storageKey);
            setAuth(emptyAuth);
          }
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setIsAuthLoaded(true);
      }
    };
    initAuth();
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      storageKey,
      auth,
      checkAuth,
      setAuth,
      register,
      login,
      logout,
      getAuthHeader,
      loginModalToggle,
      setLoginModalToggle,
      userAvatar,
      setUserAvatar,
      switchHandler,
      isOnLogin,
      setIsOnLogin,
      rerender,
      setRerender,
      isAuthLoaded,
    }),
    [
      auth,
      checkAuth,
      register,
      login,
      logout,
      getAuthHeader,
      loginModalToggle,
      userAvatar,
      isOnLogin,
      rerender,
      isAuthLoaded,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
