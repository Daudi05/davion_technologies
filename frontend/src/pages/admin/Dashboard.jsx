import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, MessageSquare, Users, Tag, Newspaper, LogOut, Code2, Menu, X } from 'lucide-react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to:'/admin',          icon:<LayoutDashboard size={17}/>, label:'Dashboard', end:true },
  { to:'/admin/messages', icon:<MessageSquare size={17}/>,   label:'Messages' },
  { to:'/admin/portfolio',icon:<Briefcase size={17}/>,       label:'Portfolio' },
  { to:'/admin/services', icon:<Tag size={17}/>,             label:'Services' },
  { to:'/admin/blog',     icon:<Newspaper size={17}/>,       label:'Blog' },
];

function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  return (
    <aside style={{ background:'var(--navy2)', borderRight:'1px solid var(--border)',
      width: collapsed ? 64 : 220, transition:'width .25s', display:'flex', flexDirection:'column',
      position:'sticky', top:0, height:'100vh', flexShrink:0, overflow:'hidden' }}>
      <div style={{ padding:'16px 14px', borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <div style={{ width:34,height:34,borderRadius:9,background:'var(--grad-indigo)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'white' }}>
          <Code2 size={17}/>
        </div>
        {!collapsed && <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'.9rem', color:'white', whiteSpace:'nowrap' }}>Davion Admin</div>}
        <button onClick={()=>setCollapsed(!collapsed)} style={{ marginLeft:'auto', color:'var(--text3)', background:'none', border:'none', cursor:'pointer', padding:2, display:'flex', flexShrink:0 }}>
          {collapsed?<Menu size={15}/>:<X size={15}/>}
        </button>
      </div>
      {!collapsed && user && (
        <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:30,height:30,borderRadius:'50%',background:'var(--grad-indigo)',color:'white',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'.8rem' }}>{user.username?.[0]?.toUpperCase()}</div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ fontSize:'.8rem', fontWeight:600, color:'white', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.username}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'.58rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'1px' }}>Admin</div>
            </div>
          </div>
        </div>
      )}
      <nav style={{ padding:'10px 8px', flex:1, overflow:'auto' }}>
        {NAV.map(n => {
          const active = n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8,
                marginBottom:2, color: active ? 'white' : 'var(--text2)',
                background: active ? 'rgba(91,79,245,.2)' : 'transparent',
                border: active ? '1px solid rgba(91,79,245,.3)' : '1px solid transparent',
                transition:'all .18s', fontSize:'.84rem', fontWeight:500, textDecoration:'none',
                whiteSpace:'nowrap', overflow:'hidden' }}>
              <span style={{ flexShrink:0 }}>{n.icon}</span>
              {!collapsed && n.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={()=>{logout();navigate('/admin/login');}}
        style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 18px',
          color:'var(--text3)', border:'none', borderTop:'1px solid var(--border)',
          background:'none', cursor:'pointer', fontFamily:'var(--font-body)',
          fontSize:'.84rem', transition:'color .18s', flexShrink:0,
          whiteSpace:'nowrap', overflow:'hidden' }}
        onMouseEnter={e=>e.currentTarget.style.color='#ff5252'}
        onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
        <LogOut size={17} style={{ flexShrink:0 }}/> {!collapsed && 'Sign Out'}
      </button>
    </aside>
  );
}

