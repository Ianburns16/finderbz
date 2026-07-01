import Link from 'next/link';
import { ShieldCheck, Users, Briefcase, ArrowRight, Lock, CheckCircle2, Star, Quote, Search } from 'lucide-react';

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
          <Link href="/dashboard/directory" style={{
            padding: '0.85rem 2rem',
            fontSize: '1.05rem',
            border: '1.5px solid var(--primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--primary)',
            backgroundColor: 'transparent',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Search size={18} /> Browse Directory
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
      <section style={{ padding: '6rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How It Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Three simple steps to get your job done safely with Belize&apos;s most trusted professionals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {[
            { step: '1', icon: <Briefcase size={32} />, title: 'Post a Job', desc: 'Describe what you need done, upload photos, and set your budget range. It takes less than 2 minutes.' },
            { step: '2', icon: <Users size={32} />, title: 'Get Quotes', desc: 'Verified tradesmen review your job and send competitive quotes through our secure messaging system.' },
            { step: '3', icon: <ShieldCheck size={32} />, title: 'Pay Securely', desc: 'Accept a quote and pay. Your money is held in escrow and only released when you confirm the job is done.' },
          ].map(item => (
            <div key={item.step} style={{
              position: 'relative',
              padding: '3rem 2rem',
              borderRadius: '1.5rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.3s ease',
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '2rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                {item.step}
              </div>
              <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ backgroundColor: 'var(--surface)', padding: '6rem 1.5rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Trusted by Belizeans</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>See what our community has to say about their experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Maria G.', district: 'Belmopan', text: 'Found an amazing electrician within an hour. The escrow system gave me peace of mind knowing my money was safe.', rating: 5 },
              { name: 'Ricardo M.', district: 'Belize City', text: 'As a tradesman, Pro-Finder has helped me grow my business and get paid on time, every time. No more chasing clients!', rating: 5 },
              { name: 'Elena S.', district: 'San Pedro', text: 'Easy to use and very professional. The verified badges help you know exactly who you are hiring.', rating: 5 },
            ].map((t, i) => (
              <div key={i} style={{ padding: '2rem', borderRadius: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Quote size={32} opacity={0.2} /></div>
                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontStyle: 'italic', color: 'var(--text-main)' }}>&quot;{t.text}&quot;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{t.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{t.district}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', color: '#fbbf24' }}>
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
