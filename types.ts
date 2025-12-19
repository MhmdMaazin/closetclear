
export enum ClothingCategory {
  TOPS = 'Tops',
  BOTTOMS = 'Bottoms',
  OUTERWEAR = 'Outerwear',
  SHOES = 'Shoes',
  ACCESSORIES = 'Accessories',
  DRESSES = 'Dresses'
}

export enum Season {
  SUMMER = 'Summer',
  WINTER = 'Winter',
  SPRING_FALL = 'Spring/Fall',
  ALL_SEASON = 'All Season'
}

export interface ClothingItem {
  id: string;
  imageUrl: string; // Base64 or URL
  name: string;
  category: ClothingCategory;
  color: string;
  brand: string;
  season: Season;
  resaleValue: number; // Estimated value in USD
  lastWorn: string; // ISO Date
  wearCount: number;
  tags: string[];
}

export interface ClosetStats {
  totalItems: number;
  totalValue: number;
  utilizationRate: number; // Percentage
  mostWornCategory: string;
}

export interface OutfitSuggestion {
  id: string;
  name: string;
  description: string;
  items: string[]; // Array of ClothingItem IDs
  occasion: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface ResaleListing {
  title: string;
  description: string;
  suggestedPrice: number;
  marketplaces: string[];
  hashtags: string[];
}

export interface PackingListResult {
  itemIds: string[];
  weatherForecast: string;
  tripAdvice: string;
}
