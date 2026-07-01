'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Star, CheckCircle2, ShieldCheck, Wrench, MessageSquare, Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TradesmanProfile, Review } from '@/lib/types';
import './profile.css';
import '@/components/components.css';

export default function TradesmanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [profile, setProfile] = useState<TradesmanProfile | any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (data) {
        // Fetch actual reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, reviewer:users!reviewer_id(full_name)')
          .eq('reviewee_id', data.user_id)
          .order('created_at', { ascending: false });

        const avgRating = reviewsData && reviewsData.length > 0
          ? (reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length).toFixed(1)
          : 'New';

        setReviews(reviewsData || []);

        setProfile({
          ...data,
          name: data.users?.full_name || 'Anonymous Pro',
          initials: data.users?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'P',
          rating: avgRating,
          reviewCount: reviewsData?.length || 0,
          memberSince: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          gigs: [
            { id: 1, title: 'Custom Service Request', price: 'Contact for Quote', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=400&h=300' }
          ],
          portfolio: data.portfolio_urls || []
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [id, supabase]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading profile...</div>;
  if (!profile) return <div style={{ padding: '3rem', textAlign: 'center' }}>Profile not found</div>;

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
                <span style={{ color: 'var(--text-main)' }}>{profile.rating} ({profile.reviewCount} reviews)</span>
              </div>
              <div className="stat-item">
                <ShieldCheck size={18} /> Background Checked
              </div>
            </div>

            <p className="profile-bio">{profile.bio}</p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {profile.skills.map((skill: string) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href={`/dashboard/messages/new?tradesmanId=${profile.id}`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem' }}>
                <MessageSquare size={18} /> Message for Custom Quote
              </Link>
              {profile.users?.phone_number && (
                <a
                  href={`https://wa.me/${profile.users.phone_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', color: '#25D366', borderColor: '#25D366' }}
                >
                  <MessageSquare size={18} /> Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title"><Briefcase size={24} color="var(--primary)" /> Pre-Priced Services</h2>
      <div className="gigs-grid">
        {profile.gigs.map((gig: any) => (
          <div key={gig.id} className="gig-card">
            <div style={{ position: 'relative', height: '200px', width: '100%' }}>
              <Image src={gig.image} alt={gig.title} fill style={{ objectFit: 'cover', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
            </div>
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
        {profile.portfolio.map((img: string, i: number) => (
          <div key={i} style={{ position: 'relative', height: '250px', width: '100%' }}>
            <Image src={img} alt={`Portfolio ${i}`} fill style={{ objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
          </div>
        ))}
      </div>

      <div className="reviews-section">
        <h2 className="section-title" style={{ marginBottom: '0.5rem' }}><Star size={24} color="var(--primary)" fill="var(--primary)" /> Reviews ({profile.reviewCount})</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{profile.rating}</span>
          <div style={{ display: 'flex', color: '#fbbf24' }}>
            {[...Array(5)].map((_, i: number) => (
              <Star key={i} size={20} fill={i < Math.round(Number(profile.rating)) ? "currentColor" : "none"} />
            ))}
          </div>
        </div>

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No reviews yet for this professional.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-card" style={{ marginBottom: '1rem' }}>
              <div className="review-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {r.reviewer?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span style={{ fontWeight: 600 }}>{r.reviewer?.full_name || 'Anonymous'}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '0.5rem' }}>
                {[...Array(5)].map((_, i: number) => (
                  <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>{r.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
