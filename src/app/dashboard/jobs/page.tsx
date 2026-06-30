'use client';

import { useState } from 'react';
import { JobCard } from '@/components/JobCard';
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

  const filteredJobs = activeCategory === 'All' 
    ? MOCK_JOBS 
    : MOCK_JOBS.filter(j => j.category === activeCategory);

  return (
    <div>
      <div className="directory-header">
        <div>
          <h1 className="directory-title">Job Board</h1>
          <p className="directory-subtitle">Find local requests and submit your quotes.</p>
        </div>
        <button className="btn-primary">Post a New Job</button>
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

      <div className="card-grid">
        {filteredJobs.map(job => (
          <JobCard 
            key={job.id}
            title={job.title}
            category={job.category}
            budget={job.budget}
            district={job.district}
            description={job.description}
            postedAt={job.postedAt}
          />
        ))}
      </div>
    </div>
  );
}
