'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

const DISTRICTS = ['Belize', 'Cayo', 'Corozal', 'Orange Walk', 'Stann Creek', 'Toledo'];
const CATEGORIES = ['Plumbing', 'Electrical', 'HVAC', 'IT Support', 'Cleaning', 'Other'];

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    district: '',
    budget_range: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to post a job');

      const { error } = await supabase.from('jobs').insert([
        {
          ...formData,
          customer_id: user.id,
          status: 'open',
        }
      ]);

      if (error) throw error;

      router.push('/dashboard/jobs');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to post job');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link href="/dashboard/jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <h1 style={{ marginBottom: '0.5rem' }}>Post a New Job</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Describe what you need and get quotes from local pros.</p>

      {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            name="title"
            className="form-input"
            placeholder="e.g. Fix leaking pipe under kitchen sink"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-input"
              required
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="district">District</label>
            <select
              id="district"
              name="district"
              className="form-input"
              required
              value={formData.district}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d} District</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="budget_range">Budget Range</label>
          <input
            id="budget_range"
            name="budget_range"
            className="form-input"
            placeholder="e.g. $50 - $100"
            required
            value={formData.budget_range}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Description</label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            placeholder="Please provide as much detail as possible..."
            required
            style={{ minHeight: '150px' }}
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: '0.5rem' }}
        >
          {loading ? 'Posting...' : <><Send size={18} /> Post Job Now</>}
        </button>
      </form>
    </div>
  );
}
