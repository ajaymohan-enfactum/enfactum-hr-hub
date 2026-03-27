import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { db } from '@/lib/supabase';
import { EncrewEmployee } from '@/types/encrew';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  employee: EncrewEmployee | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<EncrewEmployee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = db.auth.onAuthStateChange(async (_event: any, session: any) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        // Defer to avoid deadlock with auth
        setTimeout(async () => {
          const { data } = await db
            .from('employees')
            .select('*')
            .eq('email', session.user.email!)
            .single();
            .single();
          setEmployee(data as unknown as EncrewEmployee | null);
          setLoading(false);
        }, 0);
      } else {
        setEmployee(null);
        setLoading(false);
      }
    });

    db.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await db.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    await db.auth.signOut();
    setEmployee(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, employee, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
