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
  const id = params.id as string; // Virtual thread ID: jobId-otherParticipantId
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [jobId, otherId] = id.includes('-') ? id.split('-') : [null, null];

  useEffect(() => {
    const setup = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (!currentUser || !jobId || !otherId) {
        setLoading(false);
        return;
      }

      // 1. Fetch other user's info
      const { data: otherData } = await supabase
        .from('users')
        .select('*')
        .eq('id', otherId)
        .single();

      if (otherData) {
        setOtherUser({
          ...otherData,
          initials: otherData.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'
        });
      }

      // 2. Fetch actual messages
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('job_id', jobId)
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (msgData) {
        setMessages(msgData);
        // Mark as read
        const unreadMsgs = msgData.filter(m => !m.is_read && m.receiver_id === currentUser.id);
        if (unreadMsgs.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMsgs.map(m => m.id));
        }
      }
      setLoading(false);
    };
    setup();

    // 3. Setup real-time subscription
    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `job_id=eq.${jobId}`
      }, (payload) => {
        const newMsg = payload.new;
        if ((newMsg.sender_id === otherId && newMsg.receiver_id === user?.id) ||
            (newMsg.sender_id === user?.id && newMsg.receiver_id === otherId)) {
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Mark as read if it's for me
          if (newMsg.receiver_id === user?.id) {
            supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id).then();
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, jobId, otherId, user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, overrideContent?: string) => {
    e?.preventDefault();
    const contentToSend = overrideContent || newMessage;
    if (!contentToSend.trim() || !user || !otherId || !jobId) return;

    if (!overrideContent) setNewMessage(''); // Clear input immediately for UX

    const { data, error } = await supabase.from('messages').insert([{
      job_id: jobId,
      sender_id: user.id,
      receiver_id: otherId,
      content: contentToSend,
    }]).select().single();

    if (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } else if (data) {
      setMessages(prev => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading conversation...</div>;

  return (
    <div className="thread-container">
      <header className="thread-header">
        <Link href="/dashboard/messages" className="back-btn">
          <ArrowLeft size={20} />
        </Link>
        <div className="thread-user-info">
          <div className="thread-avatar">{otherUser?.initials || 'U'}</div>
          <div>
            <h3>{otherUser?.full_name || 'Anonymous User'}</h3>
            <p>Active now</p>
          </div>
        </div>
        <div className="thread-actions">
          {user?.user_metadata?.role === 'tradesman' && (
            <button
              className="btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', minHeight: 'auto' }}
              onClick={() => {
                const quote = prompt('Enter your quote amount (e.g. $100):');
                if (quote) {
                  handleSend(undefined, `I would like to offer a quote of ${quote} for this job.`);
                }
              }}
            >
              Send Quote
            </button>
          )}
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
