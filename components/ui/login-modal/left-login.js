import { useState } from 'react';
// import Link from 'next/link';
import PasswordForget from './password-forget';
import { useFormik } from 'formik';
import { loginSchema } from '../../schemas';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { toast as customToast } from '@/lib/toast';
import { getAuthGoogle } from '@/context/firebase-config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GOOGLE_LOGIN } from '@/configs/api-config';

export default function LeftLogin({ switchHandler }) {
  const [googleUser, setgoogleUser] = useAuthState(getAuthGoogle);
  const [passwordForgetBtn, setPasswordForgetBtn] = useState(false);
  const {
    auth,
    storageKey,
    setAuth,
    login,
    loginModalToggle,
    isOnLoginPage,
    setLoginModalToggle,
    setUserAvatar,
  } = useAuth();
  const router = useRouter();

  const [showPWD, setShowPWD] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const handleShowPWD = () => {
    setShowPWD(!showPWD);
  };

  const provider = new GoogleAuthProvider();
  const loginByGoogle = async () => {
    const result = await signInWithPopup(getAuthGoogle, provider);
    const user = await result.user;

    const fetchGoogleLogin = async (user) => {
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      const { apiClient } = await import('@/services/api-client');
      const jsonResult = await apiClient(GOOGLE_LOGIN, {
        method: 'POST',
        body: userData,
      });

      if (jsonResult.success) {
        let data = {
          id: jsonResult.data.id,
          username: jsonResult.data.username,
          email: jsonResult.data.email,
          token: jsonResult.data.token,
          avatar: user.photoURL || jsonResult.data.avatar,
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        setAuth(data);
        if (data.avatar) {
          setUserAvatar(data.avatar);
        }
        return jsonResult;
      }
    };

    customToast.loading('登入中...');
    const timeoutId = setTimeout(() => {
      customToast.fire({
        title: '登入中... (因首次登入須等伺服器冷啟動，須耐心等候)',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          customToast.loading();
        },
      });
    }, 5000);

    try {
      const jsonResult = await fetchGoogleLogin(user);
      clearTimeout(timeoutId);

      if (jsonResult && jsonResult.success) {
        if (jsonResult.data.getPointLogin) {
          customToast.success('登入獲得10積分');
        }
        setShowPWD(false);
        setLoginModalToggle(false);
        router.push('/');
        customToast.success('登入成功');
      } else {
        throw new Error('登入時出現錯誤');
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.error('Firebase Auth Error Details:', {
        code: e.code,
        message: e.message,
        fullError: e
      });
      customToast.error(`登入錯誤: ${e.code || e.message || e}`);
    }

    // fetchGoogleLogin(user);
    // console.log('user:', user);
    // console.log('googleUser:', googleUser);
  };

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      customToast.loading('登入中...');
      const timeoutId = setTimeout(() => {
        customToast.fire({
          title: '登入中... (因首次登入須等伺服器冷啟動，須耐心等候)',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            customToast.loading();
          },
        });
      }, 5000);

      try {
        const result = await login(values.email, values.password);
        clearTimeout(timeoutId);

        if (result && result.success) {
          resetForm();
          setShowPWD(false);
          setLoginModalToggle(false);
          if (result.data.getPointLogin) {
            customToast.success('登入獲得10積分');
          }
          router.push(
            {
              pathname: router.pathname,
            },
            undefined,
            { scroll: false },
          );
          customToast.success('登入成功');
        } else {
          throw new Error(result?.error || '登入失敗');
        }
      } catch (e) {
        clearTimeout(timeoutId);
        customToast.error(`登入錯誤: ${e.message || e}`);
      }
    },
  });

  return (
    <>
      {passwordForgetBtn ? (
        <PasswordForget
          setPasswordForgetBtn={setPasswordForgetBtn}
          switchHandler={switchHandler}
          loginResetForm={resetForm}
        />
      ) : (
        <div className="flex flex-col justify-center px-8 pt-8 my-auto duration-1000 ease-in-out md:justify-start md:pt-0 md:px-4 lg:px-8">
          <p className="flex items-center mx-auto font-bold text-center text-h3 text-dark">
            <span
              onClick={() => {
                setFieldValue('email', 'test@gmail.com');
                setFieldValue('password', 'aA!123456');
              }}
            >
              會
            </span>
            <span
              onClick={() => {
                setFieldValue('email', 'serene123@gmail.com');
                setFieldValue('password', 'Aa@12345');
              }}
            >
              員
            </span>
            <span
              onClick={() => {
                setFieldValue('email', 'davidyu828@gmail.com');
                setFieldValue('password', 'aA!123456');
              }}
            >
              登
            </span>
            <span
              onClick={() => {
                setFieldValue('email', 'lbjisgoat1984@gmail.com');
                setFieldValue('password', 'aA!123456');
              }}
            >
              入
            </span>
            {/* 會員登入 */}
            {/* <span
              onClick={() => {
                setFieldValue('email', 'lbjisgoat1984@gmail.com');
                setFieldValue('password', 'aA!123456');
              }}
              className="text-[16px] cursor-pointer my-auto"
            >
              ⭐
            </span> */}
          </p>
          <form
            className="flex flex-col pt-6"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="flex flex-col">
              <label
                className={`${
                  errors.email && touched.email ? 'input-error ' : ''
                } flex items-center gap-2 rounded-full input h-[37px] input-bordered bg-slate-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 min-w-[14px] opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="grow text-slate-700"
                  placeholder="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  autoComplete="email"
                />
              </label>
              {errors.email && touched.email ? (
                <p className="text-[12px] text-red-500 ms-6 mb-2 mt-1">
                  {errors.email}
                </p>
              ) : (
                <p className="mt-[22px] mb-2 "> </p>
              )}
            </div>
            <div className="flex flex-col ">
              <label
                className={`${
                  errors.password && touched.password ? 'input-error ' : ''
                } relative flex items-center gap-2 rounded-full input h-[37px] input-bordered bg-slate-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 min-w-[14px] opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type={showPWD ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="grow text-dark"
                  placeholder="Password"
                  onFocus={() => setIsFocused(true)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  autoComplete="current-password"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`${
                    isFocused ? 'block' : 'hidden'
                  } w-5 h-5 min-w-[14px] cursor-pointer opacity-70 text-dark absolute right-4`}
                  onClick={handleShowPWD}
                >
                  {showPWD ? <FaEyeSlash /> : <FaEye />}
                </svg>
              </label>
              {errors.password && touched.password ? (
                <p className="text-[12px] text-red-500 ms-6 mb-2 mt-1">
                  {errors.password}
                </p>
              ) : (
                <p className="mt-[22px] mb-2 "> </p>
              )}
            </div>
            <div className="text-center ">
              <div>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setPasswordForgetBtn(true);
                  }}
                  className="font-semibold underline cursor-pointer text-dark link link-neutral hover:text-slate-400"
                >
                  忘記密碼嗎?
                </a>
              </div>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full px-4 py-2 mt-6 font-semibold text-center transition duration-200 ease-in bg-white border-2 rounded-full md:mx-auto text-dark border-slate-200 hover:bg-slate-200 hover:border-slate-400 focus:ring-slate-500 focus:ring-offset-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 "
            >
              <span className="w-full">登入</span>
            </button>
          </form>
          <div className="py-4 text-center text-slate-300">
            <p>Or</p>
          </div>
          <a
            onClick={loginByGoogle}
            className="flex items-center justify-center w-full px-4 py-2 text-base font-semibold text-center transition duration-200 ease-in bg-white border-2 rounded-full shadow-md cursor-pointer border-slate-200 text-dark md:mx-auto hover:bg-slate-200 hover:border-slate-400 focus:ring-slate-500 focus:ring-offset-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 "
          >
            <FcGoogle className="me-4 min-w-[18px] " />
            Google帳號登入
          </a>
          <button
            onClick={switchHandler}
            className="w-full px-4 py-2 mx-auto font-bold text-white border-2 rounded-xl mt-14 hover:text-primary btn-primary bg-dark border-dark hover:shadow-xl3 md:hidden"
          >
            會員註冊
          </button>
        </div>
      )}
    </>
  );
}
