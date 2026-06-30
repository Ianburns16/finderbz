import Link from 'next/link';
import { MapPin, Star, CheckCircle2 } from 'lucide-react';
import './components.css';

interface TradesmanProps {
  name: string;
  district: string;
  skills: string[];
  rating: number;
  reviews: number;
}

export function TradesmanCard({ name, district, skills, rating, reviews }: TradesmanProps) {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div className="card tradesman-card">
      <Link href="/dashboard/directory/1" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card-header">
          <div className="avatar-fallback">{initials}</div>
          <div className="card-info">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {name}
              <span className="trust-badge" title="Identity & Background Verified">
                <CheckCircle2 size={12} fill="currentColor" color="white" /> Verified
              </span>
            </h3>
            <p>
              <MapPin size={14} /> {district}
            </p>
            <p style={{ color: '#fbbf24', marginTop: '0.25rem', fontWeight: 600 }}>
              <Star size={16} fill="currentColor" /> {rating} ({reviews} reviews)
            </p>
          </div>
        </div>
      </Link>
      
      <div className="skills-list">
        {skills.map(skill => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>

      <Link href="/dashboard/directory/1" className="btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
        View Profile & Gigs
      </Link>
    </div>
  );
}
