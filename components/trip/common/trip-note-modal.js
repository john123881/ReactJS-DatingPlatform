import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import { toast } from '@/lib/toast';

export default function TripNoteModal({ isOpen, onClose, tripName, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    trip_title: '',
    trip_date: '',
    trip_description: '',
    trip_notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tripName) {
      setFormData({
        trip_title: tripName.trip_title || '',
        trip_date: tripName.trip_date ? tripName.trip_date.split('T')[0] : '',
        trip_description: tripName.trip_description || '',
        trip_notes: tripName.trip_notes || '',
      });
    }
  }, [tripName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await TripService.updateTripPlan(tripName.trip_plan_id, formData);
      if (response.success) {
        toast.success('行程資訊更新成功');
        if (onUpdateSuccess) onUpdateSuccess();
        onClose();
      } else {
        throw new Error(response.error || '更新失敗');
      }
    } catch (error) {
      console.error('Update trip error:', error);
      toast.error('更新失敗', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box w-[500px] bg-[#1a1d23] border border-white/10 shadow-2xl rounded-3xl p-8 animate__animated animate__zoomIn animate__faster">
        <h3 className="mb-8 text-3xl font-black text-neongreen tracking-tighter border-b border-neongreen/20 pb-4">行程詳細資訊編輯</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-white/60 font-bold ml-1">行程標題</span>
            </label>
            <input
              type="text"
              name="trip_title"
              className="input input-bordered w-full bg-black/40 text-white border-white/10 focus:border-neongreen focus:ring-1 focus:ring-neongreen transition-all rounded-xl"
              value={formData.trip_title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-white/60 font-bold ml-1">規劃日期</span>
            </label>
            <input
              type="date"
              name="trip_date"
              className="input input-bordered w-full bg-black/40 text-white border-white/10 focus:border-neongreen focus:ring-1 focus:ring-neongreen transition-all rounded-xl"
              value={formData.trip_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-white/60 font-bold ml-1">行程描述</span>
            </label>
            <textarea
              name="trip_description"
              className="textarea textarea-bordered h-24 bg-black/40 text-white border-white/10 focus:border-neongreen focus:ring-1 focus:ring-neongreen transition-all rounded-xl text-base leading-relaxed"
              placeholder="簡單描述一下您的這場完美約會..."
              value={formData.trip_description}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-white/60 font-bold ml-1">行程備註 (私密)</span>
            </label>
            <textarea
              name="trip_notes"
              className="textarea textarea-bordered h-32 bg-black/40 text-white border-white/10 focus:border-neongreen focus:ring-1 focus:ring-neongreen transition-all rounded-xl text-base leading-relaxed"
              placeholder="記下一些小細節，例如對方的喜好或預約碼..."
              value={formData.trip_notes}
              onChange={handleChange}
            />
          </div>

          <div className="modal-action mt-6 gap-3">
            <button
              type="button"
              className="btn flex-1 bg-transparent text-white border-white/20 rounded-2xl hover:bg-white/10 hover:border-white transition-all py-4 h-auto min-h-0"
              onClick={onClose}
              disabled={isSaving}
            >
              取消
            </button>
            <button
              type="submit"
              className={`btn flex-[2] bg-neongreen text-black border-none rounded-2xl hover:bg-white hover:scale-[1.02] transition-all py-4 h-auto min-h-0 shadow-glow-green`}
              disabled={isSaving}
            >
              {isSaving ? <span className="loading loading-spinner"></span> : '儲存變更'}
              {isSaving ? '儲存中...' : ''}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
    </dialog>
  );
}
