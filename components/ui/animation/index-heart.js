import Lottie from 'lottie-react';
import heartAnima from './index-heart.json';

export default function IndexHeart() {
  return (
    <>
      <div className="flex justify-center w-full absolute top-[0px] md:top-[-30px]">
        <Lottie 
          animationData={heartAnima} 
          loop={true} 
          autoplay={true} 
          style={{ width: 150, height: 150 }} 
        />
      </div>
    </>
  );
}
