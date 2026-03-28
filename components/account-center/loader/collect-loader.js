import Loader from '@/components/ui/loader/loader';

export default function CollectLoader(props) {
  return <Loader minHeight="400px" text="正在載入收藏資料..." {...props} />;
}
