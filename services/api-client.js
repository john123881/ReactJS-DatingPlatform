import { API_SERVER } from '@/configs/api-config';

/**
 * 核心 API 請求器
 * @param {string} endpoint - API 路徑 (不含 Base URL)
 * @param {object} options - Fetch 配置項
 * @returns {Promise<any>} - 解析後的 JSON 數據
 */
export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const isFormData = body instanceof FormData;

  // 從 localStorage 取得 token (假設存在)
  const isLoginRequest = endpoint === '/login' || endpoint === '/google-login';

  if (!isLoginRequest) {
    try {
      const authData = localStorage.getItem('TD_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.token) {
          headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      console.error('Error reading auth from localStorage:', e);
    }
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  // 如果是 FormData，不要設置 Content-Type，讓瀏覽器自動處理 (帶上 boundary)
  if (isFormData) {
    delete config.headers['Content-Type'];
    config.body = body;
  } else if (body) {
    config.body = JSON.stringify(body);
  }

  console.log('Fetching URL:', `${API_SERVER}${endpoint}`);
  console.log('Config headers:', config.headers);

  const response = await fetch(`${API_SERVER}${endpoint}`, config);

  if (response.status === 401) {
    // 處理未授權情況 (例如：Token 過期)
    console.warn('Unauthorized request - 401');
    // 可在此加入全局登出邏輯或跳轉
  }

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorData.msg || errorMessage;
    } catch (e) {
      // 忽略解析錯誤，使用預設的 statusText
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// 輔助方法：GET
apiClient.get = (endpoint, config) => apiClient(endpoint, { ...config, method: 'GET' });

// 輔助方法：POST
apiClient.post = (endpoint, body, config) => apiClient(endpoint, { ...config, method: 'POST', body });

// 輔助方法：PUT
apiClient.put = (endpoint, body, config) => apiClient(endpoint, { ...config, method: 'PUT', body });

// 輔助方法：DELETE
apiClient.delete = (endpoint, config) => apiClient(endpoint, { ...config, method: 'DELETE' });
