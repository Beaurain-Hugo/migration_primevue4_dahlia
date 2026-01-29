import axios, { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({});

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

function isTokenValid(token: string) {
  if (!token) return false
  const payload = parseJwt(token)
  if (!payload || !payload.exp) return false

  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}

// --- Axios interceptor ---
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')

  if (isTokenValid(token)) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (token) {
    // Token expiré, on peut rediriger ou nettoyer
    localStorage.removeItem('jwt')
    window.location.href = '/login' // simple redirect
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
