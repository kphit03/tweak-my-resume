import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

// Helper: read Spring's XSRF-TOKEN cookie for /logout
function getXsrfToken() {
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function AuthProvider({ apiUrl, children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadSession() {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/auth/me`, {
          withCredentials: true,
          signal: controller.signal,
        });
        if (!cancelled) {
          setUser(res.data);    // {id, firstName, lastName, email}
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          // 401 is normal = not logged in
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            setUser(null);
            setError("");
          } else {
            setUser(null);
            setError(err?.message || "Failed to load session");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSession();
    return () => { cancelled = true; controller.abort(); };
  }, [apiUrl]);

  // Redirect to Spring Security's OAuth2 entry
  const login = () => {
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

  // Secure logout with CSRF header
  const logout = async () => {
    const token = getXsrfToken(); // requires a prior GET to set cookie (we did /me)
    try {
      await axios.post(`${apiUrl}/logout`, null, {
        withCredentials: true,
        headers: token ? { "X-XSRF-TOKEN": token } : undefined,
      });
    // } finally {
    //   // Server invalidates session; clear client and send home
    //   setUser(null);
    //   window.location.href = "/";
    // }
        // On success, clear user and reload
    setUser(null);
    window.location.href = "/";
  } catch (err) {
   console.error("Logout failed:", err);
    // Keep user as-is; show a small toast if you want
  }
  };

  const value = { user, loading, error, login, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
