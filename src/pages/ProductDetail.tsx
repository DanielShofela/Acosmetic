import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, Leaf, Zap } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          
          // Fetch related
          const q = query(collection(db, 'products'), where('category', '==', productData.category), limit(4));
          const relatedSnap = await getDocs(q);
          setRelatedProducts(relatedSnap.docs.filter(d => d.id !== id).map(d => ({ id: d.id, ...d.data() } as Product)));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} ajouté au panier`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Produit non trouvé</h2>
      <Link to="/catalog" className="text-brand-green font-bold hover:underline">Retour au catalogue</Link>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-brand-green transition-colors mb-12 font-semibold">
          <ArrowLeft size={20} /> Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-8 left-8">
              <span className="bg-white/90 backdrop-blur-md text-brand-green px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg">
                {product.category}
              </span>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-brand-light text-brand-light" />
                ))}
              </div>
              <span className="text-slate-400 text-sm">(48 avis clients)</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-brand-blue mb-8">{product.price.toFixed(2)} €</p>

            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-off-white rounded-full p-1 shadow-inner">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-full transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-full transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-brand-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl glow-green flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={22} /> Ajouter au panier
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={24} className="text-brand-green" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Qualité Premium</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={24} className="text-brand-blue" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Livraison Offerte</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={24} className="text-brand-light" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Retour 30 Jours</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs / Details */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
              <h3 className="text-2xl font-display font-bold text-brand-green mb-6 flex items-center gap-3">
                <Leaf size={24} className="text-brand-light" /> Ingrédients Clés
              </h3>
              <ul className="space-y-4">
                {product.ingredients?.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <div className="w-2 h-2 bg-brand-light rounded-full mt-2 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
              <h3 className="text-2xl font-display font-bold text-brand-blue mb-6 flex items-center gap-3">
                <Zap size={24} className="text-brand-light" /> Bienfaits
              </h3>
              <ul className="space-y-4">
                {product.benefits?.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-10">Vous aimerez aussi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
