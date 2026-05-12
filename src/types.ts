export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  image_urls: string[];
  featured: boolean;
  in_stock: boolean;
  created_at: any; // Firestore Timestamp
}

export type Category = 'Tudo' | 'Camisetas' | 'Calças' | 'Vestidos' | 'Accessórios' | 'Outerwear' | 'Calçados';

export const CATEGORIES: Category[] = ['Tudo', 'Camisetas', 'Calças', 'Vestidos', 'Accessórios', 'Outerwear', 'Calçados'];

export const BRAND_NAME = "DEMO LEVI REIS";
export const BRAND_DESC = "Peças essenciais curadas com excelência. Apenas uma demonstração";
export const WHATSAPP_NUMBER = "5561993084616"; // Exemplo de número brasileiro
export const INSTAGRAM_HANDLE = "reinado_perfumes";
