import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { motion } from 'motion/react';
import { 
  User, Package, MapPin, Phone, Mail, 
  Clock, Truck, CheckCircle, PackageCheck, LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function UserDashboard() {
  const { profile, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  useEffect(() => {
    if (!profile) return;
    
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'), 
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen py-12 px-6 bg-off-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={profile.photoURL} alt={profile.displayName} className="w-24 h-24 rounded-[2rem] shadow-xl border-4 border-white" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-green rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">{profile.displayName}</h1>
              <p className="text-slate-500 flex items-center gap-2"><Mail size={14} /> {profile.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-6 py-3 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Déconnexion
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <User size={20} className="text-brand-green" /> Mes Infos
                </h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-brand-green font-bold text-sm hover:underline"
                >
                  {isEditing ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      className="w-full px-6 py-3 bg-off-white rounded-2xl focus:outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Adresse</label>
                    <textarea 
                      className="w-full px-6 py-3 bg-off-white rounded-2xl focus:outline-none resize-none"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full bg-brand-green text-white py-3 rounded-full font-bold shadow-lg glow-green">
                    Enregistrer
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-off-white rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Téléphone</p>
                      <p className="text-slate-900 font-semibold">{profile.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-off-white rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adresse de livraison</p>
                      <p className="text-slate-900 font-semibold">{profile.address || 'Non renseignée'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Package size={24} className="text-brand-blue" /> Mes Commandes
            </h3>

            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white h-40 rounded-[2.5rem] animate-pulse" />
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map(order => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Commande #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-slate-500">Passée le {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest",
                        order.status === 'pending' ? "bg-amber-100 text-amber-600" :
                        order.status === 'processing' ? "bg-blue-100 text-blue-600" :
                        order.status === 'shipped' ? "bg-purple-100 text-purple-600" :
                        "bg-green-100 text-green-600"
                      )}>
                        {order.status === 'pending' && <Clock size={14} />}
                        {order.status === 'processing' && <Package size={14} />}
                        {order.status === 'shipped' && <Truck size={14} />}
                        {order.status === 'delivered' && <CheckCircle size={14} />}
                        {order.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-off-white px-4 py-2 rounded-2xl shrink-0">
                          <span className="text-brand-green font-bold">{item.quantity}x</span>
                          <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin size={14} /> {order.shippingAddress.slice(0, 30)}...
                      </div>
                      <p className="text-xl font-bold text-brand-blue">{order.total.toFixed(2)} €</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                <PackageCheck size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">Vous n'avez pas encore passé de commande.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
