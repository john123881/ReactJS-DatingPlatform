import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useRouter } from 'next/router';
import { API_SERVER } from '@/configs/api-config';
import { AuthService } from '@/services/auth-service';
import { getImageUrl } from '@/services/image-utils';

const AuthContext = createContext();
const emptyAuth = {
  id: 0,
  email: '',
  password: '',
  token: '',
  avatar: '',
  hasPassword: null, // 預設為 null，代表尚未確認是否有密碼
};

const defaultLoadingConfig = {
  title: '正在啟動伺服器',
  text: '由於伺服器正在從休眠中啟動，可能需要一段時間，請稍候...',
  btnText: '取消登入',
};

export function AuthContextProvider({ children }) {
  const [rerender, setRerender] = useState(false);

  const [auth, setAuth] = useState(emptyAuth);
  const router = useRouter();
  const [loginModalToggle, setLoginModalToggle] = useState(false);
  const [userAvatar, setUserAvatar] = useState(
    getImageUrl(null, 'avatar'),
  );
  const [isOnLoginPage, setIsOnLoginPage] = useState(true);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(defaultLoadingConfig);
  const abortControllerRef = useRef(null);

  const storageKey = 'TD_auth';

  const switchHandler = () => {
    setIsOnLoginPage(!isOnLoginPage);
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
      throw error;
    }
  }, []);


  const login = useCallback(async (email, password) => {
    setLoadingConfig(defaultLoadingConfig);
    setIsAuthLoading(true);
    // 建立新的 AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await AuthService.login({ email, password }, { signal: controller.signal });

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
      if (error.name === 'AbortError') {
        console.log('Login request aborted by user');
        return { success: false, error: '登入已取消' };
      }
      console.error('登入時發生錯誤', error);
      return { success: false, error: error.message || '登入時發生錯誤' };
    } finally {
      setIsAuthLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const cancelLogin = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsAuthLoading(false);
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
          const result = await checkAuth(data.id);
          if (result && result.success) {
            // 使用後端最新回傳的資料 (包含 hasPassword 等狀態)
            const serverAuthData = {
              ...result.data,
              token: data.token // 保留原始 Token
            };
            setAuth(serverAuthData);
            localStorage.setItem(storageKey, JSON.stringify(serverAuthData));

            if (serverAuthData.avatar) {
              setUserAvatar(getImageUrl(serverAuthData.avatar, 'avatar'));
            }
          } else {
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
      isOnLoginPage,
      setIsOnLoginPage,
      rerender,
      setRerender,
      isAuthLoaded,
      isAuthLoading,
      setIsAuthLoading,
      loadingConfig,
      setLoadingConfig,
      cancelLogin,
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
      isOnLoginPage,
      rerender,
      isAuthLoaded,
      isAuthLoading,
      loadingConfig,
      cancelLogin,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
