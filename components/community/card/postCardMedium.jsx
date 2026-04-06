import PostModal from '../modal/postModal';
import { usePostContext } from '@/context/post-context';
import styles from './card.module.css';
import { getImageUrl, handleImageError } from '@/services/image-utils';

export default function PostCardMedium({ post }) {
  const { postModalToggle, setPostModalToggle } = usePostContext();

  // 基於 post_id 的唯一 id
  const modalId = `photo_modal_${post.post_id}`;

  return (
    <>
      <div className="flex aspect-square card w-[330px] h-[330px] overflow-hidden items-center justify-center border-grayBorder">
        <figure
          className="card-photo m-0"
          onClick={() => {
            setPostModalToggle(modalId);
          }}
        >
          <div className={styles.parallaxContainer}>
            <div className={styles.parallax}>
              <div className={styles.parallaxHoverTopLeft}></div>
              <div className={styles.parallaxHoverTopRight}></div>
              <div className={styles.parallaxHoverBottomLeft}></div>
              <div className={styles.parallaxHoverBottomRight}></div>

              <div className={styles.parallaxContent}>
                <div className="parallaxContentBack">
                  <img
                    src={getImageUrl(post.img, 'post')}
                    alt={post.photo_name || 'No Image Available'}
                    className={`${styles.parallaxMedia} card-photo object-cover w-[330px] h-[330px]`}
                    loading="lazy"
                    onError={(e) => handleImageError(e, 'post')}
                  />
                </div>
              </div>
            </div>
          </div>
        </figure>

        <PostModal
          post={post}
          modalId={modalId}
          isOpen={postModalToggle === modalId}
        />
      </div>
    </>
  );
}
