import Image from 'next/image';
import Link from 'next/link';
import { RxCrossCircled, RxDoubleArrowRight } from 'react-icons/rx';
import { getImageUrl, handleImageError } from '@/services/image-utils';

export default function MovieCollectCard({ movie, index, arrowHovered, onArrowHover, onDelete }) {
  const getBadgeStyle = (typeName) => {
    switch (typeName) {
      case '愛情': return { borderColor: '#FF69B4', color: '#FF69B4' };
      case '喜劇': return { borderColor: '#A0FF1F', color: '#A0FF1F' };
      case '劇情': return { borderColor: '#00BFFF', color: '#00BFFF' };
      case '動作': return { borderColor: '#FF4500', color: '#FF4500' };
      default: return { borderColor: '#A0FF1F', color: '#A0FF1F' };
    }
  };

  return (
    <div className="grid outline outline-1 outline-grayBorder z-10 rounded-xl my-2 w-[360px] sm:w-full grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px] overflow-hidden">
      <div className="shadow-xl card sm:card-side bg-base-200">
        <figure className="relative sm:w-[300px] h-[200px] sm:basis-1/3 overflow-hidden flex-shrink-0 bg-gray-800">
          <Image
            src={getImageUrl(movie.img, 'movie')}
            className="object-cover"
            alt={movie.img_name || 'No Image Available'}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            onError={(e) => handleImageError(e, 'movie')}
            unoptimized={true}
          />
        </figure>
        <div className="card-body h-[200px] relative pt-[20px] pb-[48px] sm:pe-[48px] sm:basis-2/3 min-w-0">
          <div className="font-bold text-white text-h5 truncate flex-grow min-w-0">
            {movie.title || movie.movie_name || movie.name}
          </div>
          
          <div className="flex gap-2 mb-2 min-h-6">
            <span className="badge badge-secondary badge-outline bg-gray-500/20 text-gray-300 border-gray-500">
              數位
            </span>
            <span
              className="badge badge-secondary badge-outline"
              style={getBadgeStyle(movie.type || movie.category || movie.subtitle)}
            >
              {movie.type || movie.category || movie.subtitle}
            </span>
          </div>

          <p className="text-sm text-gray-400 line-clamp-3">
            {(movie.description || movie.movie_description || '').length > 100
              ? (movie.description || movie.movie_description).substring(0, 100) + '...'
              : (movie.description || movie.movie_description)}
          </p>

          <RxCrossCircled
            onClick={() => onDelete(movie.save_id)}
            className="text-white absolute right-[12px] top-[12px] cursor-pointer hover:text-neongreen text-3xl z-20 transition-colors"
          />
          
          <div className="absolute bottom-[16px] right-[16px] justify-end card-actions">
            <Link
              href={`/booking/movie-booking-detail/${movie.movie_id}`}
              onMouseEnter={() => onArrowHover(index, true)}
              onMouseLeave={() => onArrowHover(index, false)}
              className="flex items-center cursor-pointer hover:text-neongreen text-sm font-bold transition-all"
            >
              <RxDoubleArrowRight
                className={`me-2 ${arrowHovered[index] ? 'translate-x-[5px]' : ''} transition-transform duration-300`}
              />
              查看詳情
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
