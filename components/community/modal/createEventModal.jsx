import { useEffect, useRef } from 'react';
import { usePostContext } from '@/context/post-context';
import { FaPhotoVideo } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import styles from './modal.module.css';
import Dropzone from 'react-dropzone';

export default function CreateEventModal() {
  const {
    selectedFile,
    setSelectedFile,
    previewUrl,
    setPreviewUrl,
    setEventDetails,
    resetAndCloseModal,
    handleEventFileUpload,
    handleFileChange,
    handleDateFocus,
    handleBlur,
    handleTimeFocus,
    onDrop,
    setIsHoverActive,
    minDate,
    setMinDate,
    minEndDate,
    setMinEndDate,
    createEventModalRef,
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
        id="create_event_modal"
        ref={createEventModalRef}
        className="modal modal-bottom sm:modal-middle "
      >
        <div
          className={`modal-box p-0 overflow-hidden flex flex-col transition-all duration-300 !max-w-[1200px] w-[95%] ${
            selectedFile ? 'h-[800px]' : 'h-[750px]'
          }`}
          style={{ backgroundColor: 'rgba(15, 15, 15, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div className="p-4 border-b border-white/10 flex justify-center items-center relative bg-white/5">
            <p className={`${styles['createModalListItemText']} font-bold text-xl tracking-[0.2em] text-neongreen`}>
              {selectedFile ? 'SET EVENT DETAILS' : 'CREATE NEW EVENT'}
            </p>
          </div>

          <div className="flex-grow flex flex-col sm:flex-row overflow-hidden">
            {!selectedFile ? (
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="flex-grow flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-white/5 transition-colors group"
                  >
                    <input {...getInputProps()} ref={fileInputRef} />
                    <div className="w-24 h-24 rounded-full bg-neongreen/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-neongreen/20 shadow-neon-sm">
                      <FaPhotoVideo className="text-4xl text-neongreen" />
                    </div>
                    <p className={`${styles['createModalListItemText']} text-xl mb-4 text-white/70 font-light`}>
                      拖曳或點擊上傳活動照片
                    </p>
                    <button className="btn bg-neongreen hover:bg-neongreen/80 text-black border-none rounded-full px-10 shadow-neon font-bold">
                      瀏覽圖片
                    </button>
                  </div>
                )}
              </Dropzone>
            ) : (
              <>
                {/* Left Side: Image Preview */}
                <div className="flex-1 bg-black/60 flex items-center justify-center overflow-hidden border-r border-white/10 relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
                </div>

                {/* Right Side: Activity Details Area */}
                <div className="flex-1 flex flex-col bg-black/40 overflow-hidden relative">
                  <div className="flex-grow overflow-y-auto custom-scrollbar p-8 shadow-inner">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-neongreen/20 flex items-center justify-center border border-neongreen/30 rotate-3 transform transition-transform hover:rotate-0">
                        <FaPhotoVideo className="text-neongreen text-xl" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight tracking-wider">活動資訊</h3>
                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-tight">填寫詳情讓更多人參與</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-neongreen font-bold uppercase tracking-widest block ml-2">活動名稱</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="為你的活動命名"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 h-12 focus:border-neongreen/50 focus:bg-white/10 transition-all text-white text-sm outline-none placeholder:text-white/20 shadow-inner block"
                          onChange={handleEventContentChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-neongreen font-bold uppercase tracking-widest block ml-2">活動描述</label>
                        <textarea
                          name="description"
                          placeholder="描述一下活動內容..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 min-h-[120px] focus:border-neongreen/50 focus:bg-white/10 transition-all text-white text-sm outline-none placeholder:text-white/20 resize-none shadow-inner block"
                          onChange={handleEventContentChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-neongreen font-bold uppercase tracking-widest block ml-2">活動地點</label>
                        <input
                          type="text"
                          name="location"
                          placeholder="輸入活動地點"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 h-12 focus:border-neongreen/50 focus:bg-white/10 transition-all text-white text-sm outline-none placeholder:text-white/20 shadow-inner block"
                          onChange={handleEventContentChange}
                        />
                      </div>

                      <div className="flex items-center gap-3 py-4">
                         <div className="h-[1px] flex-grow bg-white/10"></div>
                         <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest whitespace-nowrap">時間設定</span>
                         <div className="h-[1px] flex-grow bg-white/10"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-white/40 ml-2 font-bold uppercase tracking-widest block">開始日期</label>
                          <input
                            type="text"
                            name="startDate"
                            min={minDate}
                            placeholder="選擇日期"
                            onFocus={handleDateFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 focus:border-neongreen/50 transition-all text-white text-xs text-center outline-none shadow-inner block"
                            onChange={handleEventContentChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-white/40 ml-2 font-bold uppercase tracking-widest block">開始時間</label>
                          <input
                            type="text"
                            name="startTime"
                            placeholder="選擇時間"
                            onFocus={handleTimeFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 focus:border-neongreen/50 transition-all text-white text-xs text-center outline-none shadow-inner block"
                            onChange={handleEventContentChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-white/40 ml-2 font-bold uppercase tracking-widest block">結束日期</label>
                          <input
                            type="text"
                            name="endDate"
                            min={minEndDate}
                            placeholder="選擇日期"
                            onFocus={handleDateFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 focus:border-neongreen/50 transition-all text-white text-xs text-center outline-none shadow-inner block"
                            onChange={handleEventContentChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-white/40 ml-2 font-bold uppercase tracking-widest block">結束時間</label>
                          <input
                            type="text"
                            name="endTime"
                            placeholder="選擇時間"
                            onFocus={handleTimeFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-11 focus:border-neongreen/50 transition-all text-white text-xs text-center outline-none shadow-inner block"
                            onChange={handleEventContentChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Footer */}
                  <div className="p-6 bg-black/40 border-t border-white/10 flex flex-col items-center backdrop-blur-md">
                    <button
                      className={`btn bg-neongreen hover:bg-neongreen/80 text-black border-none w-full max-w-[280px] rounded-full shadow-neon font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                        isUploading ? 'loading' : ''
                      }`}
                      onClick={handleEventFileUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        uploadProgress < 90 ? `圖片上傳中 ${uploadProgress}%` : 
                        uploadProgress < 99 ? '同步至雲端...' : '發布活動中...'
                      ) : '建立活動'}
                    </button>

                    {/* 上傳進度條與取消按鈕 */}
                    {isUploading && (
                      <div className="w-full max-w-[400px] mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white/50 font-medium">活動資料上傳中...</span>
                          <button 
                            onClick={cancelUpload}
                            className="text-white/40 hover:text-white/90 transition-colors flex items-center gap-1 text-xs"
                          >
                            <IoClose size={14} /> 取消上傳
                          </button>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div 
                            className="bg-neongreen h-full transition-all duration-300 shadow-[0_0_10px_rgba(160,255,31,0.5)]"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => {
              resetAndCloseModal();
              setIsHoverActive(true);
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
}
