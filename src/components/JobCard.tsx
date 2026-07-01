import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import './components.css';

interface JobProps {
  id?: string;
  title: string;
  category: string;
  budget: string;
  district: string;
  description: string;
  postedAt: string;
  status?: string;
}

export function JobCard({ id, title, category, budget, district, description, postedAt, status }: JobProps) {
  return (
    <div className="card job-card">
      <div className="job-card-header">
        <h3 className="job-title">{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          <span className="job-budget">{budget}</span>
          {status && (
            <span className={`trust-badge`} style={{
              backgroundColor: status === 'open' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(37, 99, 235, 0.1)',
              color: status === 'open' ? 'var(--success)' : 'var(--primary)',
              borderColor: status === 'open' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(37, 99, 235, 0.2)'
            }}>
              {status.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      
      <div className="job-meta">
        <span className="job-meta-item"><MapPin size={14} /> {district}</span>
        <span className="job-meta-item"><Clock size={14} /> {postedAt}</span>
        <span className="skill-tag" style={{ marginLeft: 'auto' }}>{category}</span>
      </div>

      <p className="job-description">{description}</p>

      <Link href={`/dashboard/jobs/${id || '1'}`} className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)', display: 'block', textAlign: 'center' }}>
        View Details & Status
      </Link>
    </div>
  );
}
