import Image from 'next/image';
import Link from 'next/link';
import { RxCrossCircled, RxDoubleArrowRight } from 'react-icons/rx';
import { getImageUrl, handleImageError } from '@/services/image-utils';

export default function BarCollectCard({ bar, index, arrowHovered, onArrowHover, onDelete }) {
  return (
    <div className="grid outline outline-1 outline-grayBorder z-10 rounded-xl my-2 w-[360px] sm:w-full grid-flow-row-dense grid-cols-1 grid-rows-1 gap-2 auto-rows-min sm:h-[200px] overflow-hidden">
      <div className="shadow-xl card sm:card-side bg-base-200 h-full">
        <figure className="relative sm:w-[300px] h-[200px] sm:basis-1/3 overflow-hidden flex-shrink-0 bg-gray-800">
          <Image
            src={getImageUrl(bar.img, 'bar')}
            className="object-cover"
            alt={bar.img_name || 'No Image Available'}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            onError={(e) => handleImageError(e, 'bar')}
            unoptimized={true}
          />
        </figure>
        <div className="card-body h-[200px] relative pt-[20px] pb-[48px] sm:pe-[48px] sm:basis-2/3 min-w-0">
          <div className="font-bold text-white text-h5 truncate flex-grow min-w-0">
            {bar.bar_name}
          </div>
          
          <div className="flex gap-2 mb-2 min-h-6">
            <span className={`badge ${
              bar.area === '松山區' ? 'bg-neongreen text-dark' : 
              bar.area === '信義區' ? 'badge-info' :
              bar.area === '大安區' ? 'bg-neonpink text-white' :
              bar.area === '中山區' ? 'badge-accent' :
              bar.area === '中正區' ? 'badge-success' :
              bar.area === '大同區' ? 'badge-warning' :
              bar.area === '萬華區' ? 'bg-slate-500 text-white' :
              bar.area === '文山區' ? 'badge-neutral' :
              bar.area === '南港區' ? 'badge-secondary' :
              bar.area === '內湖區' ? 'badge-error' :
              bar.area === '士林區' ? 'bg-red-900 text-white' :
              bar.area === '北投區' ? 'badge-primary' : 'badge-ghost'
            }`}>
              {bar.area}
            </span>
            <span className={`badge badge-outline ${
              bar.type === '運動酒吧' ? 'badge-secondary' : 
              bar.type === '音樂酒吧' ? 'badge-accent' : 
              bar.type === '異國酒吧' ? 'badge-warning' : 
              bar.type === '特色酒吧' ? 'badge-primary' : 'badge-ghost'
            }`}>
              {bar.type}
            </span>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2">
            {bar.description ? (bar.description.length > 80 ? bar.description.substring(0, 80) + '...' : bar.description) : ''}
          </p>

          <RxCrossCircled
            onClick={() => onDelete(bar.save_id)}
            className="text-white absolute right-[12px] top-[12px] cursor-pointer hover:text-neongreen text-3xl z-20 transition-colors"
          />
          
          <div className="absolute bottom-[16px] right-[16px] justify-end card-actions">
            <Link
              href={`/bar/bar-detail/${bar.bar_id}`}
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
