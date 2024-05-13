import React from 'react';
import LeftLogin from '@/components/ui/login-modal/left-login';
import RightLogin from '@/components/ui/login-modal/right-login';
import { useAuth } from '@/context/auth-context';
import PeopleAnimation from '@/components/account-center/animation/people-animation';
import LoginBackgroundAnimation from '@/components/ui/animation/login-background-animation';

export default function LoginModal() {
  const {
    loginModalToggle,
    setLoginModalToggle,
    switchHandler,
    isOnLogin,
  } = useAuth();

  return (
    <>
      {loginModalToggle && (
        <>
          <div
            className={`overflow-y-auto modal ${
              loginModalToggle ? 'opacity-100' : 'opacity-0 hidden'
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            <div className=" w-11/12 max-w-[100%] md:max-w-[68%] lg:max-w-[54%] xl:max-w-[50%] min-h-[450px] md:h-[550px] items-center flex modal-box overflow-y-clip  bg-light p-0 rounded-3xl">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => {
                  isOnLogin ? '' : switchHandler();
                  setLoginModalToggle(false);
                }}
                className={`absolute z-30 btn btn-sm text-gray-500 btn-circle btn-ghost right-2 top-2 md:text-`}
              >
                ✕
              </button>
              {/* if there is a button in form, it will close the modal */}
              <div className="relative flex flex-wrap w-full min-h-[610px] md:min-h-full ">
                <div
                  className={`flex flex-col w-full min-h-[399px] md:w-1/2 my-5 ease-in-out duration-1000  ${
                    isOnLogin ? '' : ' md:translate-x-[100%] '
                  } `}
                >
                  {isOnLogin ? (
                    <>
                      {/* LeftSide */}
                      <LeftLogin switchHandler={switchHandler} />
                    </>
                  ) : (
                    <>
                      {/* RightSide */}
                      <RightLogin
                        isOnLogin={isOnLogin}
                        switchHandler={switchHandler}
                      />
                    </>
                  )}
                </div>

                {/* Slider */}
                <div
                  className={`${
                    isOnLogin ? '' : 'translate-x-[-100%] '
                  } duration-1000 ease-in-out w-1/2 rounded-[24px] absolute pt-[33px] right-0 min-h-full outline-4 outline-gray-400 max-h-[600px] bg-cover bg-dark items-center p-4  text-center hidden md:block z-20 `}
                >
                  <div className="relative flex flex-col items-center justify-between">
                    <div
                      className={`font-bol  text-nowrap text-neongreen ${
                        isOnLogin
                          ? 'text-[40px] mb-[4.5px]'
                          : 'text-h1 max-h-[64.8px] '
                      }`}
                    >
                      {`${isOnLogin ? 'Hello, Friend!' : '歡迎回來！  '} `}
                    </div>
                    <div className="px-4 min-h-[51px]  relative z-20 ">
                      <div className="px-4 font-bold text-[19px] mt-[170px] text-dark z-30">
                        註冊並開始認識新朋友及使用網站所有功能 ！
                      </div>
                      <div className="relative flex flex-col items-center justify-center w-full mt-[-95px] ">
                        <PeopleAnimation isOnLogin={isOnLogin} />
                      </div>
                    </div>
                    <button
                      onClick={switchHandler}
                      className="py-2 px-4 z-20 font-bold mt-[-70px] max-w-[180px] rounded-xl hover:text-primary text-white w-full border-2 md:py-2 btn-primary bg-dark border-dark hover:shadow-xl3"
                    >
                      {`${isOnLogin ? '會員註冊' : '會員登入'} `}
                    </button>
                  </div>
                  <div className="h-[310px} w-[100%] absolute top-[0px] left-0">
                    <LoginBackgroundAnimation isOnLogin={isOnLogin} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
