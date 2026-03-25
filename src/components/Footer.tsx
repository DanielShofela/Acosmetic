import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-brand-green">A-Cosmetic</span>
          </Link>
          <p className="text-slate-500 leading-relaxed mb-6">
            La pureté de la nature au service de votre beauté. Des cosmétiques naturels, éthiques et performants.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-brand-green transition-colors"><Instagram size={20} /></a>
            <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-brand-green transition-colors"><Facebook size={20} /></a>
            <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-brand-green transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-slate-900 mb-6">Navigation</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-slate-500 hover:text-brand-green transition-colors">Accueil</Link></li>
            <li><Link to="/catalog" className="text-slate-500 hover:text-brand-green transition-colors">Produits</Link></li>
            <li><Link to="/cart" className="text-slate-500 hover:text-brand-green transition-colors">Panier</Link></li>
            <li><Link to="/profile" className="text-slate-500 hover:text-brand-green transition-colors">Mon Compte</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-slate-900 mb-6">Aide & Infos</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">Livraison & Retours</a></li>
            <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">Conditions Générales</a></li>
            <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">Politique de Confidentialité</a></li>
            <li><a href="#" className="text-slate-500 hover:text-brand-green transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-slate-900 mb-6">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-500"><MapPin size={18} className="text-brand-green" /> 123 Rue de la Nature, Paris</li>
            <li className="flex items-center gap-3 text-slate-500"><Phone size={18} className="text-brand-green" /> +33 1 23 45 67 89</li>
            <li className="flex items-center gap-3 text-slate-500"><Mail size={18} className="text-brand-green" /> contact@a-cosmetic.fr</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-50 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} A-Cosmetic. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
