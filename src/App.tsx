import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow pt-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<UserDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster position="top-center" richColors />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
