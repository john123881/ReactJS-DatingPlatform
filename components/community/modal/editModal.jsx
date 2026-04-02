import { useState, useEffect, useRef } from 'react';
import { usePostContext } from '@/context/post-context';
import styles from './modal.module.css';

export default function EditModal({ post, modalId }) {
  const {
    selectedFile,
    previewUrl,
    setPreviewUrl,
    resetAndCloseModal,
    handleFilePicker,
    handlePostUpdate,
    handleFileChange,
    postContent,
    fileInputRef,
    handleKeyPress,
  } = usePostContext();

  const editModalRef = useRef(null);

  const [localPostContext, setLocalPostContext] = useState(postContent);

  const handlePostContentChange = (e) => {
    setLocalPostContext(e.target.value);
  };

  // 監聽 post.post_context 的變化來更新狀態
  useEffect(() => {
    // 更新 textarea 的值
    setLocalPostContext(post.post_context);
  }, [post.post_context]);

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
        ref={editModalRef}
        className="modal modal-bottom sm:modal-middle max-w-full"
      >
        <div
          className="modal-box p-0 overflow-hidden flex flex-col transition-all duration-300 max-w-md w-[95%] h-[750px] max-h-[95vh]"
          style={{ backgroundColor: 'rgba(20, 20, 20, 0.95)', backdropFilter: 'blur(10px)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-center items-center relative">
            <p className={`${styles['createModalListItemText']} font-bold text-xl text-neongreen`}>
              編輯貼文
            </p>
          </div>

          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Top: Image Preview / Change */}
            <div 
              className="h-[400px] bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/10 cursor-pointer group relative shrink-0"
              onClick={handleFilePicker}
            >
              <img
                src={selectedFile ? previewUrl : (post.img || '/unavailable-image.jpg')}
                alt={post.photo_name || 'Post Image'}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white bg-black/50 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                  點擊更換照片
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Bottom: Edit Area */}
            <div className="flex-1 flex flex-col p-6 bg-dark/50 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-neongreen/20 flex items-center justify-center border border-neongreen/30">
                  <div className="text-neongreen font-bold text-[10px]">EDIT</div>
                </div>
                <span className="text-white font-medium text-sm">修改貼文內容</span>
              </div>

              <textarea
                className="textarea textarea-ghost w-full flex-grow text-base leading-relaxed placeholder:text-white/30 focus:bg-white/5 transition-all resize-none p-0 focus:outline-none"
                placeholder="編輯你的貼文..."
                autoFocus
                value={localPostContext}
                onChange={handlePostContentChange}
                onKeyDown={(e) => handleKeyPress(e, () => handlePostUpdate(post, localPostContext, editModalRef))}
              />

              <div className="pt-4 mt-auto border-t border-white/10 flex justify-center">
                <button
                  className="btn bg-neongreen hover:bg-neongreen/80 text-black border-none w-full rounded-full shadow-neon font-bold text-lg"
                  onClick={() => handlePostUpdate(post, localPostContext, editModalRef)}
                >
                  確認修改
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
