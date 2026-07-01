'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import './onboarding.css';
import '@/app/auth/auth.css'; // Reuse form styles

type Role = 'tradesman' | 'customer';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>('customer');
  const [district, setDistrict] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setRole(user.user_metadata.role || 'customer');
      }
    };
    checkUser();
  }, [supabase]);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);
  
  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // 1. Update user profile in users table (synced with auth)
      await supabase.from('users').upsert({
        id: user.id,
        role: role,
        full_name: user.user_metadata.full_name,
        phone_number: user.user_metadata.phone_number,
      });

      // 2. Create entry in profiles table
      const profileData: Record<string, unknown> = {
        user_id: user.id,
        district,
        bio,
      };

      if (role === 'tradesman') {
        profileData.skills = skills.split(',').map(s => s.trim());
      }

      const { error } = await supabase.from('profiles').upsert(profileData);
      if (error) throw error;

      router.push('/dashboard/directory');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        
        {step === 1 && (
          <div>
            <div className="onboarding-header">
              <h1>Welcome to Pro-Finder</h1>
              <p style={{ color: 'var(--text-muted)' }}>Let&apos;s get your profile set up so you can start {role === 'tradesman' ? 'earning' : 'hiring'}.</p>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Where are you located?</label>
              <select
                className="form-input"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Select a District</option>
                <option value="Belize">Belize District</option>
                <option value="Cayo">Cayo District</option>
                <option value="Corozal">Corozal District</option>
                <option value="Orange Walk">Orange Walk District</option>
                <option value="Stann Creek">Stann Creek District</option>
                <option value="Toledo">Toledo District</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Profile Bio</label>
              <textarea 
                className="form-input" 
                placeholder="Tell us a bit about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            <button className="btn-primary" onClick={handleNext} style={{ width: '100%' }}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && role === 'tradesman' && (
          <div>
            <div className="onboarding-header">
              <h1>Build Your Portfolio</h1>
              <p style={{ color: 'var(--text-muted)' }}>Customers want to see your past work. Upload a few photos.</p>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Primary Skills</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Plumbing, Electrical, HVAC (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Upload Portfolio Images</label>
              <div className="upload-box">
                <UploadCloud size={32} />
                <p style={{ margin: 0, fontWeight: 500 }}>Click to upload or drag and drop</p>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" onClick={handlePrev} style={{ flex: 1 }}>Back</button>
              <button className="btn-primary" onClick={handleNext} style={{ flex: 1 }}>Continue</button>
            </div>
          </div>
        )}

        {(step === 3 || (step === 2 && role === 'customer')) && (
          <div>
            <div className="onboarding-header">
              <h1>Terms of Service & Escrow</h1>
              <p style={{ color: 'var(--text-muted)' }}>Please review the rules of the marketplace.</p>
            </div>

            <div className="terms-box">
              <h3>1. The Escrow System</h3>
              <p>All payments are securely held in Escrow by Pro-Finder until the job is confirmed complete by the Customer. Tradesmen are guaranteed payout upon completion. Customers are guaranteed a refund if the Tradesman fails to show up or complete the agreed-upon scope of work.</p>
              
              <h3>2. Photographic Evidence</h3>
              <p>Customers must upload &quot;Before&quot; photos. Tradesmen must upload &quot;After&quot; photos upon completion to trigger the Escrow release. This prevents disputes.</p>
              
              <h3>3. Communication</h3>
              <p>All initial communication and quote generation MUST occur within the Pro-Finder chat interface. Taking initial negotiations off-platform voids Escrow protection.</p>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '2rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginTop: '0.25rem' }} required />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                I agree to the Terms of Service and understand how the Escrow system works.
              </span>
            </label>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" onClick={handlePrev} style={{ flex: 1 }}>Back</button>
              <button
                className="btn-primary"
                onClick={handleComplete}
                disabled={loading}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? 'Saving...' : <><CheckCircle2 size={18} /> Complete Setup</>}
              </button>
            </div>
          </div>
        )}

        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : ''}`}></div>
          {role === 'tradesman' && <div className={`step-dot ${step === 2 ? 'active' : ''}`}></div>}
          <div className={`step-dot ${step === (role === 'tradesman' ? 3 : 2) ? 'active' : ''}`}></div>
        </div>
      </div>
    </div>
  );
}
