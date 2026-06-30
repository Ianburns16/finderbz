'use client';

import { useState } from 'react';
import { User, Shield, Bell, CreditCard, LogOut } from 'lucide-react';
import './settings.css';
import '@/app/auth/auth.css'; // Reusing form classes

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your account, preferences, and escrow payouts.</p>
      </div>

      <div className="settings-tabs">
        <button className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User size={18} /> Profile
        </button>
        <button className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
          <Shield size={18} /> Security
        </button>
        <button className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
          <Bell size={18} /> Notifications
        </button>
        <button className={`settings-tab ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
          <CreditCard size={18} /> Escrow & Payouts
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="settings-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-input" defaultValue="John Doe" />
            </div>
            <div className="form-group">
              <label>Phone Number (WhatsApp)</label>
              <input type="tel" className="form-input" defaultValue="+501 600-0000" />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Email Address</label>
            <input type="email" className="form-input" defaultValue="john@example.com" disabled style={{ backgroundColor: 'var(--bg-color)', opacity: 0.7 }} />
          </div>
          <button className="btn-primary">Save Changes</button>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="settings-section">
          <h2>Notification Preferences</h2>
          <div className="toggle-row">
            <div className="toggle-info">
              <h4>WhatsApp Alerts</h4>
              <p>Receive job requests and quote approvals instantly via WhatsApp.</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Email Notifications</h4>
              <p>Daily digests of new jobs in your district.</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-row">
            <div className="toggle-info">
              <h4>Marketing Updates</h4>
              <p>News, tips, and feature updates from Pro-Finder.</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="settings-section">
          <h2>Escrow Balance & Payouts</h2>
          
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--success)', borderRadius: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Available for Payout</p>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--success)' }}>$450.00 <span style={{ fontSize: '1rem' }}>BZD</span></h3>
            </div>
            <button className="btn-primary" style={{ backgroundColor: 'var(--success)' }}>Withdraw Funds</button>
          </div>

          <h3 style={{ marginBottom: '1rem' }}>Payout Method</h3>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <select className="form-input">
              <option>e-Kyash (Wallet: +501 600-0000)</option>
              <option>DigiWallet (Wallet: +501 600-0000)</option>
              <option>Bank Transfer (Belize Bank)</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="settings-section">
          <h2>Change Password</h2>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Current Password</label>
            <input type="password" className="form-input" />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>New Password</label>
            <input type="password" className="form-input" />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Confirm New Password</label>
            <input type="password" className="form-input" />
          </div>
          <button className="btn-primary">Update Password</button>
        </div>
      )}

      <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button className="btn-secondary" style={{ color: 'var(--error)', borderColor: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

    </div>
  );
}
