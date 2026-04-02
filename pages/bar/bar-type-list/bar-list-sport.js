import BarListView from '@/components/bar/bar/bar-list-view';

export default function BarListSport({ onPageChange }) {
  return (
    <BarListView
      category="sport"
      title="運動酒吧"
      loaderText="尋找美酒中..."
      onPageChange={onPageChange}
    />
  );
}
