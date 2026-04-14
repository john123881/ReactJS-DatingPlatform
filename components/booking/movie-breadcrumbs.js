import Link from 'next/link';

export default function MovieBreadcrumbs({ currentGenre }) {
  return (
    <div className="text-sm breadcrumbs py-0 mb-2">
      <ul className="text-white/40">
        <li>
          <Link href="/" className="hover:text-neongreen transition-colors">首頁</Link>
        </li>
        <li>
          <Link href="/booking" className="hover:text-neongreen transition-colors">電影探索</Link>
        </li>
        <li>
          <Link href="/booking/movie-list" className="hover:text-neongreen transition-colors">電影列表</Link>
        </li>
        {currentGenre && (
          <li className="text-white/80">{currentGenre}</li>
        )}
      </ul>
    </div>
  );
}
