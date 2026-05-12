import { Product } from '../types';

const STORAGE_KEY = 'vogue_products';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'T-Shirt Laranja Vibrante',
    price: 89.90,
    description: 'Camiseta premium em algodão pima com cor vibrante e corte moderno. Perfeita para um look casual e cheio de energia.',
    category: 'T-Shirts',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Laranja', 'Branco'],
    image_urls: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'],
    featured: true,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Vestido Azul Elétrico',
    price: 249.00,
    description: 'Vestido midi em seda com cor azul profundo. Um destaque para qualquer evento social.',
    category: 'Dresses',
    sizes: ['PP', 'P', 'M'],
    colors: ['Azul'],
    image_urls: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'],
    featured: true,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Calça Cargo Verde Esmeralda',
    price: 189.90,
    description: 'Calça cargo estruturada com bolsos utilitários e acabamento premium em sarja.',
    category: 'Pants',
    sizes: ['38', '40', '42'],
    colors: ['Verde', 'Preto'],
    image_urls: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'],
    featured: false,
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Tênis Retro ColorBlock',
    price: 459.00,
    description: 'Calçado icônico com design retro e mistura de cores vibrantes. Conforto e estilo em cada passo.',
    category: 'Calçados',
    sizes: ['39', '40', '41', '42'],
    colors: ['Multicolor'],
    image_urls: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'],
    featured: true,
    in_stock: true,
    created_at: new Date().toISOString()
  }
];

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const productService = {
  async getAllProducts() {
    return getStoredProducts();
  },

  async getFeaturedProducts() {
    return getStoredProducts().filter(p => p.featured);
  },

  async getProductById(id: string) {
    return getStoredProducts().find(p => p.id === id) || null;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at'>) {
    const products = getStoredProducts();
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    products.unshift(newProduct);
    saveProducts(products);
    return newProduct.id;
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const products = getStoredProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...product };
      saveProducts(products);
    }
  },

  async deleteProduct(id: string) {
    const products = getStoredProducts().filter(p => p.id !== id);
    saveProducts(products);
  },

  async uploadImage(file: File): Promise<string> {
    // In local storage mode, we simulate image upload by creating a data URL or using a placeholder
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
};

