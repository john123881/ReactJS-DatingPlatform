import { useState, useEffect } from 'react';
import { TripService } from '@/services/trip-service';
import { toast } from '@/lib/toast';

export default function MyTripDetailSection({ tripName, onUpdateSuccess }) {
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
        trip_date: tripName.trip_date ? new Date(tripName.trip_date).toLocaleDateString('en-CA') : '',
        trip_description: tripName.trip_description || '',
        trip_notes: tripName.trip_notes || '',
      });
    }
  }, [tripName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!tripName?.trip_plan_id) return;
    
    setIsSaving(true);
    try {
      const response = await TripService.updateTripPlan(tripName.trip_plan_id, formData);
      if (response.success) {
        toast.success('行程資訊更新成功', '您的描述與筆記已儲存。');
        if (onUpdateSuccess) onUpdateSuccess();
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

  return (
    <div className="flex flex-col justify-start items-center h-auto w-full lg:w-[450px] border border-white/10 rounded-3xl py-12 px-8 flex-shrink-0 bg-white/5 backdrop-blur-3xl shadow-2xl animate__animated animate__fadeInRight">
      <h3 className="mb-10 text-4xl font-black text-neongreen text-center tracking-tighter">行程細節編輯</h3>
      
      <div className="w-full mb-8">
        <label className="flex items-center mb-4 text-2xl font-bold border-l-4 border-neongreen pl-4 text-white">
          行程描述
        </label>
        <textarea
          name="trip_description"
          className="w-full h-32 bg-black/40 text-white border border-white/10 rounded-2xl p-6 focus:border-neongreen focus:ring-1 focus:ring-neongreen transition-all outline-none text-lg leading-relaxed resize-none"
          placeholder="分享這趟行程的精彩之處..."
          value={formData.trip_description}
          onChange={handleChange}
        />
      </div>
      
      <div className="w-full mb-10 flex-grow">
        <label className="flex items-center mb-4 text-2xl font-bold border-l-4 border-neongreen pl-4 text-white">
          行程筆記 <span className="ml-2 text-sm text-gray-500 font-normal">(僅自己可見)</span>
        </label>
        <textarea
          name="trip_notes"
          className="w-full h-40 bg-black/40 text-white border border-white/10 rounded-2xl p-6 focus:border-neongreen focus:ring-1 focus:ring-neongreen transition-all outline-none text-lg leading-relaxed resize-none"
          placeholder="記下私人提醒，例如預約編號或特別叮嚀..."
          value={formData.trip_notes}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`group relative flex items-center justify-center w-full bg-neongreen hover:bg-white text-black font-black text-2xl py-6 rounded-2xl transition-all duration-300 shadow-glow-green hover:shadow-glow-white overflow-hidden ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <span className="relative z-10">{isSaving ? '儲存中...' : '儲存變更'}</span>
        {!isSaving && <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
      </button>
      
      <p className="mt-4 text-white/30 text-sm text-center font-medium uppercase tracking-widest">
        Last synced: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
