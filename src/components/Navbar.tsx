import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogIn, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { profile, login, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/catalog' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl">A</span>
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-brand-green">A-Cosmetic</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className={cn(
                "font-semibold transition-colors hover:text-brand-green",
                location.pathname === link.path ? "text-brand-green" : "text-slate-600"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/cart" className="relative p-2 text-slate-600 hover:text-brand-green transition-colors">
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-blue text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {profile ? (
            <div className="flex items-center gap-4">
              {profile.role === 'admin' && (
                <Link to="/admin" className="p-2 text-slate-600 hover:text-brand-green transition-colors">
                  <Settings size={24} />
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 group">
                <img src={profile.photoURL} alt={profile.displayName} className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-brand-green transition-all" />
              </Link>
              <button onClick={logout} className="text-slate-600 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 bg-brand-green text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all glow-green"
            >
              <LogIn size={18} />
              Connexion
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-semibold text-slate-600"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-slate-600">
              <ShoppingCart size={24} /> Panier ({itemCount})
            </Link>
            {profile ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-slate-600">
                  <User size={24} /> Mon Profil
                </Link>
                {profile.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-slate-600">
                    <Settings size={24} /> Admin
                  </Link>
                )}
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-lg font-semibold text-red-500">
                  <LogOut size={24} /> Déconnexion
                </button>
              </>
            ) : (
              <button 
                onClick={() => { login(); setIsMenuOpen(false); }}
                className="bg-brand-green text-white px-6 py-3 rounded-full font-semibold text-center"
              >
                Connexion
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
