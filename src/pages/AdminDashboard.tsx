import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, getDocs, updateDoc, doc, addDoc, deleteDoc, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Order, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, 
  Plus, Search, Edit2, Trash2, CheckCircle, 
  Clock, Truck, PackageCheck, Database, X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'users'>('stats');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodSnap, orderSnap, userSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'users'))
        ]);

        setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as any as Product)));
        setOrders(orderSnap.docs.map(d => ({ id: d.id, ...d.data() } as any as Order)));
        setUsers(userSnap.docs.map(d => ({ id: d.id, ...d.data() } as any as UserProfile)));
      } catch (error) {
        console.error("Admin fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Statut de la commande mis à jour : ${newStatus}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const seedProducts = async () => {
    const initialProducts = [
      {
        name: "Sérum Éclat Botanique",
        description: "Un sérum ultra-concentré en vitamine C naturelle et extraits de rose sauvage pour un teint lumineux et une peau repulpée.",
        price: 45.00,
        category: "Sérums",
        ingredients: ["Huile de Rose Musquée", "Vitamine C stable", "Acide Hyaluronique végétal"],
        benefits: ["Illumine le teint", "Hydratation profonde", "Anti-âge naturel"],
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
        stock: 50
      },
      {
        name: "Crème Hydratante Nuage",
        description: "Une texture légère comme un nuage qui fond sur la peau pour une hydratation intense sans fini gras.",
        price: 38.00,
        category: "Visage",
        ingredients: ["Aloe Vera Bio", "Beurre de Karité", "Extrait de Concombre"],
        benefits: ["Apaisant", "Hydratation 24h", "Texture non grasse"],
        image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800",
        stock: 30
      },
      {
        name: "Huile Corps Soyeuse",
        description: "Une huile sèche précieuse qui nourrit intensément et laisse un voile satiné sur la peau.",
        price: 32.00,
        category: "Corps",
        ingredients: ["Huile d'Argan", "Huile d'Amande Douce", "Vitamine E"],
        benefits: ["Nutrition intense", "Peau satinée", "Parfum délicat"],
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800",
        stock: 40
      },
      {
        name: "Masque Argile & Menthe",
        description: "Purifie en profondeur et resserre les pores pour une peau nette et fraîche.",
        price: 26.00,
        category: "Visage",
        ingredients: ["Argile Verte", "Huile Essentielle de Menthe Poivrée", "Zinc"],
        benefits: ["Détoxifiant", "Resserre les pores", "Effet fraîcheur"],
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
        stock: 25
      }
    ];

    setLoading(true);
    try {
      for (const p of initialProducts) {
        await addDoc(collection(db, 'products'), p);
      }
      toast.success("Produits ajoutés avec succès !");
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de l'ajout des produits");
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Accès Restreint</h2>
          <p className="text-slate-500 mb-8">Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 p-6 flex flex-col gap-2">
        <div className="mb-8 px-2">
          <h2 className="text-xl font-display font-bold text-brand-green">Admin Panel</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">A-Cosmetic</p>
        </div>

        {[
          { id: 'stats', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
          { id: 'products', icon: <Package size={20} />, label: 'Produits' },
          { id: 'orders', icon: <ShoppingBag size={20} />, label: 'Commandes' },
          { id: 'users', icon: <Users size={20} />, label: 'Utilisateurs' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all",
              activeTab === tab.id 
                ? "bg-brand-green text-white shadow-lg glow-green" 
                : "text-slate-500 hover:bg-slate-50"
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}

        <div className="mt-auto pt-6 border-t border-slate-50">
          <button 
            onClick={seedProducts}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-brand-blue hover:bg-brand-blue/5 transition-all"
          >
            <Database size={20} /> Seed Data
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Ventes Totales', value: `${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)} €`, icon: <ShoppingBag className="text-brand-green" />, color: 'bg-brand-green/10' },
                  { label: 'Commandes', value: orders.length, icon: <Package className="text-brand-blue" />, color: 'bg-brand-blue/10' },
                  { label: 'Clients', value: users.length, icon: <Users className="text-brand-light" />, color: 'bg-brand-light/10' },
                  { label: 'Produits', value: products.length, icon: <PackageCheck className="text-brand-green" />, color: 'bg-brand-green/10' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.color)}>
                      {stat.icon}
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-display font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Commandes Récentes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-50">
                        <th className="pb-4">ID Commande</th>
                        <th className="pb-4">Client</th>
                        <th className="pb-4">Total</th>
                        <th className="pb-4">Statut</th>
                        <th className="pb-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-mono text-sm text-slate-500">#{order.id.slice(0, 8)}</td>
                          <td className="py-4 font-semibold text-slate-900">{users.find(u => u.uid === order.userId)?.displayName || 'Client'}</td>
                          <td className="py-4 font-bold text-brand-blue">{order.total.toFixed(2)} €</td>
                          <td className="py-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              order.status === 'pending' ? "bg-amber-100 text-amber-600" :
                              order.status === 'processing' ? "bg-blue-100 text-blue-600" :
                              order.status === 'shipped' ? "bg-purple-100 text-purple-600" :
                              "bg-green-100 text-green-600"
                            )}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-slate-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-display font-bold text-slate-900">Gestion des Produits</h3>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-brand-green text-white px-6 py-3 rounded-full font-bold shadow-lg glow-green flex items-center gap-2"
                >
                  <Plus size={20} /> Nouveau Produit
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex items-center gap-6">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-900">{product.name}</h4>
                      <p className="text-sm text-slate-400">{product.category} • {product.price.toFixed(2)} €</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-brand-blue transition-colors"><Edit2 size={20} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-8">Suivi des Commandes</h3>
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Commande #{order.id.slice(0, 8)}</p>
                        <h4 className="text-xl font-bold text-slate-900">{users.find(u => u.uid === order.userId)?.displayName}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {[
                          { id: 'pending', icon: <Clock size={16} />, label: 'Attente' },
                          { id: 'processing', icon: <Package size={16} />, label: 'Préparation' },
                          { id: 'shipped', icon: <Truck size={16} />, label: 'Expédiée' },
                          { id: 'delivered', icon: <CheckCircle size={16} />, label: 'Livrée' },
                        ].map(status => (
                          <button
                            key={status.id}
                            onClick={() => handleUpdateOrderStatus(order.id, status.id as any)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                              order.status === status.id 
                                ? "bg-brand-green text-white shadow-md" 
                                : "bg-off-white text-slate-400 hover:bg-slate-100"
                            )}
                          >
                            {status.icon} {status.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Articles</p>
                        <ul className="space-y-2">
                          {order.items.map((item, i) => (
                            <li key={i} className="flex justify-between text-sm">
                              <span className="text-slate-600">{item.quantity}x {item.name}</span>
                              <span className="font-bold text-slate-900">{(item.price * item.quantity).toFixed(2)} €</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between font-bold text-brand-blue">
                          <span>Total</span>
                          <span>{order.total.toFixed(2)} €</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Livraison</p>
                        <p className="text-sm text-slate-600 mb-1">{order.shippingAddress}</p>
                        <p className="text-sm text-slate-600">{order.phoneNumber}</p>
                        <p className="text-xs text-slate-400 mt-4 italic">Passée le {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-8">Utilisateurs</h3>
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-50">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                      <th className="p-6">Utilisateur</th>
                      <th className="p-6">Email</th>
                      <th className="p-6">Rôle</th>
                      <th className="p-6">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(user => (
                      <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />
                            <span className="font-bold text-slate-900">{user.displayName}</span>
                          </div>
                        </td>
                        <td className="p-6 text-slate-600">{user.email}</td>
                        <td className="p-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            user.role === 'admin' ? "bg-brand-blue/10 text-brand-blue" : "bg-slate-100 text-slate-500"
                          )}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-6 text-sm text-slate-500">
                          {user.phone || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
