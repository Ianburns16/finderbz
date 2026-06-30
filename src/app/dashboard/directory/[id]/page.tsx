'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, CheckCircle2, ShieldCheck, Wrench, MessageSquare, Briefcase } from 'lucide-react';
import './profile.css';
import '@/components/components.css';

export default function TradesmanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data for the Fiverr-style profile
  const profile = {
    id,
    name: 'Michael Chen',
    initials: 'MC',
    district: 'Belmopan',
    rating: 4.8,
    reviews: 124,
    memberSince: 'Jan 2024',
    bio: 'Licensed Master Electrician with over 15 years of experience in residential and commercial electrical systems. Specializing in smart home integrations, panel upgrades, and emergency troubleshooting. I take pride in clean work and upfront pricing.',
    skills: ['Electrical', 'Smart Home', 'HVAC Wiring'],
    gigs: [
      { id: 1, title: 'Complete AC Unit Installation & Wiring', price: 'starting at $150 BZD', image: 'https://images.unsplash.com/photo-1527689638836-411945a2b57c?auto=format&fit=crop&q=80&w=400&h=300' },
      { id: 2, title: 'Ceiling Fan Installation (up to 12ft ceiling)', price: '$85 BZD flat rate', image: 'https://images.unsplash.com/photo-1579632863925-5026c2e352f1?auto=format&fit=crop&q=80&w=400&h=300' },
      { id: 3, title: 'Electrical Panel Inspection & Diagnostics', price: '$50 BZD / hour', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=400&h=300' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300&h=300'
    ]
  };

  return (
    <div className="profile-container">
      <Link href="/dashboard/directory" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      <div className="profile-header-card">
        <div className="profile-cover"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-large">{profile.initials}</div>
          <div className="profile-info">
            <h1 className="profile-name">
              {profile.name}
              <span className="trust-badge" style={{ fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} fill="currentColor" color="white" /> Verified Pro
              </span>
            </h1>
            
            <div className="profile-stats">
              <div className="stat-item">
                <MapPin size={18} /> {profile.district}
              </div>
              <div className="stat-item" style={{ color: '#fbbf24' }}>
                <Star size={18} fill="currentColor" /> 
                <span style={{ color: 'var(--text-main)' }}>{profile.rating} ({profile.reviews} reviews)</span>
              </div>
              <div className="stat-item">
                <ShieldCheck size={18} /> Background Checked
              </div>
            </div>

            <p className="profile-bio">{profile.bio}</p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {profile.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>

            <Link href={`/dashboard/messages/new?tradesmanId=${profile.id}`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem' }}>
              <MessageSquare size={18} /> Message for Custom Quote
            </Link>
          </div>
        </div>
      </div>

      <h2 className="section-title"><Briefcase size={24} color="var(--primary)" /> Pre-Priced Services</h2>
      <div className="gigs-grid">
        {profile.gigs.map(gig => (
          <div key={gig.id} className="gig-card">
            <img src={gig.image} alt={gig.title} className="gig-image" />
            <div className="gig-content">
              <h3 className="gig-title">{gig.title}</h3>
              <div className="gig-price">
                <span>{gig.price}</span>
                <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Select</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title"><Wrench size={24} color="var(--primary)" /> Past Work Portfolio</h2>
      <div className="portfolio-grid">
        {profile.portfolio.map((img, i) => (
          <img key={i} src={img} alt={`Portfolio ${i}`} className="portfolio-item" />
        ))}
      </div>

      <div className="reviews-section">
        <h2 className="section-title" style={{ marginBottom: '0.5rem' }}><Star size={24} color="var(--primary)" fill="var(--primary)" /> Reviews ({profile.reviews})</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{profile.rating}</span>
          <div style={{ display: 'flex', color: '#fbbf24' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
        </div>

        <div className="review-card">
          <div className="review-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>S</div>
              <span style={{ fontWeight: 600 }}>Sarah Jenkins</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>2 weeks ago</span>
          </div>
          <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '0.5rem' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Michael was extremely professional. He quickly diagnosed the issue with our AC wiring and fixed it within the hour. Highly recommended!</p>
        </div>
      </div>
    </div>
  );
}
