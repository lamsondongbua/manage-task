export const API = 'http://localhost:8080/api'

export function getToken() {
  return localStorage.getItem('accessToken')
}

export function authHeaders(extra = {}) {
  return { 'Authorization': `Bearer ${getToken()}`, ...extra }
}

function forceLogout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  if (window.location.pathname !== '/login') {
    window.location.replace('/login?expired=1')
  }
}

/**
 * Bọc fetch: token hết hạn (401) thì xoá token và đá về trang đăng nhập,
 * thay vì để người dùng kẹt mãi với token chết.
 */
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options)
  if (res.status === 401) {
    forceLogout()
  }
  return res
}
