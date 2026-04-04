import { IoMdStar } from 'react-icons/io';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { BarService } from '@/services/bar-service';
import { toast } from '@/lib/toast';

export default function BarCardIndex({ randomBar, savedBars, setSavedBars }) {
  const { auth, setLoginModalToggle } = useAuth();
  const isSaved = savedBars && savedBars[randomBar.bar_id];

  const handleSavedClick = async (e) => {
    e.preventDefault();
    if (auth.id === 0) {
      setLoginModalToggle(true);
      return;
    }
    const barId = randomBar.bar_id;
    const userId = auth.id;

    const wasSaved = isSaved || false;
    const newSavedState = !wasSaved;

    // 樂觀更新
    setSavedBars((prev) => ({ ...prev, [barId]: newSavedState }));
    toast.success(newSavedState ? '收藏成功!' : '已取消收藏!');

    try {
      if (wasSaved) {
        await BarService.unsaveBar(userId, barId);
      } else {
        await BarService.saveBar(userId, barId);
      }
    } catch (error) {
      console.error('Error updating save status:', error);
      setSavedBars((prev) => ({ ...prev, [barId]: wasSaved }));
      toast.error('操作失敗，請稍後再試');
    }
  };

  return (
    <div className="py-4">
      <div className="py-2">
        <div className="bar-card-index-img cursor-pointer relative">
          <Link href={`/bar/bar-detail/${randomBar.bar_id}`}>
            <Image
              className="relative object-cover w-[159px] h-[155px] md:w-[241px] md:h-[230px] rounded-[10px]"
              src={
                randomBar?.bar_pic_name
                  ? `/barPic/${randomBar.bar_pic_name}`
                  : '/unavailable-image.jpg'
              }
              alt={`Image of ${randomBar.bar_name}`}
              width={241}
              height={230}
            />
          </Link>
          <div 
            className="absolute cursor-pointer top-2 right-2 z-10 p-1"
            onClick={handleSavedClick}
          >
            {isSaved ? (
              <FaHeart size={20} color="#ff03ff" />
            ) : (
              <FaRegHeart size={20} color="white" className="hover:text-[#ff03ff] transition-colors" />
            )}
          </div>
        </div>
      </div>
      <div className="pb-0 pt-2 flex-col items-start text-white">
        <p className="text-[14px] md:text-[16px] font-bold mb-0.5">
          {randomBar?.bar_name || 'Default Bar Name'}
        </p>
        <button>
          <div className="flex w-[55px] border rounded-[30px] border-[#A0FF1F] mb-1">
            <div className="text-[12px] m-0.5 ml-2">
              {randomBar?.rating}
            </div>
            <div className="m-0.5 mr-2">
              <IoMdStar />
            </div>
          </div>
        </button>
        <p className="text-[15px] mb-0.5">{randomBar?.bar_area_name}</p>
        <div className="w-[159px] md:w-[241px] flex justify-between">
          <p className="text-[15px] mb-0.5">
            {randomBar?.bar_type_name}
          </p>
          <div className="flex relative mb-1 border rounded-[30px] border-white hover:bg-[#A0FF1F]">
            <button>
              <Link
                className="text-[12px] m-0.5 ml-2 mr-2 hover:text-[black]"
                href={`/bar/bar-booking/${randomBar?.bar_id}`}
                onClick={(e) => {
                  if (auth.id === 0) {
                    e.preventDefault();
                    setLoginModalToggle(true);
                  }
                }}
              >
                立即訂位
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
