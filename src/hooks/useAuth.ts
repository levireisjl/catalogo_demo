import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local storage for a fake "admin" session
    const checkAuth = () => {
      const mockSession = localStorage.getItem('vogue_admin_session');
      if (mockSession) {
        const sessionData = JSON.parse(mockSession);
        setUser({ email: sessionData.email, uid: 'mock-uid' });
        setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (optional, but good for multi-tab mock login)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = (email: string) => {
    localStorage.setItem('vogue_admin_session', JSON.stringify({ email, timestamp: Date.now() }));
    // Trigger popstate or custom event to notify listeners
    window.dispatchEvent(new Event('storage'));
    window.location.reload(); // Refresh to ensure state is picked up
  };

  const logout = () => {
    localStorage.removeItem('vogue_admin_session');
    window.dispatchEvent(new Event('storage'));
    window.location.reload();
  };

  return { user, loading, isAdmin, login, logout };
}
