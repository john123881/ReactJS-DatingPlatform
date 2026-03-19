import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/configs/api-config';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdStar } from 'react-icons/io';
import { BsTelephone } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaRegHeart } from 'react-icons/fa';
import BarRatingModal from '@/components/bar/modal/bar-rating-modal';

export default function BarDetailCard() {
  const [bars, setBars] = useState([]);

  const getBarList = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/bar/bar-list`);
      const data = await res.json();
      setBars(data);
    } catch (error) {
      console.log('Failed to fetch bar list:', error);
    }
  };

  useEffect(() => {
    getBarList();
  }, []);

  return (
    <>
      <div className="md:space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bar-detail-content text-white space-y-5">
            <div className="space-y-1 md:w-full">
              <div className="text-h4 md:text-h3">{bars.bar_name}</div>
              <div className="review flex gap-2 items-center">
                <p className="text-h4 md:text-[20px]">{bars.rating}</p>
                <div className="bar-detail-stars flex gap-1 rating rating-sm">
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-[#A0FF1F]"
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-[#A0FF1F]"
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-[#A0FF1F]"
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-[#A0FF1F]"
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-[#A0FF1F]"
                    checked
                    readOnly
                  />
                </div>
                <p className="text-[13px] md:text-h6">
                  {'('}21 則評論{')'}
                </p>
              </div>
              <div className="flex gap-4 text-[13px] md:text-h6">
                <div className="text-white">大安區</div>
                <div className="text-white">特色酒吧</div>
              </div>
              <div className="flex telephone gap-4">
                <BsTelephone />
                <div className="text-white text-[13px] md:text-h6">
                  0227220723
                </div>
              </div>
              <div className="flex address gap-4">
                <HiOutlineLocationMarker />
                <div className="text-white text-[13px] md:text-h6">
                  台北市信義區松壽路20號
                </div>
              </div>
              <div className="text-white text-[13px] md:text-h6 text-justify md:w-full">
                Fake Sober, 位在信義威秀後方，
                許多人說他有美國又或是韓國感的咖啡館，半開放式的空間到了夜晚還有
                DJ 表演，甚至供應雞尾酒、啤酒與披薩，不趕時間的話可以很 Chill
                的在這裡從白天待到晚間時刻，雖然那日是下午到訪，不過我們也舒服待上幾小時呢！
              </div>
            </div>
            <div className="bar-detail-button-group flex items-center gap-4">
              <button>
                <div className="badge badge-outline border-[#A0FF1F] text-white h-[28px]">
                  <FaRegHeart className="mr-1" />
                  加入收藏
                </div>
              </button>
              <button>
                <div className="badge badge-outline border-[#A0FF1F] text-white h-[28px]">
                  加入行程
                </div>
              </button>
              <div
                type="submit"
                onClick={() =>
                  document.getElementById('bar-rating-modal').showModal()
                }
              >
                <div className="badge badge-outline border-[#A0FF1F] text-white h-[28px]">
                  留下評論
                </div>
                <BarRatingModal />
              </div>
            </div>
            <Link
              href="/bar/bar-booking"
              className="btn w-[320px] text-black text-[15px] bg-[#A0FF1F] border-none rounded-[20px] flex items-center justify-center"
            >
              立即訂位
            </Link>
          </div>
          <div className="bar-detail-img">
            <Image
              className="object-cover rounded-[10px] w-[328px] h-[300px] md:w-[440px] md:h-[400px]"
              src="https://damei17.com/wp-content/uploads/2022/08/Fake-Sober-24.jpg"
              alt="酒吧封面照"
              width={440}
              height={400}
            />
          </div>
        </div>
        <div className="google-map hidden md:flex">
          <Image
            src="/images/googleMap.png"
            width={1062}
            height={741}
            alt="map"
            className="rounded-[20px]"
          />
        </div>
      </div>
    </>
  );
}
