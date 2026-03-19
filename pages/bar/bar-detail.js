import { useEffect } from 'react';
import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarDetailCard from '@/components/bar/card/bar-detail-card';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function BarDetail({ onPageChange }) {
  const pageTitle = '酒吧探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  const currentPage = 'Fake Sober';

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="fixed justify-center w-full h-8 mx-auto top-16 bg-dark">
        {/* <TabBar tabs={initialTabs} /> */}
      </div>

      <div className="flex flex-row justify-center pt-28">
        {/* 留 2/12 空白 */}
        <div className="w-1/12 md:w-2/12"></div>
        <div className="w-10/12 md:w-8/12">
          <div className="text-sm breadcrumbs">
            <Breadcrumbs currentPage={currentPage} />
          </div>
          <BarDetailCard />
        </div>
        <div className="w-1/12 md:w-2/12"></div>
      </div>
    </>
  );
}
