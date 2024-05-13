export default function AddBar({
  bar,
  trip_detail_id,
  onClose,
  refreshTripDetails,
}) {
  // console.log(bar.bar_pic_name);
  const updateBarInTrip = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/trip/my-details/addbar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trip_detail_id: trip_detail_id,
            bar_id: bar.bar_id,
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
      //alert('Bar added to the trip successfully!'); //換成sweet alert
    } catch (error) {
      console.error('Error updating trip detail:', error);
    }
  };

  return (
    <div className="flex justify-start items-center ">
      <div className="flex justify-start items-center ">
        {bar.bar_pic_name && (
          <img
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover"
            src={`/barPic/${bar.bar_pic_name}`}
            alt={`Image of ${bar.name}`}
          />
        )}
        <div
          className="flex flex-col justify-center sm:w-64 items-start ml-5 mr-5 sm:ml-12
     sm:mr-12"
        >
          <h2 className="text-white text-base sm:text-xl mb-5">
            {bar.bar_name}
          </h2>
          <div className="flex justify-start items-start ">
            <div className="text-white text-sm sm:text-base mr-4">
              {bar.bar_area_name}
            </div>
            <div className="text-white text-sm sm:text-base">
              {bar.bar_type_name}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={updateBarInTrip}
        className="text-white hover:text-black text-xs sm:text-lg px-4 sm:px-7 py-1 bg-black hover:bg-[#a0ff1f] rounded-full border border-white flex justify-center items-center "
      >
        加入行程
      </button>
    </div>
  );
}
