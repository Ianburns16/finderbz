'use client';

import Link from 'next/link';
import './messages.css';

const MOCK_THREADS = [
  { id: '1', name: 'John Doe', avatar: 'JD', jobTitle: 'Fix Leaking Pipe under Sink', preview: 'I can come by this afternoon to fix it.', time: '10:45 AM', unread: true },
  { id: '2', name: 'Sarah Lee', avatar: 'SL', jobTitle: 'Install new AC unit', preview: 'Is the outdoor unit accessible?', time: 'Yesterday', unread: false },
];

export default function MessagesPage() {
  return (
    <div className="messages-list-container">
      <h1 style={{ marginBottom: '2rem' }}>Messages</h1>
      
      <div className="messages-list">
        {MOCK_THREADS.map(thread => (
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
    </div>
  );
}
