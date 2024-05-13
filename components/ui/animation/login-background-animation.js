import { useLottie } from 'lottie-react';
import loginBackgroundAnima from './login-background.json';
import React from 'react';
import Lottie from 'react-lottie';

export default function LoginBackgroundAnimation({ isOnLogin }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginBackgroundAnima,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <>
      <div
        // className="rounded-[24px]"
        style={{
          transform: isOnLogin ? 'scaleX(-1)' : 'none',
        }}
      >
        <Lottie
          options={defaultOptions}
          height={550}
          style={{ borderRadius: '24px' }}
        />
      </div>
    </>
  );
}
