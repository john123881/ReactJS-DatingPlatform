import DateCard from '@/components/index/date_card';
import ThemeCard from '@/components/index/theme_card';
import RegisterAcc from '@/components/index/register_acc';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function Home({ onPageChange }) {
  const pageTitle = '首頁';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 overflow-hidden">
        {/* <KeyView and Login  /> */}
        <RegisterAcc />
        {/* Data */}
        <div className="carousel carousel-center rounded-box max-w-full overflow-x-auto scrollbar-hide md:gap-[120px] p-[80px] ">
          <div className="p-4 carousel-item">
            <DateCard
              title="Taipei Date浪漫啟程"
              paragraph="我們深知交友的重要性，提供了豐富的功能。無論喜歡電影、喝酒，還是喜歡規劃一天的行程，共同的興趣和活動可以成為一段關係的契機。"
              imageSrc="/date_index_1.jpg"
              altText="約會"
            />
          </div>
          <div className="p-4 carousel-item">
            <DateCard
              title="真誠約會，樂趣相伴！"
              paragraph="Taipei Date不只是一個約會平台，更是一個建立真誠連結的地方。鼓勵開放、坦誠的交流，讓每一場約會都充滿歡笑和深刻的感動。"
              imageSrc="/date_index_2.jpg"
              altText="約會"
            />
          </div>
          <div className="p-4 carousel-item">
            <DateCard
              title="突破框架，愉快約會"
              paragraph="以真誠交友和有趣出遊為核心的約會平台！致力於改變約會遊戲的規則，打破陳舊的框架開啟一段珍貴的關係。"
              imageSrc="/date_index_3.jpg"
              altText="約會"
            />
          </div>
        </div>

        <Link href="/date">
          <button className="w-40 py-1 my-2 text-black border-2 rounded-full md:w-80 h-[55px] md:py-2 btn-primary bg-primary border-primary hover:shadow-xl3">
            開始配對
          </button>
        </Link>

        {/* Other Theme */}

        <div className="carousel carousel-center rounded-box w-full overflow-x-auto scrollbar-hide object-center md:gap-[120px] p-[120px]">
          <div className="px-4 carousel-item ">
            <ThemeCard
              imagePic="/community_index.jpg"
              paragraphText="探索愛情與生活的精彩時刻！在我們的社交平台上，輕鬆發佈並分享您的美好時刻，一起編織社交新篇章。"
              buttonText="探索更多"
              link="/community"
            />
          </div>
          <div className="px-4 carousel-item">
            <ThemeCard
              imagePic="/bar-index.jpg"
              paragraphText="無論是想體驗運動酒吧的熱烈氛圍，享受音樂酒吧的現場演出，探索充滿特色的主題酒吧，還是沉浸在異國酒吧的獨特文化中，點擊探索都能滿足您的需求！"
              buttonText="立即探索!"
              link="/bar"
            />
          </div>
          <div className="px-4 carousel-item">
            <ThemeCard
              imagePic="/trip_index.jpg"
              paragraphText="安排屬於自己的完美行程，和剛結識的新朋友共享難忘的一天!利用我們提供的行程規劃功能，讓每一次約會都成為一段最完美的回憶!"
              buttonText="開始規劃"
              link="/trip"
            />
          </div>
          <div className="px-4 carousel-item">
            <ThemeCard
              imagePic="/movie_index.jpg"
              paragraphText="在電影院中一同沉浸在精彩的故事情節中，台北都擁有豐富的約會場所和活動，讓你與夥伴度過難忘的時刻！"
              buttonText="立即探索！"
              link="/booking"
            />
          </div>
        </div>
      </div>
    </>
  );
}
