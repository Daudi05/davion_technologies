import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, CheckCircle, ChevronRight, Zap, Shield, Globe, Smartphone, Brain, ShoppingCart, Code, Cloud, Settings } from 'lucide-react';
import { publicApi } from '../services/api';
import TerminalHero from '../components/TerminalHero';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden:  { opacity:0, y:32 },
  visible: { opacity:1, y:0, transition:{ duration:0.65, ease:[0.25,0.1,0.25,1] } },
};

function Reveal({ children, delay=0, style={} }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-64px' });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden"
      animate={inView?'visible':'hidden'} transition={{ delay }} style={style}>
      {children}
    </motion.div>
  );
}

function StatCounter({ value, label, suffix='' }) {
  const [count, setCount] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true });
  const target = parseInt(value);
  useEffect(() => {
    if (!inView) return;
    const step = Math.ceil(target / 40);
    const id = setInterval(() => {
      setCount(c => { if (c + step >= target) { clearInterval(id); return target; } return c + step; });
    }, 35);
    return () => clearInterval(id);
  }, [inView, target]);
  return (
    <div ref={ref} style={{ textAlign:'center', padding:'24px 32px', borderRight:'1px solid var(--border)' }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,3rem)', fontWeight:800, color:'var(--indigo2)', lineHeight:1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:'.65rem', letterSpacing:'2px', textTransform:'uppercase', color:'var(--text2)', marginTop:8 }}>{label}</div>
    </div>
  );
}

const SERVICES_PREVIEW = [
  { icon:<Globe size={22}/>,       title:'Web Development',     slug:'web-development',    color:'#5b4ff5' },
  { icon:<Smartphone size={22}/>,  title:'Mobile Apps',          slug:'mobile-apps',        color:'#7b6ff7' },
  { icon:<Brain size={22}/>,       title:'AI Solutions',         slug:'ai-solutions',       color:'#f5a623' },
  { icon:<ShoppingCart size={22}/>,title:'E-commerce',           slug:'e-commerce',         color:'#00e5a0' },
  { icon:<Code size={22}/>,        title:'API Development',      slug:'api-development',    color:'#5b4ff5' },
  { icon:<Cloud size={22}/>,       title:'Cloud & DevOps',       slug:'cloud-solutions',    color:'#7b6ff7' },
  { icon:<Settings size={22}/>,    title:'Business Automation',  slug:'business-automation',color:'#f5a623' },
  { icon:<Shield size={22}/>,      title:'UI/UX Design',         slug:'ui-ux-design',       color:'#00e5a0' },
];

