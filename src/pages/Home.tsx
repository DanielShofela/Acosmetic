import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, ShieldCheck, Zap, Droplets } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), limit(4));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setFeaturedProducts(products);
    };
    fetchProducts();
  }, []);

  const benefits = [
    { icon: <Leaf className="text-brand-green" />, title: "100% Naturel", desc: "Ingrédients issus de l'agriculture biologique." },
    { icon: <ShieldCheck className="text-brand-blue" />, title: "Éthique", desc: "Non testé sur les animaux, emballages recyclables." },
    { icon: <Zap className="text-brand-light" />, title: "Efficace", desc: "Formules concentrées pour des résultats visibles." },
    { icon: <Droplets className="text-brand-blue" />, title: "Pur", desc: "Sans parabènes, sans sulfates, sans parfums de synthèse." },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=2000" 
            alt="Nature Background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-off-white via-off-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block bg-brand-light/20 text-brand-green px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
              Pureté & Nature
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight mb-8">
              Révélez votre <span className="text-brand-green">éclat naturel</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Découvrez notre collection de soins botaniques haut de gamme, conçus pour nourrir votre peau avec la force brute de la nature.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="bg-brand-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl glow-green flex items-center gap-2">
                Découvrir la collection <ArrowRight size={20} />
              </Link>
              <Link to="/catalog" className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all border border-slate-200">
                Nos best-sellers
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] hidden lg:block"
        >
          <div className="w-64 h-64 bg-brand-light/30 rounded-full blur-3xl" />
          <Leaf className="text-brand-green/20 absolute top-0 left-0 animate-leaf" size={120} />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 10 + 's',
                opacity: Math.random() * 0.5
              }}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-off-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-500">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-brand-green font-bold uppercase tracking-widest text-sm mb-2 block">Incontournables</span>
              <h2 className="text-4xl font-display font-bold text-slate-900">Nos Best-Sellers</h2>
            </div>
            <Link to="/catalog" className="text-brand-green font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Voir tout le catalogue <ArrowRight size={18} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 italic">Chargement des produits merveilleux...</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-brand-green rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl glow-green">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-light/20 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
              Prêt à transformer votre routine beauté ?
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Rejoignez des milliers de femmes qui ont déjà adopté une approche plus saine et plus naturelle pour leur peau.
            </p>
            <Link to="/catalog" className="bg-white text-brand-green px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-xl inline-block">
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
