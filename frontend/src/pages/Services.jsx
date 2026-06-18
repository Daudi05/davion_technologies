import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { publicApi } from '../services/api';

const fadeUp = { hidden:{opacity:0,y:32}, visible:{opacity:1,y:0,transition:{duration:.65,ease:[0.25,0.1,0.25,1]}} };

function Reveal({ children, delay=0, style={} }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-60px' });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden"
      animate={inView?'visible':'hidden'} transition={{ delay }} style={style}>
      {children}
    </motion.div>
  );
}

const FALLBACK = [
  { id:1, title:'Web Development', icon:'🌐', short_desc:'Custom web applications built with React, Next.js and Flask. Fast, secure, scalable.', features:['Responsive design','SEO optimized','PWA support','API integration'], price_from:'From KES 80,000' },
  { id:2, title:'Mobile Apps', icon:'📱', short_desc:'Native and cross-platform mobile apps for iOS and Android.', features:['React Native & Flutter','Offline support','Push notifications','M-Pesa integration'], price_from:'From KES 120,000' },
  { id:3, title:'AI Solutions', icon:'🤖', short_desc:'Machine learning, NLP, and AI integrations for your business workflows.', features:['Custom ML models','OpenAI integration','Data pipelines','Predictive analytics'], price_from:'From KES 150,000' },
  { id:4, title:'E-commerce', icon:'🛒', short_desc:'End-to-end online stores with payment integration and inventory management.', features:['M-Pesa & card payments','Inventory management','Order tracking','Analytics dashboard'], price_from:'From KES 90,000' },
  { id:5, title:'API Development', icon:'⚡', short_desc:'RESTful and GraphQL APIs that power your products and third-party integrations.', features:['RESTful & GraphQL','Authentication & RBAC','Rate limiting','Comprehensive docs'], price_from:'From KES 60,000' },
  { id:6, title:'Business Automation', icon:'⚙️', short_desc:'Automate repetitive workflows and free your team to do real work.', features:['Process automation','Workflow design','CRM integration','Email automation'], price_from:'From KES 70,000' },
];

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    publicApi.services().then(r=>setServices(r.data.data)).catch(()=>setServices(FALLBACK));
  }, []);

  const data = services.length > 0 ? services : FALLBACK;

  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--navy)', minHeight:'100vh' }}>
      <section style={{ padding:'80px 0 64px', background:'var(--grad-hero)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'var(--grad-glow)', opacity:.5 }}/>
        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center' }}>
          <div className="eyebrow" style={{ justifyContent:'center' }}>What We Build</div>
          <h1 style={{ color:'white', marginBottom:16 }}>
            Every Service You Need.<br/><span className="text-gradient">One Team.</span>
          </h1>
          <p style={{ color:'var(--text2)', maxWidth:480, margin:'0 auto', lineHeight:1.8 }}>
            From ideation to production — we handle the full lifecycle of your software product.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding:'72px 24px 96px', display:'flex', flexDirection:'column', gap:80 }}>
        {data.map((s,i) => (
          <div key={s.id} id={s.slug}
            style={{ display:'grid', gridTemplateColumns: i%2===0 ? '1fr 1fr' : '1fr 1fr',
              gap:64, alignItems:'center', direction: i%2===0 ? 'ltr' : 'rtl' }}>
            <Reveal style={{ direction:'ltr' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'.65rem', letterSpacing:'3px',
                textTransform:'uppercase', color:'var(--indigo2)', marginBottom:14 }}>Service</div>
              <h2 style={{ marginBottom:16 }}>
                <span style={{ fontSize:'2rem', display:'block', marginBottom:8 }}>{s.icon}</span>
                {s.title}
              </h2>
              <p style={{ color:'var(--text2)', lineHeight:1.85, marginBottom:24, fontSize:'.95rem' }}>{s.short_desc}</p>
              {s.features?.length > 0 && (
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                  {s.features.map(f=>(
                    <div key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:'.875rem', color:'var(--text)' }}>
                      <CheckCircle size={15} color="var(--success)"/> {f}
                    </div>
                  ))}
                </div>
              )}
              {s.price_from && (
                <div style={{ marginBottom:24 }}>
                  <span className="tag tag-amber">{s.price_from}</span>
                </div>
              )}
              <Link to="/contact" className="btn btn-primary" style={{ display:'inline-flex' }}>
                Get a Quote <ArrowRight size={16}/>
              </Link>
            </Reveal>
            <Reveal delay={0.15} style={{ direction:'ltr' }}>
              <div style={{ background:'var(--navy2)', border:'1px solid var(--border)',
                borderRadius:20, padding:'40px', textAlign:'center',
                aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center',
                background:'radial-gradient(ellipse at center, rgba(91,79,245,0.12) 0%, transparent 70%)',
                boxShadow:'inset 0 0 60px rgba(91,79,245,0.08)' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'.72rem', lineHeight:2,
                  color:'var(--text2)', textAlign:'left' }}>
                  {['$ davion init project',`$ davion add ${s.title.toLowerCase().split(' ')[0]}`,
                    '$ davion deploy --prod','✓ Done in 8 weeks'].map((line,j)=>(
                    <div key={j} style={{ color: j===3 ? 'var(--success)' : j%2===0 ? 'var(--slate2)' : 'var(--indigo2)' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}
