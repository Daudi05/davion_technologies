import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Target, Eye, Heart, Lightbulb, Users, Globe, Award } from 'lucide-react';

const fadeUp = {
  hidden:  { opacity:0, y:32 },
  visible: { opacity:1, y:0, transition:{ duration:0.65, ease:[0.25,0.1,0.25,1] } },
};
const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:.12 } } };

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

const VALUES = [
  { icon:<Target size={22}/>,    title:'Precision',   desc:'We obsess over details most agencies skip — performance, edge cases, and the 3am bug.' },
  { icon:<Heart size={22}/>,     title:'Partnership',  desc:'Your success is our KPI. We stay engaged after launch, not just until payment.' },
  { icon:<Lightbulb size={22}/>, title:'Clarity',      desc:'No jargon, no vague timelines. You always know what we\'re building and why.' },
  { icon:<Globe size={22}/>,     title:'Africa First', desc:'We build for Kenyan realities — M-Pesa, low bandwidth, mobile-first users.' },
];

const TEAM = [
  { name:'David Wege',     role:'Founder & Lead Engineer',   initials:'DW', color:'#5b4ff5' },
  { name:'Amina Odhiambo', role:'Senior Full-Stack Engineer', initials:'AO', color:'#f5a623' },
  { name:'Brian Mwangi',   role:'Mobile Engineer',            initials:'BM', color:'#00e5a0' },
  { name:'Grace Njeri',    role:'UI/UX Designer',             initials:'GN', color:'#7b6ff7' },
];

export default function About() {
  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--navy)' }}>

      {/* Hero */}
      <section style={{ padding:'80px 0 0', background:'var(--grad-hero)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'var(--grad-glow)', opacity:.5 }}/>
        <div style={{ position:'absolute', inset:0, opacity:.04,
          backgroundImage:'radial-gradient(circle,rgba(91,79,245,.8) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
        <div className="container" style={{ position:'relative', zIndex:2, paddingBottom:80 }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}><div className="eyebrow">Our Story</div></motion.div>
            <motion.h1 variants={fadeUp} style={{ color:'white', maxWidth:640, marginBottom:20 }}>
              Built in Nairobi.<br/><span className="text-gradient">Shipping for Africa.</span>
            </motion.h1>
            <motion.p variants={fadeUp}
              style={{ color:'var(--text2)', maxWidth:520, lineHeight:1.85, fontSize:'1.05rem' }}>
              Davion Technologies started in 2020 with a single conviction: Kenyan businesses deserve 
              software as good as anything built in Silicon Valley — built by a team that actually 
              understands the local market.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <Reveal>
            <div className="eyebrow">The Beginning</div>
            <h2 style={{ marginBottom:20 }}>One Founder. One Problem. One Mission.</h2>
            <p style={{ color:'var(--text2)', lineHeight:1.85, marginBottom:16 }}>
              Our founder David Wege spent three years watching Kenyan SMEs pay international agencies 
              who delivered generic solutions that didn't account for M-Pesa, Safaricom's API quirks, 
              or the reality that 70% of their customers were on 3G mobile.
            </p>
            <p style={{ color:'var(--text2)', lineHeight:1.85, marginBottom:24 }}>
              He built Davion to fix that. Five years and 48 client projects later, we've shipped 
              everything from micro-lending platforms to fleet tracking systems — all grounded in 
              the real constraints of doing business in East Africa.
            </p>
            <Link to="/portfolio" className="btn btn-primary" style={{ display:'inline-flex' }}>
              See Our Work <ArrowRight size={16}/>
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                ['2020','Founded in Nairobi'],['48+','Projects shipped'],['12','Team members'],['6','Countries served'],
              ].map(([num,label]) => (
                <div key={label} className="card" style={{ padding:'28px 20px', textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:800,
                    color:'var(--indigo2)', marginBottom:6 }}>{num}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'.62rem', letterSpacing:'1.5px',
                    textTransform:'uppercase', color:'var(--text2)' }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding:'64px 0', background:'var(--navy2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
          {[
            { icon:<Target size={28}/>, title:'Our Mission', color:'#5b4ff5',
              text:'Make world-class software development accessible to every Kenyan business — regardless of size or technical background.' },
            { icon:<Eye size={28}/>, title:'Our Vision', color:'#f5a623',
              text:'Be the most trusted software partner for African businesses by 2030, with a track record built entirely on delivered results.' },
          ].map(m => (
            <Reveal key={m.title}>
              <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                <div style={{ width:56,height:56,borderRadius:14,background:`${m.color}18`,
                  display:'flex',alignItems:'center',justifyContent:'center',color:m.color,flexShrink:0 }}>
                  {m.icon}
                </div>
                <div>
                  <h3 style={{ marginBottom:10, color:'white' }}>{m.title}</h3>
                  <p style={{ color:'var(--text2)', lineHeight:1.8 }}>{m.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <Reveal style={{ textAlign:'center', marginBottom:52 }}>
            <div className="eyebrow" style={{ justifyContent:'center' }}>How We Work</div>
            <h2>Values That Shape Everything</h2>
          </Reveal>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
            style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {VALUES.map((v,i) => (
              <motion.div key={v.title} variants={fadeUp} className="card card-hover"
                style={{ padding:'28px 22px', transition:'all .25s' }}>
                <div style={{ width:48,height:48,borderRadius:12,background:'var(--indigo-dim)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color:'var(--indigo2)',marginBottom:16 }}>{v.icon}</div>
                <h3 style={{ marginBottom:10 }}>{v.title}</h3>
                <p style={{ fontSize:'.85rem', color:'var(--text2)', lineHeight:1.7, margin:0 }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:'64px 0', background:'var(--navy2)' }}>
        <div className="container">
          <Reveal style={{ textAlign:'center', marginBottom:48 }}>
            <div className="eyebrow" style={{ justifyContent:'center' }}>The People</div>
            <h2>A Small Team. A Serious Track Record.</h2>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {TEAM.map((m,i) => (
              <Reveal key={m.name} delay={i*0.1}>
                <div className="card" style={{ padding:'28px', textAlign:'center' }}>
                  <div style={{ width:72,height:72,borderRadius:'50%',
                    background:`linear-gradient(135deg,${m.color},${m.color}88)`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,
                    color:'white',margin:'0 auto 16px' }}>{m.initials}</div>
                  <div style={{ fontWeight:700,marginBottom:5 }}>{m.name}</div>
                  <div style={{ fontFamily:'var(--font-mono)',fontSize:'.62rem',
                    letterSpacing:'1px',color:'var(--text2)',textTransform:'uppercase' }}>{m.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 0', background:'var(--navy)', textAlign:'center' }}>
        <div className="container">
          <Reveal>
            <h2 style={{ marginBottom:14 }}>Ready to Work Together?</h2>
            <p style={{ color:'var(--text2)', marginBottom:28 }}>Let's build something your users will love.</p>
            <Link to="/contact" className="btn btn-amber btn-xl" style={{ display:'inline-flex' }}>
              Start a Conversation <ArrowRight size={18}/>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
