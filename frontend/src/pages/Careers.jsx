import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { publicApi } from '../services/api';

export default function Careers() {
  const [jobs,     setJobs]     = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [applying, setApplying] = useState(null);
  const [form,     setForm]     = useState({ name:'', email:'', phone:'', cover_letter:'' });
  const [status,   setStatus]   = useState('idle');

  useEffect(() => { publicApi.jobs().then(r=>setJobs(r.data.data)).catch(()=>{}); }, []);

  const apply = async e => {
    e.preventDefault(); setStatus('loading');
    try {
      await publicApi.apply(applying, form);
      setStatus('success');
      setTimeout(() => { setApplying(null); setStatus('idle'); setForm({ name:'',email:'',phone:'',cover_letter:'' }); }, 3000);
    } catch { setStatus('error'); }
  };

  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--navy)', minHeight:'100vh' }}>
      <section style={{ padding:'80px 0 64px', background:'var(--grad-hero)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'var(--grad-glow)', opacity:.5 }}/>
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div className="eyebrow">Join the Team</div>
          <h1 style={{ color:'white', marginBottom:16, maxWidth:540 }}>
            Build the Future of<br/><span className="text-gradient">African Software</span>
          </h1>
          <p style={{ color:'var(--text2)', maxWidth:460, lineHeight:1.85, fontSize:'1.05rem' }}>
            We're a small, high-trust team. We hire slowly, invest deeply, and build together.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding:'64px 24px 96px', display:'grid', gridTemplateColumns:'2fr 1fr', gap:48, alignItems:'start' }}>
        <div>
          <h2 style={{ marginBottom:28, fontSize:'1.4rem' }}>Open Positions</h2>
          {jobs.length === 0 && (
            <div className="card" style={{ padding:48, textAlign:'center', color:'var(--text2)' }}>
              No open positions right now. Check back soon or send a speculative application to hello@davion.tech
            </div>
          )}
          {jobs.map(job => (
            <div key={job.id} className="card" style={{ marginBottom:16, overflow:'hidden' }}>
              <div style={{ padding:'22px 24px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', cursor:'pointer' }}
                onClick={()=>setExpanded(expanded===job.id?null:job.id)}>
                <div>
                  <h3 style={{ marginBottom:8 }}>{job.title}</h3>
                  <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                    {[
                      [Briefcase,job.department],[MapPin,job.location],[Clock,job.type]
                    ].map(([Icon,val])=>val&&(
                      <span key={val} style={{ display:'flex', alignItems:'center', gap:5,
                        fontFamily:'var(--font-mono)', fontSize:'.65rem', color:'var(--text2)', letterSpacing:'.5px' }}>
                        <Icon size={12} color="var(--indigo2)"/>{val}
                      </span>
                    ))}
                  </div>
                </div>
                {expanded===job.id ? <ChevronUp size={18} color="var(--text2)"/> : <ChevronDown size={18} color="var(--text2)"/>}
              </div>
              <AnimatePresence>
                {expanded===job.id && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                    exit={{ height:0, opacity:0 }} transition={{ duration:.25 }}
                    style={{ overflow:'hidden', borderTop:'1px solid var(--border)' }}>
                    <div style={{ padding:'24px' }}>
                      <p style={{ color:'var(--text2)', lineHeight:1.8, marginBottom:20 }}>{job.description}</p>
                      {job.requirements?.length > 0 && (
                        <div style={{ marginBottom:24 }}>
                          <div style={{ fontFamily:'var(--font-mono)', fontSize:'.65rem', letterSpacing:'2px',
                            textTransform:'uppercase', color:'var(--indigo2)', marginBottom:12 }}>Requirements</div>
                          {job.requirements.map(r=>(
                            <div key={r} style={{ display:'flex', gap:10, padding:'4px 0', fontSize:'.875rem', color:'var(--text2)' }}>
                              <span style={{ color:'var(--success)', flexShrink:0 }}>✓</span>{r}
                            </div>
                          ))}
                        </div>
                      )}
                      <button className="btn btn-primary" onClick={()=>setApplying(job.id)}>
                        Apply for this Role <Send size={15}/>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ position:'sticky', top:'calc(var(--nav-h) + 24px)' }}>
          <div className="card" style={{ padding:28, marginBottom:20 }}>
            <h3 style={{ marginBottom:12 }}>Why Work at Davion?</h3>
            {['Competitive salary in KES','Remote-first culture','Real ownership over your work',
              'Direct access to the founder','Conference budget','Medical insurance'].map(b=>(
              <div key={b} style={{ display:'flex', gap:8, padding:'6px 0', fontSize:'.875rem', color:'var(--text2)' }}>
                <span style={{ color:'var(--success)' }}>✓</span>{b}
              </div>
            ))}
          </div>
          <div className="card" style={{ padding:28 }}>
            <h3 style={{ marginBottom:10 }}>Don't See Your Role?</h3>
            <p style={{ fontSize:'.85rem', color:'var(--text2)', lineHeight:1.75, marginBottom:16 }}>
              Send a speculative application. We're always interested in exceptional engineers and designers.
            </p>
            <a href="mailto:hello@davion.tech" className="btn btn-outline w-full" style={{ justifyContent:'center', display:'flex' }}>
              ojorodavid@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {applying && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:200 }}
              onClick={()=>setApplying(null)}/>
            <motion.div initial={{ opacity:0, scale:.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:.95 }} transition={{ duration:.25 }}
              style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                zIndex:201, width:'min(500px,95vw)', background:'var(--navy2)',
                border:'1px solid var(--border)', borderRadius:20, overflow:'auto', maxHeight:'90vh' }}>
              <div style={{ padding:32 }}>
                {status==='success'
                  ? <div style={{ textAlign:'center', padding:'32px 0' }}>
                      <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✅</div>
                      <h3>Application Submitted!</h3>
                      <p style={{ color:'var(--text2)', marginTop:8 }}>We'll review your application and get back to you within 5 business days.</p>
                    </div>
                  : <>
                      <h3 style={{ marginBottom:4 }}>Apply Now</h3>
                      <p style={{ color:'var(--text2)', fontSize:'.85rem', marginBottom:24 }}>
                        {jobs.find(j=>j.id===applying)?.title}
                      </p>
                      <form onSubmit={apply}>
                        {[['Full Name','name','text','Jane Njoroge'],['Email','email','email','jane@company.co.ke'],['Phone','phone','tel','+254 7xx xxx xxx']].map(([l,k,t,p])=>(
                          <div key={k} className="form-group">
                            <label className="form-label">{l}</label>
                            <input className="form-input" type={t} placeholder={p} value={form[k]}
                              onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} required={k!=='phone'}/>
                          </div>
                        ))}
                        <div className="form-group">
                          <label className="form-label">Cover Letter</label>
                          <textarea className="form-input" rows={5} placeholder="Why do you want to join Davion? What makes you the right person for this role?"
                            value={form.cover_letter} onChange={e=>setForm(f=>({...f,cover_letter:e.target.value}))} style={{ resize:'none' }}/>
                        </div>
                        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                          <button type="button" className="btn btn-ghost" onClick={()=>setApplying(null)}>Cancel</button>
                          <motion.button type="submit" className="btn btn-primary" disabled={status==='loading'}
                            whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}>
                            {status==='loading'?<><span className="spinner"/> Sending…</>:<><Send size={14}/> Submit</>}
                          </motion.button>
                        </div>
                      </form>
                    </>
                }
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
