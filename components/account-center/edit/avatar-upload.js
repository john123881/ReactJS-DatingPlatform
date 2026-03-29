import { useRef } from 'react';
import { API_SERVER } from '@/configs/api-config';
import toast from 'react-hot-toast';

/**
 * AvatarUpload - 處理大頭照選取與上傳預覽
 */
export default function AvatarUpload({ avatar, onFileChange }) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('文件大小不能超過1MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('文件類型必須是JPG、JPEG或PNG');
        return;
      }
      onFileChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-full">
      <div className="mx-4 mt-4 ">
        <img
          className="object-cover w-48 h-48 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
          src={avatar ? avatar : `${API_SERVER}/avatar/defaultAvatar.jpg`}
          alt="會員大頭照"
          onClick={handleImageClick}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
      </div>
      <div className="max-h-[48px] w-[200px] mx-4 my-4 lg:mb-4 ">
        <p className="mb-4 text-xs text-center md:text-sm text-slate-400">
          點擊頭像可直接上傳
        </p>
        <p className="text-xs text-center md:text-sm text-slate-500">
          檔案大小： 最大1MB <br/>
          格式：.JPG, .JPEG, .PNG
        </p>
      </div>
    </div>
  );
}
