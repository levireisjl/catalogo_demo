import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProductForm = lazy(() => import('./pages/admin/ProductForm'));

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-brand-bg transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products/new" element={<AdminProductForm />} />
                <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingWhatsApp />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
