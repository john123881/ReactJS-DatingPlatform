import BarListView from '@/components/bar/bar/bar-list-view';

export default function BarListOthers({ onPageChange }) {
  return (
    <BarListView
      category="others"
      title="其他酒吧"
      loaderText="還有些有趣的酒吧..."
      onPageChange={onPageChange}
    />
  );
}
