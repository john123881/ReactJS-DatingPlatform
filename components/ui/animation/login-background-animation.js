import Lottie from 'lottie-react';
import loginBackgroundAnima from './login-background.json';

export default function LoginBackgroundAnimation({ isOnLogin }) {
  const style = {
    height: 550,
    borderRadius: '24px',
    transform: isOnLogin ? 'scaleX(-1)' : 'none',
    transition: 'transform 0.5s ease-in-out',
  };

  return (
    <div className="flex justify-center items-center overflow-hidden rounded-[24px]">
      <Lottie
        animationData={loginBackgroundAnima}
        loop={true}
        autoPlay={true}
        style={style}
      />
    </div>
  );
}
