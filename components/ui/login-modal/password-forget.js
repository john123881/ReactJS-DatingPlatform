import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { forgetPasswordSchema } from '@/components/schemas';
import {
  SENDOTP_FORGETPWD_POST,
  FORGETPWD_PUT,
} from '@/components/config/api-path';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { RiPassValidFill } from 'react-icons/ri';
import { useNotify } from '@/context/use-notify';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function PasswordForget({
  setPasswordForgetBtn,
  switchHandler,
  loginResetForm,
}) {
  const [hasCheckPWDOTD, setHasCheckPWDOTD] = useState(true);
  const [hasSentOTP, setHasSentOTP] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPWD, setShowPWD] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);
  const [showPWD2, setShowPWD2] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const { notifyPromise } = useNotify();

  const handleShowNewPWD = () => {
    setShowPWD(!showPWD);
  };
  const handleShowConfirmNewPWD = () => {
    setShowPWD2(!showPWD2);
  };

  const sendOTPForForgetPWD = async () => {
    try {
      const r = await fetch(SENDOTP_FORGETPWD_POST, {
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
  const handleOTPClick = async () => {
    try {
      const result = await sendOTPForForgetPWD(); // 使用 await 等待 sendValidCode 函數的返回結果
      console.log('發信成功拿到回傳result:', result);
      if (!result.success) {
        toast.error(result.error, { duration: 1500 });
        return;
      }
      // 檢查是否成功發送驗證碼
      if (!hasSentOTP && result.success) {
        setHasSentOTP(true);
        toast.success(result.message, { duration: 1500 });
      }
    } catch (error) {
      console.log('按下發信按鍵時發生錯誤:', error);
    }
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
      password: '',
      confirmPassword: '',
    },
    validationSchema: forgetPasswordSchema,
    onSubmit: async (values) => {
      const fetchChangeForgetPWD = async () => {
        try {
          const r = await fetch(FORGETPWD_PUT, {
            method: 'PUT',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' },
          });
          const result = await r.json();
          console.log('返回來的Result:', result);
          return result;
        } catch (error) {
          throw error;
        }
      };

      notifyPromise(fetchChangeForgetPWD, {
        loading: '正在保存...',
        success: (result) => {
          if (!result.success) {
            throw result.error;
          }
          // router.push(`/account/index/${auth.id}`);
          setPasswordForgetBtn(false);
          loginResetForm();
          return result.message;
        },
        error: (error) => `${error.toString()}`,
      });

      // try {
      // } catch (e) {
      //   console.log('error:', e);
      // }
    },
  });

  //計時60秒
  useEffect(() => {
    let timer;
    if (hasSentOTP) {
      timer = setTimeout(() => {
        setCountdown(60);
        const interval = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
          setHasSentOTP(false);
        }, 60000);
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [hasSentOTP]);
  return (
    <>
      <div className="flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-4 lg:px-8">
        <div className="relative flex items-center justify-center mt-6">
          <a
            onClick={(e) => {
              e.preventDefault();
              setPasswordForgetBtn(false);
              loginResetForm();
            }}
            className="absolute left-0 font-bold text-center bg-white border-0 rounded-full cursor-pointer text-h3 text-dark btn hover:bg-slate-200 h-[45px] w-[45px]"
          >
            ←
          </a>
          <p className="font-bold text-center text-h3 text-dark ">忘記密碼</p>
          <div> </div>
        </div>
        <div className="font-semibold text-red-500 text-center text-[11px] mb-4 ">
          輸入 8-16 個字元，需包含大小寫英文、數字及特殊符號。
        </div>

        <form className="flex flex-col " onSubmit={handleSubmit}>
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
                hasSentOTP
                  ? ' cursor-no-drop bg-opacity-60 border-slate-400 hover:bg-opacity-60 hover:bg-dark'
                  : ' '
              } duration-0 absolute right-[1px] text-light bg-dark top-[1px] px-[8px] rounded-r-full min-h-[35px] h-[35px] btn `}
              title="發送驗證碼"
              onClick={handleOTPClick}
            >
              {hasSentOTP ? (
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
                onFocus={() => setIsFocused1(true)}
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
                  isFocused1 ? 'block' : 'hidden'
                } w-5 h-5 min-w-[14px] cursor-pointer opacity-70 text-dark absolute right-4`}
                onClick={handleShowNewPWD}
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
                autoComplete="new-password"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className={`${
                  isFocused2 ? 'block' : 'hidden'
                } w-5 h-5 min-w-[14px] cursor-pointer opacity-70 text-dark absolute right-4`}
                onClick={handleShowConfirmNewPWD}
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
            type="submit"
            className="w-full px-4 py-2 mt-2 font-semibold text-center transition duration-200 ease-in bg-white border-2 rounded-full md:mx-auto text-dark border-slate-200 hover:bg-slate-200 hover:border-slate-400 focus:ring-slate-500 focus:ring-offset-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 "
          >
            送出
          </button>
        </form>

        <button
          onClick={switchHandler}
          className="w-full px-4 py-2 mx-auto font-bold border-2 rounded-xl mt-14 text-primary btn-primary bg-dark border-dark hover:shadow-xl3 md:hidden"
        >
          會員註冊
        </button>
      </div>
      s
    </>
  );
}
