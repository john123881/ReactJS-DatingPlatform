import { API_SERVER } from '@/configs/api-config';

/**
 * 取得認證配置 (Token 備援)
 */
function getAuthConfig(customConfig = {}) {
  const headers = { 'Content-Type': 'application/json', ...customConfig.headers };
  const storageKey = 'TD_auth';
  const str = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

  if (str) {
    try {
      const parsed = JSON.parse(str);
      if (parsed?.token) {
        headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error('API Client: Auth parse error', e);
    }
  }
  return headers;
}

/**
 * 準備請求主體 (JSON vs FormData)
 */
function prepareRequestBody(body) {
  if (body instanceof FormData) {
    return { body, isFormData: true };
  }
  return { body: body ? JSON.stringify(body) : undefined, isFormData: false };
}

/**
 * 處理特殊錯誤狀態 (401/438)
 */
function handleErrorStatus(status) {
  if (status === 401 || status === 438) {
    console.warn(`Auth error: ${status}`);
    localStorage.removeItem('TD_auth');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
  }
}

/**
 * 解析回應錯誤訊息
 */
async function parseResponseError(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  try {
    if (isJson) {
      const errorData = await response.json();
      return errorData.message || errorData.error || errorData.msg || `Error: ${response.status}`;
    }
    const text = await response.text();
    return text.length < 500 ? text : `Server error: ${response.status}`;
  } catch (e) {
    return `Server error: ${response.status}`;
  }
}

/**
 * 最終回應處理 (解包 success/data)
 */
async function processResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');

  if (!isJson) return response.text();

  const result = await response.json();

  // 統一回應包裝處理
  if (result && typeof result === 'object' && 'success' in result) {
    if (result.success) {
      // 核心相容性邏輯 (Ghost Wrapper Pattern):
      // 我們確保 finalData 至少是一個空陣列 (除非原本就是物件型態的工作)
      // 但在大多數情況下，回傳 [] 比回傳 null 對組件更具防禦性。
      const finalData = result.data !== undefined ? (result.data ?? []) : result;
      
      // 如果 finalData 是 null，我們需要建立一個包裝物件以便定義 .success 屬性，
      // 否則前端執行 if (result.success) 時會噴出 TypeError: Cannot read properties of null
      const isNull = finalData === null;
      const wrapper = isNull ? {} : finalData;

      if (wrapper && (typeof wrapper === 'object' || Array.isArray(wrapper))) {
        // 定義 .success 屬性
        try {
          Object.defineProperty(wrapper, 'success', {
            value: true,
            enumerable: false,
            configurable: true,
          });

          // 定義 .data 屬性
          Object.defineProperty(wrapper, 'data', {
            value: isNull ? null : wrapper,
            enumerable: false,
            configurable: true,
          });

          // 定義 .message
          Object.defineProperty(wrapper, 'message', {
            value: result.message || 'Success',
            enumerable: false,
            configurable: true,
          });

          // 如果有分頁資訊
          if (result.pagination) {
            Object.defineProperty(wrapper, 'pagination', {
              value: result.pagination,
              enumerable: false,
              configurable: true,
            });
          }

          // 核心修正：保留所有原始回應中的額外 Key (如 barType, movieType, hasPlay 等)
          Object.keys(result).forEach((key) => {
            if (!['success', 'data', 'message', 'pagination'].includes(key)) {
              if (!(key in wrapper)) {
                Object.defineProperty(wrapper, key, {
                  value: result[key],
                  enumerable: false,
                  configurable: true,
                });
              }
            }
          });
        } catch (e) {
          console.warn('API Client: Could not define ghost properties on response', e);
        }
      }

      return wrapper;
    }
    // 失敗時，拋出後端給的 message
    throw new Error(result.message || '操作失敗');
  }

  // 針對舊有 API (沒有 success 欄位的)，直接返回原始 JSON
  return result ?? {};
}

/**
 * 核心 API 請求器
 */
export async function apiClient(endpoint, { body: rawBody, ...customConfig } = {}) {
  const { body, isFormData } = prepareRequestBody(rawBody);
  const headers = getAuthConfig(customConfig);

  if (isFormData) delete headers['Content-Type'];

  const config = {
    method: rawBody ? 'POST' : 'GET',
    ...customConfig,
    credentials: 'include',
    headers,
    body,
  };

  const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_SERVER}${endpoint}`;
  const response = await fetch(fullUrl, config);

  handleErrorStatus(response.status);

  if (!response.ok) {
    const errorMsg = await parseResponseError(response);

    // 特殊邏輯：如果訊息包含「成功」但狀態碼非 200 (相容舊後端)
    if (errorMsg.includes('成功')) {
      return { success: true, message: errorMsg, data: null };
    }

    if (errorMsg.includes('沒授權TOKEN') || errorMsg.includes('授權失敗')) {
      handleErrorStatus(401); // 觸發過期邏輯
      throw new Error('工作階段已過期，請重新登入');
    }

    throw new Error(errorMsg);
  }

  return processResponse(response);
}

/**
 * 檔案上傳器 (支援進度追蹤與取消)
 */
export function uploadFile(endpoint, formData, onProgress, method = 'POST') {
  let abortFn;
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    abortFn = () => xhr.abort();
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_SERVER}${endpoint}`;

    xhr.open(method, fullUrl);

    // 取得認證資訊
    const storageKey = 'TD_auth';
    const str = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (str) {
      try {
        const parsed = JSON.parse(str);
        if (parsed?.token) {
          xhr.setRequestHeader('Authorization', `Bearer ${parsed.token}`);
        }
      } catch (e) {
        console.error('API Client: Auth parse error', e);
      }
    }

    xhr.withCredentials = true;

    // 進度監聽
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const responseText = xhr.responseText;
          const result = JSON.parse(responseText);
          if (result && result.success) {
            const finalData = result.data !== undefined ? result.data : result;
            if (finalData && (typeof finalData === 'object' || Array.isArray(finalData))) {
              Object.defineProperty(finalData, 'success', { value: true, enumerable: false, configurable: true });
              Object.defineProperty(finalData, 'data', { value: finalData, enumerable: false, configurable: true });
              if (result.message) {
                Object.defineProperty(finalData, 'message', { value: result.message, enumerable: false, configurable: true });
              }
            }
            resolve(finalData);
          } else {
            resolve(result);
          }
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else {
        handleErrorStatus(xhr.status);
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new Error('Upload aborted'));

    xhr.send(formData);
  });

  promise.abort = abortFn;
  return promise;
}

// 輔助方法
apiClient.get = (endpoint, config) => apiClient(endpoint, { ...config, method: 'GET' });
apiClient.post = (endpoint, body, config) => apiClient(endpoint, { ...config, method: 'POST', body });
apiClient.put = (endpoint, body, config) => apiClient(endpoint, { ...config, method: 'PUT', body });
apiClient.delete = (endpoint, config) => apiClient(endpoint, { ...config, method: 'DELETE' });
