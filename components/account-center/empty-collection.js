import { RxCrossCircled } from 'react-icons/rx';
import Link from 'next/link';

export default function EmptyCollection({ itemType, linkPath }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] text-gray-200">
      <RxCrossCircled className="text-6xl mb-4 text-[#a0ff1f] opacity-50" />
      <p className="text-xl">目前沒有收藏的{itemType}</p>
      <Link
        href={linkPath}
        className="mt-4 btn bg-transparent text-[#a0ff1f] px-8 border border-[#a0ff1f] rounded-full hover:bg-[#a0ff1f] hover:text-black hover:border-[#a0ff1f]"
      >
        去探索{itemType}
      </Link>
    </div>
  );
}
