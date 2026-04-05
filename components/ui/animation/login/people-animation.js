import { useLottie } from 'lottie-react';
import peopleAnima from './peopleData.json';

export default function PeopleAnimation({ isOnLoginPage }) {
  const options = {
    animationData: peopleAnima,
    loop: true,
    style: {
      height: '270px',
      width: '250px',
      marginTop: '40px',
      transform: isOnLoginPage ? '' : 'scaleX(-1)',
    },
  };
  const { View } = useLottie(options);
  return <>{View}</>;
}
