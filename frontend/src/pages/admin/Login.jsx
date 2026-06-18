import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form,  setForm]    = useState({ email:'', password:'' });
  const [status,setStatus]  = useState('idle');
  const [errMsg,setErrMsg]  = useState('');

  const submit = async e => {
    e.preventDefault(); setStatus('loading');
    try { await login(form.email, form.password); navigate('/admin'); }
    catch (err) { setErrMsg(typeof err==='string'?err:'Invalid credentials'); setStatus('error'); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--nav-h)', padding:24, background:'var(--grad-hero)' }}>
      <div style={{ position:'fixed', inset:0, background:'var(--grad-glow)', opacity:.5 }}/>
      <div style={{ position:'fixed', inset:0, opacity:.04,
        backgroundImage:'radial-gradient(circle,rgba(91,79,245,.8) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        style={{ position:'relative', zIndex:1, width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56,height:56,borderRadius:16,background:'var(--grad-indigo)',
            display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',color:'white' }}>
            <Code2 size={26}/>
          </div>
          <h2 style={{ marginBottom:4 }}>Davion Admin</h2>
          <p style={{ color:'var(--text2)', fontSize:'.875rem' }}>Sign in to manage your site</p>
        </div>
        <div className="card" style={{ padding:36 }}>
          {status==='error' && (
            <div style={{ padding:'10px 14px', background:'rgba(255,82,82,0.1)', borderLeft:'3px solid var(--danger)',
              borderRadius:6, fontSize:'.82rem', color:'var(--danger)', marginBottom:16 }}>{errMsg}</div>
          )}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="admin@davion.tech"
                value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required/>
            </div>
            <motion.button type="submit" className="btn btn-primary btn-lg w-full"
              disabled={status==='loading'} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
              style={{ justifyContent:'center', marginTop:8 }}>
              {status==='loading'?<><span className="spinner"/>Signing In…</>:<><Lock size={16}/>Sign In</>}
            </motion.button>
          </form>
          <div style={{ marginTop:20, padding:14, background:'var(--surface)', borderRadius:8, border:'1px dashed var(--border2)', fontSize:'.75rem', color:'var(--text2)' }}>
            <strong style={{ color:'var(--text)' }}>Demo:</strong> admin@davion.tech / Admin@2025!
          </div>
        </div>
      </motion.div>
    </div>
  );
}
