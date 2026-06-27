import React, { createContext, useContext, useMemo, useState } from 'react';

export interface AppUser {
  name: string;
  email: string;
  regionId?: string;
}

export interface CvState {
  uploaded: boolean;
  fileName?: string;
  analyzed: boolean;
}

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  connectedPlatformIds: string[];
  cv: CvState;
  signUp: (data: AppUser) => void;
  signIn: (email: string) => void;
  signInWithPlatform: (platformId: string) => void;
  signOut: () => void;
  togglePlatform: (id: string) => void;
  setCv: (cv: CvState) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  // Start with two platforms pre-connected so the feed isn't empty on first run.
  const [connectedPlatformIds, setConnected] = useState<string[]>(['linkedin', 'taqat']);
  const [cv, setCv] = useState<CvState>({ uploaded: false, analyzed: false });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      connectedPlatformIds,
      cv,
      signUp: (data) => setUser(data),
      signIn: (email) => setUser({ name: 'أحمد الراشدي', email }),
      signInWithPlatform: (platformId) => {
        setConnected((ids) => (ids.includes(platformId) ? ids : [...ids, platformId]));
        setUser({ name: 'أحمد الراشدي', email: 'ahmad@example.com' });
      },
      signOut: () => {
        setUser(null);
        setCv({ uploaded: false, analyzed: false });
      },
      togglePlatform: (id) =>
        setConnected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])),
      setCv,
    }),
    [user, connectedPlatformIds, cv],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
