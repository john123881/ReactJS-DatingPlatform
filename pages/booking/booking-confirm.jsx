import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';
import { useAuth } from '@/context/auth-context';
import Loader from '@/components/ui/loader/loader';

export default function MovieSeatSelection({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  const { auth, isAuthLoaded, setLoginModalToggle } = useAuth();

  useEffect(() => {
    onPageChange(pageTitle);
  }, [onPageChange, pageTitle]);

  // Auth Guard
  useEffect(() => {
    if (isAuthLoaded && auth.id === 0) {
      setLoginModalToggle(true);
    }
  }, [isAuthLoaded, auth.id, setLoginModalToggle]);

  if (!isAuthLoaded) {
    return <Loader text="確認登入狀態中..." minHeight="80vh" />;
  }

  if (auth.id === 0) {
    return null;
  }

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="card w-96 bg-neutral text-neutral-content items-center">
        <div className="card-body items-center text-center">
          <h2 className="card-title">訂票同意</h2>
          <p>訂票同意書</p>
        </div>
      </div>
      {/* <div className="form-control">
  <label className="cursor-pointer label">
    <span className="label-text">同意請勾選</span>
    <input type="checkbox" defaultChecked className="checkbox checkbox-success" />
  </label>
</div> */}
      <div className="flex justify-center items-center h-screen">
        <div className="form-control">
          <label className="cursor-pointer label flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="checkbox checkbox-success mr-2"
              style={{ borderColor: '#10b981', backgroundColor: '#10b981' }}
            />
            <span className="label-text">同意請勾選</span>
          </label>
        </div>
      </div>
      <button
        className="btn btn-outline"
        style={{
          textAlign: 'center',
          margin: '0 10px', // 設置按鈕之間的間距
          display: 'inline-block',
          height: '50px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s',
          color: '#A0FF1F',
          borderColor: '#A0FF1F',
        }}
        onClick={() => {
          if (auth.id === 0) {
            setLoginModalToggle(true);
          } else {
            router.push('/booking/movie-ticket-select');
          }
        }}
      >
        我已同意，前往票卷選擇
      </button>
    </>
  );
}
