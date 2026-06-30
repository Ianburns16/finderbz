'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, UserCheck, Wrench, User } from 'lucide-react';
import './auth.css';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'customer' | 'tradesman'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard/directory');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
              phone_number: phone,
            },
          },
        });
        if (error) throw error;
        router.push('/onboarding');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>Pro-Finder</h1>
          <p>Belize&apos;s trusted tradesman marketplace</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
            Log In
          </button>
          <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label>I am a...</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-option ${role === 'customer' ? 'selected' : ''}`}
                    onClick={() => setRole('customer')}
                  >
                    <User size={24} color={role === 'customer' ? 'var(--primary)' : 'var(--text-muted)'} />
                    <h4>Customer</h4>
                    <p>I need work done</p>
                  </button>
                  <button
                    type="button"
                    className={`role-option ${role === 'tradesman' ? 'selected' : ''}`}
                    onClick={() => setRole('tradesman')}
                  >
                    <Wrench size={24} color={role === 'tradesman' ? 'var(--primary)' : 'var(--text-muted)'} />
                    <h4>Tradesman</h4>
                    <p>I offer services</p>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  className="form-input"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (WhatsApp)</label>
                <input
                  id="phone"
                  className="form-input"
                  type="tel"
                  placeholder="+501 600-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="trust-footer">
          <div className="trust-icons">
            <div className="trust-icon-item">
              <ShieldCheck size={20} />
              <span>Escrow Protected</span>
            </div>
            <div className="trust-icon-item">
              <Lock size={20} />
              <span>256-bit Encrypted</span>
            </div>
            <div className="trust-icon-item">
              <UserCheck size={20} />
              <span>Verified Providers</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Your data is protected and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
