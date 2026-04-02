import BarListView from '@/components/bar/bar/bar-list-view';

export default function BarListMusic({ onPageChange }) {
  return (
    <BarListView
      category="music"
      title="音樂酒吧"
      loaderText="音浪載入中..."
      onPageChange={onPageChange}
    />
  );
}
