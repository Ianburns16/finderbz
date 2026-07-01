'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Briefcase, MessageSquare, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NotificationBell } from '@/components/NotificationBell';
import ErrorBoundary from '@/components/ErrorBoundary';
import './dashboard.css';

import { User } from '@supabase/supabase-js';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string).split(' ').map((n: string) => n[0]).join('')
    : (user?.email?.[0]?.toUpperCase() as string) || 'U';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const NAV_ITEMS = [
    { name: 'Directory', href: '/dashboard/directory', icon: <Users size={20} /> },
    { name: 'Job Board', href: '/dashboard/jobs', icon: <Briefcase size={20} /> },
    { name: 'Messages', href: '/dashboard/messages', icon: <MessageSquare size={20} /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">Pro-Finder</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`nav-link ${pathname.includes(item.href) ? 'active' : ''}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="nav-link"
            style={{ marginTop: 'auto', background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="mobile-brand">Pro-Finder</div>
          <div className="user-profile-nav">
            <NotificationBell />
            <div className="header-user-info" style={{ marginLeft: '1rem' }}>
              <span className="user-name">{user?.user_metadata?.full_name || 'User'}</span>
              <span className="user-role">{user?.user_metadata?.role === 'tradesman' ? 'Pro' : 'Customer'} View</span>
            </div>
            <div className="avatar-placeholder">{initials}</div>
          </div>
        </header>
        
        <div className="dashboard-content">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`bottom-nav-link ${pathname.includes(item.href) ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
