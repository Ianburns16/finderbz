'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import './messages.css';

export default function MessagesPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchThreads = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // This is a simplified approach. In a production app, we'd probably have a 'conversations' table.
      // Here we group messages by job_id and participant.
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          jobs (title),
          sender:users!sender_id (full_name),
          receiver:users!receiver_id (full_name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (data) {
        // Group by job_id + the other participant's ID
        const threadMap = new Map();
        data.forEach((msg: any) => {
          const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          const otherName = msg.sender_id === user.id ? msg.receiver?.full_name : msg.sender?.full_name;
          const key = `${msg.job_id}-${otherId}`;

          if (!threadMap.has(key)) {
            threadMap.set(key, {
              id: key, // We'll use this key as a virtual thread ID for now
              otherId,
              name: otherName || 'Anonymous',
              avatar: (otherName || 'A').split(' ').map((n: string) => n[0]).join(''),
              jobTitle: msg.jobs?.title || 'General Inquiry',
              preview: msg.content,
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: !msg.is_read && msg.receiver_id === user.id
            });
          }
        });
        setThreads(Array.from(threadMap.values()));
      }
      setLoading(false);
    };

    fetchThreads();
  }, [supabase]);

  return (
    <div className="messages-list-container">
      <h1 style={{ marginBottom: '2rem' }}>Messages</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading conversations...</div>
      ) : threads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No messages yet. Start a conversation from the directory or job board!</p>
        </div>
      ) : (
        <div className="messages-list">
          {threads.map(thread => (
            <Link key={thread.id} href={`/dashboard/messages/${thread.id}`} className="message-thread-card">
              <div className="thread-avatar">{thread.avatar}</div>
              <div className="thread-details">
                <div className="thread-header">
                  <p className="thread-name">{thread.name}</p>
                  <span className="thread-time">{thread.time}</span>
                </div>
                <p className="thread-preview">{thread.preview}</p>
                <p className="thread-job">Job: {thread.jobTitle}</p>
              </div>
              {thread.unread && <span className="unread-badge">New</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
