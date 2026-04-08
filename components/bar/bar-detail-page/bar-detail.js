import Breadcrumbs from '@/components/bar/breadcrumbs/breadcrumbs';
import BarDetailCard from '@/components/bar/card/bar-detail-card';

export default function BarDetail() {
  const currentPage = 'Fake Sober';

  return (
    <>

      <div className="flex flex-row pt-28 justify-center">
        <div className="lg:basis-9/12">
          <Breadcrumbs currentPage={currentPage} />
          <BarDetailCard />
        </div>
      </div>
    </>
  );
}
