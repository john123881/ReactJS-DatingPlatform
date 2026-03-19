import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BarMap() {
  const router = useRouter();

  useEffect(() => {
    router.back();
  }, [router]);

  return null;
}
