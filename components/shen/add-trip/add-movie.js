export default function AddMovie({
  movie,
  trip_detail_id,
  onClose,
  refreshTripDetails,
}) {
  const updateMovieInTrip = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/trip/my-details/addmovie',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trip_detail_id: trip_detail_id,
            movie_id: movie.movie_id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to update the trip detail: ${data.message || ''}`
        );
      }
      refreshTripDetails();
      onClose();
      //alert('Movie added to the trip successfully!'); //換成sweet alert
    } catch (error) {
      console.error('Error updating trip detail:', error);
    }
  };
  return (
    <div className="flex justify-start items-center ">
      <div className="flex justify-start items-center ">
        {movie.poster_img && (
          <img
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover"
            src={`/movie_img/${movie.poster_img}`}
            alt={`Image of ${movie.title}`}
          />
        )}
        <div
          className="flex flex-col justify-center items-start sm:w-64 ml-5 mr-5 sm:ml-12
     sm:mr-12"
        >
          <h2 className="text-white text-base sm:text-xl mb-5">
            {movie.title}
          </h2>
          <div className="flex justify-start items-start ">
            <div className="text-white text-sm sm:text-base ">
              {movie.movie_type}片
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={updateMovieInTrip}
        className="text-white hover:text-black text-xs sm:text-lg px-4 sm:px-7 py-1 bg-black hover:bg-[#a0ff1f] rounded-full border border-white  flex justify-center items-center "
      >
        加入行程
      </button>
    </div>
  );
}
