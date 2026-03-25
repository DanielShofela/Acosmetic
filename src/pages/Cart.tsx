import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl">
          <ShoppingBag size={40} className="text-slate-200" />
        </div>
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Votre panier est vide</h2>
        <p className="text-slate-500 mb-10 max-w-md">
          Il semble que vous n'ayez pas encore ajouté de produits à votre panier. Découvrez notre collection naturelle !
        </p>
        <Link to="/catalog" className="bg-brand-green text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl glow-green">
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-12">Mon Panier ({itemCount})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <motion.div 
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-off-white shrink-0">
                    <img src={`https://picsum.photos/seed/${item.productId}/200/200`} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-display font-bold text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-brand-blue font-bold">{item.price.toFixed(2)} €</p>
                  </div>

                  <div className="flex items-center bg-off-white rounded-full p-1 shadow-inner">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-full transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-full transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-lg font-bold text-slate-900">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>

                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 sticky top-32">
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Résumé</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500">
                  <span>Sous-total</span>
                  <span className="font-semibold text-slate-900">{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Livraison</span>
                  <span className="font-semibold text-brand-green uppercase text-xs tracking-widest">Offerte</span>
                </div>
                <div className="h-px bg-slate-100 my-4" />
                <div className="flex justify-between text-xl font-display font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-brand-blue">{total.toFixed(2)} €</span>
                </div>
              </div>

              {user ? (
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-brand-green text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl glow-green flex items-center justify-center gap-2"
                >
                  Commander <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={login}
                  className="w-full bg-brand-blue text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl glow-blue flex items-center justify-center gap-2"
                >
                  <LogIn size={20} /> Se connecter pour commander
                </button>
              )}

              <p className="text-center text-slate-400 text-xs mt-6">
                Paiement sécurisé par SSL. Livraison sous 3 à 5 jours ouvrés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
