import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, Clock, Eye } from 'lucide-react';
import { publicApi } from '../services/api';

export default function Blog() {
  const [posts,   setPosts]   = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  const load = (q='') => {
    setLoading(true);
    publicApi.blog({ search:q, per_page:12 })
      .then(r => { setPosts(r.data.data); setLoading(false); })
      .catch(()=>setLoading(false));
  };
  useEffect(()=>load(),[]);

  const handleSearch = e => { e.preventDefault(); load(search); };

  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--navy)', minHeight:'100vh' }}>
      <section style={{ padding:'80px 0 64px', background:'var(--grad-hero)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'var(--grad-glow)', opacity:.5 }}/>
        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center' }}>
          <div className="eyebrow" style={{ justifyContent:'center' }}>Knowledge Base</div>
          <h1 style={{ color:'white', marginBottom:16 }}>Engineering &<br/><span className="text-gradient">Product Insights</span></h1>
          <p style={{ color:'var(--text2)', maxWidth:440, margin:'0 auto 32px', lineHeight:1.8 }}>
            Real lessons from building software for African businesses.
          </p>
          <form onSubmit={handleSearch} style={{ display:'flex', gap:10, maxWidth:440, margin:'0 auto', justifyContent:'center' }}>
            <div style={{ position:'relative', flex:1 }}>
              <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }}/>
              <input className="form-input" style={{ paddingLeft:40 }} placeholder="Search articles…"
                value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <div className="container" style={{ padding:'64px 24px 96px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text2)' }}>
            <div className="spinner" style={{ margin:'0 auto 16px', width:32, height:32, borderWidth:3 }}/> Loading…
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {posts.map((p,i) => (
              <motion.div key={p.id} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i*.07 }}>
                <Link to={`/blog/${p.slug}`} className="card card-hover"
                  style={{ display:'block', overflow:'hidden', height:'100%' }}>
                  <div style={{ height:200, overflow:'hidden', background:'var(--navy2)' }}>
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.title}
                          style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .5s' }}
                          onMouseEnter={e=>e.target.style.transform='scale(1.06)'}
                          onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                      : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem' }}>📝</div>
                    }
                  </div>
                  <div style={{ padding:'20px' }}>
                    {p.category && <span className="tag tag-indigo" style={{ marginBottom:12 }}>{p.category.name}</span>}
                    <h3 style={{ marginBottom:10, lineHeight:1.3 }}>{p.title}</h3>
                    <p style={{ fontSize:'.84rem', color:'var(--text2)', lineHeight:1.7, marginBottom:14 }}>{p.excerpt}</p>
                    <div style={{ display:'flex', gap:16, fontSize:'.72rem', color:'var(--text3)', fontFamily:'var(--font-mono)' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={12}/> {p.read_time} min read</span>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}><Eye size={12}/> {p.views} views</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {posts.length === 0 && (
              <div style={{ gridColumn:'span 3', textAlign:'center', padding:'80px 0', color:'var(--text2)' }}>
                No posts found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
