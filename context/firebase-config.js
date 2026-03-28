import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// 從環境變數讀取 Firebase 設定，避免金鑰洩漏到 GitHub
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export { firebaseConfig };

const app = initializeApp(firebaseConfig);

export const getAuthGoogle = getAuth(app);
