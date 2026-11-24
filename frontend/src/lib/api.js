// PakProperty API Client (JavaScript)
const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    // In browser, using '/api' leverages Next.js rewrites or Nginx reverse proxy without hardcoded host
    return '/api';
  }
  // During server-side rendering or build
  return process.env.BACKEND_INTERNAL_URL
    ? `${process.env.BACKEND_INTERNAL_URL}/api`
    : 'http://localhost:5001/api';
};

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('pakproperty_token');
  }
  return null;
};

async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${getApiBase()}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API error ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API fetch error on [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  auth: {
    login: (credentials) =>
      fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => fetchAPI('/auth/me'),
    updateProfile: (profileData) =>
      fetchAPI('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      }),
    changePassword: (passwords) =>
      fetchAPI('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwords),
      }),
  },

  properties: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      return fetchAPI(`/properties?${query.toString()}`);
    },
    getFeatured: () => fetchAPI('/properties/featured'),
    getCityStats: () => fetchAPI('/properties/stats/cities'),
    getById: (id) => fetchAPI(`/properties/${id}`),
    create: (propertyData) =>
      fetchAPI('/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
      }),
    update: (id, propertyData) =>
      fetchAPI(`/properties/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(propertyData),
      }),
    delete: (id) =>
      fetchAPI(`/properties/${id}`, {
        method: 'DELETE',
      }),
  },

  user: {
    getMyProperties: (status) =>
      fetchAPI(`/users/properties${status ? `?status=${status}` : ''}`),
    getNotifications: () => fetchAPI('/users/notifications'),
    markNotificationRead: (id) =>
      fetchAPI(`/users/notifications/${id}/read`, { method: 'PATCH' }),
  },

  agents: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.append(k, String(v));
      });
      return fetchAPI(`/agents?${query.toString()}`);
    },
    getById: (id) => fetchAPI(`/agents/${id}`),
    addReview: (agentId, reviewData) =>
      fetchAPI(`/agents/${agentId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      }),
  },

  inquiries: {
    send: (data) =>
      fetchAPI('/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMyInquiries: () => fetchAPI('/inquiries/my-inquiries'),
  },

  favorites: {
    getAll: () => fetchAPI('/favorites'),
    toggle: (propertyId) =>
      fetchAPI(`/favorites/${propertyId}`, {
        method: 'POST',
      }),
  },

  admin: {
    getDashboard: () => fetchAPI('/admin/dashboard'),
    getPending: () => fetchAPI('/admin/properties/pending'),
    approve: (id) =>
      fetchAPI(`/admin/properties/${id}/approve`, { method: 'PATCH' }),
    reject: (id, reason) =>
      fetchAPI(`/admin/properties/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      }),
    toggleFeature: (id) =>
      fetchAPI(`/admin/properties/${id}/feature`, { method: 'PATCH' }),
    getUsers: () => fetchAPI('/admin/users'),
  },

  upload: {
    images: async (files) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const token = getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${getApiBase()}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data;
    },
  },
};
