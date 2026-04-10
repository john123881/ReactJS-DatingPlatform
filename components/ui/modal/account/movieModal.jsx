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
        className={`modal flex transition-all duration-300 ${isOpen ? 'modal-open pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        style={{ zIndex: 99999 }}
      >
        <div
          className="modal-box w-full md:max-w-[1200px] md:max-h-[85vh] h-full h-screen max-h-none md:max-h-[85vh] rounded-none md:rounded-2xl bg-[#0A0A0A] border-none md:border md:border-white/10 overflow-hidden p-0 flex flex-col md:flex-row relative will-change-transform m-0"
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
            <figure className="relative flex flex-col w-full mx-3 md:w-1/2 card-photo h-[35vh] md:h-auto">
              <Image
                src={movie.img || '/unavailable-image.jpg'}
                alt={movie.img_name || 'No Image Available'}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-contain"
              />
            </figure>

            <div className="flex flex-col w-full h-full mx-3 overflow-auto card-body md:w-1/2 pt-20 md:pt-0 pb-32 md:pb-10">
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