function DashboardHome() {
  const [data, setData] = useState(null);
  useEffect(()=>{ adminApi.dashboard().then(r=>setData(r.data.data)).catch(()=>{}); },[]);
  if (!data) return <div style={{ padding:32, color:'var(--text2)' }}>Loading…</div>;
  return (
    <div style={{ padding:32 }}>
      <h2 style={{ marginBottom:6 }}>Dashboard</h2>
      <p style={{ color:'var(--text2)', marginBottom:28 }}>Overview of your Davion Technologies site</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
        {[
          ['Portfolio Projects', data.projects, '#5b4ff5'],
          ['Messages', data.messages, '#f5a623'],
          ['Unread', data.unread, '#ff5252'],
          ['Blog Posts', data.posts, '#00e5a0'],
          ['Applications', data.applications, '#7b6ff7'],
          ['Testimonials', data.testimonials, '#5b4ff5'],
        ].map(([label,val,color])=>(
          <div key={label} className="card" style={{ padding:24 }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color, marginBottom:4 }}>{val}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'.62rem', letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text2)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Messages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  useEffect(()=>{ adminApi.messages().then(r=>setMessages(r.data.data)).catch(()=>{}); },[]);
  const markRead = async id => {
    await adminApi.markRead(id);
    setMessages(m=>m.map(x=>x.id===id?{...x,is_read:true}:x));
  };
  return (
    <div style={{ padding:32 }}>
      <h2 style={{ marginBottom:24 }}>Contact Messages</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card" style={{ overflow:'hidden' }}>
          {messages.map(m=>(
            <div key={m.id} onClick={()=>{setSelected(m);if(!m.is_read)markRead(m.id);}}
              style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', cursor:'pointer',
                background: selected?.id===m.id ? 'var(--surface2)' : !m.is_read ? 'rgba(91,79,245,0.06)' : 'transparent' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <strong style={{ fontSize:'.875rem' }}>{m.name}</strong>
                {!m.is_read && <span style={{ width:8,height:8,borderRadius:'50%',background:'var(--indigo2)',flexShrink:0,marginTop:4 }}/>}
              </div>
              <div style={{ fontSize:'.75rem', color:'var(--text2)', marginBottom:3 }}>{m.email}</div>
              <div style={{ fontSize:'.78rem', color:'var(--text3)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.message}</div>
            </div>
          ))}
          {messages.length===0 && <div style={{ padding:40, textAlign:'center', color:'var(--text2)' }}>No messages yet</div>}
        </div>
        <div className="card" style={{ padding:28 }}>
          {selected ? (
            <>
              <div style={{ marginBottom:20 }}>
                <h3 style={{ marginBottom:4 }}>{selected.name}</h3>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'.65rem', color:'var(--text2)', letterSpacing:'1px' }}>{selected.email} · {selected.phone}</div>
              </div>
              {selected.company && <div style={{ marginBottom:10, fontSize:'.85rem', color:'var(--text2)' }}>Company: {selected.company}</div>}
              {selected.service && <div style={{ marginBottom:10 }}><span className="tag tag-indigo">{selected.service}</span></div>}
              {selected.budget  && <div style={{ marginBottom:16 }}><span className="tag tag-amber">{selected.budget}</span></div>}
              <p style={{ color:'var(--text)', lineHeight:1.8, fontSize:'.9rem' }}>{selected.message}</p>
              <div style={{ marginTop:20, fontSize:'.72rem', color:'var(--text3)', fontFamily:'var(--font-mono)' }}>
                {new Date(selected.created_at).toLocaleString()}
              </div>
              <a href={`mailto:${selected.email}`} className="btn btn-primary btn-sm" style={{ marginTop:16, display:'inline-flex' }}>
                Reply via Email
              </a>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text3)' }}>Select a message to view it</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const loc      = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(()=>{ if(!user) navigate('/admin/login'); },[user]);
  if (!user) return null;

  const isMessages  = loc.pathname.includes('/messages');
  const isPortfolio = loc.pathname.includes('/portfolio');
  const isBlog      = loc.pathname.includes('/blog');
  const isServices  = loc.pathname.includes('/services');
  const isRoot      = loc.pathname === '/admin';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--navy)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
      <main style={{ flex:1, overflow:'auto' }}>
        {isRoot      && <DashboardHome/>}
        {isMessages  && <Messages/>}
        {isPortfolio && <PortfolioAdmin/>}
        {isBlog      && <BlogAdmin/>}
        {isServices  && <ServicesAdmin/>}
      </main>
    </div>
  );
}

function PortfolioAdmin() {
  const [projects, setProjects] = useState([]);
  useEffect(()=>{ adminApi.portfolio().then(r=>setProjects(r.data.data)).catch(()=>{}); },[]);
  const del = async id => {
    if(!confirm('Delete this project?')) return;
    await adminApi.deleteProject(id);
    setProjects(p=>p.filter(x=>x.id!==id));
  };
  return (
    <div style={{ padding:32 }}>
      <h2 style={{ marginBottom:24 }}>Portfolio Projects</h2>
      <div className="card" style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.85rem' }}>
          <thead><tr>
            {['Project','Category','Featured','Actions'].map(h=>(
              <th key={h} style={{ padding:'12px 16px', textAlign:'left', background:'var(--surface)',
                borderBottom:'1px solid var(--border)', fontSize:'.68rem', textTransform:'uppercase',
                letterSpacing:'1px', color:'var(--text2)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {projects.map(p=>(
              <tr key={p.id} style={{ borderBottom:'1px solid var(--border)' }}>
                <td style={{ padding:'12px 16px', fontWeight:600 }}>{p.title}<br/><span style={{ fontFamily:'var(--font-mono)',fontSize:'.65rem',color:'var(--text2)' }}>{p.client}</span></td>
                <td style={{ padding:'12px 16px' }}><span className="tag tag-indigo">{p.category}</span></td>
                <td style={{ padding:'12px 16px' }}>{p.is_featured?'⭐':'—'}</td>
                <td style={{ padding:'12px 16px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>del(p.id)} style={{ color:'var(--danger)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  useEffect(()=>{ adminApi.blog().then(r=>setPosts(r.data.data)).catch(()=>{}); },[]);
  const del = async id => { if(!confirm('Delete?')) return; await adminApi.deletePost(id); setPosts(p=>p.filter(x=>x.id!==id)); };
  return (
    <div style={{ padding:32 }}>
      <h2 style={{ marginBottom:24 }}>Blog Posts</h2>
      <div className="card" style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.85rem' }}>
          <thead><tr>
            {['Title','Category','Published','Views','Actions'].map(h=>(
              <th key={h} style={{ padding:'12px 16px', textAlign:'left', background:'var(--surface)',
                borderBottom:'1px solid var(--border)', fontSize:'.68rem', textTransform:'uppercase',
                letterSpacing:'1px', color:'var(--text2)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {posts.map(p=>(
              <tr key={p.id} style={{ borderBottom:'1px solid var(--border)' }}>
                <td style={{ padding:'12px 16px', fontWeight:600 }}>{p.title}</td>
                <td style={{ padding:'12px 16px' }}>{p.category?.name||'—'}</td>
                <td style={{ padding:'12px 16px' }}><span className={`tag ${p.is_published?'tag-success':'tag-indigo'}`}>{p.is_published?'Live':'Draft'}</span></td>
                <td style={{ padding:'12px 16px', fontFamily:'var(--font-mono)', fontSize:'.75rem' }}>{p.views}</td>
                <td style={{ padding:'12px 16px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>del(p.id)} style={{ color:'var(--danger)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServicesAdmin() {
  const [services, setServices] = useState([]);
  useEffect(()=>{ adminApi.services().then(r=>setServices(r.data.data)).catch(()=>{}); },[]);
  const del = async id => { if(!confirm('Delete?')) return; await adminApi.deleteService(id); setServices(s=>s.filter(x=>x.id!==id)); };
  return (
    <div style={{ padding:32 }}>
      <h2 style={{ marginBottom:24 }}>Services</h2>
      <div className="card" style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.85rem' }}>
          <thead><tr>
            {['Service','Price From','Active','Actions'].map(h=>(
              <th key={h} style={{ padding:'12px 16px', textAlign:'left', background:'var(--surface)',
                borderBottom:'1px solid var(--border)', fontSize:'.68rem', textTransform:'uppercase',
                letterSpacing:'1px', color:'var(--text2)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {services.map(s=>(
              <tr key={s.id} style={{ borderBottom:'1px solid var(--border)' }}>
                <td style={{ padding:'12px 16px', fontWeight:600 }}>{s.icon} {s.title}</td>
                <td style={{ padding:'12px 16px', fontFamily:'var(--font-mono)', fontSize:'.75rem' }}>{s.price_from}</td>
                <td style={{ padding:'12px 16px' }}><span className={`tag ${s.is_active!==false?'tag-success':'tag-indigo'}`}>{s.is_active!==false?'Active':'Hidden'}</span></td>
                <td style={{ padding:'12px 16px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>del(s.id)} style={{ color:'var(--danger)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
