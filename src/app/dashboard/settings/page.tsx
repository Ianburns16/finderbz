'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Bell, CreditCard, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/lib/contexts/ToastContext';
import { ImageUpload } from '@/components/ImageUpload';
import './settings.css';
import '@/app/auth/auth.css'; // Reusing form classes

export default function SettingsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    district: '',
    bio: '',
    portfolio_urls: [] as string[]
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setFormData({
            full_name: user.user_metadata.full_name || '',
            phone_number: user.user_metadata.phone_number || '',
            district: profileData.district || '',
            bio: profileData.bio || '',
            portfolio_urls: profileData.portfolio_urls || []
          });

          // Fetch transactions
          const { data: transData } = await supabase
            .from('transactions')
            .select('*, jobs(title)')
            .or(`customer_id.eq.${user.id},tradesman_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

          if (transData) {
            setTransactions(transData);
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          phone_number: formData.phone_number
        }
      });
      if (authError) throw authError;

      // 2. Update users table
      await supabase.from('users').update({
        full_name: formData.full_name,
        phone_number: formData.phone_number
      }).eq('id', user.id);

      // 3. Update profiles table
      const { error: profileError } = await supabase.from('profiles').update({
        district: formData.district,
        bio: formData.bio,
        portfolio_urls: formData.portfolio_urls
      }).eq('user_id', user.id);

      if (profileError) throw profileError;

      toast('Profile updated successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading settings...</div>;

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
              <input
                type="text"
                className="form-input"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone Number (WhatsApp)</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>District</label>
            <select
              className="form-input"
              value={formData.district}
              onChange={(e) => setFormData({...formData, district: e.target.value})}
            >
              <option value="Belize">Belize District</option>
              <option value="Cayo">Cayo District</option>
              <option value="Corozal">Corozal District</option>
              <option value="Orange Walk">Orange Walk District</option>
              <option value="Stann Creek">Stann Creek District</option>
              <option value="Toledo">Toledo District</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Bio</label>
            <textarea
              className="form-input"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              style={{ minHeight: '100px' }}
            />
          </div>
          {user?.user_metadata?.role === 'tradesman' && (
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Portfolio Images</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Upload photos of your best work to attract more customers.</p>
              <ImageUpload
                bucket="portfolio"
                maxFiles={10}
                onUploadComplete={(urls) => setFormData(prev => ({ ...prev, portfolio_urls: urls }))}
              />
            </div>
          )}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Email Address</label>
            <input type="email" className="form-input" value={user?.email || ''} disabled style={{ backgroundColor: 'var(--bg-color)', opacity: 0.7 }} />
          </div>
          <button
            className="btn-primary"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
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
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <select className="form-input">
              <option>e-Kyash (Wallet: {user?.user_metadata?.phone_number || '+501 600-0000'})</option>
              <option>DigiWallet (Wallet: {user?.user_metadata?.phone_number || '+501 600-0000'})</option>
              <option>Bank Transfer (Belize Bank)</option>
            </select>
          </div>

          <h3 style={{ marginBottom: '1rem' }}>Transaction History</h3>
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                No transactions recorded yet.
              </p>
            ) : (
              transactions.map(t => (
                <div key={t.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600, margin: 0 }}>{t.jobs?.title || 'Payment'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, margin: 0, color: t.status === 'released' ? 'var(--success)' : 'var(--primary)' }}>
                      {t.tradesman_id === user?.id ? '+' : '-'}${t.amount} BZD
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase' }}>{t.status}</p>
                  </div>
                </div>
              ))
            )}
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
        <button
          onClick={handleSignOut}
          className="btn-secondary"
          style={{ color: 'var(--error)', borderColor: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

    </div>
  );
}
