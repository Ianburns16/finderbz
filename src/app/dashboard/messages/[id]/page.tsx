'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send, Phone, Info } from 'lucide-react';
import Link from 'next/link';
import './thread.css';

import { User } from '@supabase/supabase-js';

export default function MessageThreadPage() {
  const params = useParams();
  const id = params.id;
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      // Mock initial messages for demo purposes if no database data yet
      setMessages([
        { id: 1, sender_id: 'other', content: 'Hi there! I saw your post about the leaking pipe.', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, sender_id: user?.id, content: 'Yes, it is under the kitchen sink. Can you come today?', created_at: new Date(Date.now() - 1800000).toISOString() },
        { id: 3, sender_id: 'other', content: 'I can be there around 2 PM. My quote is $60.', created_at: new Date(Date.now() - 600000).toISOString() },
      ]);
    };
    setup();
  }, [supabase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender_id: user?.id,
      content: newMessage,
      created_at: new Date().toISOString()
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading conversation...</div>;

  return (
    <div className="thread-container">
      <header className="thread-header">
        <Link href="/dashboard/messages" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
        <div className="thread-user-info">
          <div className="thread-avatar">JD</div>
          <div>
            <h3>John Doe</h3>
            <p>Active now</p>
          </div>
        </div>
        <div className="thread-actions">
          <button title="Call"><Phone size={20} /></button>
          <button title="Info"><Info size={20} /></button>
        </div>
      </header>

      <div className="messages-area" ref={scrollRef}>
        <div className="escrow-notice">
          <Info size={16} />
          <p>Always keep payments within Pro-Finder to stay protected by our Escrow system.</p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble-wrapper ${msg.sender_id === user?.id ? 'sent' : 'received'}`}>
            <div className="message-bubble">
              {msg.content}
              <span className="message-time">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form className="message-input-area" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" disabled={!newMessage.trim()} className="send-btn">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
