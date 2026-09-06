export const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export function getToken() {
  return localStorage.getItem("accessToken");
}

export function authHeaders(extra = {}) {
  return { Authorization: `Bearer ${getToken()}`, ...extra };
}

function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  if (window.location.pathname !== "/login") {
    window.location.replace("/login?expired=1");
  }
}

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    forceLogout();
  }
  return res;
}
