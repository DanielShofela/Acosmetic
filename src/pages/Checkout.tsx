import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, CreditCard, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const { profile, updateProfile } = useAuth();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
    if (!profile?.phone || !profile?.address) {
      setShowProfilePopup(true);
    }
  }, [items, profile, navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setShowProfilePopup(false);
      toast.success("Informations mises à jour !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!profile?.phone || !profile?.address) {
      setShowProfilePopup(true);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: profile.uid,
        items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: profile.address,
        phoneNumber: profile.phone,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      setStep(3);
      toast.success("Commande validée !");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Erreur lors de la validation de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-off-white">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? "bg-brand-green text-white shadow-lg glow-green" : "bg-white text-slate-300"
              }`}>
                {step > s ? <CheckCircle2 size={20} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 rounded-full ${step > s ? "bg-brand-green" : "bg-white"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl"
            >
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Truck className="text-brand-green" /> Livraison
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-off-white rounded-3xl border-2 border-brand-green">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-900">Adresse de livraison</h3>
                    <CheckCircle2 className="text-brand-green" size={20} />
                  </div>
                  <p className="text-slate-600 mb-1">{profile?.displayName}</p>
                  <p className="text-slate-600 mb-1">{profile?.address || "Adresse non renseignée"}</p>
                  <p className="text-slate-600">{profile?.phone || "Téléphone non renseigné"}</p>
                  <button 
                    onClick={() => setShowProfilePopup(true)}
                    className="mt-4 text-brand-green text-sm font-bold hover:underline"
                  >
                    Modifier
                  </button>
                </div>
                
                <div className="p-6 bg-off-white rounded-3xl border-2 border-transparent opacity-50 cursor-not-allowed">
                  <h3 className="font-bold text-slate-900 mb-2">Point Relais</h3>
                  <p className="text-slate-500 text-sm italic">Bientôt disponible</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => navigate('/cart')} className="text-slate-500 font-bold flex items-center gap-2">
                  <ArrowLeft size={18} /> Retour au panier
                </button>
                <button 
                  onClick={() => setStep(2)}
                  className="bg-brand-green text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl glow-green"
                >
                  Continuer vers le paiement
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl"
            >
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                <CreditCard className="text-brand-blue" /> Paiement
              </h2>

              <div className="bg-slate-50 p-8 rounded-3xl mb-10 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-600">Total à régler</span>
                  <span className="text-3xl font-bold text-brand-blue">{total.toFixed(2)} €</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-brand-blue">
                    <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-bold text-[10px] text-slate-400">CARD</div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-900">Carte Bancaire</p>
                      <p className="text-xs text-slate-500">Visa, Mastercard, Amex</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-brand-blue" />
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-transparent opacity-60">
                    <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-bold text-[10px] text-slate-400">PAYPAL</div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-900">PayPal</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-sm mb-10 justify-center">
                <ShieldCheck size={18} className="text-brand-green" />
                Vos données de paiement sont cryptées et sécurisées.
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-slate-500 font-bold flex items-center gap-2">
                  <ArrowLeft size={18} /> Retour à la livraison
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-brand-green text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl glow-green disabled:opacity-50"
                >
                  {loading ? "Traitement..." : "Confirmer le paiement"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[3rem] shadow-xl text-center"
            >
              <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={60} className="text-brand-green" />
              </div>
              <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Merci pour votre commande !</h2>
              <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
                Votre commande a été validée avec succès. Vous recevrez un e-mail de confirmation d'ici quelques instants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/profile" className="bg-brand-blue text-white px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg">
                  Suivre ma commande
                </Link>
                <Link to="/catalog" className="bg-off-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all border border-slate-200">
                  Continuer mes achats
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Completion Popup */}
        <AnimatePresence>
          {showProfilePopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => !loading && setShowProfilePopup(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl"
              >
                <div className="flex items-center gap-3 text-brand-blue mb-6">
                  <AlertCircle size={32} />
                  <h3 className="text-2xl font-display font-bold text-slate-900">Finaliser votre profil</h3>
                </div>
                <p className="text-slate-500 mb-8">
                  Veuillez compléter vos informations pour finaliser votre commande. Ces données sont nécessaires pour la livraison.
                </p>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+33 6 00 00 00 00"
                      className="w-full px-6 py-4 bg-off-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Adresse complète</label>
                    <textarea 
                      required
                      placeholder="Rue, Code Postal, Ville..."
                      rows={3}
                      className="w-full px-6 py-4 bg-off-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-green text-white py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl glow-green disabled:opacity-50"
                  >
                    {loading ? "Enregistrement..." : "Enregistrer et continuer"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
