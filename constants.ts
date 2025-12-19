import { ClothingCategory, ClothingItem, Season } from "./types";

export const MOCK_CLOSET: ClothingItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',
    name: 'White Cotton T-Shirt',
    category: ClothingCategory.TOPS,
    color: 'White',
    brand: 'Uniqlo',
    season: Season.ALL_SEASON,
    resaleValue: 5,
    lastWorn: '2023-10-25',
    wearCount: 12,
    tags: ['casual', 'basic', 'cotton']
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=500',
    name: 'Vintage Denim Jacket',
    category: ClothingCategory.OUTERWEAR,
    color: 'Blue',
    brand: 'Levi\'s',
    season: Season.SPRING_FALL,
    resaleValue: 45,
    lastWorn: '2023-10-10',
    wearCount: 4,
    tags: ['vintage', 'casual', 'layering']
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1551488852-d81438b6d859?auto=format&fit=crop&q=80&w=500',
    name: 'Green Cargo Pants',
    category: ClothingCategory.BOTTOMS,
    color: 'Green',
    brand: 'Carhartt',
    season: Season.ALL_SEASON,
    resaleValue: 30,
    lastWorn: '2023-09-15',
    wearCount: 2,
    tags: ['streetwear', 'utility', 'comfortable']
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=500',
    name: 'Blue Heels',
    category: ClothingCategory.SHOES,
    color: 'Blue',
    brand: 'Zara',
    season: Season.ALL_SEASON,
    resaleValue: 25,
    lastWorn: '2023-01-20',
    wearCount: 1,
    tags: ['formal', 'party', 'uncomfortable']
  }
];

export const SYSTEM_INSTRUCTION_STYLIST = `You are a world-class personal stylist and sustainability expert for the 'ClosetClear' app. 
Your goal is to help users maximize their wardrobe utility, suggest outfits based on their existing items, and advise on what to resell or donate.
When suggesting outfits, always refer to specific items from the user's closet context provided.
Be concise, encouraging, and fashion-forward.`;
