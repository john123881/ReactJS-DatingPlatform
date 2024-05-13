import { useLottie } from 'lottie-react';
import heartAnima from './index-heart.json';
import React from 'react';
import Lottie from 'react-lottie';

export default function IndexHeart() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: heartAnima,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <>
      <div className="h-[50px} w-[100%] absolute top-[-24px] left-[3px]">
        <Lottie options={defaultOptions} height={150} width={150} />
      </div>
    </>
  );
}
