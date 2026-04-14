import { useCollect } from '@/context/use-collect';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdStar } from 'react-icons/io';

export default function MovieModal({ movie, modalId, isOpen }) {
  const { setMovieModalToggle } = useCollect();

  return (
    <>
      <div
        id={modalId}
        className={`modal fixed inset-0 w-screen h-screen transition-all duration-500 ease-out flex items-center justify-center ${
          isOpen ? 'modal-open pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ zIndex: 99999 }}
      >
        {/* 電腦版背景：高斯模糊海報 */}
        <div 
          className="absolute inset-0 hidden md:block opacity-60 transition-opacity duration-700"
          style={{
            backgroundImage: `url(${movie.img || '/unavailable-image.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(60px) brightness(0.4)',
          }}
        />

        <div
          className={`modal-box p-0 overflow-hidden flex flex-col md:flex-row w-full max-w-none md:max-w-[1200px] h-[92vh] md:h-auto md:max-h-[85vh] rounded-t-[2.5rem] md:rounded-3xl bg-[#0A0A0A]/80 backdrop-blur-2xl border-none md:border md:border-white/10 relative shadow-2xl transition-transform duration-500 ease-out m-0 mt-auto md:mt-0 ${
            isOpen ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'
          }`}
        >
          {/* 手機版頂部拉動條 (Pull Bar) */}
          <div className="flex justify-center w-full pt-4 pb-2 md:hidden absolute top-0 z-50 pointer-events-none">
            <div className="w-12 h-1.5 rounded-full bg-white/20" />
          </div>
          <div
            onClick={() => {
              setMovieModalToggle(false);
            }}
            className="absolute btn btn-sm btn-circle btn-ghost right-4 top-4 z-50 text-white/50 hover:text-white"
          >
            ✕
          </div>

          <div className="flex flex-col md:flex-row w-full h-full">
            <figure className="relative flex-shrink-0 w-full md:w-[480px] h-[45vh] md:h-auto bg-black/20 group">
              <Image
                src={movie.img || '/unavailable-image.jpg'}
                alt={movie.title || 'Movie Poster'}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover md:object-contain transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent md:hidden" />
            </figure>

            <div className="flex flex-col flex-1 h-full p-6 md:p-14 overflow-hidden relative">
              <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 md:pb-0">
                <div className="flex flex-col gap-3 mb-6">
                  <span className="text-neongreen text-xs md:text-sm font-black tracking-[0.3em] uppercase opacity-80">Now Showing</span>
                  <h2 className="text-[32px] md:text-[52px] font-black text-white leading-none tracking-tighter italic">
                    {movie.title || '未知電影'}
                  </h2>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                      movie.type === '愛情' ? 'border-pink-500 text-pink-500 bg-pink-500/10' : 
                      movie.type === '劇情' ? 'border-blue-500 text-blue-500 bg-blue-500/10' : 
                      movie.type === '懸疑' ? 'border-purple-500 text-purple-500 bg-purple-500/10' : 
                      movie.type === '喜劇' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 
                      'border-neongreen text-neongreen bg-neongreen/10'
                    }`}
                  >
                    {movie.type || '其他'}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                    <span className="text-[14px] text-yellow-500 font-black">{movie.movie_rating || movie.rating || '4.9'}</span>
                    <IoMdStar className="text-[16px] text-yellow-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-white/60 leading-relaxed text-[15px] md:text-[18px] font-medium max-w-2xl">
                  <p className="border-l-2 border-neongreen/30 pl-4 italic">
                    {movie.description || '暫無電影介紹。'}
                  </p>
                </div>
              </div>

              <div className="fixed md:static bottom-0 left-0 w-full p-6 md:p-0 md:mt-auto bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent md:bg-none z-50">
                <Link
                  href={`/booking/movie-booking-detail/${movie.item_id || movie.movie_id}`}
                  className="btn w-full h-14 md:h-16 bg-neongreen hover:bg-white text-black font-black border-none rounded-xl md:rounded-2xl text-lg tracking-widest uppercase italic shadow-[0_10px_30px_rgba(160,255,31,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] transition-all duration-300 transform-gpu active:scale-95 flex items-center justify-center p-0"
                  onClick={() => setMovieModalToggle(false)}
                >
                  查看詳情
                </Link>
                {/* Safe Area Spacer for iOS Home Bar */}
                <div className="h-4 md:hidden" />
              </div>
            </div>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setMovieModalToggle(false);
          }}
        >
          <button className="cursor-default">close</button>
        </form>
      </div>
    </>
  );
}
