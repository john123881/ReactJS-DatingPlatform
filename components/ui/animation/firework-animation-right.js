import { useLottie } from 'lottie-react';
import fireworkAnimaRight from './firework-right.json';
import React, { useEffect, useRef } from 'react';

export default function FireworkAnimationRight() {
  const animationRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationRef.current?.play();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const options = {
    animationData: fireworkAnimaRight,
    loop: true,
    lottieRef: animationRef,
  };

  const { View } = useLottie(options);

  return <>{View}</>;
}
