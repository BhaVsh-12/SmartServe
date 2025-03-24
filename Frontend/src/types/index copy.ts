export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  providers: ServiceProvider[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  experience: number;
  rating: number;
  description: string;
  image: string;
  reviews: Review[];
  pricing: Pricing[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Pricing {
  id: string;
  serviceName: string;
  price: number;
  unit: string;
}