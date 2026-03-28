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

  // Note: JWT is now handled via httpOnly cookies; 'credentials: include' takes care of it.
  const isLoginRequest = endpoint === '/login' || endpoint === '/google-login';

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    credentials: 'include', // 核心！允許發送 Cookie
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  // 取得 localStorage 中的 token 作為備援 (針對 localhost 開發環境)
  const storageKey = 'TD_auth';
  const str = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
  if (str) {
    try {
      const parsed = JSON.parse(str);
      if (parsed && parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error('API Client: Failed to parse auth data from localStorage', e);
    }
  }

  // 如果是 FormData，不要設置 Content-Type，讓瀏覽器自動處理 (帶上 boundary)
  if (isFormData) {
    delete config.headers['Content-Type'];
    config.body = body;
  } else if (body) {
    config.body = JSON.stringify(body);
  }

  // 如果 endpoint 已經是完整 URL (以 http 或 https 開頭)，則不重複拼接 API_SERVER
  const fullUrl =
    endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? endpoint
      : `${API_SERVER}${endpoint}`;


  const response = await fetch(fullUrl, config);

  if (response.status === 401 || response.status === 438) {
    console.warn(`Auth error detected - status ${response.status}`);
    localStorage.removeItem('TD_auth');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!response.ok) {
    let errorMessage = `Server error: ${response.status} ${response.statusText}`;
    if (isJson) {
      try {
        const errorData = await response.json();
        const msg = errorData.message || errorData.error || errorData.msg;
        if (msg) {
          errorMessage = msg;
        }
      } catch (e) {
        console.error('Error parsing JSON from non-OK response:', e);
      }
    } else {
      try {
        const text = await response.text();
        if (text && text.length < 500) {
          errorMessage = text;
        }
      } catch (e) {
        console.error('Error reading text from non-OK response:', e);
      }
    }

    // Special Global Handling: If the error message indicates success (contains "成功"), 
    // we log it as a warning but DO NOT throw, instead returning the message body. 
    // This handles inconsistent backends that return non-200 for successful operations.
    if (errorMessage.includes('成功')) {
      console.warn(`Backend returned non-OK status (${response.status}) but message indicates success: "${errorMessage}"`);
      return { success: true, message: errorMessage, data: null };
    }

    // Global Handling for Auth Expiry Messages
    if (errorMessage.includes('沒授權TOKEN') || errorMessage.includes('授權失敗')) {
      localStorage.removeItem('TD_auth');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
      errorMessage = '工作階段已過期，請重新登入';
    }

    throw new Error(errorMessage);
  }

  if (isJson) {
    return response.json();
  } else {
    return response.text();
  }
}

// 輔助方法：GET
apiClient.get = (endpoint, config) =>
  apiClient(endpoint, { ...config, method: 'GET' });

// 輔助方法：POST
apiClient.post = (endpoint, body, config) =>
  apiClient(endpoint, { ...config, method: 'POST', body });

// 輔助方法：PUT
apiClient.put = (endpoint, body, config) =>
  apiClient(endpoint, { ...config, method: 'PUT', body });

// 輔助方法：DELETE
apiClient.delete = (endpoint, config) =>
  apiClient(endpoint, { ...config, method: 'DELETE' });
