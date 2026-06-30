import Link from 'next/link';
import { ShieldCheck, Users, Briefcase, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 1.5rem 4rem',
        background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(37, 99, 235, 0.08) 50%, rgba(139, 92, 246, 0.06) 100%)',
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          color: 'var(--success)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}>
          <CheckCircle2 size={16} /> Now live in Belize
        </span>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          maxWidth: '700px',
          marginBottom: '1.5rem',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          Find Trusted <span style={{ background: 'linear-gradient(to right, var(--primary), #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Tradesmen</span> in Belize
        </h1>

        <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '550px', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Post a job or browse verified service providers. Pay securely with our escrow system — your money is protected until the job is done.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/auth" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link href="/auth" style={{
            padding: '0.85rem 2rem',
            fontSize: '1.05rem',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            I&apos;m a Tradesman
          </Link>
        </div>
      </section>

      {/* Trust Strip */}
      <section style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
        padding: '2rem 1.5rem',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        flexWrap: 'wrap',
      }}>
        {[
          { icon: <ShieldCheck size={24} />, label: 'Escrow Protection' },
          { icon: <Lock size={24} />, label: '256-bit Encrypted' },
          { icon: <CheckCircle2 size={24} />, label: 'Verified Providers' },
          { icon: <Users size={24} />, label: '100+ Active Users' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
            <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>Three simple steps to get your job done safely.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {[
            { step: '1', icon: <Briefcase size={32} />, title: 'Post a Job', desc: 'Describe what you need done, upload photos, and set your budget range.' },
            { step: '2', icon: <Users size={32} />, title: 'Get Quotes', desc: 'Verified tradesmen review your job and send you competitive quotes through our secure chat.' },
            { step: '3', icon: <ShieldCheck size={32} />, title: 'Pay Securely', desc: 'Accept a quote and pay. Your money is held in escrow until you confirm the job is complete.' },
          ].map(item => (
            <div key={item.step} style={{ textAlign: 'center', padding: '2rem 1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                {item.icon}
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '4rem 1.5rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(139, 92, 246, 0.05))',
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to find a Pro?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Join hundreds of Belizeans already using Pro-Finder to get jobs done right.
        </p>
        <Link href="/auth" className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem' }}>
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        © 2026 Pro-Finder Belize. All rights reserved.
      </footer>
    </main>
  );
}
