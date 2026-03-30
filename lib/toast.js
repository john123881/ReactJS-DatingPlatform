import Swal from 'sweetalert2';

/**
 * 全站統一的 Toast 通知工具
 * 預設顯示在右下角，並自動於 3 秒後消失
 */
export const toast = {
  success: (title, text = '') => {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#a0ff1f',
      color: '#000000',
      iconColor: '#000000',
    });
  },
  error: (title, text = '') => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#1a1d23',
      color: '#ffffff',
    });
  },
  warning: (title, text = '') => {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#1a1d23',
      color: '#ffffff',
      iconColor: '#a0ff1f',
    });
  },
  info: (title, text = '') => {
    Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      background: '#1a1d23',
      color: '#ffffff',
    });
  },
  loading: (title) => {
    return Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#1a1d23',
      color: '#ffffff',
    });
  },
  promise: async (promiseFunc, options = {}) => {
    // 顯示 Loading
    const loadingToast = Swal.fire({
      title: options.loading || '處理中...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#1a1d23',
      color: '#ffffff',
    });

    try {
      const result = await promiseFunc();
      
      // 成功處理
      const successMsg = typeof options.success === 'function' 
        ? options.success(result) 
        : options.success;
      
      Swal.fire({
        icon: 'success',
        title: successMsg || '成功',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#a0ff1f',
        color: '#000000',
        iconColor: '#000000',
      });
      
      return result;
    } catch (error) {
      // 錯誤處理
      const errorMsg = typeof options.error === 'function' 
        ? options.error(error) 
        : options.error;
      
      Swal.fire({
        icon: 'error',
        title: errorMsg || '失敗',
        text: error.toString(),
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#1a1d23',
        color: '#ffffff',
      });
      
      throw error;
    }
  },
  fire: (options) => {
    return Swal.fire({
      background: '#1a1d23',
      color: '#ffffff',
      ...options,
    });
  }
};
