import React, { createContext, useContext, useMemo, useState } from 'react';
import { jobPlatforms } from '../data/platforms';

export interface AppUser {
  name: string;
  email: string;
  phone?: string;
  regionId?: string;
  educationLevelId?: string;
  specialization?: string;
  experienceYears?: number;
  experienceText?: string;
  cvFileName?: string;
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
  signOut: () => void;
  updateUser: (patch: Partial<AppUser>) => void;
  togglePlatform: (id: string) => void;
  setCv: (cv: CvState) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  // Simple in-memory registry so logging in after registering shows the right person.
  const [registry, setRegistry] = useState<Record<string, AppUser>>({});
  // Platforms are linked from INSIDE the account; none are connected until the user links them.
  const [connectedPlatformIds, setConnected] = useState<string[]>([]);
  const [cv, setCv] = useState<CvState>({ uploaded: false, analyzed: false });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      connectedPlatformIds,
      cv,
      signUp: (data) => {
        setRegistry((r) => ({ ...r, [data.email.toLowerCase()]: data }));
        setUser(data);
        if (data.cvFileName) {
          setCv({ uploaded: true, fileName: data.cvFileName, analyzed: true });
        }
        // The app "pulls" listings from all known platforms automatically.
        setConnected(jobPlatforms.map((p) => p.id));
      },
      signIn: (email) => {
        const known = registry[email.toLowerCase()];
        if (known) {
          setUser(known);
        } else {
          // Unknown email: derive a display name from the address (demo only).
          const local = email.split('@')[0] || 'مستخدم';
          setUser({ name: local, email });
        }
      },
      signOut: () => {
        setUser(null);
        setCv({ uploaded: false, analyzed: false });
        setConnected([]);
      },
      updateUser: (patch) =>
        setUser((u) => (u ? { ...u, ...patch } : u)),
      togglePlatform: (id) =>
        setConnected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])),
      setCv,
    }),
    [user, registry, connectedPlatformIds, cv],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
