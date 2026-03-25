import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={handleAddToCart}
            className="p-3 bg-white rounded-full text-brand-green hover:bg-brand-green hover:text-white transition-all shadow-lg"
          >
            <ShoppingCart size={20} />
          </button>
          <div className="p-3 bg-white rounded-full text-slate-600 hover:bg-slate-100 transition-all shadow-lg">
            <Eye size={20} />
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-brand-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-brand-light text-brand-light" />
          ))}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-1 group-hover:text-brand-green transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-brand-blue">{product.price.toFixed(2)} €</span>
          <button 
            onClick={handleAddToCart}
            className="text-brand-green font-semibold text-sm hover:underline"
          >
            Acheter
          </button>
        </div>
      </div>
    </motion.div>
  );
}
