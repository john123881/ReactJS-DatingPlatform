import Lottie from 'lottie-react';
import loginBackgroundAnima from './login-background.json';

export default function LoginBackgroundAnimation({ isOnLogin }) {
  const style = {
    height: 550,
    width: '100%',
    borderRadius: '24px',
    transform: isOnLogin ? 'scaleX(-1)' : 'none',
    transition: 'transform 0.5s ease-in-out',
  };

  return (
    <div className="flex justify-center items-center overflow-hidden rounded-[24px] w-full h-full">
      <Lottie
        animationData={loginBackgroundAnima}
        loop={true}
        autoPlay={true}
        style={style}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
        }}
      />
    </div>
  );
}
