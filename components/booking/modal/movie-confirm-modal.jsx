export default function MovieConfirmModal() {
  return (
    <>
      <dialog
        id="movie-confirm-modal"
        className="modal modal-bottom sm:modal-middle text-white"
      >
        <div
          className="modal-box h-[500px] grid grid-cols-2 border border-white"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div className="col-span-10 space-y-4 justify-center items-center">
            <div className="font-bold text-h5">您已訂票成功</div>
            <div className="font-bold text-h6">以下是您的訂票資訊：</div>
            <div className="text-h6 h-[238px]  border border-white rounded-lg flex flex-col justify-between p-10">
              <div className="">旺卡</div>
              <hr />
              <div className="text-h6 items-center space-y-4">
              <div className="grid grid-cols-2">
                  <div className="col-span-1">全票：2人</div>
                  <div className="col-span-1">優待票：1人</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="col-span-1">預約日期</div>
                  <div className="col-span-1">2024/05/10 (五)</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="col-span-1">預約時段</div>
                  <div className="col-span-1">20:00</div>
                </div>
              </div>
            </div>
            <div className="col-span-1 pt-10">
            <button
          className="btn btn-outline btn-accent mx-20 h-[0.5rem] border-[]"
          style={{
            height: '0.5rem',
            borderColor: '#A0FF1F',
     
          }}
        >
          我的電影票
        </button>
          
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"></form>
      </dialog>
    </>
  );
}
