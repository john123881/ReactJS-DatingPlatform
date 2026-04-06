import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { BiHardHat } from 'react-icons/bi';
import { IoArrowBackOutline } from 'react-icons/io5';
import PageLoader from '@/components/ui/loader/page-loader';

export default function UnderConstruction({ onPageChange }) {
  const router = useRouter();
  const pageTitle = '功能開發中';

  useEffect(() => {
    if (onPageChange) onPageChange(pageTitle);
  }, [onPageChange]);

  return (
    <>
      <Head>
        <title>施工中 | Taipei Date</title>
      </Head>
      
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 opacity-10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Main Content Card */}
        <div className="relative z-10 w-full max-w-2xl text-center space-y-8 p-12 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
          
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse"></div>
              <div className="bg-dark/50 p-6 rounded-3xl border border-primary/30 relative">
                <BiHardHat className="text-8xl text-primary animate-bounce" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              UNDER <span className="text-primary italic">CONSTRUCTION</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
              此功能正在加緊趕工中！<br />
              為了帶給您更好的台北約會體驗，我們正在優化細節。
            </p>
          </div>
          
          {/* Progress Indicator Mockup */}
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="bg-primary h-full w-[70%] animate-pulse shadow-[0_0_15px_rgba(160,255,31,0.5)]"></div>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={() => router.back()}
              className="group flex items-center justify-center gap-2 mx-auto px-8 py-4 bg-primary text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <IoArrowBackOutline className="text-xl group-hover:-translate-x-1 transition-transform" />
              返回上一頁
            </button>
          </div>
          
          <div className="pt-4 flex justify-center gap-8 opacity-40 grayscale pointer-events-none">
            <div className="flex items-center gap-2 text-xs text-white tracking-widest font-bold">
              {new Date().getFullYear()}
            </div>
            <div className="flex items-center gap-2 text-xs text-white tracking-widest font-bold uppercase">
              Taipei Date
            </div>
          </div>
          
        </div>
        
        {/* Floating Icons Decors */}
        <div className="absolute top-20 right-[15%] text-primary/20 text-4xl rotate-12 hidden lg:block">{'</>'}</div>
        <div className="absolute bottom-40 left-[10%] text-primary/20 text-4xl -rotate-12 hidden lg:block italic">Coming Soon</div>
      </div>

      <style jsx>{`
        .bg-dark {
          background-color: #000000;
        }
        .text-primary {
          color: #A0FF1F;
        }
        .bg-primary {
          background-color: #A0FF1F;
        }
        .border-primary\/30 {
          border-color: rgba(160, 255, 31, 0.3);
        }
        .shadow-primary\/20 {
          box-shadow: 0 10px 30px rgba(160, 255, 31, 0.2);
        }
      `}</style>
    </>
  );
}
