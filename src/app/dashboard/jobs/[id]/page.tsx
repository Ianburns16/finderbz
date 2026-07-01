'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Clock, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import '@/components/components.css';
import './job-details.css';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
    const fetchJob = async () => {
      const { data } = await supabase
        .from('jobs')
        .select(`
          *,
          users!customer_id (
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (data) {
        setJob({
          ...data,
          customerName: data.users?.full_name || 'Anonymous User',
          customerJobs: 12,
          customerRating: 4.9,
          postedAt: new Date(data.created_at).toLocaleDateString()
        });
      }
      setLoading(false);
    };

    fetchJob();
  }, [id, supabase]);

  const handleClaimJob = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          status: 'claimed',
          tradesman_id: user.id
        })
        .eq('id', id);

      if (error) throw error;

      // Send automated message
      await supabase.from('messages').insert([{
        job_id: id,
        sender_id: user.id,
        receiver_id: job.customer_id,
        content: "I've claimed this job and would like to discuss the details with you!"
      }]);

  setJob((prev: any) => ({ ...prev, status: 'claimed', tradesman_id: user.id }));
    } catch (err: any) {
      alert(err.message || 'Failed to claim job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setJob((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading job details...</div>;
  if (!job) return <div style={{ padding: '3rem', textAlign: 'center' }}>Job not found</div>;

  const isCustomer = user?.id === job.customer_id;
  const isTradesman = user?.user_metadata?.role === 'tradesman';
  const isAssignedTradesman = user?.id === job.tradesman_id;

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
          {job.photos && job.photos.length > 0 ? (
            job.photos.map((url: string, index: number) => (
              <div key={index} style={{ position: 'relative', height: '200px', width: '300px' }}>
                <Image src={url} alt={`Job photo ${index + 1}`} fill style={{ objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No photos uploaded for this job.</p>
          )}
        </div>
      </div>

      <div className="action-bar">
        {job.status === 'open' && isTradesman && (
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            onClick={handleClaimJob}
            disabled={actionLoading}
          >
            {actionLoading ? 'Claiming...' : 'Claim Job & Message Customer'}
          </button>
        )}

        {job.status === 'claimed' && isAssignedTradesman && (
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            onClick={() => handleUpdateStatus('in_progress')}
            disabled={actionLoading}
          >
            {actionLoading ? 'Updating...' : 'Start Job'}
          </button>
        )}

        {job.status === 'in_progress' && isAssignedTradesman && (
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            onClick={() => handleUpdateStatus('completed')}
            disabled={actionLoading}
          >
            {actionLoading ? 'Updating...' : 'Mark as Completed'}
          </button>
        )}

        {job.status === 'completed' && isCustomer && (
          <button
            className="btn-primary"
            style={{ flex: 2, backgroundColor: 'var(--success)' }}
            disabled
          >
            Job Completed
          </button>
        )}

        {job.status !== 'open' && (
          <Link
            href={`/dashboard/messages/${job.id}-${isCustomer ? job.tradesman_id : job.customer_id}`}
            className="btn-secondary"
            style={{ flex: 1, textAlign: 'center' }}
          >
            Message {isCustomer ? 'Pro' : 'Customer'}
          </Link>
        )}
      </div>
    </div>
  );
}
