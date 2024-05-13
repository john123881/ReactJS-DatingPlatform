import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useCollect } from '@/context/use-collect';
import { FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { usePostContext } from '@/context/post-context';

export default function CollectList({
  i,
  handleContentHover,
  data,
  showContent,
}) {
  const router = useRouter();
  const { auth } = useAuth();
  // const [movieV, setMovieV] = useState({});

  // const [postid, setPostid] = useState(0);
  // const [postContent, setPostContent] = useState({
  //   img: '../../../public/unavailable-image.jpg',
  //   photo_name: 'No Image Available',
  //   author: 'Unknown',
  //   author_email: 'Unknown@XXX.com',
  //   post_context: '',
  //   post_id: 0,
  //   isOpen: false,
  //   post_userId: 0,
  //   avatar: '/unknown-user-image.jpg',
  // });
  const {
    setDropDownCollectOpen,
    p,
    setP,
    setModalId,
    setMovieModalToggle,
    movies,
    setMovies,
    movieV,
    setMovieV,
  } = useCollect();
  const { setPostModalToggle, savedPosts, checkPostsStatus, getPostComments } =
    usePostContext();
  //依 type 分不同處理方式
  const handleBarLink = (e) => {
    e.preventDefault();
    router.push({
      pathname: `/bar/bar-detail/${data.item_id}`,
    });
  };

  const handleMovieLink = () => {
    setMovieModalToggle(data.item_id);
    setModalId(data.item_id);
    setMovieV({
      ...movieV,
      isOpen: true,
      img: data.img,
      img_name: data.img_name,
      title: data.title,
      type: data.subtitle,
      rating: data.rating,
      description: data.content,
    });
    // e.preventDefault();
    // router.push({
    //   pathname: `/booking/movie-booking-detail/${data.item_id}`,
    // });
  };
  const handlePostLink = () => {
    setPostModalToggle(data.item_id);
    setModalId(data.item_id);
    checkPostsStatus(data.item_id);
    getPostComments(data.item_id);
    setP({
      ...p,
      isOpen: true,
      img: data.img,
      photo_name: data.img_name,
      author: data.title,
      email: data.author_email,
      post_context: data.content,
      post_id: data.item_id,
      post_userId: data.author_id,
      avatar: data.author_avatar,
    });
  };

  const linkMap = {
    bar: handleBarLink,
    movie: handleMovieLink,
    post: handlePostLink,
  };

  const titleMap = {
    bar: data.title ? data.title : 'Unknown',
    movie: data.title ? data.title.match(/[\u4e00-\u9fa5]+/g) : 'Unknown',
    post: data.author_email ? data.author_email.split('@')[0] : 'Unknown',
  };

  const subMap = {
    movie: (
      <div
        className={`badge text-[10px] h-[14px] 
        ${data.subtitle === '愛情' ? 'badge-error' : ''}
        ${data.subtitle === '劇情' ? 'badge-info' : ''}
        ${data.subtitle === '懸疑' ? 'badge-success' : ''}
        ${data.subtitle === '驚悚' ? 'badge-accent' : ''}
        ${data.subtitle === '喜劇' ? 'badge-secondary' : ''}
        ${data.subtitle === '動作' ? 'badge-primary' : ''}`}
      >
        {data.subtitle}
      </div>
    ),
    post: (
      <>
        <FaHeart className=" ms-1 text-neongreen" />
        <span className="absolute top-[4px] left-[20px] badge badge-xs">
          {data.subtitle}
        </span>
      </>
    ),
    bar: `${data.subtitle}`,
  };

  useEffect(() => {
    if (auth.id === 0) return;
  }, [auth.id]);

  return (
    <>
      <li
        className="relative rounded-none collapse"
        onMouseEnter={() => handleContentHover(i, true)}
        onMouseLeave={() => handleContentHover(i, false)}
        onClick={() => setDropDownCollectOpen(false)}
      >
        <button
          // href={linkMap[data.item_type]}
          onClick={linkMap[data.item_type]}
          className="relative flex items-center space-x-3 rtl:space-x-reverse"
        >
          <div className="flex-shrink-0">
            <img
              className="w-8 h-8 rounded-full"
              src={data.img || '/unavailable-image.jpg'}
              alt={data.img_name || 'No Image Available'}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-bold text-gray-900 truncate dark:text-white">
              {/* {data.author_email ? data.author_email.split('@')[0] : 'Unknown'} */}
              {titleMap[data.item_type]}
            </div>
            <div className="text-[10px] h-[20px] flex items-center relative text-gray-500 truncate dark:text-gray-400">
              {subMap[data.item_type]}
            </div>
          </div>
          <div className="badge badge-outline bg-dark text-white  absolute right-[8px] bottom-[8px] text-[10px] h-[14px] font-medium  rounded-full ">
            {data.item_type}
          </div>
        </button>
        <div
          className={`collapse-content py-1 pb-0 bg-black hover:bg-dark cursor-text hover:cursor-text ${
            showContent[i] ? 'visible' : ' '
          }`}
          style={
            showContent[i]
              ? {
                  paddingBottom: '80px ',
                  transition: 'padding 0.2s ease-out',
                  backgroundColor: '0.2s ease-out',
                }
              : {
                  transition: 'padding 0.2s ease-out',
                  backgroundColor: '0.2s ease-out',
                }
          }
        >
          <div className="  text-[14px] text-pretty ">
            {' '}
            {data.content == 'null'
              ? (data.content = 'null')
              : data.content.length > 50
              ? data.content.substring(0, 50) + '...'
              : data.content}
          </div>
        </div>
      </li>
    </>
  );
}
