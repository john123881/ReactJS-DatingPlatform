import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { registerSchema } from '../../schemas';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { RiPassValidFill } from 'react-icons/ri';
import { SENDOTP_POST } from '@/components/config/api-path';
import toast from 'react-hot-toast';

import Link from 'next/link';

export default function RightLogin({ isOnLogin, switchHandler }) {
  const { auth, register } = useAuth();
  const router = useRouter();
  const [showPWD, setShowPWD] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [showPWD2, setShowPWD2] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const handleShowPWD = () => {
    setShowPWD(!showPWD);
  };
  const handleShowPWD2 = () => {
    setShowPWD2(!showPWD2);
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
  } = useFormik({
    initialValues: {
      email: '',
      validCode: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        toast.promise(
          register(
            values.email,
            values.validCode,
            values.name,
            values.password
          ),
          {
            loading: '註冊中',
            success: (result) => {
              if (!result.success) {
                throw new Error(result.error);
              }
              switchHandler();
              resetForm();
              return '註冊成功';
            },
            error: (e) => {
              return `${e}`;
            },
          }
        );
      } catch (e) {
        console.log('error:', e);
      }
    },
  });

  const sendValidCode = async () => {
    try {
      const r = await fetch(SENDOTP_POST, {
        method: 'POST',
        body: JSON.stringify({ email: values.email }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await r.json();
      // console.log('FETCH 要求 驗證碼之結果:', result);
      return result;
    } catch (error) {
      console.log('發信時發生錯誤:', error);
      return { success: false, error: '發信時發生錯誤' }; // 如果發生錯誤，返回一個錯誤對象
    }
  };

  //按下後發送寄信
  const handleCodeClick = async () => {
    try {
      const result = await sendValidCode(); // 使用 await 等待 sendValidCode 函數的返回結果
      // console.log('發信成功前:', result);
      if (!result.success) {
        toast.error(result.error, { duration: 1500 });
        return;
      }
      // 檢查是否成功發送驗證碼
      if (!hasSent && result.success) {
        setHasSent(true);
        toast.success(result.message, { duration: 1500 });
      }
    } catch (error) {
      console.log('按下發信按鍵時發生錯誤:', error);
    }
  };

  //計時60秒
  useEffect(() => {
    let timer;
    if (hasSent) {
      timer = setTimeout(() => {
        setCountdown(60);
        const interval = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
          setHasSent(false);
        }, 60000);
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [hasSent]);

  return (
    <>
      <div
        className={`flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-4 lg:px-8 `}
      >
        <p className="font-bold text-center text-h3 text-dark">建立帳戶</p>
        <div className="text-center ">
          <p className="font-semibold text-red-500 text-[11px] mb-2 ">
            輸入 8-16 個字元，需包含大小寫英文、數字及特殊符號。
          </p>
        </div>
        <form
          className="flex flex-col "
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label
              className={`flex items-center gap-2 rounded-full input h-[37px] input-bordered bg-slate-300 ${
                errors.email && touched.email ? 'input-error ' : ''
              }`}
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
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                type="email"
                className={`grow text-slate-700 `}
                placeholder="Email"
                // autoComplete="email"
              />
            </label>
            {errors.email && touched.email ? (
              <p className="text-[12px] text-red-500 ms-4  mb-2 mt-1">
                {errors.email}
              </p>
            ) : (
              <p className="mt-[22px] mb-2 "> </p>
            )}
          </div>
          <div className="relative flex flex-col">
            <label
              className={`flex items-center gap-2 rounded-full input h-[37px] input-bordered bg-slate-300 ${
                errors.validCode && touched.validCode ? 'input-error ' : ''
              }`}
            >
              <RiPassValidFill className="w-4 h-4 min-w-[14px] opacity-70 " />
              <input
                id="validCode"
                name="validCode"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.validCode}
                type="text"
                className={`grow text-slate-700 `}
                placeholder="ValidCode"
                autoComplete="off"
              />
            </label>
            <div
              className={`${
                hasSent
                  ? ' cursor-no-drop bg-opacity-60 border-slate-400 hover:bg-opacity-60 hover:bg-dark'
                  : ' '
              } duration-0 absolute right-[1px] text-light bg-dark top-[1px] px-[8px] rounded-r-full min-h-[35px] h-[35px] btn `}
              title="發送驗證碼"
              onClick={handleCodeClick}
            >
              {hasSent ? (
                <>
                  <span className="countdown">
                    <span style={{ '--value': countdown }}></span>秒後刷新
                  </span>
                </>
              ) : (
                '發送驗證碼'
              )}
            </div>
            {errors.validCode && touched.validCode ? (
              <p className="text-[12px] text-red-500 ms-4  mb-2 mt-1">
                {errors.validCode}
              </p>
            ) : (
              <p className="mt-[22px] mb-2 "> </p>
            )}
          </div>
          <div className="flex flex-col ">
            <label
              className={`flex items-center gap-2 rounded-full input h-[37px] input-bordered bg-slate-300 ${
                errors.name && touched.name ? 'input-error ' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 min-w-[14px] opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                id="name"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                type="text"
                className={`grow text-slate-700`}
                placeholder="Username"
                // autoComplete="username"
              />
            </label>
            {errors.name && touched.name ? (
              <p className="text-[12px] text-red-500 ms-4 mb-2 mt-1">
                {errors.name}
              </p>
            ) : (
              <p className="mt-[22px] mb-2 "> </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              className={`relative flex items-center gap-2 rounded-full input h-[37px] input-bordered bg-slate-300 ${
                errors.password && touched.password ? 'input-error ' : ''
              }`}
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
                id="password"
                name="password"
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                type={showPWD ? 'text' : 'password'}
                className={`grow text-slate-700`}
                placeholder="Password"
                // autoComplete="new-password"
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
              <p className="text-[12px] text-red-500 ms-4 mb-2 mt-1">
                {errors.password}
              </p>
            ) : (
              <p className="mt-[22px] mb-2 "> </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              className={`relative flex items-center gap-2 rounded-full input h-[37px] input-bordered bg-slate-300 ${
                errors.confirmPassword && touched.confirmPassword
                  ? 'input-error '
                  : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className=" w-4 h-4 min-w-[14px] opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="absolute top-2 left-[9px]  w-4 h-4 min-w-[14px] opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                id="confirmPassword"
                name="confirmPassword"
                onFocus={() => setIsFocused2(true)}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                type={showPWD2 ? 'text' : 'password'}
                className={`grow text-slate-700`}
                placeholder="ConfirmPassword"
                // autoComplete="new-password"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className={`${
                  isFocused2 ? 'block' : 'hidden'
                } w-5 h-5 min-w-[14px] cursor-pointer opacity-70 text-dark absolute right-4`}
                onClick={handleShowPWD2}
              >
                {showPWD2 ? <FaEyeSlash /> : <FaEye />}
              </svg>
            </label>
            {errors.confirmPassword && touched.confirmPassword ? (
              <p className="text-[12px] text-red-500 ms-4 mb-2 mt-1">
                {errors.confirmPassword}
              </p>
            ) : (
              <p className="mt-[22px] mb-2 "> </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full px-4 py-2 text-center transition duration-200 ease-in bg-white border-2 rounded-full mb-0font-semibold md:mx-auto text-dark border-slate-200 hover:bg-slate-200 hover:border-slate-400 focus:ring-slate-500 focus:ring-offset-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="w-full">註冊</span>
          </button>
        </form>

        <button
          onClick={switchHandler}
          className="w-full px-4 py-2 mx-auto mt-8 mb-4 font-bold text-white border-2 rounded-xl md:mt-14 hover:text-primary btn-primary bg-dark border-dark hover:shadow-xl3 md:hidden"
        >
          會員登入
        </button>
      </div>
    </>
  );
}
