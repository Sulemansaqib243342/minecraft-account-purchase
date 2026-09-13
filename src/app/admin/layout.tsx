'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, Inbox, LogOut, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Check admin session
    fetch('/api/auth/session')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin mb-4" />
        <p className="text-gray-400 text-sm font-display">Verifying Admin Credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 font-display text-lg font-bold text-neon-green text-glow-green"
            >
              <Shield className="w-6 h-6 text-neon-green" />
              <span>Admin Control Panel</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-xs font-semibold text-gray-400">
              User: <span className="text-neon-cyan">{user?.username}</span>
            </span>

            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Main Site
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg border border-warning-red/30 bg-warning-red/10 text-warning-red hover:bg-warning-red/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
