import { useEffect, useRef } from 'react';
import { usePostContext } from '@/context/post-context';
import { FaPhotoVideo } from 'react-icons/fa';
import { IoClose, IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';
import styles from './modal.module.css';

export default function CreateEventModalMobile() {
  const {
    selectedFile,
    previewUrl,
    setPreviewUrl,
    setEventDetails,
    handleFileUpload,
    handleFileChange,
    resetAndCloseModal,
    handleEventFileUpload,
    handleDateFocus,
    handleBlur,
    handleTimeFocus,
    minDate,
    setMinDate,
    minEndDate,
    setMinEndDate,
    createEventModalMobileRef,
    isUploading,
    uploadProgress,
    cancelUpload,
  } = usePostContext();

  const fileInputRef = useRef(null);
  const handleFilePicker = () => fileInputRef.current?.click();

  const handleEventContentChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
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

  // 當選擇檔案時，建立預覽圖的網址
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  return (
    <>
      <dialog
        id="create_event_mobile"
        ref={createEventModalMobileRef}
        className="modal fixed inset-0 w-screen h-screen z-[1000] items-end justify-center"
        style={{ zIndex: 1000 }}
      >
        <div
          className="modal-box p-0 overflow-hidden flex flex-col w-full h-[92vh] rounded-t-3xl bg-black/20 backdrop-blur-xl border-none relative shadow-2xl m-0"
        >
          {/* Header */}
          <div className="pt-20 pb-4 px-6 border-b border-white/10 flex justify-center items-center relative bg-white/5">
            <p className={`${styles['createModalListItemText']} font-bold text-xl tracking-[0.2em] text-neongreen`}>
              {selectedFile ? 'EVENT DETAILS' : 'CREATE EVENT'}
            </p>
            <button
              onClick={resetAndCloseModal}
              className="btn btn-sm btn-circle bg-black/50 border-none absolute right-4 top-20 z-[110] text-white hover:text-neongreen"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-6 pt-6 pb-32">
            {!selectedFile ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-24 h-24 rounded-full bg-neongreen/10 flex items-center justify-center mb-6 border border-neongreen/20 shadow-neon-sm">
                  <FaPhotoVideo className="text-4xl text-neongreen" />
                </div>
                <p className="text-lg mb-8 text-white/70 font-light tracking-wide text-center">
                  選擇一張吸引人的活動照片
                </p>
                <button
                  onClick={handleFilePicker}
                  className="btn bg-neongreen hover:bg-neongreen/80 text-black border-none rounded-full px-12 shadow-neon font-bold text-lg h-14"
                >
                  從相簿選擇
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Preview Image */}
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-video relative group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                     <button 
                       onClick={handleFilePicker}
                       className="btn btn-xs btn-ghost text-white/70 hover:text-neongreen bg-black/40 backdrop-blur-sm rounded-lg"
                     >
                       更換圖片
                     </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-5 mt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] text-neongreen font-bold uppercase tracking-widest block ml-2">活動名稱</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="輸入活動名稱"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 focus:border-neongreen/50 focus:bg-white/10 transition-all text-white text-sm outline-none placeholder:text-white/20"
                      onChange={handleEventContentChange}
                    />
                  </div>

                  {/* Date & Time Group moved up for better mobile accessibility */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 ml-2 font-bold uppercase tracking-widest block">開始日期</label>
                        <div className="relative">
                          <IoCalendarOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                          <input
                            type="text"
                            name="startDate"
                            min={minDate}
                            placeholder="選擇日期"
                            onFocus={handleDateFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 h-12 focus:border-neongreen/50 transition-all text-white text-sm outline-none"
                            onChange={handleEventContentChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 ml-2 font-bold uppercase tracking-widest block">開始時間</label>
                        <div className="relative">
                          <IoTimeOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                          <input
                            type="text"
                            name="startTime"
                            placeholder="選擇時間"
                            onFocus={handleTimeFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 h-12 focus:border-neongreen/50 transition-all text-white text-sm outline-none"
                            onChange={handleEventContentChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 ml-2 font-bold uppercase tracking-widest block">結束日期</label>
                        <div className="relative">
                          <IoCalendarOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                          <input
                            type="text"
                            name="endDate"
                            min={minEndDate}
                            placeholder="選擇日期"
                            onFocus={handleDateFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 h-12 focus:border-neongreen/50 transition-all text-white text-sm outline-none"
                            onChange={handleEventContentChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 ml-2 font-bold uppercase tracking-widest block">結束時間</label>
                        <div className="relative">
                          <IoTimeOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                          <input
                            type="text"
                            name="endTime"
                            placeholder="選擇時間"
                            onFocus={handleTimeFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 h-12 focus:border-neongreen/50 transition-all text-white text-sm outline-none"
                            onChange={handleEventContentChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-neongreen font-bold uppercase tracking-widest block ml-2">活動地點</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="地點名稱或地址"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 h-12 focus:border-neongreen/50 focus:bg-white/10 transition-all text-white text-sm outline-none placeholder:text-white/20"
                      onChange={handleEventContentChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-neongreen font-bold uppercase tracking-widest block ml-2">活動描述</label>
                    <textarea
                      name="description"
                      placeholder="簡單描述一下活動內容..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 min-h-[100px] focus:border-neongreen/50 focus:bg-white/10 transition-all text-white text-sm outline-none placeholder:text-white/20 resize-none"
                      onChange={handleEventContentChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with sticky input area feeling */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-black/80 backdrop-blur-xl border-t border-white/10 flex flex-col items-center min-h-[140px] justify-center">
            {/* Hidden Input moved here to be always accessible */}
            <input
              id="photo-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

            {!isUploading ? (
              <button
                className="btn bg-neongreen hover:bg-neongreen/80 text-black border-none w-full rounded-2xl shadow-neon font-bold text-lg h-14 transition-all"
                onClick={handleEventFileUpload}
                disabled={!selectedFile}
              >
                分享活動
              </button>
            ) : (
              <div className="w-full space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="loading loading-spinner loading-xs text-neongreen"></span>
                    <span className="text-sm text-neongreen font-bold uppercase tracking-widest text-glow-neon">
                      {uploadProgress < 90 ? `圖片傳送中 ${uploadProgress}%` : 
                       uploadProgress < 99 ? '正在同步至雲端...' : '正在發布活動內容...'}
                    </span>
                  </div>
                  <button 
                    onClick={cancelUpload}
                    className="btn btn-xs btn-ghost text-white/40 hover:text-white/90 transition-colors uppercase font-bold tracking-tighter"
                  >
                    <IoClose size={14} /> 取消
                  </button>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5 p-[1px]">
                  <div 
                    className="bg-neongreen h-full transition-all duration-300 shadow-[0_0_15px_rgba(160,255,31,0.6)] rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-white/30 text-center uppercase tracking-widest">
                  請稍後，正在為您同步精彩活動...
                </p>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
