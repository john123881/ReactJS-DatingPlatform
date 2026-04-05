import Image from 'next/image';
import Link from 'next/link';
import { RxDoubleArrowRight } from 'react-icons/rx';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import { FaRegHeart, FaHeart, FaBookmark } from 'react-icons/fa';
import { getImageUrl, handleImageError } from '@/services/image-utils';
import { usePostContext } from '@/context/post-context';
import { useAuth } from '@/context/auth-context';
import CommunityTag from '../../community/ui/CommunityTag';

export default function PostCollectCard({ post, index, arrowHovered, onArrowHover, onDelete, onPostClick }) {
  const { auth } = useAuth();
  const { likedPosts, handleLikedClick, setPostModalToggle } = usePostContext();
  
  const userId = auth.id;
  const isLiked = likedPosts[post.post_id] || false;
  
  const contextParts = (post.post_context || '').split('#');
  const mainText = contextParts[0].trim();
  const hashtags = contextParts.slice(1).map(tag => tag.trim()).filter(tag => tag);

  // 點擊留言開啟 Modal
  const handleCommentClick = () => {
    const modalId = `photo_modal_${post.post_id}`;
    onPostClick(post, modalId);
  };

  return (
    <div className="group relative w-full mb-4 transition-all duration-300">
      <div className="flex flex-col sm:flex-row bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-neongreen/30 transition-all duration-500 shadow-2xl">
        {/* Left Side: Photo */}
        <div 
          className="relative w-full sm:w-[240px] md:w-[300px] h-[200px] overflow-hidden cursor-pointer"
          onClick={() => onPostClick(post, `photo_modal_${post.post_id}`)}
        >
          <Image
            src={getImageUrl(post.img, 'post')}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            alt={post.photo_name || 'Post Image'}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            onError={(e) => handleImageError(e, 'post')}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
        </div>

        {/* Right Side: content */}
        <div className="flex flex-col flex-grow p-5 sm:p-6 min-w-0 relative">
          {/* Top: User Info & Unsave Action */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link 
                href={`/community/profile/${post.post_userId}`}
                className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 p-[2px] hover:border-neongreen transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={getImageUrl(post.avatar, 'avatar')}
                    alt="avatar"
                    fill
                    className="object-cover"
                    onError={(e) => handleImageError(e, 'avatar')}
                  />
                </div>
              </Link>
              <Link 
                href={`/community/profile/${post.post_userId}`}
                className="font-bold text-sm text-white hover:text-neongreen transition-colors truncate max-w-[150px]"
                onClick={(e) => e.stopPropagation()}
              >
                {post.email ? post.email.split('@')[0] : 'unknown'}
              </Link>
            </div>
            
            <button 
              onClick={() => onDelete(post.save_id)}
              className="text-neongreen hover:scale-110 active:scale-95 transition-all p-1"
              title="取消收藏"
            >
              <FaBookmark className="text-xl" />
            </button>
          </div>

          {/* Middle: Post Text */}
          <div className="mb-4 flex-grow">
            <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
              {mainText}
            </p>
          </div>

          {/* Social Icons (Community Consistency) */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-6">
              {isLiked ? (
                <FaHeart
                  className="text-xl text-neongreen cursor-pointer hover:scale-110 active:scale-95 transition-all"
                  onClick={() => handleLikedClick(post)}
                />
              ) : (
                <FaRegHeart
                  className="text-xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                  onClick={() => handleLikedClick(post)}
                />
              )}
              <FiMessageCircle
                className="text-xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                onClick={handleCommentClick}
              />
              <FiSend
                className="text-xl text-gray-400 hover:text-white cursor-pointer hover:scale-110 transition-all"
                onClick={() => {
                   // 可以點擊進入詳情看分享，或者在這裡實作
                   handleCommentClick();
                }}
              />
            </div>

            {/* Read More / View detail link */}
            <div 
              className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-500 hover:text-neongreen transition-colors group/link"
              onClick={() => onPostClick(post, `photo_modal_${post.post_id}`)}
              onMouseEnter={() => onArrowHover(index, true)}
              onMouseLeave={() => onArrowHover(index, false)}
            >
              <RxDoubleArrowRight
                className={`transition-transform duration-300 ${arrowHovered[index] ? 'translate-x-1' : ''}`}
              />
              <span>查看詳情</span>
            </div>
          </div>

          {/* Tags (Optional Overlay or Bottom) */}
          <div className="absolute top-6 right-16 hidden md:flex flex-wrap gap-2">
            {hashtags.slice(0, 2).map((tag, i) => (
              <CommunityTag key={i} text={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
