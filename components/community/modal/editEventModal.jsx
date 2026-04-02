import { useState, useEffect, useRef } from 'react';
import { usePostContext } from '@/context/post-context';
import styles from './modal.module.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default function EditEventModal({ event, modalId }) {
  const {
    selectedFile,
    previewUrl,
    setPreviewUrl,
    resetAndCloseModal,
    handleFilePicker,
    handleEventUpdate,
    handleFileChange,
    fileInputRef,
    handleDateFocus,
    handleBlur,
    handleTimeFocus,
    minDate,
    setMinDate,
    minEndDate,
    setMinEndDate,
  } = usePostContext();

  const editEventModalRef = useRef(null);

  const [localEventDetails, setLocalEventDetails] = useState({
    title: event?.title || '',
    description: event?.description || '',
    location: event?.location || '',
    startDate: event?.start_date || '',
    startTime: event?.start_time || '',
    endDate: event?.end_date || '',
    endTime: event?.end_time || '',
  });

  const handleEventContentChange = (e) => {
    const { name, value } = e.target;
    setLocalEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    // 更新最早结束日期
    if (name === 'startDate') {
      setMinEndDate(value);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
    setMinEndDate(minDate);
  }, []);

  // 監聽 event 的變化來更新狀態
  useEffect(() => {
    if (event) {
      // 將後端送來呈現在卡片的資料再轉換成前端可讀取的資料
      const formattedStartDate = dayjs(
        event.start_date,
        'YYYY年 MM月DD日',
      ).isValid()
        ? dayjs(event.start_date, 'YYYY年 MM月DD日').format('YYYY-MM-DD')
        : '';
      const formattedEndDate = dayjs(
        event.end_date,
        'YYYY年 MM月DD日',
      ).isValid()
        ? dayjs(event.end_date, 'YYYY年 MM月DD日').format('YYYY-MM-DD')
        : '';

      // console.log(localEventDetails);

      setLocalEventDetails((prev) => ({
        ...prev,
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        startDate: formattedStartDate,
        startTime: event.start_time || '',
        endDate: formattedEndDate,
        endTime: event.end_time || '',
      }));
    }
  }, [event]);

  // 當選擇檔案時，建立預覽圖的網址。使用的是狀態連鎖更動的樣式 A狀態 -> B狀態
  useEffect(() => {
    // 當沒有選中檔案時
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }

    // 當有選中檔案時
    // 透過URL.createObjectURL()得到預覽圖片的網址
    const objectUrl = URL.createObjectURL(selectedFile);
    //console.log(objectUrl)
    // 設定預覽圖片的網址
    setPreviewUrl(objectUrl);

    // 當元件從真實DOM被移出時
    return () => {
      // 註銷剛建立的ObjectURL(快取)
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);
  // ^^^^^^^^^^^^^^ 這裡代表只有在selectedFile有變動(之後)才會執行

  return (
    <>
      <dialog
        id={modalId}
        ref={editEventModalRef}
        className="modal modal-bottom sm:modal-middle max-w-full"
      >
        <div
          className="modal-box p-0 overflow-hidden flex flex-col transition-all duration-300 max-w-5xl w-[95%] h-[650px]"
          style={{ backgroundColor: 'rgba(20, 20, 20, 0.95)', backdropFilter: 'blur(10px)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-center items-center relative">
            <p className={`${styles['createModalListItemText']} font-bold text-xl text-neongreen`}>
              編輯活動詳情
            </p>
          </div>

          <div className="flex-grow flex flex-col sm:flex-row overflow-hidden">
            {/* Left Side: Event Image / Change */}
            <div 
              className="flex-[1.2] bg-black/40 flex items-center justify-center overflow-hidden border-r border-white/10 cursor-pointer group relative"
              onClick={handleFilePicker}
            >
              <img
                src={selectedFile ? previewUrl : (event.img || '/unavailable-image.jpg')}
                alt={event.photo_name || 'Event Image'}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white bg-black/50 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm shadow-xl">
                   更換活動封面
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Right Side: Activity Details Area */}
            <div className="flex-1 flex flex-col p-6 bg-dark/50 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <div className="text-primary font-bold text-xs uppercase">Edit</div>
                </div>
                <span className="text-white font-medium italic text-sm">更新活動資訊</span>
              </div>

              <div className="flex flex-col gap-4">
                <label className="form-control w-full">
                  <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">活動名稱</span>
                  <input
                    type="text"
                    name="title"
                    placeholder="活動名稱"
                    value={localEventDetails.title}
                    className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12"
                    onChange={handleEventContentChange}
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">活動描述</span>
                  <textarea
                    name="description"
                    placeholder="活動描述"
                    value={localEventDetails.description}
                    className="textarea textarea-bordered bg-white/5 border-white/10 rounded-2xl focus:border-primary transition-all text-white h-24 resize-none"
                    onChange={handleEventContentChange}
                  />
                </label>

                <label className="form-control w-full">
                   <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">活動地點</span>
                  <input
                    type="text"
                    name="location"
                    placeholder="活動地點"
                    value={localEventDetails.location}
                    className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12"
                    onChange={handleEventContentChange}
                  />
                </label>

                <div className="divider opacity-20 my-1">時間設定</div>

                <div className="flex gap-4">
                  <label className="form-control flex-1">
                    <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">開始日期</span>
                    <input
                      type="date"
                      name="startDate"
                      min={minDate}
                      placeholder="開始日期"
                      value={localEventDetails.startDate}
                      className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12 text-center"
                      onChange={handleEventContentChange}
                    />
                  </label>
                  <label className="form-control flex-1">
                    <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">開始時間</span>
                    <input
                      type="time"
                      name="startTime"
                      placeholder="開始時間"
                      value={localEventDetails.startTime}
                      onFocus={handleTimeFocus}
                      onBlur={handleBlur}
                      className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12 text-center"
                      onChange={handleEventContentChange}
                    />
                  </label>
                </div>

                <div className="flex gap-4 mb-4">
                  <label className="form-control flex-1">
                    <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">結束日期</span>
                    <input
                      type="date"
                      name="endDate"
                      min={minEndDate}
                      placeholder="結束日期"
                      value={localEventDetails.endDate}
                      onFocus={handleDateFocus}
                      onBlur={handleBlur}
                      className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12 text-center"
                      onChange={handleEventContentChange}
                    />
                  </label>
                  <label className="form-control flex-1">
                    <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">結束時間</span>
                    <input
                      type="time"
                      name="endTime"
                      placeholder="結束時間"
                      value={localEventDetails.endTime}
                      onFocus={handleTimeFocus}
                      onBlur={handleBlur}
                      className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12 text-center"
                      onChange={handleEventContentChange}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-6 mt-auto border-t border-white/10 flex justify-end">
                <button
                  className="btn bg-neongreen hover:bg-neongreen/80 text-black border-none btn-wide rounded-full shadow-neon font-bold text-lg"
                  onClick={() => handleEventUpdate(event, localEventDetails, editEventModalRef)}
                >
                  確認更新
                </button>
              </div>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={resetAndCloseModal}>close</button>
        </form>
      </dialog>
    </>
  );
}
