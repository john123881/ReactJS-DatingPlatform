import RegisterAcc from '@/components/index/register_acc';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function Home({ onPageChange }) {
  const pageTitle = '首頁';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 overflow-hidden">
        {/* <KeyView and Login  /> */}
        <RegisterAcc />

        {/* Other Theme */}

        {/* <div className="carousel carousel-center rounded-box w-full overflow-x-auto scrollbar-hide object-center md:gap-[120px] p-[120px]">
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
        </div> */}
      </div>
    </>
  );
}
