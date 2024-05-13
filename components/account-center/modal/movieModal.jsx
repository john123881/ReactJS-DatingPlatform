import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { usePostContext } from '@/context/post-context';
import { useCollect } from '@/context/use-collect';
import { useRouter } from 'next/router';
import { IoMdStar } from 'react-icons/io';
import Router from 'next/router';
// import ShareModal from '../modal/shareModal';
// import EditModal from '../modal/editModal';
import { FiSend, FiMessageCircle, FiMoreHorizontal } from 'react-icons/fi';
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from 'react-icons/fa';

export default function MovieModal({ movie, modalId, isOpen }) {
  const { auth } = useAuth();
  const {
    movies,
    setMovies,
    setModalId,
    movieModalToggle,
    setMovieModalToggle,
  } = useCollect();
  const router = useRouter();

  // const postModalRef = useRef(null);

  // const textareaRef = useRef(null);

  // useEffect(() => {
  //   // 定義路由變化完成後要執行的函數，這個函數將會關閉 modal
  //   const handleRouteChange = () => {
  //     setPostModalToggle(false); // 關閉 modal
  //   };

  //   // 監聽路由變化完成事件
  //   Router.events.on('routeChangeComplete', handleRouteChange);

  //   // 在組件卸載或重新渲染前，移除監聽器，這是為了避免記憶體洩漏和重複註冊監聽器
  //   return () => {
  //     Router.events.off('routeChangeComplete', handleRouteChange);
  //   };
  // }, []);

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
            <figure className="flex flex-col w-full mx-3 md:w-1/2 card-photo">
              <img
                src={movie.img || '/unavailable-image.jpg'}
                alt={movie.img_name || 'No Image Available'}
                className="object-contain w-full h-full"
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
