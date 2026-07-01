'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ReviewModalProps {
  job: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({ job, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('reviews').insert([{
        job_id: job.id,
        reviewer_id: user.id,
        reviewee_id: job.tradesman_id,
        rating,
        content
      }]);

      if (error) throw error;

      // Also send a notification to the tradesman
      await supabase.from('notifications').insert([{
        user_id: job.tradesman_id,
        title: 'New Review Received!',
        content: `A customer left you a ${rating}-star review for the job: ${job.title}`,
        type: 'review',
        link: `/dashboard/directory/${job.tradesman_id}`
      }]);

      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '500px',
        padding: '2rem',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '0.5rem' }}>Leave a Review</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>How was your experience with the pro on this job?</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: (hover || rating) >= star ? '#fbbf24' : 'var(--border-color)' }}
              >
                <Star size={40} fill={(hover || rating) >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Share your feedback</label>
            <textarea
              className="form-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did they do well? Anything they could improve?"
              style={{ minHeight: '120px' }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
