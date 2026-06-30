'use client';

import { useState } from 'react';
import { TradesmanCard } from '@/components/TradesmanCard';
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

  const filteredTradesmen = activeCategory === 'All' 
    ? MOCK_TRADESMEN 
    : MOCK_TRADESMEN.filter(t => t.category === activeCategory);

  return (
    <div>
      <div className="directory-header">
        <div>
          <h1 className="directory-title">Service Directory</h1>
          <p className="directory-subtitle">Browse trusted tradesmen in Belize and request a quote.</p>
        </div>
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
    </div>
  );
}
