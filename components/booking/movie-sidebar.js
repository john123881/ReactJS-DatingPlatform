import { useRouter } from 'next/router';
import { BiCameraMovie } from 'react-icons/bi';

export default function MovieSidebar() {
  const router = useRouter();
  const { movie_type_id } = router.query;

  const genres = [
    { id: 0, name: '全部電影', icon: <BiCameraMovie /> },
    { id: 1, name: '劇情片' },
    { id: 2, name: '愛情片' },
    { id: 3, name: '喜劇片' },
    { id: 4, name: '動作片' },
    { id: 5, name: '動畫片' },
    { id: 6, name: '驚悚片' },
    { id: 7, name: '懸疑片' },
  ];

  const handleGenreClick = (id) => {
    if (id === 0) {
      router.push('/booking/movie-list');
    } else {
      router.push(`/booking/movie-list/${id}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 px-2 mb-2">
        <div className="w-1 h-6 bg-neongreen shadow-neon-sm rounded-full"></div>
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">電影類別</h2>
      </div>
      
      <nav className="flex flex-col gap-2">
        {genres.map((genre) => {
          const isActive = (genre.id === 0 && !movie_type_id) || (movie_type_id == genre.id);
          
          return (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id)}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-neongreen text-black font-bold shadow-neon-sm translate-x-1'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg ${isActive ? 'text-black' : 'text-neongreen/50 group-hover:text-neongreen'}`}>
                  {genre.id === 0 ? genre.icon : '•'}
                </span>
                <span className="text-sm tracking-loose">{genre.name}</span>
              </div>
              
              {isActive && (
                <div className="w-1.5 h-1.5 bg-black rounded-full shadow-sm"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* 底部裝飾或是小工具 */}
      <div className="mt-8 p-6 rounded-3xl bg-neongreen/5 border border-neongreen/10 relative overflow-hidden group">
         <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-neongreen/10 rounded-full blur-2xl group-hover:bg-neongreen/20 transition-all duration-500"></div>
         <p className="text-[10px] text-neongreen/40 uppercase tracking-[0.2em] font-bold mb-2">Taipei Date Official</p>
         <p className="text-xs text-white/70 leading-relaxed italic">
           「在城市的霓虹下，<br/>發現專屬於你的精彩瞬間。」
         </p>
      </div>
    </div>
  );
}
