import Image from 'next/image';
import Link from 'next/link';
import { RxCrossCircled, RxDoubleArrowRight } from 'react-icons/rx';
import { getImageUrl, handleImageError } from '@/services/image-utils';

export default function PostCollectCard({ post, index, arrowHovered, onArrowHover, onDelete, onPostClick }) {
  const contextParts = (post.post_context || '').split('#');
  const mainText = contextParts[0];
  const hashtags = contextParts.slice(1);

  return (
    <div className="grid z-0 outline outline-1 outline-grayBorder rounded-xl my-2 w-[360px] sm:w-full grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px] overflow-hidden">
      <div className="shadow-xl card sm:card-side bg-base-200">
        <figure className="relative sm:w-[300px] h-[200px] sm:basis-1/3 overflow-hidden">
          <Image
            src={getImageUrl(post.img, 'post')}
            className="object-cover"
            alt={post.photo_name || 'No Image Available'}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            onError={(e) => handleImageError(e, 'post')}
          />
        </figure>
        <div className="card-body h-[200px] relative pe-[48px] sm:basis-2/3 pt-[20px] pb-[48px]">
          <Link
            className="absolute top-[20px] left-[32px] avatar me-2 group"
            href={`/community/profile/${post.post_userId}`}
          >
            <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden ring ring-offset-base-100 ring-offset-2 ring-gray-600 group-hover:ring-neongreen transition-all">
              <Image
                src={getImageUrl(post.avatar, 'avatar')}
                alt={post.photo_name || 'Avatar'}
                fill
                sizes="40px"
                className="object-cover"
                onError={(e) => handleImageError(e, 'avatar')}
              />
            </div>
          </Link>
          
          <div className="flex items-center ms-[54px] font-bold text-white text-h5 truncate pe-10">
            {post.email ? post.email.split('@')[0] : 'unknown'}
          </div>

          <div className="mt-2 text-sm text-gray-300 line-clamp-2">
            {mainText}
          </div>

          <div className="absolute bottom-[16px] left-[32px] flex flex-wrap gap-1">
            {hashtags[0] && (
              <div className="badge text-neongreen badge-sm badge-outline">#{hashtags[0]}</div>
            )}
            {hashtags[1] && (
              <div className="badge badge-secondary badge-sm badge-outline">#{hashtags[1]}</div>
            )}
            {hashtags[2] && (
              <div className="badge badge-info badge-sm badge-outline">#{hashtags[2]}</div>
            )}
          </div>

          <RxCrossCircled
            onClick={() => onDelete(post.save_id)}
            className="text-white absolute right-[10px] top-[10px] cursor-pointer hover:text-neongreen text-3xl z-20 transition-colors"
          />

          <div className="absolute bottom-[16px] right-[16px] justify-end card-actions">
            <span
              onClick={() => onPostClick(post, post.post_id)}
              onMouseEnter={() => onArrowHover(index, true)}
              onMouseLeave={() => onArrowHover(index, false)}
              className="flex items-center cursor-pointer hover:text-neongreen text-sm font-bold transition-all"
            >
              <RxDoubleArrowRight
                className={`me-2 ${arrowHovered[index] ? 'translate-x-[5px]' : ''} transition-transform duration-300`}
              />
              詳細內文
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
