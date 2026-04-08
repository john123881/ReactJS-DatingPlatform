import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

function TabBar({ tabs }) {
  const { auth, setLoginModalToggle } = useAuth();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 同步全站：捲動隱藏/顯示邏輯
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      if (currentScrollY > lastScrollY && currentScrollY > 64) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return (
    <>
      <div
        role="tablist"
        className={`w-full tabs tabs-bordered fixed top-16 bg-dark transition-all duration-300 ${
          showNav ? 'translate-y-0 opacity-100' : 'translate-y-[-100px] opacity-0 pointer-events-none'
        }`}
      >
        {tabs.map((tab, index) => (
          <Link
            key={index}
            href={tab.path} // 使用 href 屬性指定導頁的路徑
            role="tab"
            className={`tab ${tab.active ? 'tab-active' : ''}`}
            onClick={(e) => {
              if (tab.isProtected && auth.id === 0) {
                e.preventDefault();
                setLoginModalToggle(true);
              }
            }}
          >
            {tab.title}
          </Link>
        ))}
      </div>
    </>
  );
}

export default TabBar;
