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
  return (
    <>
      <AuthContextProvider>
        <BarProvider>
          <LoaderProvider>
            <NotifyProvider>
              <CollectProvider>
                <PostProvider>
                  <Navbar currentPageTitle={currentPageTitle} />
                  <LoginModal />
                  <Component {...pageProps} onPageChange={handlePageChange} />
                  <SpeedInsights />
                  <Footer />
                </PostProvider>
              </CollectProvider>
            </NotifyProvider>
          </LoaderProvider>
        </BarProvider>
      </AuthContextProvider>
    </>
  );
}
