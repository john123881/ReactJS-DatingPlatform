import Sidebar from '@/components/community/sidebar/sidebar';
import TabbarMobile from '@/components/community/tabbar/tabbarMobile';
import PageTitle from '@/components/page-title';

/**
 * CommunityLayout provides a persistent sidebar and mobile navigation
 * for all community-related pages.
 */
export default function CommunityLayout({ children }) {
  const pageTitle = '社群媒體';

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      
      {/* sidebar for mobile */}
      <div className="block md:hidden w-full">
        <TabbarMobile />
      </div>

      <div className="flex flex-col w-full pt-28 pb-20">
        <div className="flex flex-wrap justify-center w-full min-h-screen max-w-[1440px] mx-auto">
          {/* Persistent Sidebar */}
          <div className="hidden md:flex md:basis-2/12 border-r border-white/5">
            <Sidebar />
          </div>

          {/* Dynamic Content Area */}
          <div className="flex flex-col md:basis-10/12 w-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
