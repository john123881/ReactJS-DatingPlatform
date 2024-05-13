import { useLottie } from 'lottie-react';
import fireworkAnima from './firework.json';
import React from 'react';

export default function FireworkAnimation() {
  const options = {
    animationData: fireworkAnima,
    loop: true,
  };
  const { View } = useLottie(options);
  return <>{View}</>;
}
