'use client';

export function Skeleton({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div
      className={`skeleton ${className || ''}`}
      style={{
        backgroundColor: 'var(--border-color)',
        borderRadius: 'var(--radius-md)',
        animation: 'pulse 1.5s infinite ease-in-out',
        ...style
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ height: '220px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Skeleton style={{ width: '52px', height: '52px', borderRadius: '50%' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton style={{ height: '1.2rem', width: '60%' }} />
          <Skeleton style={{ height: '0.8rem', width: '40%' }} />
        </div>
      </div>
      <Skeleton style={{ height: '2rem', width: '100%' }} />
      <Skeleton style={{ height: '3.5rem', width: '100%', borderRadius: 'var(--radius-md)' }} />
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem' }}>
          <Skeleton style={{ width: '48px', height: '48px' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Skeleton style={{ height: '1.1rem', width: '30%' }} />
            <Skeleton style={{ height: '0.9rem', width: '70%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
