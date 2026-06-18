import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home     = lazy(()=>import('./pages/Home'));
const About    = lazy(()=>import('./pages/About'));
const Services = lazy(()=>import('./pages/Services'));
const Portfolio= lazy(()=>import('./pages/Portfolio'));
const Blog     = lazy(()=>import('./pages/Blog'));
const Careers  = lazy(()=>import('./pages/Careers'));
const Contact  = lazy(()=>import('./pages/Contact'));
const AdminLogin    = lazy(()=>import('./pages/admin/Login'));
const AdminDashboard= lazy(()=>import('./pages/admin/Dashboard'));

const Loader = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', gap:12, color:'var(--text2)' }}>
    <div className="spinner" style={{ width:28, height:28, borderWidth:3 }}/>
    <span style={{ fontFamily:'var(--font-mono)', fontSize:'.78rem', letterSpacing:'1px' }}>Loading…</span>
  </div>
);

function WithLayout({ children }) {
  return <>
    <Navbar/>
    {children}
    <Footer/>
  </>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/"          element={<WithLayout><Home/></WithLayout>}/>
        <Route path="/about"     element={<WithLayout><About/></WithLayout>}/>
        <Route path="/services"  element={<WithLayout><Services/></WithLayout>}/>
        <Route path="/portfolio" element={<WithLayout><Portfolio/></WithLayout>}/>
        <Route path="/blog"      element={<WithLayout><Blog/></WithLayout>}/>
        <Route path="/careers"   element={<WithLayout><Careers/></WithLayout>}/>
        <Route path="/contact"   element={<WithLayout><Contact/></WithLayout>}/>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/*"   element={<AdminDashboard/>}/>
        <Route path="*"          element={<Navigate to="/" replace/>}/>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
  );
}
