'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext();
const STORAGE_KEY = 'albisht-user-session';

const readStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('تعذر قراءة جلسة المستخدم', error);
    return null;
  }
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      setUser,
      clearUser: () => setUser(null),
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser يجب أن يُستخدم داخل UserProvider');
  }
  return context;
};

