'use client';

import { useState } from 'react';
import { DollarSign, X } from 'lucide-react';

interface QuoteModalProps {
  onClose: () => void;
  onConfirm: (amount: string) => void;
}

export function QuoteModal({ onClose, onConfirm }: QuoteModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onConfirm(`$${amount} BZD`);
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
        maxWidth: '400px',
        padding: '2rem',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '0.5rem' }}>Send a Quote</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Enter the total amount for the job.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Quote Amount (BZD)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="number"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Send Quote
          </button>
        </form>
      </div>
    </div>
  );
}
