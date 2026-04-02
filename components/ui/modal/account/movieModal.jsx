import { useCollect } from '@/context/use-collect';
import Image from 'next/image';
import { IoMdStar } from 'react-icons/io';

export default function MovieModal({ movie, modalId, isOpen }) {
  const { setMovieModalToggle } = useCollect();

  return (
    <>
      <div
        id={modalId}
        // ref={postModalRef}
        className={`modal z-50 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}
        style={{ pointerEvents: 'auto' }}
      >
        <div
          className="flex modal-box w-[90vw] max-w-[90vw] h-[90vh] overflow-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div
            onClick={() => {
              setMovieModalToggle(false);
            }}
            className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2 text-h3"
          >
            ✕
          </div>

          <div className="container flex flex-col md:flex-row">
            <figure className="relative flex flex-col w-full mx-3 md:w-1/2 card-photo h-[300px] md:h-auto">
              <Image
                src={movie.img || '/unavailable-image.jpg'}
                alt={movie.img_name || 'No Image Available'}
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-contain"
              />
            </figure>

            <div className="flex flex-col w-full h-full mx-3 overflow-auto card-body md:w-1/2">
              <div className="flex flex-row items-center justify-between h-10 gap-2 m-2 md:mt-[64px] first-letter:card-user">
                <div className="flex items-center justify-start gap-2 text-[26px] md:text-[32px]  font-semibold">
                  {movie.title
                    ? movie.title.match(/[\u4e00-\u9fa5]+/g)
                    : 'unknownMovie'}
                </div>
              </div>
              <div className="flex mt-4 mb-10 ms-3 context ">
                {/* <div>{movie.description} 9 </div> */}
                <div
                  className={`badge
                            ${movie.type === '愛情' ? 'badge-error' : ''}
                            ${movie.type === '劇情' ? 'badge-info' : ''}
                            ${movie.type === '懸疑' ? 'badge-success' : ''}
                            ${movie.type === '喜劇' ? 'badge-secondary' : ''}
                            ${movie.type === '動作' ? 'badge-primary' : ''}`}
                >
                  {movie.type}
                </div>
                <div className="ms-4 ps-2 pe-1 badge badge-warning badge-outline">
                  {movie.rating}{' '}
                  <div className="m-0.5">
                    <IoMdStar className="text-[14px] lg:text-[16px] text-warning" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 comment ">
                <div className="flex items-center gap-2 card-user">
                  <div className="flex flex-wrap items-center justify-between w-full text-[14px] md:text-[20px]">
                    {movie.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={() => {
            setMovieModalToggle(false);
          }}
        >
          <button>close</button>
        </form>
      </div>
    </>
  );
}
