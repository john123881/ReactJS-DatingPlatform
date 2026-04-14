import { useEffect, useRef } from 'react';
import { usePostContext } from '@/context/post-context';
import { FaPhotoVideo, FaRegTimesCircle } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import styles from './modal.module.css';
import Dropzone from 'react-dropzone';

export default function CreateModal() {
  const {
    selectedFile,
    previewUrl,
    setPreviewUrl,
    postContent,
    setPostContent,
    resetAndCloseModal,
    handleFileUpload,
    handleFileChange,
    onDrop,
    handleKeyPress,
    setIsHoverActive,
    createModalRef,
    isUploading,
    uploadProgress,
    cancelUpload,
  } = usePostContext();

  const fileInputRef = useRef(null);
  const handleFilePicker = () => fileInputRef.current?.click();

  const handlePostContentChange = (e) => {
    setPostContent(e.target.value);
  };

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
        id="create_modal"
        ref={createModalRef}
        className="modal modal-bottom sm:modal-middle "
      >
        <div
          className={`modal-box p-0 overflow-hidden flex flex-col transition-all duration-300 ${
            selectedFile ? 'max-w-md w-[95%] h-[750px] max-h-[95vh]' : 'max-w-md w-full h-[500px]'
          }`}
          style={{ backgroundColor: 'rgba(20, 20, 20, 0.95)', backdropFilter: 'blur(10px)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-center items-center relative">
            <p className={`${styles['createModalListItemText']} font-bold text-xl text-neongreen`}>
              {selectedFile ? '預覽貼文' : '建立新貼文'}
            </p>
          </div>

          <div className="flex-grow flex flex-col overflow-hidden">
            {!selectedFile ? (
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="flex-grow flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <input {...getInputProps()} ref={fileInputRef} />
                    <FaPhotoVideo className={`${styles['createModalListItemIcon']} text-8xl mb-6 text-neongreen`} />
                    <p className={`${styles['createModalListItemText']} text-xl mb-4 text-white/70`}>
                      請將照片拖曳至此處
                    </p>
                    <button className="btn bg-neongreen hover:bg-neongreen/80 text-black border-none rounded-full px-8 shadow-neon">
                      從圖庫瀏覽
                    </button>
                  </div>
                )}
              </Dropzone>
            ) : (
              <>
                {/* Top: Image Preview */}
                <div className="h-[400px] bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/10 shrink-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bottom: Content Area */}
                <div className="flex-1 flex flex-col p-6 bg-dark/50 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-neongreen/20 flex items-center justify-center overflow-hidden border border-neongreen/30">
                      <FaPhotoVideo className="text-neongreen text-base" />
                    </div>
                    <span className="text-white font-medium text-sm">編輯貼文內容</span>
                  </div>

                  {/* Tags Selection */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['約會', '酒吧', '電影', '活動'].map((tag) => {
                      const isSelected = postContent?.includes(`#${tag}`);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => {
                            const tagStr = `#${tag}`;
                            if (isSelected) {
                              setPostContent((postContent || '').replace(tagStr, '').trim());
                            } else {
                              // 將標籤加在內容後面
                              setPostContent(`${(postContent || '').trim()} ${tagStr}`.trim());
                            }
                          }}
                          className={`badge badge-sm cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-neongreen text-black border-neongreen' 
                              : 'badge-outline border-white/20 text-white/50 hover:border-neongreen/50'
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    className="textarea textarea-ghost w-full flex-grow text-base leading-relaxed placeholder:text-white/30 focus:bg-white/5 transition-all resize-none p-0 focus:outline-none"
                    placeholder="撰寫貼文內容..."
                    autoFocus
                    value={(postContent || '').split('#')[0].trim()}
                    onChange={(e) => {
                      const tags = (postContent || '').split('#').slice(1).map(t => `#${t.trim()}`).join(' ');
                      setPostContent(`${e.target.value} ${tags}`.trim());
                    }}
                    onKeyDown={(e) => handleKeyPress(e, () => handleFileUpload())}
                  />

                  <div className="pt-4 mt-auto border-t border-white/10 flex justify-center">
                    <button
                      className={`btn bg-neongreen hover:bg-neongreen/80 text-black border-none w-full rounded-full shadow-neon font-bold text-lg ${
                        isUploading ? 'loading' : ''
                      }`}
                      onClick={handleFileUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        uploadProgress < 90 ? `貼文上傳中 ${uploadProgress}%` : 
                        uploadProgress < 99 ? '同步至雲端...' : '正在發布內容...'
                      ) : '分享貼文'}
                    </button>
                  </div>

                  {/* 上傳進度條與取消按鈕 */}
                  {isUploading && (
                    <div className="mt-4 px-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/50 font-medium">圖片上傳中...</span>
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
