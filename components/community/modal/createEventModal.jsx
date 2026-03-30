import { useEffect } from 'react';
import { usePostContext } from '@/context/post-context';
import { FaPhotoVideo } from 'react-icons/fa';
import styles from './modal.module.css';
import Dropzone from 'react-dropzone';

export default function CreateEventModal() {
  const {
    selectedFile,
    previewUrl,
    setPreviewUrl,
    setEventDetails,
    resetAndCloseModal,
    handleEventFileUpload,
    handleFilePicker,
    handleDateFocus,
    handleBlur,
    handleTimeFocus,
    onDrop,
    setIsHoverActive,
    minDate,
    setMinDate,
    minEndDate,
    setMinEndDate,
    fileInputRef,
    createEventModalRef,
  } = usePostContext();

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
          className={`modal-box p-0 overflow-hidden flex flex-col transition-all duration-300 ${
            selectedFile ? 'max-w-5xl w-[95%] h-[650px]' : 'max-w-md w-full h-[500px]'
          }`}
          style={{ backgroundColor: 'rgba(20, 20, 20, 0.95)', backdropFilter: 'blur(10px)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-center items-center relative">
            <p className={`${styles['createModalListItemText']} font-bold text-xl text-neongreen`}>
              {selectedFile ? '設定活動詳情' : '建立新活動'}
            </p>
          </div>

          <div className="flex-grow flex flex-col sm:flex-row overflow-hidden">
            {!selectedFile ? (
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="flex-grow flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <input {...getInputProps()} ref={fileInputRef} />
                    <FaPhotoVideo className={`${styles['createModalListItemIcon']} text-8xl mb-6 text-primary`} />
                    <p className={`${styles['createModalListItemText']} text-xl mb-4 text-white/70`}>
                      請將活動照片拖曳至此處
                    </p>
                    <button className="btn btn-primary rounded-full px-8 shadow-neon">
                      從圖庫瀏覽
                    </button>
                  </div>
                )}
              </Dropzone>
            ) : (
              <>
                {/* Left Side: Image Preview */}
                <div className="flex-[1.2] bg-black/40 flex items-center justify-center overflow-hidden border-r border-white/10">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Right Side: Activity Details Area */}
                <div className="flex-1 flex flex-col p-6 bg-dark/50 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                      <FaPhotoVideo className="text-primary text-xl" />
                    </div>
                    <span className="text-white font-medium italic">讓大家知道活動資訊</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="form-control w-full">
                      <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">活動名稱</span>
                      <input
                        type="text"
                        name="title"
                        placeholder="替你的活動取個響亮的名字..."
                        className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12"
                        onChange={handleEventContentChange}
                      />
                    </label>

                    <label className="form-control w-full">
                      <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">活動描述</span>
                      <textarea
                        name="description"
                        placeholder="描述一下活動內容吧..."
                        className="textarea textarea-bordered bg-white/5 border-white/10 rounded-2xl focus:border-primary transition-all text-white h-24 resize-none"
                        onChange={handleEventContentChange}
                      />
                    </label>

                    <label className="form-control w-full">
                      <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">活動地點</span>
                      <input
                        type="text"
                        name="location"
                        placeholder="在哪裡舉行？"
                        className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12"
                        onChange={handleEventContentChange}
                      />
                    </label>

                    <div className="divider opacity-20 my-1">時間設定</div>

                    <div className="flex gap-4">
                      <label className="form-control flex-1">
                        <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">開始日期</span>
                        <input
                          type="text"
                          name="startDate"
                          min={minDate}
                          placeholder="選擇日期"
                          onFocus={handleDateFocus}
                          onBlur={handleBlur}
                          className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12 text-center"
                          onChange={handleEventContentChange}
                        />
                      </label>
                      <label className="form-control flex-1">
                        <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">開始時間</span>
                        <input
                          type="text"
                          name="startTime"
                          placeholder="選擇時間"
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
                          type="text"
                          name="endDate"
                          min={minEndDate}
                          placeholder="選擇日期"
                          onFocus={handleDateFocus}
                          onBlur={handleBlur}
                          className="input input-bordered bg-white/5 border-white/10 rounded-full focus:border-primary transition-all text-white h-12 text-center"
                          onChange={handleEventContentChange}
                        />
                      </label>
                      <label className="form-control flex-1">
                        <span className="label-text text-white/50 mb-1 ml-4 text-xs font-bold uppercase tracking-wider">結束時間</span>
                        <input
                          type="text"
                          name="endTime"
                          placeholder="選擇時間"
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
                      className="btn btn-primary btn-wide rounded-full shadow-neon font-bold text-lg"
                      onClick={handleEventFileUpload}
                    >
                      建立活動
                    </button>
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
