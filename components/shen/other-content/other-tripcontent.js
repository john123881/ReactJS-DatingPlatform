import React from 'react';
import { useState, useEffect } from 'react';
import { useLoader } from '@/context/use-loader';
import Loader from '@/components/ui/loader/loader';

export default function OtherTripContent({ imageSrc, altText, onClick }) {
  const [showDetails, setShowDetails] = useState(false); // 控制顯示電影細節的狀態
  const { open, close, isLoading } = useLoader();

  const handleShowDetails = () => {
    setShowDetails(!showDetails); // 這個狀態用於子組件顯示某些內容（如果有需要）
    if (onClick) {
      onClick(); // 這裡調用父組件的函數來更新父組件的狀態
    }
  };
  return (
    <div className="relative group">
      <div className="flex flex-col justify-center items-center w-32 h-32 sm:w-48 sm:h-48 border border-white rounded-2xl overflow-hidden relative group">
        {isLoading ? (
          <Loader />
        ) : (
          <img
            src={imageSrc}
            alt={altText}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300 ease-in-out border border-white rounded-lg cursor-pointer"
          />
        )}

        <div
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
          onClick={handleShowDetails}
        >
          <p className="text-white text-xl text-center">{altText}</p>
        </div>
      </div>
    </div>
  );
}
