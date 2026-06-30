'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import './onboarding.css';
import '@/app/auth/auth.css'; // Reuse form styles

type Role = 'tradesman' | 'customer';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  // Stored in state so the compiler won't narrow the type to a literal
  const [role] = useState<Role>('tradesman'); // In production: read from auth context

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);
  
  const handleComplete = () => {
    // In a real app, save data to Supabase here
    router.push('/dashboard/directory');
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
              <select className="form-input">
                <option value="">Select a District</option>
                <option value="belize">Belize District</option>
                <option value="cayo">Cayo District</option>
                <option value="corozal">Corozal District</option>
                <option value="orange_walk">Orange Walk District</option>
                <option value="stann_creek">Stann Creek District</option>
                <option value="toledo">Toledo District</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Profile Bio</label>
              <textarea 
                className="form-input" 
                placeholder="Tell us a bit about yourself..."
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
              <input type="text" className="form-input" placeholder="e.g. Plumbing, Electrical, HVAC (comma separated)" />
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
              <p>Customers must upload "Before" photos. Tradesmen must upload "After" photos upon completion to trigger the Escrow release. This prevents disputes.</p>
              
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
              <button className="btn-primary" onClick={handleComplete} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} /> Complete Setup
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
