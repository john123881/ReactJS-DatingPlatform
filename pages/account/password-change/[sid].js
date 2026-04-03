import { useState, useEffect } from 'react';
import AccountLayout from '@/components/account-center/account-layout';
// import ChangePWSuccessModal from '@/components/account-center/modal/change-pw-success-modal';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import { changePasswordSchema } from '@/components/schemas';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useAccountAuth } from '@/hooks/use-account-auth';
import { AccountService } from '@/services/account-service';
import { useNotify } from '@/context/use-notify';
import PageLoader from '@/components/ui/loader/page-loader';
import { useLoader } from '@/context/use-loader';
import { toast as customToast } from '@/lib/toast';

export default function AccountPasswordChange({ onPageChange }) {
  const [showOldPWD, setOldShowPWD] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);
  const [showNewPWD, setNewShowPWD] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [showConfirmNewPWD, setConfirmNewShowPWD] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);
  const { auth } = useAuth();
  const { isLoading } = useAccountAuth(async () => {
    onPageChange(pageTitle);
  });
  const router = useRouter();

  const handleShowOldPWD = () => {
    setOldShowPWD(!showOldPWD);
  };
  const handleShowNewPWD = () => {
    setNewShowPWD(!showNewPWD);
  };
  const handleShowConfirmNewPWD = () => {
    setConfirmNewShowPWD(!showConfirmNewPWD);
  };

  const pageTitle = '會員中心';
  const currentPage = '更改密碼';

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
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      customToast.loading('正在保存...');
      
      try {
        // 發送所有欄位，後端要求包含 confirmNewPassword 進行驗證
        const { password, newPassword, confirmNewPassword } = values;
        const result = await AccountService.changePassword(auth.id, { 
          password, 
          newPassword, 
          confirmNewPassword 
        });
        if (!result.success) {
          throw new Error(result.error || '更改密碼失敗');
        }
        
        customToast.success('更改密碼成功', '即將跳轉回個人首頁');
        
        // 清除表單數據以確保安全
        resetForm();
        
        setTimeout(() => {
          router.push(`/account/index/${auth.id}`);
        }, 1500);
      } catch (error) {
        customToast.error('更改密碼失敗', error.message || error.toString());
      }
    },
  });


  return (
    <AccountLayout currentPage={currentPage}>

            {isLoading ? (
              <PageLoader type="password" />
            ) : (
              <>
                <form autoComplete="on" onSubmit={handleSubmit}>
                  {/* Accessibility: hidden username field */}
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={auth.username || auth.email || ''}
                    readOnly
                    className="hidden"
                  />
                  {/* CONTENT1 START */}
                  <div className="flex flex-col h-full lg:mx-1 xl:mx-1 2xl:mx-12 lg:flex-row card bg-base-300 rounded-box place-items-center">
                    <div className="container">
                      <div className="flex flex-row items-center justify-center mx-4 me-4 sm:me-16 lg:justify-start mt-7 ">
                        <p className="text-center ms-2 basis-1/2 lg:ms-0 ">
                          目前密碼：
                        </p>
                        <div className="relative basis-1/2">
                          <input
                            value={values.password}
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            onFocus={() => setIsFocused1(true)}
                            type={showOldPWD ? 'text' : 'password'}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            className={`w-full input-sm input input-bordered ${
                              errors.password && touched.password
                                ? 'input-error'
                                : ''
                            }`}
                          />

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className={` ${
                              isFocused1 ? 'block' : 'hidden'
                            } absolute right-4 w-5 h-5 cursor-pointer top-[6px] opacity-70 text-dark`}
                            onClick={handleShowOldPWD}
                          >
                            {showOldPWD ? <FaEyeSlash /> : <FaEye />}
                          </svg>

                          {errors.password && touched.password && (
                            <p className="absolute bottom-[-21px] mx-2 text-red-500 basis-full lg:justify-start text-[12px]">
                              {errors.password}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-center mx-4 lg:justify-start mt-7 me-4 sm:me-16">
                        <p className="text-center ms-2 basis-1/2 lg:ms-0 ">
                          新密碼：
                        </p>
                        <div className="relative basis-1/2">
                          <input
                            value={values.newPassword}
                            name="newPassword"
                            id="newPassword"
                            autoComplete="new-password"
                            onFocus={() => setIsFocused2(true)}
                            type={showNewPWD ? 'text' : 'password'}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            className={`w-full input-sm input input-bordered ${
                              errors.newPassword && touched.newPassword
                                ? 'input-error'
                                : ''
                            }`}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className={` ${
                              isFocused2 ? 'block' : 'hidden'
                            } absolute right-4 w-5 h-5 cursor-pointer top-[6px] opacity-70 text-dark`}
                            onClick={handleShowNewPWD}
                          >
                            {showNewPWD ? <FaEyeSlash /> : <FaEye />}
                          </svg>
                          {errors.newPassword && touched.newPassword && (
                            <p className="absolute bottom-[-21px] mx-2 text-red-500 basis-full lg:justify-start text-[12px]">
                              {errors.newPassword}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-center mx-4 lg:justify-start mt-7 me-4 sm:me-16">
                        <p className="text-center ms-2 basis-1/2 lg:ms-0 ">
                          新密碼確認：
                        </p>
                        <div className="relative basis-1/2">
                          <input
                            value={values.confirmNewPassword}
                            name="confirmNewPassword"
                            id="confirmNewPassword"
                            autoComplete="new-password"
                            onFocus={() => setIsFocused3(true)}
                            type={showConfirmNewPWD ? 'text' : 'password'}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            className={`w-full input-sm input input-bordered ${
                              errors.confirmNewPassword &&
                              touched.confirmNewPassword
                                ? 'input-error'
                                : ''
                            }`}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className={` ${
                              isFocused3 ? 'block' : 'hidden'
                            } absolute right-4 w-5 h-5 cursor-pointer top-[6px] opacity-70 text-dark`}
                            onClick={handleShowConfirmNewPWD}
                          >
                            {showConfirmNewPWD ? <FaEyeSlash /> : <FaEye />}
                          </svg>
                          {errors.confirmNewPassword &&
                            touched.confirmNewPassword && (
                              <p className="absolute bottom-[-21px] mx-2 text-red-500 basis-full lg:justify-start text-[12px]">
                                {errors.confirmNewPassword}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="flex justify-end mt-[30px] mx-4 mb-8 sm:mx-14 md:mx-16 lg:mx-14 xl:mx-16 2xl:mx-16">
                        <div className="flex flex-col justify-center sm:flex-row sm:justify-end basis-full sm:basis-2/3">
                          <button
                            type="submit"
                            className="btn min-h-[40px] h-[40px] mt-4  sm:w-[140px] rounded-full border-dark  btn-primary  bg-primary hover:bg-primary hover:shadow-xl3 hover:border-primary font-bold"
                          >
                            確定更改
                          </button>
                          <Link
                            href={`/account/index/${auth.id}`}
                            className="btn min-h-[40px] h-[40px]  mt-4 sm:w-[140px] sm:ml-4 rounded-full  btn-outline bg-dark btn-md hover:bg-dark text-primary hover:text-primary hover:shadow-xl3 hover:border-dark"
                          >
                            取消更改
                          </Link>

                          {/* <ChangePWSuccessModal /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* CONTENT1 END */}
                </form>
              </>
            )}
    </AccountLayout>
  );
}
