'use client';

import { useState, useEffect } from 'react';
import { TradesmanCard } from '@/components/TradesmanCard';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import './directory.css';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'HVAC', 'IT Support', 'Cleaning'];

const MOCK_TRADESMEN = [
  { id: 1, name: 'John Doe', district: 'Belize City', skills: ['Plumbing', 'Pipe Repair'], rating: 4.8, reviews: 124, category: 'Plumbing' },
  { id: 2, name: 'Jane Smith', district: 'Belmopan', skills: ['Electrical Wiring', 'Panel Upgrades'], rating: 4.9, reviews: 89, category: 'Electrical' },
  { id: 3, name: 'Mike Johnson', district: 'San Ignacio', skills: ['AC Repair', 'Refrigeration'], rating: 4.7, reviews: 56, category: 'HVAC' },
  { id: 4, name: 'Sarah Lee', district: 'Placencia', skills: ['Deep Cleaning', 'Move-out Cleaning'], rating: 5.0, reviews: 42, category: 'Cleaning' },
  { id: 5, name: 'David Cho', district: 'Corozal', skills: ['Network Setup', 'PC Repair'], rating: 4.6, reviews: 78, category: 'IT Support' },
  { id: 6, name: 'Carlos Mendez', district: 'Orange Walk', skills: ['Water Heater', 'Plumbing'], rating: 4.5, reviews: 112, category: 'Plumbing' },
];

export default function DirectoryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tradesmen, setTradesmen] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTradesmen = async () => {
      const { data } = await supabase
        .from('profiles')
        .select(`
          id,
          district,
          skills,
          users (
            full_name
          )
        `)
        .eq('verification_status', 'verified'); // Only show verified for now? Or all?

      if (data) {
        const formatted = (data as unknown[]).map((p: any) => ({
          id: p.id,
          name: p.users?.full_name || 'Anonymous Pro',
          district: p.district,
          skills: p.skills || [],
          rating: 4.8, // Fallback for now
          reviews: Math.floor(Math.random() * 50) + 10,
          category: p.skills?.[0] || 'General'
        }));
        setTradesmen(formatted);
      }
      setLoading(false);
    };

    fetchTradesmen();
  }, [supabase]);

  const displayTradesmen = tradesmen.length > 0 ? tradesmen : MOCK_TRADESMEN;

  const filteredTradesmen = displayTradesmen.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory || t.skills.includes(activeCategory);
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="directory-header">
        <div>
          <h1 className="directory-title">Service Directory</h1>
          <p className="directory-subtitle">Browse trusted tradesmen in Belize and request a quote.</p>
        </div>
      </div>

      <div className="search-container" style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
        <input
          type="text"
          placeholder="Search by name or skill (e.g. plumbing)..."
          className="form-input"
          style={{ paddingLeft: '3rem' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading directory...</div>
      ) : (
        <div className="card-grid">
          {filteredTradesmen.map(tradesman => (
            <TradesmanCard
              key={tradesman.id}
            name={tradesman.name}
            district={tradesman.district}
            skills={tradesman.skills}
              rating={tradesman.rating}
              reviews={tradesman.reviews}
            />
          ))}
        </div>
      )}
    </div>
  );
}
