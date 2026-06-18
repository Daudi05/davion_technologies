import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { publicApi } from '../services/api';

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

const SERVICES = ['Web Development','Mobile App','UI/UX Design','AI Solution','E-commerce','API Development','Cloud Services','Business Automation','Other'];
const BUDGETS  = ['Under KES 50,000','KES 50k–150k','KES 150k–500k','KES 500k–1M','Over KES 1M'];

const INFO = [
  { icon:<Mail size={18}/>,     label:'Email',    value:'ojorodavid@gmail.com',      href:'mailto:ojorodavid@gmail.com' },
  { icon:<Phone size={18}/>,    label:'Phone',    value:'+254 757 451 584',       href:'tel:+254700000000' },
  { icon:<MapPin size={18}/>,   label:'Office',   value:'Yaya Centre', href:null },
  { icon:<Clock size={18}/>,    label:'Hours',    value:'Mon–Fri · 8am–6pm EAT',  href:null },
];

export default function Contact() {
  const [form,   setForm]   = useState({ name:'', email:'', phone:'', company:'', service:'', budget:'', message:'' });
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async e => {
    e.preventDefault(); setStatus('loading');
    try {
      await publicApi.contact(form);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrMsg(typeof err==='string'?err:'Something went wrong. Try again.');
    }
  };

  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--navy)', minHeight:'100vh' }}>

      {/* Hero */}
      <section style={{ padding:'72px 0 0', background:'var(--grad-hero)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'var(--grad-glow)', opacity:.5 }}/>
        <div style={{ position:'absolute', inset:0, opacity:.04,
          backgroundImage:'radial-gradient(circle, rgba(91,79,245,0.8) 1px, transparent 1px)',
          backgroundSize:'40px 40px' }}/>
        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center', paddingBottom:72 }}>
          <motion.div initial="hidden" animate="visible" variants={{ hidden:{}, visible:{ transition:{ staggerChildren:.1 } } }}>
            <motion.div variants={fadeUp}>
              <div className="eyebrow" style={{ justifyContent:'center' }}>Let's Talk</div>
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ color:'white', marginBottom:16 }}>
              Start Your<br/><span className="text-gradient">Project Today</span>
            </motion.h1>
            <motion.p variants={fadeUp}
              style={{ color:'var(--text2)', maxWidth:480, margin:'0 auto', lineHeight:1.8, fontSize:'1.05rem' }}>
              Tell us what you're building. We'll respond within 24 hours with a clear plan and honest timeline.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <div className="container" style={{ padding:'72px 24px 96px',
        display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'clamp(40px,6vw,96px)', alignItems:'start' }}>

        {/* Left — Info */}
        <div>
          <Reveal style={{ marginBottom:40 }}>
            <h2 style={{ fontSize:'1.6rem', marginBottom:12 }}>Get in Touch</h2>
            <p style={{ color:'var(--text2)', lineHeight:1.8, fontSize:'.9rem' }}>
              We work best when we understand your business, your users, and your constraints. 
              The form takes 3 minutes. The conversation that follows is worth much more.
            </p>
          </Reveal>

          {INFO.map(({icon,label,value,href},i) => (
            <Reveal key={label} delay={i*0.08}
              style={{ display:'flex', gap:14, padding:'16px 0', borderBottom:'1px solid var(--border)', alignItems:'center' }}>
              <div style={{ width:40,height:40, background:'var(--indigo-dim)', borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'center', color:'var(--indigo2)', flexShrink:0 }}>
                {icon}
              </div>
              <div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'.6rem', letterSpacing:'2px',
                  textTransform:'uppercase', color:'var(--text3)', marginBottom:3 }}>{label}</div>
                {href
                  ? <a href={href} style={{ fontSize:'.9rem', fontWeight:500, color:'var(--text)',
                      transition:'color .2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='var(--indigo2)'}
                      onMouseLeave={e=>e.currentTarget.style.color='var(--text)'}>
                      {value}
                    </a>
                  : <div style={{ fontSize:'.9rem', fontWeight:500, color:'var(--text)' }}>{value}</div>
                }
              </div>
            </Reveal>
          ))}

          {/* Map */}
          <Reveal delay={0.3} style={{ marginTop:28 }}>
            <iframe
              title="Davion Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.277444357788!2d36.79!3d-1.27!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1745d63f0001%3A0x69e7a3ad434ce3a9!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1718000000000"
              width="100%" height="200" style={{ border:0, borderRadius:12, filter:'grayscale(40%) contrast(1.1)' }}
              allowFullScreen="" loading="lazy"/>
          </Reveal>
        </div>

        {/* Right — Form */}
        <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.75, ease:[0.25,0.1,0.25,1] }}>

          {status === 'success' ? (
            <motion.div initial={{ opacity:0, scale:.94 }} animate={{ opacity:1, scale:1 }}
              transition={{ ease:[0.34,1.56,0.64,1] }}
              style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20,
                padding:'64px 40px', textAlign:'center' }}>
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ delay:.2, ease:[0.34,1.56,0.64,1] }}
                style={{ width:64, height:64, borderRadius:'50%', background:'rgba(0,229,160,0.12)',
                  display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
                <CheckCircle size={28} color="var(--success)"/>
              </motion.div>
              <h3 style={{ marginBottom:12 }}>Message Received</h3>
              <p style={{ color:'var(--text2)', lineHeight:1.8, marginBottom:24 }}>
                We'll review your project details and reach out within 24 business hours.
              </p>
              <button className="btn btn-outline" onClick={()=>setStatus('idle')}>Send Another</button>
            </motion.div>
          ) : (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'36px 32px' }}>
              <div style={{ marginBottom:28 }}>
                <div className="eyebrow">Project Enquiry</div>
                <h2 style={{ fontSize:'1.6rem' }}>Tell Us What You Need</h2>
                <div style={{ width:40, height:2, background:'var(--grad-indigo)', marginTop:12 }}/>
              </div>

              <form onSubmit={submit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="Jane Njoroge" value={form.name}
                      onChange={e=>set('name',e.target.value)} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="jane@company.co.ke"
                      value={form.email} onChange={e=>set('email',e.target.value)} required/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" type="tel" placeholder="+254 7xx xxx xxx"
                      value={form.phone} onChange={e=>set('phone',e.target.value)}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input className="form-input" placeholder="Your company name"
                      value={form.company} onChange={e=>set('company',e.target.value)}/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service Needed</label>
                    <select className="form-input" value={form.service} onChange={e=>set('service',e.target.value)}>
                      <option value="">Select a service</option>
                      {SERVICES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Budget Range</label>
                    <select className="form-input" value={form.budget} onChange={e=>set('budget',e.target.value)}>
                      <option value="">Select budget</option>
                      {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Project Brief *</label>
                  <textarea className="form-input" rows={5}
                    placeholder="Describe your project, target users, key features, and any relevant context..."
                    value={form.message} onChange={e=>set('message',e.target.value)} required style={{ resize:'none', lineHeight:1.7 }}/>
                </div>
                {status==='error' && (
                  <div style={{ padding:'10px 14px', background:'rgba(255,82,82,0.1)', borderLeft:'3px solid var(--danger)',
                    borderRadius:6, fontSize:'.82rem', color:'var(--danger)', marginBottom:16 }}>{errMsg}</div>
                )}
                <motion.button type="submit" className="btn btn-primary btn-lg" disabled={status==='loading'}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                  style={{ justifyContent:'center', width:'100%', position:'relative', overflow:'hidden' }}>
                  {status==='loading'
                    ? <><span className="spinner"/> Sending…</>
                    : <><Send size={16}/> Send Enquiry</>
                  }
                </motion.button>
                <p style={{ textAlign:'center', marginTop:12, fontFamily:'var(--font-mono)',
                  fontSize:'.62rem', letterSpacing:'1px', color:'var(--text3)' }}>
                  We reply within 24 hours · Mon–Fri · 8am–6pm EAT
                </p>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
