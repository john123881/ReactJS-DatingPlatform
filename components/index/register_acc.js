import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const IndexHeart = dynamic(() => import('@/components/ui/animation/heart/index-heart'), { ssr: false });
const FireworkAnimation = dynamic(() => import('@/components/ui/animation/firework/firework-animation'), { ssr: false });
const FireworkAnimationRight = dynamic(() => import('@/components/ui/animation/firework/firework-animation-right'), { ssr: false });

export default function RegisterAcc() {
  const { auth, setLoginModalToggle, switchHandler, isOnLoginPage, setIsOnLoginPage } =
    useAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div
        className="relative flex flex-col items-center justify-end bg-no-repeat bg-cover"
        style={{
          backgroundImage: 'url(/index_background_2.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <IndexHeart />

        {/* <div className="absolute top-[-100px] left-0">
          <FireworkAnimation />
        </div>
        <div className="absolute top-[-100px] right-0 hidden md:block">
          <FireworkAnimationRight />
        </div> */}
        {auth.id ? (
          <>
            <div className="z-10 flex flex-col items-center justify-center mb-[250px]">
              <Link href="/community">
                <button className="w-40 py-1 my-2 text-black border-2 rounded-full md:w-80 h-[55px] md:py-2 btn-primary bg-primary border-primary hover:shadow-xl3 transition-all active:scale-95">
                  探索社群
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="z-10 flex flex-col items-center justify-center mb-[250px]">
              <button
                onClick={() => setLoginModalToggle(true)}
                className="w-40 py-1 my-2 text-black border-2 rounded-full md:w-80 h-[55px] md:py-2 btn-primary bg-primary border-primary hover:shadow-xl3"
              >
                登入會員
              </button>
              <button
                onClick={() => {
                  setIsOnLoginPage(false);
                  setLoginModalToggle(true);
                }}
                className="w-40 py-1 my-2 bg-black border-2 rounded-full md:w-80 h-[55px] md:py-2 border-primary text-primary hover:shadow-xl3"
              >
                建立帳號
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
