import { useLottie } from 'lottie-react';
import fireworkAnima from './firework.json';

export default function FireworkAnimation() {
  const options = {
    animationData: fireworkAnima,
    loop: true,
  };
  const { View } = useLottie(options);
  return <>{View}</>;
}
