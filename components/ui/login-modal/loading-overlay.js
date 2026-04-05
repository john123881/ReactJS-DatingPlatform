import React from 'react';
import { useAuth } from '@/context/auth-context';

export default function LoadingOverlay() {
  const { isLoggingIn, cancelLogin } = useAuth();

  if (!isLoggingIn) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-300 pointer-events-auto"
      style={{
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex flex-col items-center p-8 bg-white/10 rounded-3xl border border-white/20 shadow-2xl max-w-xs w-full text-center">
        {/* Premium Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-neongreen/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-neongreen border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">正在啟動伺服器</h3>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          由於伺服器正在從休眠中啟動，可能需要一段時間，請稍候...
        </p>

        <button
          onClick={cancelLogin}
          className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors text-sm font-medium"
        >
          取消登入
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
