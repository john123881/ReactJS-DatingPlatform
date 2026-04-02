import BarListView from '@/components/bar/bar/bar-list-view';

export default function BarListForeign({ onPageChange }) {
  return (
    <BarListView
      category="foreign"
      title="異國酒吧"
      loaderText="探索異國風情中..."
      onPageChange={onPageChange}
    />
  );
}
