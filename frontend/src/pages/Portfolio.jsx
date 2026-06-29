import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { publicApi } from '../services/api';

const fadeUp = { hidden:{opacity:0,y:32}, visible:{opacity:1,y:0,transition:{duration:.6,ease:[0.25,0.1,0.25,1]}} };
const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:.1 } } };

const CATS = ['All','E-commerce','Education','Fintech'];

// ── Your real projects — used as fallback if the API returns nothing ───────
const MY_PROJECTS = [
  {
    id: 1,
    slug: 'danis-choice',
    title: 'Danis Choice',
    client: 'Danis Choice',
    category: 'E-commerce',
    summary: 'A full e-commerce platform for a ladies fashion brand — clothing, shoes, and bags. Built with a custom storefront, cart, checkout, and admin dashboard for managing inventory and orders.',
    technologies: ['React', 'Flask', 'PostgreSQL', 'Framer Motion'],
    cover_image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    is_featured: true,
  },
  {
    id: 2,
    slug: 'nyabera-secondary-school',
    title: 'Nyabera Secondary School',
    client: 'Nyabera Secondary School',
    category: 'Education',
    summary: 'A school management and information system for student records, communication, and academic administration — built to digitize daily operations for the institution.',
    technologies: ['React', 'Flask', 'PostgreSQL', 'JWT Auth'],
    cover_image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    is_featured: true,
  },
  {
    id: 3,
    slug: 'mkopo-finance',
    title: 'Mkopo Finance',
    client: 'Mkopo Finance',
    category: 'Fintech',
    summary: 'A loan management platform supporting 12 loan product types, customer onboarding, loan officer workflows, and M-Pesa-integrated repayments for a Kenyan microfinance institution.',
    technologies: ['React', 'Flask', 'PostgreSQL', 'M-Pesa Daraja API'],
    cover_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    is_featured: true,
  },
];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [cat,      setCat]      = useState('All');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    publicApi.portfolio({ per_page: 20 })
      .then(r => {
        const data = r.data.data;
        setProjects(data && data.length > 0 ? data : MY_PROJECTS);
        setLoading(false);
      })
      .catch(() => {
        setProjects(MY_PROJECTS);
        setLoading(false);
      });
  }, []);

  const filtered = cat === 'All' ? projects : projects.filter(p => p.category === cat);

  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--navy)', minHeight:'100vh' }}>
      {/* Hero */}
      <section style={{ padding:'80px 0 64px', background:'var(--grad-hero)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'var(--grad-glow)', opacity:.5 }}/>
        <div style={{ position:'absolute', inset:0, opacity:.04,
          backgroundImage:'radial-gradient(circle,rgba(91,79,245,.8) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center' }}>
          <div className="eyebrow" style={{ justifyContent:'center' }}>Our Work</div>
          <h1 style={{ color:'white', marginBottom:16 }}>
            Projects That<br/><span className="text-gradient">Shipped and Scaled</span>
          </h1>
          <p style={{ color:'var(--text2)', maxWidth:480, margin:'0 auto', lineHeight:1.8 }}>
            Real products for real businesses. Every project here is live, used by real people, solving real problems.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div style={{ background:'var(--navy2)', borderBottom:'1px solid var(--border)', padding:'16px 0' }}>
        <div className="container" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={()=>setCat(c)} className={cat===c?'btn btn-primary btn-sm':'btn btn-ghost btn-sm'}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding:'64px 24px 96px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text2)' }}>
            <div className="spinner" style={{ margin:'0 auto 16px', width:32, height:32, borderWidth:3 }}/> Loading…
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible"
            style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {filtered.map((p,i) => (
              <motion.div key={p.id} variants={fadeUp}>
                <Link to={`/portfolio/${p.slug}`} className="card card-hover"
                  style={{ display:'block', overflow:'hidden', height:'100%' }}>
                  <div style={{ height:240, overflow:'hidden', background:'var(--navy2)', position:'relative' }}>
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.title}
                          style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .5s' }}
                          onMouseEnter={e=>e.target.style.transform='scale(1.06)'}
                          onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                      : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🚀</div>
                    }
                    {p.is_featured && (
                      <div style={{ position:'absolute', top:12, left:12 }}>
                        <span className="tag tag-amber">Featured</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:'22px 22px' }}>
                    <span className="tag tag-indigo" style={{ marginBottom:12 }}>{p.category}</span>
                    <h3 style={{ marginBottom:6 }}>{p.title}</h3>
                    {p.client && <div style={{ fontFamily:'var(--font-mono)', fontSize:'.65rem', letterSpacing:'1px', color:'var(--text2)', marginBottom:10 }}>{p.client}</div>}
                    <p style={{ fontSize:'.85rem', color:'var(--text2)', lineHeight:1.7, marginBottom:14 }}>{p.summary}</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {(p.technologies||[]).slice(0,4).map(t=>(
                        <span key={t} style={{ fontFamily:'var(--font-mono)', fontSize:'.6rem', padding:'3px 8px',
                          background:'var(--surface)', border:'1px solid var(--border)', borderRadius:4, color:'var(--text2)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn:'span 3', textAlign:'center', padding:'80px 0', color:'var(--text2)' }}>
                No projects in this category yet.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}