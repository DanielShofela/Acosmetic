import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['Tous', 'Visage', 'Corps', 'Cheveux', 'Sérums'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'Tous') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, products]);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Notre Collection</h1>
          <p className="text-slate-500 max-w-2xl">
            Explorez notre gamme complète de soins naturels. Chaque produit est formulé avec soin pour répondre aux besoins spécifiques de votre peau.
          </p>
        </header>

        {/* Filters & Search */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-12 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-grow max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un produit..." 
                className="w-full pl-12 pr-4 py-3 bg-off-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? "bg-brand-green text-white shadow-lg glow-green" 
                      : "bg-off-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-slate-100 hidden md:block" />

            <div className="relative group">
              <select 
                className="appearance-none bg-off-white pl-4 pr-10 py-2 rounded-full text-sm font-semibold text-slate-600 focus:outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Nouveautés</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-off-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-slate-500">Essayez de modifier vos filtres ou votre recherche.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); }}
              className="mt-6 text-brand-green font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
