import { useEffect, useState } from 'react';
import BarListView from '@/components/bar/bar/bar-list-view';

export default function BarListPage({ onPageChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <BarListView
      title="所有酒吧探索"
      onPageChange={onPageChange}
    />
  );
}
