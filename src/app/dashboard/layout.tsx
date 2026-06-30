'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Briefcase, MessageSquare, Settings } from 'lucide-react';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="mobile-brand">Pro-Finder</div>
          <div className="user-profile-nav">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer View</span>
            <div className="avatar-placeholder">IB</div>
          </div>
        </header>
        
        <div className="dashboard-content">
          {children}
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
