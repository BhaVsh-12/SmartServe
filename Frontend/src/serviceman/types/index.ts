export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  serviceCategory: string;
  subCategory: string;
  location: string;
  pricing: number;
  membershipType: 'Premium' | 'Average' | 'Low';
}

export interface Request {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  service: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  date: string;
  amount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MembershipPlan {
  type: 'Premium' | 'Average' | 'Low';
  price: number;
  features: string[];
  recommended: boolean;
}