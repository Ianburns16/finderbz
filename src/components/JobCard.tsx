import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import './components.css';

interface JobProps {
  title: string;
  category: string;
  budget: string;
  district: string;
  description: string;
  postedAt: string;
}

export function JobCard({ title, category, budget, district, description, postedAt }: JobProps) {
  return (
    <div className="card job-card">
      <div className="job-card-header">
        <h3 className="job-title">{title}</h3>
        <span className="job-budget">{budget}</span>
      </div>
      
      <div className="job-meta">
        <span className="job-meta-item"><MapPin size={14} /> {district}</span>
        <span className="job-meta-item"><Clock size={14} /> {postedAt}</span>
        <span className="skill-tag" style={{ marginLeft: 'auto' }}>{category}</span>
      </div>

      <p className="job-description">{description}</p>

      <Link href={`/dashboard/jobs/1`} className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)', display: 'block', textAlign: 'center' }}>
        View Details & Quote
      </Link>
    </div>
  );
}
