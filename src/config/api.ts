// Backend API Configuration
// Using Render backend URL for production
export const API_URL = (import.meta.env.VITE_REACT_APP_API_URL as string | undefined) || 'https://university-management-k0ri.onrender.com';

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function for file upload headers
export const getFileUploadHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API request helper
export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  optionsOverride: RequestInit = {}
) => {
  const url = `${API_URL}${endpoint}`;

  const isFormData = body instanceof FormData;

  const headers = {
    ...(isFormData ? getFileUploadHeaders() : getAuthHeaders()),
    ...(optionsOverride.headers as Record<string, string> | undefined),
  };

  const options: RequestInit = {
    method,
    credentials: 'include', // Include cookies for CORS requests
    ...optionsOverride,
    headers,
  };

  if (body && method !== 'GET') {
    if (isFormData) {
      options.body = body;
      // Let browser set Content-Type for multipart/form-data
      if (options.headers && 'Content-Type' in options.headers) {
        const newHeaders = { ...options.headers } as Record<string, string>;
        delete newHeaders['Content-Type'];
        options.headers = newHeaders;
      }
    } else {
      options.body = JSON.stringify(body);
      if (!options.headers) options.headers = {};
      (options.headers as Record<string, string>)['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await fetch(url, options);

    let data: any;
    const contentType = response.headers.get('content-type');

    if (response.status === 204 || response.status === 205) {
      data = null;
    } else if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        data && typeof data === 'object' && 'message' in data
          ? (data.message as string)
          : typeof data === 'string'
          ? data
          : `API Error: ${response.status}`;

      console.error('API Error:', {
        status: response.status,
        message: errorMessage,
        endpoint,
      });

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Request failed:', {
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiUrl: API_URL,
    });
    throw error;
  }
};
