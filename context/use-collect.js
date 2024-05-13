import { createContext, useContext, useState } from 'react';

const CollectContext = createContext(null);

export function CollectProvider({ children }) {
  const [bars, setBars] = useState([]);
  const [movies, setMovies] = useState([]);
  const [movieV, setMovieV] = useState({});
  const [dropDownCollectOpen, setDropDownCollectOpen] = useState(false);
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

  return (
    <CollectContext.Provider
      // 使用value屬性提供資料給提供者階層以下的所有後代元件
      value={{
        bars,
        setBars,
        movies,
        setMovies,
        movieV,
        setMovieV,
        dropDownCollectOpen,
        setDropDownCollectOpen,
        p,
        setP,
        modalId,
        setModalId,
        movieModalToggle,
        setMovieModalToggle,
      }}
    >
      {children}
    </CollectContext.Provider>
  );
}

export const useCollect = () => useContext(CollectContext);
