import { createContext, useContext, useState, useMemo } from 'react';

const CollectContext = createContext(null);

export function CollectProvider({ children }) {
  const [bars, setBars] = useState([]);
  const [movies, setMovies] = useState([]);
  const [movieV, setMovieV] = useState({});
  const [dropDownCollectOpen, setDropDownCollectOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [allCollectList, setAllCollectList] = useState([]);

  // 觸發重新整理收藏列表
  const refreshCollectList = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  //P 為 Post , 避免與postContext重複
  const [p, setP] = useState({
    img: '../../../public/unavailable-image.jpg',
    photo_name: 'No Image Available',
    author: 'Unknown',
    author_email: 'Unknown@XXX.com',
    post_context: '',
    post_id: 0,
    isOpen: false,
    post_userId: 0,
    avatar: '/unknown-user-image.jpg',
  });
  const [modalId, setModalId] = useState('');
  const [movieModalToggle, setMovieModalToggle] = useState(false);

  const value = useMemo(
    () => ({
      bars,
      setBars,
      movies,
      setMovies,
      movieV,
      setMovieV,
      dropDownCollectOpen,
      setDropDownCollectOpen,
      refreshTrigger,
      refreshCollectList,
      p,
      setP,
      modalId,
      setModalId,
      movieModalToggle,
      setMovieModalToggle,
      allCollectList,
      setAllCollectList,
    }),
    [
      bars,
      movies,
      movieV,
      dropDownCollectOpen,
      refreshTrigger,
      p,
      modalId,
      movieModalToggle,
      allCollectList,
    ],
  );

  return (
    <CollectContext.Provider value={value}>
      {children}
    </CollectContext.Provider>
  );
}

export const useCollect = () => useContext(CollectContext);
