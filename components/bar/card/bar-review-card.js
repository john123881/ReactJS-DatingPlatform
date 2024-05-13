import RatingStar from '../bar-rating/rating-star';
import BarRatingDeleteModal from '../modal/bar-rating-delete-modal';
import BarRatingEditModal from '../modal/bar-rating-edit-modal';

export default function BarReviewCard({ rating, id }) {
  console.log(rating);
  return (
    <>
      <div className="flex justify-between items-center border-b border-white pb-2 mb-4">
        <div className="flex">
          <img
            className="h-[71px] w-[71px] rounded-full"
            // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFYeFJDGzt1LOUrw_SLn1yXUkNRUkryv0BBqh_q2pyvw&s"
            src={rating.avatar}
            alt={rating.username}
          />
          <div className="ml-4 text-white space-y-1">
            <div className="text-[15px]">
              {/* username */}
              {rating.username}
            </div>
            {/* <div className="bar-detail-stars flex gap-1 rating rating-sm">
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
              />
            </div> */}
            <RatingStar />
            <div className="text-[12px]">
              {/* 2024-03-07 14:20 */}
              {rating.created_at}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1 h-[71px] w-[71px]">
          <div
            type="submit"
            onClick={() =>
              document.getElementById('bar-rating-edit-modal').showModal()
            }
          >
            <div className="badge badge-outline border-white text-[10px] lg:text-[12px] text-white h-[20px] lg:h-[24px] hover:bg-[#A0FF1F] hover:text-black cursor-pointer">
              編輯評論
            </div>
            <BarRatingEditModal />
          </div>

          <div
            type="submit"
            onClick={() =>
            document.getElementById('bar-rating-delete-modal').showModal()
            }
          >
            <button className="cursor-pointer badge badge-outline border-white text-[10px] lg:text-[12px] text-white h-[20px] lg:h-[24px] hover:bg-[#FF03FF] hover:text-black">
              刪除評論
            </button>
            <BarRatingDeleteModal />
          </div>
        </div>
      </div>
    </>
  );
}
