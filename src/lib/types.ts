export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'customer' | 'tradesman';
  phone_number?: string;
}

export interface TradesmanProfile {
  id: string;
  user_id: string;
  skills: string[];
  district: string;
  portfolio_urls: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  bio: string;
  users?: UserProfile;
}

export interface Job {
  id: string;
  customer_id: string;
  tradesman_id?: string;
  title: string;
  description: string;
  category: string;
  budget_range?: string;
  district: string;
  photos: string[];
  status: 'open' | 'claimed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  photo_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  content: string;
  created_at: string;
  reviewer?: {
    full_name: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'job_update' | 'message' | 'payment' | 'review';
  link?: string;
  is_read: boolean;
  created_at: string;
}
