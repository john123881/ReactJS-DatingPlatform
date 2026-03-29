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
      // 為了不破壞舊有直接預期 Array 的組件 (如 SuggestionBar)，
      // 又要維持對 .success 和 .data 的檢查支援，
      // 我們在資料物件/陣列上定義「隱形」(non-enumerable) 的屬性。
      
      const finalData = result.data !== undefined ? result.data : result;
      
      // 如果 finalData 是 null，我們需要建立一個包裝物件以便定義 .success 屬性，
      // 否則前端執行 if (result.success) 時會噴出 TypeError: Cannot read properties of null
      const isNull = finalData === null;
      const wrapper = isNull ? {} : finalData;

      if (wrapper && typeof wrapper === 'object') {
        // 定義 .success 屬性
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
      }

      return wrapper;
    }
    // 失敗時，拋出後端給的 message
    throw new Error(result.message || '操作失敗');
  }

  // 針對舊有 API (沒有 success 欄位的)，直接返回原始 JSON
  return result;
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

// 輔助方法
apiClient.get = (endpoint, config) => apiClient(endpoint, { ...config, method: 'GET' });
apiClient.post = (endpoint, body, config) => apiClient(endpoint, { ...config, method: 'POST', body });
apiClient.put = (endpoint, body, config) => apiClient(endpoint, { ...config, method: 'PUT', body });
apiClient.delete = (endpoint, config) => apiClient(endpoint, { ...config, method: 'DELETE' });
