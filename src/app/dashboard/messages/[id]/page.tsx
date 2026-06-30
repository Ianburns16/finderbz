'use client';

import { use } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Send, Camera, DollarSign, ShieldCheck } from 'lucide-react';
import '../messages.css';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: 'Hi, I saw your job post about the leaking pipe.' },
    { id: 2, sender: 'me', text: 'Yes, it is still leaking. Can you fix it today?' },
    { id: 3, sender: 'other', text: 'I can come by this afternoon around 2 PM. Based on the photos, it looks like a simple P-trap replacement.' },
  ]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', text: inputValue }]);
    setInputValue('');
  };

  const handleSendQuote = () => {
    if (!quoteAmount) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', text: `[QUOTE_SENT:${quoteAmount}]` }]);
    setShowQuoteModal(false);
    setQuoteAmount('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard/messages" style={{ color: 'var(--text-main)' }}>
            <ArrowLeft size={24} />
          </Link>
          <div className="chat-title-area">
            <h2>John Doe (Plumber)</h2>
            <p>Job: Fix Leaking Pipe under Sink</p>
          </div>
        </div>
        <button 
          className="btn-primary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          onClick={() => setShowQuoteModal(true)}
        >
          <DollarSign size={16} /> Generate Quote
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(msg => {
          if (msg.text.startsWith('[QUOTE_SENT:')) {
            const amount = msg.text.split(':')[1].replace(']', '');
            return (
              <div key={msg.id} className="quote-bubble">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--primary)" />
                  <h3 style={{ color: 'var(--primary)', margin: 0 }}>Official Quote</h3>
                </div>
                <div className="quote-amount">${amount} BZD</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Funds will be held in Escrow until the job is marked complete. 
                  You are protected by our Escrow & Payout guarantee.
                </p>
                <button className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--success)' }}>
                  Pay & Lock Job
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  🔒 256-bit encrypted • Escrow protected
                </p>
              </div>
            );
          }
          return (
            <div key={msg.id} className={`chat-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}>
              {msg.text}
            </div>
          );
        })}
      </div>

      <div className="chat-input-area">
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0.5rem', cursor: 'pointer' }}>
          <Camera size={24} />
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="chat-send-btn" onClick={handleSendMessage}>
          <Send size={20} />
        </button>
      </div>

      {showQuoteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1rem' }}>Generate Quote</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Enter the final price for this job. Once the customer accepts, the funds will be secured in escrow.
            </p>
            <input 
              type="number" 
              className="chat-input" 
              style={{ width: '100%', marginBottom: '1rem', borderRadius: '0.5rem' }} 
              placeholder="Amount in BZD"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowQuoteModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSendQuote}>Send Quote</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
