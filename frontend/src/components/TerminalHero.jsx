import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  { prompt: '$ davion build',        output: 'Building your vision...',          color: '#00e5a0' },
  { prompt: '$ davion deploy web',   output: '✓ Web app live in production',     color: '#5b4ff5' },
  { prompt: '$ davion ai integrate', output: '✓ AI model trained & deployed',    color: '#f5a623' },
  { prompt: '$ davion mobile ios',   output: '✓ iOS app submitted to App Store', color: '#7b6ff7' },
  { prompt: '$ davion mpesa link',   output: '✓ M-Pesa STK Push live',           color: '#00e5a0' },
  { prompt: '$ davion automate',     output: '✓ Workflow saving 40 hrs/month',   color: '#f5a623' },
];

function useCycle(arr, delay = 2200) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % arr.length), delay);
    return () => clearInterval(id);
  }, [arr.length, delay]);
  return idx;
}

function TypeWriter({ text, speed = 38, onDone }) {
  const [displayed, setDisplayed] = useState('');
  const i = useRef(0);
  useEffect(() => {
    i.current = 0;
    setDisplayed('');
    const id = setInterval(() => {
      if (i.current < text.length) {
        setDisplayed(text.slice(0, i.current + 1));
        i.current++;
      } else {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return <span>{displayed}<span style={{ animation: 'blink 1s step-end infinite', opacity: 1 }}>▌</span></span>;
}

export default function TerminalHero() {
  const lineIdx  = useCycle(LINES, 2600);
  const [phase,  setPhase]  = useState('prompt'); // prompt | output
  const [history,setHistory]= useState([]);
  const line = LINES[lineIdx];

  useEffect(() => {
    setPhase('prompt');
  }, [lineIdx]);

  const handlePromptDone = () => setTimeout(() => setPhase('output'), 300);

  // Keep last 4 lines of history
  useEffect(() => {
    if (phase === 'output') {
      const timer = setTimeout(() => {
        setHistory(h => [...h.slice(-3), { ...line, id: Date.now() }]);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [phase, lineIdx]);

  return (
    <div style={{
      background: 'rgba(10,15,46,0.9)', border: '1px solid rgba(91,79,245,0.25)',
      borderRadius: 14, overflow: 'hidden', fontFamily: 'var(--font-mono)',
      fontSize: 'clamp(.72rem,.9vw,.88rem)', lineHeight: 1.7,
      boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(91,79,245,0.15)',
      maxWidth: 540, width: '100%',
    }}>
      {/* Title bar */}
      <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['#ff5f56','#ffbd2e','#27c93f'].map((c,i) => (
          <div key={i} style={{ width:11, height:11, borderRadius:'50%', background:c }} />
        ))}
        <span style={{ marginLeft:8, color:'rgba(255,255,255,0.3)', fontSize:'.65rem', letterSpacing:'1px' }}>
          davion@terminal ~ 
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', minHeight: 180 }}>
        {/* History */}
        {history.map(h => (
          <div key={h.id} style={{ marginBottom: 8, opacity: 0.45 }}>
            <div style={{ color: 'rgba(159,168,218,0.6)' }}>{h.prompt}</div>
            <div style={{ color: h.color, paddingLeft: 14 }}>{h.output}</div>
          </div>
        ))}

        {/* Active line */}
        <div style={{ color: 'var(--slate2)' }}>
          {phase === 'prompt' ? (
            <TypeWriter key={`prompt-${lineIdx}`} text={line.prompt} speed={42} onDone={handlePromptDone} />
          ) : (
            <>
              <div>{line.prompt}</div>
              <div style={{ color: line.color, paddingLeft: 14 }}>
                <TypeWriter key={`output-${lineIdx}`} text={line.output} speed={28} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
