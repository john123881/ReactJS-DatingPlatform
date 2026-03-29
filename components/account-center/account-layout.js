import Sidebar from './sidebar/sidebar';
import PageTitle from '@/components/page-title';
import Breadcrumbs from './breadcrumbs/breadcrumbs';
import BurgerMenu from './burgermenu/burger-menu';

/**
 * AccountLayout - 統一會員中心的佈局架構
 * @param {string} pageTitle - 瀏覽器標籤標題 (預設: 會員中心)
 * @param {string} currentPage - 目前頁面名稱 (用於 Breadcrumbs 與 Sidebar 啟動狀態)
 * @param {React.ReactNode} children - 頁面主要內容
 */
export default function AccountLayout({ 
  pageTitle = '會員中心', 
  currentPage, 
  children 
}) {
  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="bg-dark min-h-screen">
        <div className="flex w-full max-w-[1440px] mx-auto pt-10">
          <Sidebar currentPage={currentPage} />

          <div className="flex-1 w-full max-w-full px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-20">
            <div className="flex flex-col w-full ">
              <BurgerMenu currentPage={currentPage} />
              <Breadcrumbs currentPage={currentPage} />
              
              <div className="mt-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
