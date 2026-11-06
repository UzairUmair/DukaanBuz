import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import StorefrontLayout from './components/layout/StorefrontLayout.jsx';
import Landing from './pages/Landing.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import ProductEditor from './pages/ProductEditor.jsx';
import StoreSettings from './pages/StoreSettings.jsx';
import PublicStore from './pages/PublicStore.jsx';
import PublicProduct from './pages/PublicProduct.jsx';
import NotFound from './pages/NotFound.jsx';

function SessionRedirect() { const { authenticated } = useAuth(); return <Navigate to={authenticated ? '/dashboard' : '/login'} replace />; }
function AppRoutes() { return <Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route element={<ProtectedRoute />}><Route path="/onboarding" element={<Onboarding />} /><Route element={<DashboardLayout />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/dashboard/products" element={<Products />} /><Route path="/dashboard/products/new" element={<ProductEditor mode="new" />} /><Route path="/dashboard/products/:id/edit" element={<ProductEditor mode="edit" />} /><Route path="/dashboard/store" element={<StoreSettings />} /></Route></Route><Route element={<StorefrontLayout />}><Route path="/s/:slug" element={<PublicStore />} /><Route path="/s/:slug/p/:id" element={<PublicProduct />} /></Route><Route path="/app" element={<SessionRedirect />} /><Route path="*" element={<NotFound />} /></Routes>; }
export default function App() { return <BrowserRouter><a className="skip-link" href="#main-content">Skip to content</a><AppRoutes /></BrowserRouter>; }
