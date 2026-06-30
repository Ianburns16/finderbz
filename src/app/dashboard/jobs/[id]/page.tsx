'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import '@/components/components.css';
import './job-details.css';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const job = {
    id,
    title: 'Fix Leaking Pipe under Sink',
    category: 'Plumbing',
    budget: '$50 - $100',
    district: 'Belize City',
    description: 'The PVC pipe right under the kitchen sink trap has a significant crack and is leaking water whenever the tap runs. I need someone to come out and either patch it or replace the P-trap section entirely. I am available all day today.',
    postedAt: '2 hours ago',
    status: 'open',
    customerName: 'Jane D.',
    customerJobs: 12,
    customerRating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=300&h=200',
      'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=300&h=200'
    ]
  };

  return (
    <div className="job-details-container">
      <Link href="/dashboard/jobs" className="back-link">
        <ArrowLeft size={16} /> Back to Job Board
      </Link>

      {/* Escrow Protection Banner */}
      <div className="escrow-banner">
        <ShieldCheck size={32} />
        <div className="escrow-banner-text">
          <h3>Payment Protected by Escrow</h3>
          <p>Funds are secured before work begins and released only after the customer confirms completion.</p>
        </div>
      </div>

      <div className="job-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h1>{job.title}</h1>
          <span className="job-budget" style={{ fontSize: '1.1rem', padding: '0.5rem 1rem' }}>
            {job.budget}
          </span>
        </div>
        
        <div className="meta-tags">
          <span className="meta-tag"><MapPin size={16} /> {job.district}</span>
          <span className="meta-tag"><Clock size={16} /> {job.postedAt}</span>
          <span className="skill-tag">{job.category}</span>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="job-section">
        <h2>Posted By</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="avatar-fallback" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
            {job.customerName.charAt(0)}
          </div>
          <div>
            <p style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {job.customerName}
              <span className="trust-badge">
                <CheckCircle2 size={12} fill="currentColor" color="white" /> Verified Customer
              </span>
            </p>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={14} fill="#fbbf24" color="#fbbf24" /> {job.customerRating} • {job.customerJobs} jobs posted
            </p>
          </div>
        </div>
      </div>

      <div className="job-section">
        <h2>Description</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{job.description}</p>
      </div>

      <div className="job-section">
        <h2>Photos of the Problem</h2>
        <div className="photo-gallery">
          {job.photos.map((url, index) => (
            <img key={index} src={url} alt={`Job photo ${index + 1}`} className="job-photo" />
          ))}
        </div>
      </div>

      <div className="action-bar">
        <Link href={`/dashboard/messages/1?jobId=${job.id}`} className="btn-primary" style={{ flex: 2, textAlign: 'center' }}>
          Claim Job & Message Customer
        </Link>
        <button className="btn-secondary">Save for Later</button>
      </div>
    </div>
  );
}
