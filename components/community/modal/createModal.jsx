import { useEffect } from 'react';
import { usePostContext } from '@/context/post-context';
import { FaPhotoVideo } from 'react-icons/fa';
import styles from './modal.module.css';
import Dropzone from 'react-dropzone';

export default function CreateModal() {
  const {
    selectedFile,
    previewUrl,
    setPreviewUrl,
    setPostContent,
    resetAndCloseModal,
    handleFilePicker,
    handleFileUpload,
    onDrop,
    handleKeyPress,
    setIsHoverActive,
    fileInputRef,
    createModalRef,
  } = usePostContext();

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
            selectedFile ? 'max-w-4xl w-[90%] h-[600px]' : 'max-w-md w-full h-[500px]'
          }`}
          style={{ backgroundColor: 'rgba(20, 20, 20, 0.95)', backdropFilter: 'blur(10px)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-center items-center relative">
            <p className={`${styles['createModalListItemText']} font-bold text-xl text-neongreen`}>
              {selectedFile ? '預覽貼文' : '建立新貼文'}
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
                      請將照片拖曳至此處
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

                {/* Right Side: Content Area */}
                <div className="flex-1 flex flex-col p-6 bg-dark/50 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                      <FaPhotoVideo className="text-primary text-xl" />
                    </div>
                    <span className="text-white font-medium">編輯貼文內容</span>
                  </div>

                  <textarea
                    className="textarea textarea-ghost w-full flex-grow text-lg leading-relaxed placeholder:text-white/30 focus:bg-white/5 transition-all resize-none p-0 focus:outline-none"
                    placeholder="撰寫貼文內容..."
                    autoFocus
                    onChange={handlePostContentChange}
                    onKeyDown={(e) => handleKeyPress(e, () => handleFileUpload())}
                  />

                  <div className="pt-6 mt-auto border-t border-white/10 flex justify-end">
                    <button
                      className="btn btn-primary btn-wide rounded-full shadow-neon font-bold text-lg"
                      onClick={handleFileUpload}
                    >
                      分享貼文
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
