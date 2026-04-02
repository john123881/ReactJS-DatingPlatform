import Footer from '@/components/ui/footer/footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from '@/components/ui/navbar/navbar';
import '@/styles/globals.css';
import { useState } from 'react';
import { AuthContextProvider } from '@/context/auth-context';
import { NotifyProvider } from '@/context/use-notify';
import { LoaderProvider } from '@/context/use-loader';
import { PostProvider } from '@/context/post-context';
import { CollectProvider } from '@/context/use-collect';
import { BarProvider } from '@/context/bar-context';
import LoginModal from '@/components/ui/login-modal/login-modal';

export default function App({ Component, pageProps }) {
  const [currentPageTitle, setCurrentPageTitle] = useState('');
  const handlePageChange = (pageTitle) => {
    setCurrentPageTitle(pageTitle);
  };
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <AuthContextProvider>
        <BarProvider>
          <LoaderProvider>
            <NotifyProvider>
              <CollectProvider>
                <PostProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navbar currentPageTitle={currentPageTitle} />
                    <LoginModal />
                    <main className="flex-grow">
                      {getLayout(
                        <Component
                          {...pageProps}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </main>
                    <SpeedInsights />
                    <Footer />
                  </div>
                </PostProvider>
              </CollectProvider>
            </NotifyProvider>
          </LoaderProvider>
        </BarProvider>
      </AuthContextProvider>
    </>
  );
}
