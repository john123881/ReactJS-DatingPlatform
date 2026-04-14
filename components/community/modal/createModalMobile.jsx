import { useEffect, useRef } from 'react';
import { usePostContext } from '@/context/post-context';
import { FaPhotoVideo } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import styles from './modal.module.css';

export default function CreateModalMobile() {
  const {
    selectedFile,
    previewUrl,
    setPreviewUrl,
    setPostContent,
    handleFileChange,
    resetAndCloseModal,
    handleFileUpload,
    handleKeyPress,
    createModalMobileRef,
    isUploading,
    uploadProgress,
    cancelUpload,
  } = usePostContext();

  const fileInputRef = useRef(null);
  const handleFilePicker = () => fileInputRef.current?.click();

  const handlePostContentChange = (e) => {
    setPostContent(e.target.value);
  };

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
        id="create_modal_mobile"
        ref={createModalMobileRef}
        className="modal fixed inset-0 w-screen h-screen z-[1000] items-end justify-center"
        style={{ zIndex: 1000 }}
      >
        <div
          className="modal-box p-0 overflow-hidden flex flex-col w-full h-[92vh] rounded-t-3xl bg-black/80 backdrop-blur-xl border-none relative will-change-transform m-0"
        >
          {/* Header */}
          <div className="pt-20 pb-4 px-6 border-b border-white/10 flex justify-center items-center relative bg-white/5">
            <p className={`${styles['createModalListItemText']} font-bold text-xl tracking-[0.2em] text-neongreen uppercase`}>
              {selectedFile ? 'POST DETAILS' : 'CREATE POST'}
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
                  分享您的精彩瞬間
                </p>
                <button
                  onClick={handleFilePicker}
                  className="btn bg-neongreen hover:bg-neongreen/80 text-black border-none rounded-full px-12 shadow-neon font-bold text-lg h-14"
                >
                  從相簿選擇圖片
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Preview Image */}
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-square relative group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                     <button 
                       onClick={handleFilePicker}
                       className="btn btn-xs btn-ghost text-white/70 hover:text-neongreen bg-black/40 backdrop-blur-sm rounded-lg border-white/10"
                     >
                       更換圖片
                     </button>
                  </div>
                </div>

                {/* Content Input */}
                <div className="space-y-2">
                  <label className="text-[10px] text-neongreen font-bold uppercase tracking-widest block ml-2 text-glow-neon">貼文內容</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 min-h-[160px] focus:border-neongreen/50 focus:bg-white/10 transition-all text-white text-sm outline-none placeholder:text-white/20 resize-none shadow-inner"
                    placeholder="在想什麼嗎？分享您的心情..."
                    onChange={handlePostContentChange}
                    onKeyDown={(e) =>
                      handleKeyPress(e, () => handleFileUpload())
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer - Sticky Button or Progress */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-black/80 backdrop-blur-xl border-t border-white/10 flex flex-col items-center min-h-[140px] justify-center">
            {/* Hidden Input */}
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
                onClick={handleFileUpload}
                disabled={!selectedFile}
              >
                立即發佈
              </button>
            ) : (
              <div className="w-full space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="loading loading-spinner loading-xs text-neongreen"></span>
                    <span className="text-sm text-neongreen font-bold uppercase tracking-widest text-glow-neon">
                      {uploadProgress < 90 ? `貼文上傳中 ${uploadProgress}%` : 
                       uploadProgress < 99 ? '正在同步至雲端...' : '正在發布精彩內容...'}
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
                  請稍後，正在為您珍藏精彩瞬間...
                </p>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
