import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';

const NAV = [
  { to:'/about',     label:'About' },
  { to:'/services',  label:'Services' },
  { to:'/portfolio', label:'Work' },
  { to:'/blog',      label:'Blog' },
  { to:'/careers',   label:'Careers' },
  { to:'/contact',   label:'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 'var(--nav-h)', transition: 'all .3s',
      background: scrolled ? 'rgba(10,15,46,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
    }}>
      <div className="container" style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <motion.div whileHover={{ rotate:10 }}
            style={{ width:38, height:38, borderRadius:10, background:'var(--grad-indigo)',
              display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>
            <Code2 size={20}/>
          </motion.div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.05rem', letterSpacing:'.5px', color:'white' }}>Davion</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'.52rem', letterSpacing:'2px', color:'var(--text3)', textTransform:'uppercase' }}>Technologies</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display:'flex', alignItems:'center', gap:4 }}>
          {NAV.map(n => (
            <Link key={n.to} to={n.to}
              style={{ padding:'7px 14px', borderRadius:8, fontSize:'.85rem', fontWeight:500,
                color: loc.pathname.startsWith(n.to) ? 'white' : 'var(--text2)',
                background: loc.pathname.startsWith(n.to) ? 'var(--surface2)' : 'transparent',
                transition:'all .18s' }}
              onMouseEnter={e=>{ if(!loc.pathname.startsWith(n.to)) e.currentTarget.style.color='white'; }}
              onMouseLeave={e=>{ if(!loc.pathname.startsWith(n.to)) e.currentTarget.style.color='var(--text2)'; }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <Link to="/contact" className="btn btn-primary btn-sm" style={{ display:'inline-flex' }}>
            Get a Quote
          </Link>
          <button onClick={()=>setOpen(!open)} style={{ display:'none', color:'var(--text2)', padding:6 }} className="hamburger">
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            style={{ background:'rgba(10,15,46,0.98)', backdropFilter:'blur(20px)',
              borderTop:'1px solid var(--border)', overflow:'hidden' }}>
            {NAV.map(n => (
              <Link key={n.to} to={n.to}
                style={{ display:'block', padding:'14px 24px', fontSize:'.9rem', color:'var(--text2)',
                  borderBottom:'1px solid var(--border)' }}>
                {n.label}
              </Link>
            ))}
            <div style={{ padding:'16px 24px' }}>
              <Link to="/contact" className="btn btn-primary w-full" style={{ justifyContent:'center' }}>Get a Quote</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media(max-width:900px){nav{display:none!important}.hamburger{display:flex!important}}`}</style>
    </header>
  );
}
