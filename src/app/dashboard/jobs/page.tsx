'use client';

import { useState, useEffect } from 'react';
import { JobCard } from '@/components/JobCard';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import '../directory/directory.css'; // Reuse filter styles

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'HVAC', 'IT Support', 'Cleaning'];

const MOCK_JOBS = [
  { id: 1, title: 'Fix Leaking Pipe under Sink', district: 'Belize City', description: 'The pipe under the kitchen sink is leaking significantly. Need someone to fix or replace it today.', budget: '$50 - $100', category: 'Plumbing', postedAt: '2 hours ago' },
  { id: 2, title: 'Install new AC unit', district: 'San Pedro', description: 'Just bought a new 12000 BTU split unit. Need a licensed professional to install it on the second floor.', budget: '$150 - $250', category: 'HVAC', postedAt: '5 hours ago' },
  { id: 3, title: 'Rewire Living Room Outlets', district: 'Belmopan', description: 'Need to add three new outlets in the living room and upgrade the breaker.', budget: '$200 - $400', category: 'Electrical', postedAt: '1 day ago' },
  { id: 4, title: 'Set up Office Network', district: 'Belize City', description: 'Small office needs 5 computers networked with a new router and switch.', budget: '$300 - $500', category: 'IT Support', postedAt: '2 days ago' },
  { id: 5, title: 'Post-Construction Cleanup', district: 'Placencia', description: 'Need a team to deep clean a newly built 2-bedroom house before moving in.', budget: '$400 - $600', category: 'Cleaning', postedAt: '3 days ago' },
];

export default function JobsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my_jobs'
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const displayJobs = jobs.length > 0 ? jobs : MOCK_JOBS;

  const filteredJobs = displayJobs.filter(j => {
    const matchesCategory = activeCategory === 'All' || j.category === activeCategory;

    if (activeTab === 'my_jobs' && user) {
      const isMyJob = j.customer_id === user.id || j.tradesman_id === user.id;
      return matchesCategory && isMyJob;
    }

    return matchesCategory;
  });

  return (
    <div>
      <div className="directory-header">
        <div>
          <h1 className="directory-title">Job Board</h1>
          <p className="directory-subtitle">Find local requests and submit your quotes.</p>
        </div>
        <Link href="/dashboard/jobs/new" className="btn-primary">Post a New Job</Link>
      </div>

      <div className="filters-bar" style={{ marginBottom: '1rem' }}>
        <button
          className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Jobs
        </button>
        <button
          className={`filter-btn ${activeTab === 'my_jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('my_jobs')}
        >
          My Jobs
        </button>
      </div>

      <div className="filters-bar">
        {CATEGORIES.map(category => (
          <button 
            key={category}
            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{ height: '220px', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.6, borderLeft: '4px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ height: '1.2rem', width: '60%', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
                <div style={{ height: '1.2rem', width: '20%', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ height: '0.8rem', width: '30%', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
                <div style={{ height: '0.8rem', width: '30%', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
              </div>
              <div style={{ flex: 1, backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
              <div style={{ height: '3rem', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }}></div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No jobs found</h3>
          <p style={{ color: 'var(--text-muted)' }}>There are currently no active job requests in this category.</p>
          <Link href="/dashboard/jobs/new" className="btn-primary" style={{ marginTop: '1.5rem' }}>Post the First Job</Link>
        </div>
      ) : (
        <div className="card-grid">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              category={job.category}
              budget={job.budget || job.budget_range}
              district={job.district}
              description={job.description}
              postedAt={job.created_at ? new Date(job.created_at as string).toLocaleDateString() : (job as any).postedAt}
              status={job.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
