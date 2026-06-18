import { Link } from 'react-router-dom';
import { Code2, Mail, Phone } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy2)', borderTop: '1px solid var(--border)', paddingTop: 64 }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1.2fr', gap:48, paddingBottom:48 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:36,height:36,borderRadius:10,background:'var(--grad-indigo)',display:'flex',alignItems:'center',justifyContent:'center',color:'white' }}><Code2 size={18}/></div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem', color:'white' }}>Davion Technologies</div>
            </div>
            <p style={{ fontSize:'.875rem', color:'var(--text2)', lineHeight:1.8, maxWidth:280, marginBottom:20 }}>
              Building software that works for African businesses. Nairobi-based, continent-minded.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              {[FaGithub, FaLinkedin, FaTwitter].map((Icon,i)=>(
                <a key={i} href="#"
                  style={{ width:36,height:36,borderRadius:8,border:'1px solid var(--border2)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text2)',transition:'all .2s' }}
                  onMouseEnter={e=>Object.assign(e.currentTarget.style,{background:'var(--indigo)',borderColor:'var(--indigo)',color:'white'})}
                  onMouseLeave={e=>Object.assign(e.currentTarget.style,{background:'transparent',borderColor:'var(--border2)',color:'var(--text2)'})}>
                  <Icon size={15}/>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'.65rem',letterSpacing:'2px',textTransform:'uppercase',color:'var(--indigo2)',marginBottom:16 }}>Services</h4>
            {['Web Development','Mobile Apps','UI/UX Design','AI Solutions','E-commerce','API Development'].map(l=>(
              <div key={l}><Link to="/services" style={{ display:'block',fontSize:'.85rem',color:'var(--text2)',padding:'4px 0',transition:'color .18s' }}
                onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}>{l}</Link></div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'.65rem',letterSpacing:'2px',textTransform:'uppercase',color:'var(--indigo2)',marginBottom:16 }}>Company</h4>
            {[['About Us','/about'],['Portfolio','/portfolio'],['Blog','/blog'],['Careers','/careers'],['Contact','/contact']].map(([l,to])=>(
              <div key={l}><Link to={to} style={{ display:'block',fontSize:'.85rem',color:'var(--text2)',padding:'4px 0',transition:'color .18s' }}
                onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}>{l}</Link></div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily:'var(--font-mono)',fontSize:'.65rem',letterSpacing:'2px',textTransform:'uppercase',color:'var(--indigo2)',marginBottom:16 }}>Contact</h4>
            {[
              [Mail,'ojorodavid@gmail.com','mailto:ojorodavid@gmail.com'],
              [Phone,'+254 757451584','tel:+254757451584'],
              [FaMapMarkerAlt,'Kilimani, Nairobi, Kenya',null],
            ].map(([Icon,text,href])=>(
              <div key={text} style={{ display:'flex',gap:10,padding:'5px 0',fontSize:'.85rem',color:'var(--text2)' }}>
                <Icon size={14} color="var(--indigo2)" style={{ flexShrink:0,marginTop:3 }}/>
                {href ? <a href={href} style={{ transition:'color .2s' }} onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='var(--text2)'}>{text}</a> : <span>{text}</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid var(--border)',padding:'16px 0',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,fontSize:'.75rem',color:'var(--text3)' }}>
          <span>© 2026 Davion Technologies Ltd. Registered in Kenya.</span>
          <span>Built in Nairobi 🇰🇪 · Shipping globally</span>
        </div>
      </div>
    </footer>
  );
}
