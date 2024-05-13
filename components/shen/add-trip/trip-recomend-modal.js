import AddBar from '@/components/shen/add-trip/add-bar';
import AddMovie from '@/components/shen/add-trip/add-movie';
import Recomendbar from '@/components/shen/sidebars/recomendbar';
import { useState, useEffect, useRef } from 'react';

export default function TripRecomendModal({
  trip_detail_id,
  onClose,
  refreshTripDetails,
}) {
  const [currentTab, setCurrentTab] = useState('addMovie');
  const [barSaved, setBarSaved] = useState([]);
  const [movie, setMovie] = useState([]);
  const [movieTypes, setMovieTypes] = useState([
    { id: '1', name: '劇情' },
    { id: '2', name: '愛情' },
    { id: '3', name: '喜劇' },
    { id: '4', name: '動作' },
    { id: '5', name: '動畫' },
    { id: '6', name: '驚悚' },
    { id: '7', name: '懸疑' },
  ]);
  const [selectedMovieType, setSelectedMovieType] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedBarType, setSelectedBarType] = useState('');
  const [areas, setAreas] = useState([]);
  const [barTypes, setBarTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); //用於酒吧關鍵字搜尋
  const [searchMovieTerm, setSearchMovieTerm] = useState(''); //用於電影關鍵字搜索

  const recomendModalRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3001/trip/my-details/recommend/bar')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setBarSaved(data);
        const uniqueAreas = Array.from(
          new Set(data.map((bar) => bar.bar_area_name))
        ).sort();
        const uniqueBarTypes = Array.from(
          new Set(data.map((bar) => bar.bar_type_name))
        ).sort();
        setAreas(uniqueAreas);
        setBarTypes(uniqueBarTypes);
      })
      .catch((error) => console.error('Fetching bar info error:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/trip/my-details/recommend/movie')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setMovie(data);
      })
      .catch((error) => console.error('Fetching movie error:', error));
  }, []);

  const filteredBars = barSaved.filter(
    (bar) =>
      (bar.bar_area_name === selectedArea || selectedArea === '') &&
      (bar.bar_type_name === selectedBarType || selectedBarType === '') &&
      bar.bar_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMovies = movie.filter(
    (m) =>
      (String(m.movie_type_id) === selectedMovieType ||
        selectedMovieType === '') &&
      m.title.toLowerCase().includes(searchMovieTerm.toLowerCase())
  );

  return (
    <>
      <div
        ref={recomendModalRef}
        className="flex flex-col items-center justify-start w-full h-full gap-8"
      >
        <Recomendbar onTabChange={setCurrentTab} />
        {currentTab === 'addMovie' ? (
          <>
            <select
              className="p-2  rounded-full bg-black "
              value={selectedMovieType}
              onChange={(e) => setSelectedMovieType(e.target.value)}
            >
              <option value="">所有類型</option>
              {movieTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow "
                placeholder="尋找電影"
                value={searchMovieTerm}
                onChange={(e) => setSearchMovieTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <AddMovie
                  key={movie.movie_id}
                  movie={movie}
                  trip_detail_id={trip_detail_id}
                  refreshTripDetails={refreshTripDetails}
                  onClose={onClose}
                />
              ))
            ) : (
              <div>正在載入電影或未找到選定類型的電影...</div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <select
                  className="p-2 mb-4 rounded-full bg-black"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  <option value="">所有地區</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <select
                  className="p-2 mb-4 rounded-full bg-black"
                  value={selectedBarType}
                  onChange={(e) => setSelectedBarType(e.target.value)}
                >
                  <option value="">所有類型</option>
                  {barTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="尋找酒吧"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
            {filteredBars.length > 0 ? (
              filteredBars.map((bar) => (
                <AddBar
                  key={bar.bar_id}
                  bar={bar}
                  trip_detail_id={trip_detail_id}
                  refreshTripDetails={refreshTripDetails}
                  onClose={onClose}
                />
              ))
            ) : (
              <div>正在載入酒吧或未找到選定地區、類型或名稱的酒吧...</div>
            )}
          </>
        )}
      </div>
    </>
  );
}
