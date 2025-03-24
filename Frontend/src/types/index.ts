export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategory {
  id: string;
  name: string;
  providers: ServiceProvider[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  experience: string;
  rating: number;
  description: string;
  pricing: string;
  reviews: Review[];
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

export interface ServiceHistory {
  id: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  amount: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

export interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'Credit Card' | 'PayPal' | 'Bank Account';
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}