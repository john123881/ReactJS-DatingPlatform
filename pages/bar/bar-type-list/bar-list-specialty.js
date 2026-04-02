import BarListView from '@/components/bar/bar/bar-list-view';

export default function BarListSpecialty({ onPageChange }) {
  return (
    <BarListView
      category="specialty"
      title="特色酒吧"
      loaderText="調製特色酒單中..."
      onPageChange={onPageChange}
    />
  );
}