const TECH_STACK = [
  'React','Next.js','React Native',,'Python','Flask','Django',
  'Node.js','PostgreSQL','MongoDB','M-Pesa',
];

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [projects,     setProjects]     = useState([]);
  const [stats,        setStats]        = useState(null);
  const [testIdx,      setTestIdx]      = useState(0);

  useEffect(() => {
  publicApi.testimonials()
    .then(r => setTestimonials(Array.isArray(r.data.data) ? r.data.data : []))
    .catch(() => setTestimonials([]));

  publicApi.portfolio({ featured: true })
    .then(r => setProjects(Array.isArray(r.data.data) ? r.data.data.slice(0, 3) : []))
    .catch(() => setProjects([]));

  publicApi.stats()
    .then(r => setStats(r.data.data || null))
    .catch(() => setStats(null));

  const id = setInterval(() => setTestIdx(i => (i + 1) % 4), 5000);
  return () => clearInterval(id);
}, []);

  return (
    <div>
      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section style={{ position:'relative', minHeight:'100svh', display:'flex', alignItems:'center',
        background:'var(--grad-hero)', overflow:'hidden', paddingTop:'var(--nav-h)' }}>

        {/* Glow */}
        <div style={{ position:'absolute', inset:0, background:'var(--grad-glow)', pointerEvents:'none' }}/>

        {/* Animated grid dots */}
        <div style={{ position:'absolute', inset:0, opacity:0.06,
          backgroundImage:'radial-gradient(circle, rgba(91,79,245,0.8) 1px, transparent 1px)',
          backgroundSize:'40px 40px', pointerEvents:'none' }}/>

        <div className="container" style={{ position:'relative', zIndex:2,
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center',
          padding:'80px 24px' }}>

          {/* Left */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span className="tag tag-indigo" style={{ marginBottom:24, display:'inline-flex' }}>
                <Zap size={12}/> Nairobi's Premier Software Studio
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp}
              style={{ marginBottom:20, color:'white', lineHeight:1.05 }}>
              We Build Software<br/>
              <span className="text-gradient">That Actually Works</span>
            </motion.h1>

            <motion.p variants={fadeUp}
              style={{ fontSize:'clamp(1rem,1.6vw,1.15rem)', color:'var(--text2)',
                lineHeight:1.8, maxWidth:480, marginBottom:36 }}>
              Custom web apps, mobile products, and AI solutions for Kenyan SMEs and startups. 
              No generic templates. No offshore guesswork. Just clean code, shipped on time.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <Link to="/contact" className="btn btn-primary btn-lg" style={{ display:'inline-flex' }}>
                Start Your Project <ArrowRight size={18}/>
              </Link>
              <Link to="/portfolio" className="btn btn-outline btn-lg" style={{ display:'inline-flex' }}>
                See Our Work
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp}
              style={{ marginTop:40, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
              {['100% On-Time Delivery','5-Year Track Record','48 Happy Clients'].map(t => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:7,
                  fontSize:'.8rem', color:'var(--text2)', fontWeight:500 }}>
                  <CheckCircle size={14} color="var(--success)"/>
                  {t}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Terminal */}
          <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:.9, ease:[0.25,0.1,0.25,1] }}
            style={{ display:'flex', justifyContent:'center' }}>
            <TerminalHero/>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:1.8 }}
          style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
            width:24, height:40, border:'1.5px solid rgba(255,255,255,0.2)', borderRadius:12,
            display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:6 }}>
          <div style={{ width:4, height:8, borderRadius:2, background:'var(--indigo2)' }}/>
        </motion.div>
      </section>

      {/* ═══ STATS ══════════════════════════════════════════════════════ */}
      <section style={{ background:'var(--navy2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', borderLeft:'1px solid var(--border)' }}>
            {[
              [stats?.projects||'40',  'Projects Shipped', '+'],
              [stats?.clients||'48',   'Happy Clients',    '+'],
              [stats?.years||'5',      'Years Building',   ''],
              [stats?.team_size||'12', 'Team Members',     ''],
              [stats?.satisfaction||'98','% Satisfaction', ''],
            ].map(([v,l,s]) => <StatCounter key={l} value={v} label={l} suffix={s}/>)}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══════════════════════════════════════════════════ */}
      <section className="section" style={{ background:'var(--navy)' }}>
        <div className="container">
          <Reveal style={{ textAlign:'center', marginBottom:56 }}>
            <div className="eyebrow" style={{ justifyContent:'center' }}>What We Build</div>
            <h2>End-to-End Software Services</h2>
            <p style={{ color:'var(--text2)', marginTop:14, maxWidth:520, margin:'14px auto 0', lineHeight:1.8 }}>
              From idea validation to production deployment — we cover the full stack.
            </p>
          </Reveal>
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once:true, margin:'-60px' }}
            style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {SERVICES_PREVIEW.map((s,i) => (
              <motion.div key={s.slug} variants={fadeUp}>
                <Link to={`/services#${s.slug}`} className="card card-hover"
                  style={{ display:'block', padding:'28px 22px', transition:'all .25s' }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:`${s.color}18`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:s.color, marginBottom:16, transition:'all .25s' }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontSize:'1rem', marginBottom:8 }}>{s.title}</h3>
                  <div style={{ display:'flex', alignItems:'center', gap:4,
                    fontSize:'.78rem', color:'var(--text2)', fontWeight:500 }}>
                    Learn more <ChevronRight size={13}/>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURED WORK ══════════════════════════════════════════════ */}
      <section className="section" style={{ background:'var(--navy2)' }}>
        <div className="container">
          <Reveal>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end',
              marginBottom:52, flexWrap:'wrap', gap:16 }}>
              <div>
                <div className="eyebrow">Case Studies</div>
                <h2>Work We're Proud Of</h2>
              </div>
              <Link to="/portfolio" className="btn btn-outline btn-sm" style={{ display:'inline-flex' }}>
                View All Projects <ArrowRight size={14}/>
              </Link>
            </div>
          </Reveal>
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once:true }}
            style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {projects.map((p,i) => (
              <motion.div key={p.id} variants={fadeUp}>
                <Link to={`/portfolio/${p.slug}`} className="card card-hover"
                  style={{ display:'block', overflow:'hidden' }}>
                  <div style={{ height:220, overflow:'hidden', background:'var(--navy)' }}>
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.title}
                          style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .5s' }}
                          onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
                          onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                      : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem' }}>🚀</div>
                    }
                  </div>
                  <div style={{ padding:'20px 22px' }}>
                    <span className="tag tag-indigo" style={{ marginBottom:12 }}>{p.category}</span>
                    <h3 style={{ marginBottom:8 }}>{p.title}</h3>
                    <p style={{ fontSize:'.85rem', color:'var(--text2)', lineHeight:1.7, marginBottom:14 }}>{p.summary}</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {(p.technologies||[]).slice(0,4).map(t => (
                        <span key={t} style={{ fontFamily:'var(--font-mono)', fontSize:'.62rem',
                          padding:'3px 8px', background:'var(--surface)', borderRadius:5,
                          color:'var(--text2)', border:'1px solid var(--border)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="section" style={{ background:'var(--navy)', overflow:'hidden' }}>
          <div className="container">
            <Reveal style={{ textAlign:'center', marginBottom:52 }}>
              <div className="eyebrow" style={{ justifyContent:'center' }}>Client Voices</div>
              <h2>What Our Clients Say</h2>
            </Reveal>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:24 }}>
              {testimonials.slice(0,4).map((t,i) => (
                <Reveal key={t.id} delay={i*0.1}>
                  <div className="card" style={{ padding:'28px 24px' }}>
                    <div style={{ display:'flex', gap:2, marginBottom:16 }}>
                      {[1,2,3,4,5].map(s=><Star key={s} size={14} fill="#f5a623" color="#f5a623"/>)}
                    </div>
                    <p style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontStyle:'italic',
                      color:'var(--slate)', lineHeight:1.7, marginBottom:20 }}>"{t.content}"</p>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--grad-indigo)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'white', fontWeight:700, flexShrink:0, fontFamily:'var(--font-display)' }}>
                        {t.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'.875rem', color:'var(--text)' }}>{t.name}</div>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:'.62rem', letterSpacing:'1px', color:'var(--text2)' }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ TECH STACK ═════════════════════════════════════════════════ */}
      <section style={{ padding:'72px 0', background:'var(--navy2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', overflow:'hidden' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div className="eyebrow" style={{ justifyContent:'center', marginBottom:4 }}>Our Stack</div>
          <h3 style={{ color:'var(--text2)', fontWeight:400, fontSize:'1rem' }}>Technologies we know deeply</h3>
        </div>
        <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:28, ease:'linear', repeat:Infinity }}
          style={{ display:'flex', width:'max-content', gap:0 }}>
          {[...TECH_STACK,...TECH_STACK].map((t,i) => (
            <span key={i} style={{ fontFamily:'var(--font-mono)', fontSize:'.78rem', fontWeight:500,
              color:'var(--text2)', padding:'10px 28px', borderRight:'1px solid var(--border)',
              whiteSpace:'nowrap', transition:'color .2s', letterSpacing:'1px' }}>
              {t}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════════════ */}
      <section style={{ padding:'96px 0', background:'var(--navy)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'var(--grad-glow)', opacity:0.7 }}/>
        <div style={{ position:'absolute', right:'-80px', top:'50%', transform:'translateY(-50%)',
          fontFamily:'var(--font-display)', fontSize:'clamp(200px,22vw,320px)', fontWeight:800,
          color:'rgba(91,79,245,0.04)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>D</div>
        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <Reveal>
            <span className="tag tag-indigo" style={{ marginBottom:24, display:'inline-flex' }}>
              Ready to Build?
            </span>
            <h2 style={{ marginBottom:16, maxWidth:600, margin:'0 auto 16px' }}>
              Your Next Product Starts With a Conversation
            </h2>
            <p style={{ color:'var(--text2)', maxWidth:480, margin:'0 auto 36px', lineHeight:1.8 }}>
              Tell us what you're building. We'll tell you if we're the right team to build it — and how fast.
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/contact" className="btn btn-primary btn-xl" style={{ display:'inline-flex' }}>
                Start a Project <ArrowRight size={18}/>
              </Link>
              <Link to="/portfolio" className="btn btn-outline btn-xl" style={{ display:'inline-flex' }}>
                View Our Work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
