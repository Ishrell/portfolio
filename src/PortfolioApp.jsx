import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, useReducedMotion } from "framer-motion";
import "./index.css";
import { Github, Linkedin, Mail, ExternalLink, Download, ArrowRight, Sparkles, Cpu, Server, Palette, Calendar, Clock, MessageSquare, Zap, Target, TrendingUp } from "lucide-react";

// Ultra‑fresh, full‑bleed, glass/M3‑inspired dark UI
// TailwindCSS required. All content is in one file.

const ACCENTS = [
  { name: "Amber", value: "#F59E0B" },
  { name: "Cyan", value: "#06B6D4" }, // primary
  { name: "Violet", value: "#8B5CF6" },
  { name: "Magenta", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
];

function useAccent() {
  const [accent, setAccent] = useState(() => {
    if (typeof window === "undefined") return ACCENTS[0].value;
    return localStorage.getItem("accent") || ACCENTS[0].value;
  });
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-soft", `${accent}22`);
    localStorage.setItem("accent", accent);
  }, [accent]);
  // when user calls setAccent manually, mark as locked so section auto-swaps won't override
  const setAccentRaw = (value) => {
    setAccent(value);
    try { localStorage.setItem('accent', value); } catch (e) {}
  };

  const setAccentLocked = (value) => {
    setAccentRaw(value);
    try { localStorage.setItem('accentLocked', '1'); } catch (e) {}
  };

  return { accent, setAccent: setAccentLocked, setAccentRaw };
}

// Helper: returns motion props guarded by reduced-motion preference
function useMotionProps() {
  const reduce = useReducedMotion();
  return (opts) => (reduce ? {} : opts);
}

const GLASS_ROUNDED = "rounded-[var(--radius)]";

// Lightweight context to toggle a 'lite' UI mode (disable particles/extra motion)
const LiteContext = React.createContext({ liteMode: false, setLiteMode: () => {}, backgroundsEnabled: true, setBackgroundsEnabled: () => {}, aiMode: false, setAiMode: () => {} });
const ThemeContext = React.createContext('default');
const Glass = ({ className = "", children, variant = "default" }) => {
  // subtle shadow for depth; keep glass variants for color presets
  const baseClasses = `${GLASS_ROUNDED} backdrop-blur-xl border shadow-md transition-colors transition-transform transition-shadow duration-300`;
  const variants = {
    default: "glass",
    dark: "glass-dark",
    purple: "glass-purple"
  };
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Tag = React.memo(({ children }) => (
  <motion.span 
    whileHover={{ scale: 1.05, y: -2 }}
  className="tag px-2.5 py-1 text-xs border border-purple-500/30 bg-purple-500/10 text-purple-300 cursor-pointer transition-transform transition-colors duration-300"
  >
    {children}
  </motion.span>
));

// Reusable glow overlay (used across cards for a consistent hover glow)
const Glow = React.memo(() => {
  const theme = useContext(ThemeContext);
  const isCyber = theme === 'cyberpunk';
  return (
    <>
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isCyber
            ? "radial-gradient(600px 160px at 20% 0%, rgba(0,229,255,0.28), transparent)"
            : "radial-gradient(600px 160px at 20% 0%, rgba(139,92,246,0.24), transparent)",
        }}
      />
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: isCyber
            ? "radial-gradient(420px 140px at 80% 100%, rgba(255,230,0,0.22), transparent)"
            : "radial-gradient(400px 120px at 80% 100%, rgba(236,72,153,0.18), transparent)",
        }}
      />
      {isCyber && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, transparent 40%, rgba(0,229,255,0.08) 50%, transparent 60%)",
          }}
        />
      )}
    </>
  );
});

// Full-screen AI Takeover overlay (fear factor). Blocks interaction until firewall is enabled.
const AITakeoverOverlay = ({ onDisable }) => {
  const reduce = useReducedMotion();
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'f') {
        onDisable?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDisable]);

  return (
    <div className="fixed inset-0 z-[70] pointer-events-auto">
      {/* Dark veil + pulsing red aura */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_20%,rgba(255,0,0,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-black/70" />
      <div className={`absolute inset-0 mix-blend-screen ${reduce ? '' : 'fear-scanlines'}`} />

      {/* Aggressive border alarm */}
      <div className={`absolute inset-2 rounded-[16px] border border-red-500/50 ${reduce ? '' : 'fear-alarm'}`} />

      {/* Glitch bars */}
      {!reduce && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 bg-red-600/8"
              style={{
                top: `${i * 11}%`,
                height: `${6 + (i % 3) * 2}px`,
                animation: `fear-glitch ${2 + (i % 4) * 0.4}s ${i * 137}ms infinite linear`,
              }}
            />
          ))}
        </div>
      )}

      {/* Center panel */}
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="w-[92vw] max-w-2xl">
          <div className="px-5 py-4 bg-black/70 border border-red-500/50 shadow-[0_0_60px_rgba(255,0,60,0.25)]">
            <div className="flex items-center justify-between text-red-300 font-mono text-xs">
              <span className="uppercase tracking-[0.25em]">/var/log/security</span>
              <span className="text-[10px]">ai@deck:~$</span>
            </div>
            <div className="mt-2">
              <div className="text-red-200 font-mono text-[10px] opacity-70">{'>'} intrusion report · classification: critical</div>
            </div>
          </div>

          <div className="mt-3 p-6 bg-black/70 border border-red-500/40 text-red-200 relative overflow-hidden">
            {!reduce && <div className="fear-vignette" />}

            <div className={`font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest text-red-400 ${reduce ? '' : 'fear-title'}`}>FIREWALL DISABLED</div>
            <div className="mt-1 text-sm sm:text-base text-red-300/90 font-mono">root privileges obtained · lateral movement in progress</div>

            {/* Breach progress */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-mono text-red-300/80">
                <span>{'>'} encrypting home directory…</span>
                <span className="tabular-nums" id="fear-pct">87%</span>
              </div>
              <div className="mt-2 h-3 rounded-sm bg-red-900/40 overflow-hidden border border-red-500/30">
                <div className={`h-full w-[87%] bg-[linear-gradient(45deg,rgba(255,0,60,0.9),rgba(255,60,100,0.8))] ${reduce ? '' : 'fear-stripes'}`} />
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onDisable}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-sm font-semibold bg-[linear-gradient(90deg,#FFE600,#00E5FF)] text-[#051018] ${reduce ? '' : 'fear-cta'} `}
              >
                ENABLE FIREWALL NOW
              </button>
              <div className="text-[12px] text-red-300/70 font-mono">Press F or Esc</div>
            </div>

            {/* Sub-warnings */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              {[
                'credential harvesting detected',
                'persistence: boot sector hook',
                'exfiltration channel: covert DNS',
              ].map((t, i) => (
                <div key={i} className="px-3 py-2 bg-red-900/30 border border-red-500/30 text-red-200/90">
                  {'>'} {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive 3D Card Component
const InteractiveCard = ({ children, className = "", intensity = 15 }) => {
  const cardRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { liteMode } = useContext(LiteContext);
  const disabled = reduceMotion || liteMode;
  const rafRef = useRef(0);
  const gyroActiveRef = useRef(false);
  const handleRef = useRef(null);
  const coarsePointer = typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)').matches : false;

  const handleMove = (e) => {
    if (disabled || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.setProperty('--rx', `${-py * intensity}deg`);
    cardRef.current.style.setProperty('--ry', `${px * intensity}deg`);
    cardRef.current.style.setProperty('--tx', `${px * 8}px`);
    cardRef.current.style.setProperty('--ty', `${py * 8}px`);
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.removeProperty('--rx');
    cardRef.current.style.removeProperty('--ry');
    cardRef.current.style.removeProperty('--tx');
    cardRef.current.style.removeProperty('--ty');
  };

  // Gyroscope support for mobile (coarse pointers)
  const stopGyro = () => {
    if (handleRef.current) {
      window.removeEventListener('deviceorientation', handleRef.current);
      handleRef.current = null;
    }
    gyroActiveRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    handleLeave();
  };

  const startGyro = async () => {
    if (disabled || !cardRef.current || gyroActiveRef.current) return;
    if (!coarsePointer) return; // only on touch devices
    let permitted = true;
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const res = await DeviceOrientationEvent.requestPermission().catch(() => null);
        permitted = res === 'granted';
      }
    } catch (_) {}
    if (!permitted) return;

    let pending = false;
    handleRef.current = (e) => {
      if (pending) return;
      pending = true;
      rafRef.current = requestAnimationFrame(() => {
        pending = false;
        if (!cardRef.current) return;
        const beta = (e.beta ?? 0);   // front-back tilt [-180,180]
        const gamma = (e.gamma ?? 0); // left-right tilt [-90,90]
        // Map to -1..1 with gentle clamp
        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
        const py = clamp(beta / 30, -1, 1); // up/down
        const px = clamp(gamma / 45, -1, 1); // left/right
        cardRef.current.style.setProperty('--rx', `${-py * intensity}deg`);
        cardRef.current.style.setProperty('--ry', `${px * intensity}deg`);
        cardRef.current.style.setProperty('--tx', `${px * 8}px`);
        cardRef.current.style.setProperty('--ty', `${py * 8}px`);
      });
    };
    try {
      window.addEventListener('deviceorientation', handleRef.current, { passive: true });
      gyroActiveRef.current = true;
    } catch (_) {
      // ignore
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopGyro();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group interactive-tilt will-change-transform ${className}`}
      onMouseMove={disabled ? undefined : handleMove}
      onMouseLeave={() => { if (!disabled) handleLeave(); stopGyro(); }}
      onTouchStart={() => { startGyro(); }}
      onTouchEnd={() => { setTimeout(stopGyro, 1200); }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className="relative"
        style={{
          transform: disabled
            ? undefined
            : 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translate3d(var(--tx, 0px), var(--ty, 0px), 0)',
          transition: 'transform 120ms ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Animated Progress Bar
const ProgressBar = React.memo(({ skill, percentage, color = "var(--accent)" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-purple-200 font-medium">{skill}</span>
        <span className="text-xs text-purple-300 font-semibold">{percentage}%</span>
      </div>
      <div className="h-3 bg-purple-900/30 overflow-hidden border border-purple-500/20">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full relative"
          style={{ 
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 10px ${color}40`
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute inset-0 bg-white/20"
          />
        </motion.div>
      </div>
    </div>
  );
});

// Floating Particles Background (optimized: hidden on touch / reduced motion / lite)
const FloatingParticles = () => {
  const reduceMotion = useReducedMotion();
  const { liteMode } = useContext(LiteContext);
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (reduceMotion || isTouch || liteMode) return null;
  return (
    <div className="floating-particles fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-[calc(var(--radius)/2)] ${
            i % 3 === 0 ? 'w-2 h-2 bg-purple-400/40' :
            i % 3 === 1 ? 'w-1 h-1 bg-pink-400/30' :
            'w-0.5 h-0.5 bg-blue-400/50'
          }`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 25 + 12,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};
// Typing Effect Component
const TypingEffect = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setDisplayText(text);
      setCurrentIndex(text.length);
      return;
    }
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
};

const SectionTitle = ({ icon: Icon, title, kicker }) => {
  const reduce = useReducedMotion();
  const { liteMode } = useContext(LiteContext);
  const sweep = !(reduce || liteMode);
  return (
    <div className="flex items-end justify-between gap-6 mb-6">
      <div>
        {kicker && (
          <div className="text-[12px] uppercase tracking-[0.2em] text-white/50">{kicker}</div>
        )}
        <h2 className="relative font-display tracking-tightest mt-1 text-2xl md:text-3xl font-semibold text-white flex items-center gap-3">
          {Icon ? <Icon className="size-6 text-[var(--accent)]" /> : null}
          <span className="relative">
            {title}
            {sweep && (
              <motion.span
                aria-hidden
                className="absolute left-0 right-0 -bottom-1 h-[2px]"
                initial={{ x: '-110%', opacity: 0.0 }}
                animate={{ x: ['-110%', '110%'], opacity: [0.0, 1.0, 0.0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
                style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
              />
            )}
          </span>
        </h2>
      </div>
    </div>
  );
};

const SectionContainer = ({ children, className = "" }) => (
  <div className={`max-w-6xl mx-auto px-6 w-full ${className}`}>
    {children}
  </div>
);

// Lazy mount children when they enter the viewport (simple hook + wrapper)
const LazyMount = ({ children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px' });
  return (
    <div ref={ref}>
      {inView ? children : <div style={{ minHeight: 120 }} />}
    </div>
  );
};

// Lightweight wrapper used for page sections — provides consistent snapping and spacing
const SectionBlock = ({ id, children }) => (
  <section id={id} className="snap-start snap-always w-full">
    {children}
  </section>
);

// Central internships data (used by credentials view)
const INTERNSHIPS_DATA = null; // memoized in component with useMemo

// Single internship item component (respects reduced motion)
const InternshipItem = ({ item, idx }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      key={item.company}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { y: 30, opacity: 0 }}
      whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: idx * 0.06 }}
      viewport={{ once: true }}
    >
      <InteractiveCard intensity={6}>
  <Glass className="p-6 h-full">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display tracking-tightest text-white font-semibold text-lg">{item.company}</h3>
              <div className="text-sm text-white/70">{item.role} • <span className="text-white/60">{item.dates}</span></div>
            </div>
            <div className="text-xs text-[var(--accent)] font-semibold">{item.tech.join(' • ')}</div>
          </div>

          <ul className="text-sm text-white/70 list-disc list-inside space-y-2 mb-4">
            {item.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          <div className="text-sm text-white/70">
            <strong className="text-white">Outcome:</strong> {item.outcomes}
          </div>
        </Glass>
      </InteractiveCard>
    </motion.div>
  );
};

const InternshipsList = ({ compact = false }) => (
  <div className="space-y-4">
    {(
      (() => {
        const items = [
          {
            company: "Smartbridge (SmartInternz)",
            role: "Intern — AI for Cybersecurity",
            dates: "April 2024",
            bullets: [
              "Studied and applied ML techniques for anomaly detection & threat intelligence.",
              "Hands-on with IBM QRadar SIEM, Kali Linux, MobaXterm, Python scripting and API integration.",
              "Contributed to a team AI-driven threat detection project and 10+ cybersecurity mini-projects."
            ],
            tech: ["IBM QRadar", "Kali Linux", "Python", "API Integration", "Prompt Engineering"],
            outcomes: "Contributed to a production-ready threat detection prototype and improved practical SIEM workflows."
          },
          {
            company: "Ethnus",
            role: "Trainee — MERN Full Stack",
            dates: "April 2024",
            bullets: [
              "Designed, developed and deployed web applications using MongoDB, Express, React and Node.js.",
              "Built a collaborative project management platform and completed multiple coding challenges.",
              "Participated in weekly assignments, quizzes, and a final project review with team demos."
            ],
            tech: ["MongoDB", "Express.js", "React", "Node.js", "Bootstrap"],
            outcomes: "Delivered a deployed MERN project and improved full-stack development workflows across the team."
          }
        ];
        return items.map((item, idx) => <InternshipItem key={item.company} item={item} idx={idx} />);
      })()
    )}
  </div>
);

const GridBackground = () => {
  const { liteMode } = useContext(LiteContext);
  // In Lite Mode, keep a tasteful static backdrop instead of removing entirely
  if (liteMode) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 420px at 60% 20%, var(--accent-soft), transparent), radial-gradient(640px 340px at 20% 80%, var(--accent-glow), transparent)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "80px 80px, 80px 80px",
          }}
        />
      </div>
    );
  }
  return (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="rgba(139,92,246,0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.06, 0.12, 0.06], x: [0, 30, -15, 0], y: [0, -8, 20, 0], scale: [1, 1.04, 1] }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
    className="absolute -top-28 left-1/3 w-[720px] h-[720px] blur-[140px]"
      style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
    />

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.04, 0.1, 0.04], x: [0, -20, 12, 0], y: [0, 12, -10, 0], scale: [1, 0.98, 1] }}
      transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
  className="absolute top-1/2 right-1/4 w-[520px] h-[520px] blur-[100px]"
      style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent)" }}
    />

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.06, 0.1, 0.06], x: [0, 18, -10, 0], y: [0, -18, 14, 0], rotate: [0, 120, 240] }}
      transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
  className="absolute bottom-1/4 left-1/4 w-[420px] h-[420px] blur-[80px]"
      style={{ background: "radial-gradient(closest-side, #EC4899, transparent)" }}
    />

    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
  className="absolute w-1 h-1 bg-purple-400"
        initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
        animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: [0, 0.8, 0] }}
        transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </div>
  );
};

// Vaporwave (Outrun) background: perspective grid + purple horizon + VHS scanlines
const VaporwaveBackground = () => {
  const reduce = useReducedMotion();
  const { liteMode } = useContext(LiteContext);
  const [t, setT] = useState(0);
  const isStatic = reduce || liteMode;
  useEffect(() => {
    if (isStatic) return;
    const id = setInterval(() => setT((v) => (v + 1) % 10000), 60);
    return () => clearInterval(id);
  }, [isStatic]);
  return (
  <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Sky gradient + horizon glow */}
      <div className="absolute inset-0" style={{
        background:
          'linear-gradient(180deg, #04040A 0%, #0A0820 40%, #4B2AA9 60%, #F72585 66%, #FFA54D20 70%, transparent 80%)'
      }}/>

      {/* Aurora-like drifting glow */}
      {isStatic ? null : (
        <motion.div
          className="absolute inset-x-0 top-0 h-2/3"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.35, 0.2], x: [-20, 10, -15] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(70% 30% at 60% 20%, rgba(139,92,246,0.25), transparent), radial-gradient(40% 20% at 30% 10%, rgba(236,72,153,0.18), transparent)' }}
        />
      )}

      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 120 }).map((_, i) => (
          <circle key={i} cx={`${(i * 83) % 100}%`} cy={`${(i * 47) % 100}%`} r={(i % 7 === 0 ? 1.2 : 0.6)} fill={i % 5 === 0 ? '#FDE68A' : '#E0E7FF'} opacity={0.4} />
        ))}
      </svg>

      {/* Sun bands at horizon */}
      {isStatic ? (
        <div className="absolute left-1/2 -translate-x-1/2 top-28 w-[360px] h-[360px] rounded-full"
          style={{
            background: 'radial-gradient(closest-side, rgba(247,37,133,0.5), transparent 70%)',
            WebkitMaskImage: 'repeating-linear-gradient( to bottom, black 0 6px, transparent 6px 10px )',
            maskImage: 'repeating-linear-gradient( to bottom, black 0 6px, transparent 6px 10px )',
            filter: 'blur(1px)'
          }}
        />
      ) : (
        <motion.div className="absolute left-1/2 -translate-x-1/2 top-28 w-[360px] h-[360px] rounded-full"
          initial={{ y: -8, opacity: 0.7 }}
          animate={{ y: [-8, 8, -8], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(closest-side, rgba(247,37,133,0.5), transparent 70%)',
            WebkitMaskImage: 'repeating-linear-gradient( to bottom, black 0 6px, transparent 6px 10px )',
            maskImage: 'repeating-linear-gradient( to bottom, black 0 6px, transparent 6px 10px )',
            filter: 'blur(1px)'
          }}
        />
      )}

      {/* Perspective grid (SVG with vanishing point) */}
      <div className="absolute inset-x-0 bottom-0 h-[68%]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 680" preserveAspectRatio="none">
          <defs>
            <linearGradient id="vw-laser" x1="0" x2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="vw-chroma" x1="0" x2="1">
              <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FF0040" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {(() => {
            const elements = [];
            const W = 1000; const H = 680;
            const horizonY = 180; // horizon line
            const bottomY = H;
            const vanishX = W / 2;
            const verticalCount = 20;
            const spacing = W / (verticalCount - 1);
            // Vertical lines converging to vanishing point
            for (let i = 0; i < verticalCount; i++) {
              const xBottom = i * spacing;
              const xStart = xBottom;
              const xEnd = vanishX;
              elements.push(
                <line key={`v-main-${i}`} x1={xStart} y1={bottomY} x2={xEnd} y2={horizonY} stroke="url(#vw-laser)" strokeWidth="1" opacity="0.5" />
              );
              elements.push(
                <line key={`v-chroma-${i}`} x1={xStart} y1={bottomY} x2={xEnd} y2={horizonY} stroke="url(#vw-chroma)" strokeWidth="1" opacity="0.35" />
              );
            }
            // Horizontal grid lines, exponentially closer to horizon
            const rows = 24;
            for (let j = 1; j <= rows; j++) {
              const tRow = (j + (isStatic ? 0 : (t/6)%1)) / rows; // animate upward motion
              // ease-in power to bunch near horizon
              const p = 1.6;
              const y = horizonY + (bottomY - horizonY) * Math.pow(tRow % 1, p);
              elements.push(
                <line key={`h-main-${j}`} x1={0} y1={y} x2={W} y2={y} stroke="url(#vw-laser)" strokeWidth="1" opacity="0.5" />
              );
              elements.push(
                <line key={`h-chroma-${j}`} x1={0} y1={y} x2={W} y2={y} stroke="url(#vw-chroma)" strokeWidth="1" opacity="0.35" />
              );
            }
            return elements;
          })()}
        </svg>
      </div>

      {/* Shooting stars */}
      {!isStatic && (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-24"
              style={{ top: `${10 + i*12}%`, left: '110%', background: 'linear-gradient(90deg, rgba(255,255,255,0.8), transparent)' }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [-window.innerWidth * (0.6 + i*0.05), 0], opacity: [0.0, 1.0, 0.0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeIn', delay: i * 1.2 }}
            />
          ))}
        </>
      )}

      {/* Diagonal white sweep for retro glare */}
      {!isStatic && (
        <motion.div
          className="absolute -inset-10 rotate-12"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
          initial={{ x: '-120%' }}
          animate={{ x: ['-120%', '120%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* VHS scanlines + vignette */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)',
        opacity: 0.06
      }}/>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(120% 80% at 50% 20%, transparent 40%, rgba(0,0,0,0.6) 100%)'
      }}/>
    </div>
  );
};

// Cyberdeck HUD background: cyan/yellow neon, concentric scanners, subtle code rain
const CyberpunkBackground = () => {
  const reduce = useReducedMotion();
  const { liteMode, aiMode } = useContext(LiteContext);
  const isStatic = reduce || liteMode;
  return (
  <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Split neon backdrop */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(140deg, #031018 40%, #041520 60%)'
      }}/>

      {/* Volumetric fog blobs for eerie ambience */}
      {isStatic ? (
        <>
          <div className="absolute -top-24 -left-10 w-[60vw] h-[60vh] blur-[80px] opacity-15" style={{ background: 'radial-gradient(closest-side, #00E5FF22, transparent)' }}/>
          <div className="absolute bottom-[-8vh] right-[-10vw] w-[50vw] h-[50vh] blur-[90px] opacity-15" style={{ background: 'radial-gradient(closest-side, #FFE60022, transparent)' }}/>
        </>
      ) : (
        <>
          <motion.div className="absolute -top-24 -left-10 w-[60vw] h-[60vh] blur-[80px]" style={{ background: 'radial-gradient(closest-side, #00E5FF22, transparent)' }} initial={{ opacity: 0.1, x: -40, y: -20 }} animate={{ opacity: [0.1, 0.2, 0.1], x: [-40, 20, -30], y: [-20, 10, -10] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}/>
          <motion.div className="absolute bottom-[-8vh] right-[-10vw] w-[50vw] h-[50vh] blur-[90px]" style={{ background: 'radial-gradient(closest-side, #FFE60022, transparent)' }} initial={{ opacity: 0.1, x: 30, y: 10 }} animate={{ opacity: [0.1, 0.22, 0.1], x: [30, -10, 20], y: [10, -15, 12] }} transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}/>
        </>
      )}

      {/* Scanner rings */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ring" cx="50%" cy="35%" r="60%">
            <stop offset="60%" stopColor="transparent"/>
            <stop offset="70%" stopColor="#00E5FF66"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
        {Array.from({ length: 6 }).map((_, i) => (
          isStatic ? (
            <circle key={i} cx="50%" cy="35%" r={`${20 + i*12}%`} fill="none" stroke="url(#ring)" strokeWidth="1" />
          ) : (
            <motion.circle key={i} cx="50%" cy="35%" r={`${20 + i*12}%`} fill="none" stroke="url(#ring)" strokeWidth="1"
              initial={{ opacity: 0.15 }}
              animate={{ opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 6 + i*0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )
        ))}
      </svg>

      {/* Angular HUD lines */}
      <div className="absolute inset-0 mix-blend-screen">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute h-px w-1/2"
            style={{
              top: `${(i*11)%100}%`, left: `${(i*23)%100}%`,
              background: i % 2 ? '#00E5FF33' : '#FFE60033',
              transform: `rotate(${(i*17)%180}deg)`
            }}
          />
        ))}
      </div>

      {/* Code rain (very subtle) */}
      {!isStatic && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div key={i} className="absolute text-[10px] font-mono text-[#00E5FF55]" style={{ left: `${(i*41)%100}%` }}
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: ['-10%', '110%'], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 6 + (i%5), repeat: Infinity, ease: 'linear', delay: (i%7)*0.4 }}
            >
              {Array.from({ length: 12 }).map((__, j) => (
                <div key={j}>{(i+j)%3===0? '▓▒░' : (i+j)%3===1? '▌▖▗' : '</>'}</div>
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {/* Diagonal scan sweep */}
      {!isStatic && (
        <motion.div className="absolute -inset-10 rotate-12 mix-blend-screen" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.08), transparent)' }} initial={{ x: '-120%' }} animate={{ x: ['-120%', '120%'] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} />
      )}

      {/* AI takeover overlays */}
      {aiMode && (
        <>
          {/* Glitch bars */}
          {!isStatic && Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[2px] w-2/3 left-1/6 bg-red-500/30 mix-blend-screen"
              initial={{ y: Math.random()*window.innerHeight, x: -80, opacity: 0 }}
              animate={{ x: [ -80, 40, -40, 80, -120 ], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: 'linear', delay: i*0.12 }}
            />
          ))}
          {/* Faint face outline suggestion (ghost-in-the-shell vibe) */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute left-1/2 top-1/3 -translate-x-1/2" width="420" height="320" viewBox="0 0 420 320">
              <g opacity="0.08" stroke="#FF3355" fill="none">
                <ellipse cx="210" cy="160" rx="120" ry="150" />
                <path d="M110,130 C140,110 280,110 310,130" />
                <path d="M150,200 C190,240 230,240 270,200" />
              </g>
            </svg>
          </div>
          {/* Center distortion */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(400px 240px at 50% 40%, rgba(255,0,60,0.08), transparent)' }} />
        </>
      )}

      {/* Scanline + vignette */}
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px)', opacity: 0.05 }}/>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 50% 20%, transparent 40%, rgba(0,0,0,0.75) 100%)' }}/>
    </div>
  );
};

// CRT overlay and curvature effect (applied in Cyberdeck theme)
const CRTEffect = () => {
  const reduce = useReducedMotion();
  const { liteMode } = useContext(LiteContext);
  const isStatic = reduce || liteMode;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      {/* Scanlines */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 3px)' }} />
      {/* Phosphor triads */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,0,0,0.35) 0 1px, rgba(0,255,0,0.35) 1px 2px, rgba(0,128,255,0.35) 2px 3px, transparent 3px 4px)' }} />
      {/* Subtle flicker */}
      {!isStatic && (
        <motion.div className="absolute inset-0" initial={{ opacity: 0.02 }} animate={{ opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} style={{ background: 'black' }} />
      )}
      {/* Vignette + curvature illusion */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 50% 20%, transparent 50%, rgba(0,0,0,0.45) 100%)' }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(120% 60% at 50% -10%, rgba(255,255,255,0.05), transparent 60%)',
        WebkitMaskImage: 'radial-gradient(100% 100% at 50% 50%, black 60%, transparent 100%)',
        maskImage: 'radial-gradient(100% 100% at 50% 50%, black 60%, transparent 100%)'
      }} />
    </div>
  );
};

const Dock = ({ active }) => (
  <Glass variant="purple" className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 px-3 py-2 items-center gap-1 z-40">
    {[
      { href: "#about", label: "About" },
      { href: "#projects", label: "Projects" },
      { href: "#skills", label: "Skills" },
      { href: "#credentials", label: "Credentials" },
      { href: "#leadership", label: "Leadership" },
      { href: "#education", label: "Education" },
      { href: "#contact", label: "Contact" },
    ].map((item) => (
      <a
        key={item.href}
        href={item.href}
                className={`px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition ${active === item.href.slice(1) ? 'bg-white/10 text-white scale-105' : ''}`}
      >
        {item.label}
      </a>
    ))}
  </Glass>
);

const MobileNav = ({ open, onClose, active, accent, setAccent, setAccentRaw, theme, setTheme, setLiteMode }) => {
  const reduceMotion = useReducedMotion();
  const drawerRef = React.useRef(null);
  const { backgroundsEnabled, setBackgroundsEnabled, aiMode, setAiMode } = useContext(LiteContext);

  // focus trap + Esc to close when open
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first && first.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && focusable.length) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mobile-nav-overlay"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mobile-nav-drawer"
            id="mobile-drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={reduceMotion ? {} : { x: 300 }}
            animate={reduceMotion ? {} : { x: 0 }}
            exit={reduceMotion ? {} : { x: 300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="font-semibold text-lg" id="mobile-nav-title">Menu</div>
              <button onClick={onClose} className="px-2 py-2 bg-white/5">Close</button>
            </div>
            <nav className="flex flex-col">
              {[
                { href: "#about", label: "About" },
                { href: "#projects", label: "Projects" },
                { href: "#skills", label: "Skills" },
                { href: "#credentials", label: "Credentials" },
                { href: "#leadership", label: "Leadership" },
                { href: "#education", label: "Education" },
                { href: "#contact", label: "Contact" },
              ].map((i) => (
                <a
                  key={i.href}
                  href={i.href}
                  onClick={onClose}
                  className={`text-white/90 hover:bg-white/6 ${active === i.href.slice(1) ? 'bg-white/6 rounded-lg' : ''}`}
                >
                  {i.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 border-t border-white/6 pt-4">
              <div className="text-xs text-white/70 mb-2 flex items-center gap-2">
                <Palette className="size-4" /> Accent
              </div>
              <div className="flex gap-2 flex-wrap">
                {ACCENTS.map((c) => (
                  <button
                    key={c.value}
                    aria-label={c.name}
                    onClick={() => { try { setAccent(c.value); } catch(e){}; onClose(); }}
                    className="h-8 w-8 border border-white/10 rounded-md"
                    style={{ background: c.value, outline: accent === c.value ? `2px solid ${c.value}` : 'none' }}
                  />
                ))}
                <button
                  aria-label="Auto accents"
                  title="Auto accents"
                  onClick={() => { try { localStorage.removeItem('accentLocked'); } catch(e){}; try { setAccentRaw && setAccentRaw(localStorage.getItem('accent') || ACCENTS[2].value); } catch(e){}; onClose(); }}
                  className="h-8 w-8 border border-white/10 flex items-center justify-center text-xs text-white/80"
                >
                  A
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme(theme === 'cyberpunk' ? 'default' : 'cyberpunk')}
                  className={`px-3 py-2 rounded-md text-sm font-semibold ${theme==='cyberpunk' ? 'bg-[#00E5FF1a] text-[#00E5FF]' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                >
                  {theme==='cyberpunk' ? 'Disable Cyberdeck' : 'Enable Cyberdeck'}
                </button>
                <button
                  onClick={() => setLiteMode?.(v => !v)}
                  className="px-3 py-2 rounded-md text-sm bg-white/5 text-white/80 hover:bg-white/10"
                >
                  Toggle Lite
                </button>
                <button
                  onClick={() => setAiMode(v => !v)}
                  className={`col-span-2 px-3 py-2 rounded-md text-sm ${aiMode ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                >
                  {aiMode ? 'Firewall Off' : 'Firewall ON'}
                </button>
                <button
                  onClick={() => setBackgroundsEnabled(v => !v)}
                  className={`col-span-2 px-3 py-2 rounded-md text-sm ${backgroundsEnabled ? 'bg-white/10 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                >
                  Backgrounds: {backgroundsEnabled ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AccentPicker = ({ accent, setAccent, onAuto }) => (
  <Glass variant="dark" className="fixed top-6 right-6 p-3">
    <div className="flex items-center gap-2 text-white/70 text-xs mb-2">
      <Palette className="size-4" /> Accent
    </div>
    <div className="flex gap-2">
      {ACCENTS.map((c) => (
        <button
          key={c.value}
          aria-label={c.name}
          onClick={() => setAccent(c.value)}
          className="h-6 w-6 border border-white/20 hover:scale-[1.05] transition"
          style={{
            background: c.value,
            outline: accent === c.value ? `2px solid ${c.value}` : "none",
            boxShadow: accent === c.value ? `0 0 0 3px ${c.value}55` : "none",
          }}
        />
      ))}
      <button
        aria-label="Auto accents"
        title="Auto accents"
        onClick={() => { try { localStorage.removeItem('accentLocked'); } catch(e){}; if(onAuto) onAuto(); else alert('Accent auto mode enabled — sections will control accents.'); }}
        className="h-6 w-6 border border-white/20 flex items-center justify-center text-xs text-white/80 hover:scale-[1.05] transition"
      >
        A
      </button>
    </div>
  </Glass>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="pt-20 md:pt-28 pb-16 md:pb-24 relative overflow-hidden">
      <motion.div 
        style={{ y, opacity }}
      >
        <SectionContainer>
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className=" lg:col-span-7">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
                            <h1 className="font-display tracking-tightest text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                 <span className="gradient-text">Pushya Saie Raag Enuga</span>
               </h1>

              <div className="h-8 md:h-10 flex items-center">
                <TypingEffect 
                  text="AI/ML researcher & HCI‑minded full‑stack developer — shipped 8 projects approved by Experts; published medical‑AI paper."
                  className="text-white/70 text-lg max-w-2xl"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-7 hero-actions flex flex-wrap items-center gap-3"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 text-black bg-[var(--accent)] hover:brightness-110 transition font-medium shadow-md"
              >
                Explore Projects <ArrowRight className="size-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="/resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white/90 hover:bg-white/10 transition backdrop-blur-sm"
              >
                <Download className="size-4" /> Resume
              </motion.a>
              <div className="flex gap-2 ml-2">
                {[
                  { href: "https://github.com/Ishrell/", icon: Github, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/pushya-saie-raag-e-134960272/", icon: Linkedin, label: "LinkedIn" },
                  { href: "mailto:pushyasaie@gmail.com", icon: Mail, label: "Email" }
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                    href={social.href}
                    target={social.label !== "Email" ? "_blank" : undefined}
                    rel={social.label !== "Email" ? "noreferrer" : undefined}
                    className="p-3 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-300"
                  >
                    <social.icon className="size-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
                         <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="mt-6 flex flex-wrap gap-2"
             >
               <Tag>MERN Certified • Ethnus</Tag>
               <Tag>IBM QRadar AI</Tag>
               <Tag>Kali Linux</Tag>
               <Tag>Cybersecurity</Tag>
               <Tag>AI/ML Research</Tag>
             </motion.div>
          </div>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <InteractiveCard intensity={12}>
              <Glass variant="purple" className="group p-8 relative overflow-hidden">
                <Glow />
                <motion.div
                  className="absolute -top-10 -right-10 w-20 h-20 opacity-20"
                  style={{ background: "var(--accent)" }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                <div className="grid grid-cols-2 gap-6 text-sm relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 bg-white/5"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">TOEFL</div>
                    <div className="text-white text-2xl font-bold">108</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 bg-white/5"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">IELTS</div>
                    <div className="text-white text-2xl font-bold">8.0</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 bg-white/5 col-span-2"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">Open to</div>
                    <div className="text-white font-medium">AI/ML • Full‑Stack • Product</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 bg-white/5 col-span-2"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">Location</div>
                    <div className="text-white font-medium">Texas State University</div>
                  </motion.div>
                </div>
              </Glass>
            </InteractiveCard>
          </motion.div>
        </div>
        </SectionContainer>
      </motion.div>
    </section>
  );
};

const SkillCard = ({ title, icon: Icon, children }) => (
  <Glass className="p-5 hover:bg-white/7 transition">
    <div className="flex items-center gap-3 mb-2">
      {Icon ? <Icon className="size-5 text-[var(--accent)]" /> : null}
      <h3 className="font-display tracking-tightest font-medium text-white">{title}</h3>
    </div>
    <p className="font-sans text-sm text-white/70 leading-relaxed">{children}</p>
  </Glass>
);

const Projects = () => {
  const projects = useMemo(() => [
    {
      title: "Bone Cancer Detection (CNN)",
      href: "https://ieeexplore.ieee.org/document/10941267",
      image: "🔬",
      tech: ["Python", "TensorFlow", "CNN", "Medical AI"],
      status: "Completed",
      problem: "Radiologists needed an automated assist for early bone cancer detection from X‑rays to improve triage.",
      solution: "Built a convolutional model with augmentation, dropout, and explainability overlays for clinical review.",
      outcome: "Published IEEE paper; improved detection sensitivity by 12% in retrospective testing."
    },
    {
      title: "Spanish Learning App with Telugu Translation",
      image: "🇪🇸",
      tech: ["React", "Node.js", "MongoDB", "Express", "Translation API"],
      status: "Completed",
      problem: "Telugu speakers lacked localized Spanish learning materials integrated with their native language.",
  solution: "Built a MERN app that offers guided lessons with Telugu translations and spaced repetition.",
      outcome: "Deployed to student testers; positive feedback and 40% faster vocabulary retention in pilot study."
    },
    {
      title: "Java Learning App with Integrated IDE",
      image: "☕",
      tech: ["React", "Java", "WebAssembly", "CodeMirror", "Compiler API"],
      status: "In Progress",
      problem: "Learners faced friction switching between editor and compiler while learning Java online.",
      solution: "Created an in-browser IDE with real-time compilation and inline hints to shorten feedback loops.",
      outcome: "Early testers report faster iteration; public beta planned."
    },
    {
      title: "Hyper Spectral Imaging (ISRO RESPOND)",
      image: "🛰️",
      tech: ["Python", "PyTorch", "Transformers", "Remote Sensing"],
      status: "In Progress",
      problem: "Existing classifiers underperformed on Odisha hyperspectral datasets due to domain shifts.",
      solution: "Built a CNN‑Transformer hybrid with targeted preprocessing and augmentation for spectral bands.",
      outcome: "+18% accuracy in held-out evaluation and stakeholder presentations delivered."
    },
    {
      title: "LLM Localization on USB",
      image: "💾",
      tech: ["Python", "HuggingFace", "Ollama", "Edge Computing"],
      status: "Active",
      problem: "Teams needed a portable LLM setup for offline demos without heavy infra.",
      solution: "Packaged an LLM runtime and model artifacts to run from a USB with optional GPU offload.",
      outcome: "Delivered portable demos and internal tooling for quick client trials."
    },
    {
      title: "AI Weapon Detection",
      image: "🛡️",
      tech: ["Python", "EfficientDet", "NAS", "Real-time"],
      status: "Completed",
  problem: "Need for fast, accurate detection of weapons in video streams for safety systems.",
      solution: "Used EfficientDet and NAS for a compact, fast model tuned for low-latency inference.",
      outcome: "Achieved real-time detection with strong precision in test scenarios."
    }
  ], []);

  return (
    <section id="projects" className="py-14 md:py-20">
      <SectionContainer>
        <SectionTitle icon={Sparkles} title="Selected Projects" kicker="work" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            return (
              <motion.div
                key={project.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                             <InteractiveCard intensity={10}>
                <Glass className="group p-8 relative overflow-hidden h-full">
                   <Glow />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl mb-3">{project.image}</div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`px-3 py-1 rounded-[calc(var(--radius)/1.6)] text-xs font-medium ${
                          project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {project.status}
                      </motion.div>
                    </div>
                    
                    <h3 className="font-display tracking-tightest text-white font-semibold text-lg mb-3 flex items-center gap-2">
                      {project.title}
                      {project.href && (
                        <motion.a
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 text-sm"
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="size-4" />
                        </motion.a>
                      )}
                    </h3>
                    
                    <div className="project-body mb-4">
                      <div className="mb-2"><strong>Problem:</strong> {project.problem}</div>
                      <div className="mb-2"><strong>Solution:</strong> {project.solution}</div>
                      <div className="mb-2"><strong>Outcome:</strong> {project.outcome}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </div>
                  </div>
                </Glass>
              </InteractiveCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <InteractiveCard>
            <Glass className="p-8">
              <h3 className="font-display tracking-tightest text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Zap className="size-6 text-[var(--accent)]" />
                Other Highlights
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-display tracking-tightest text-white/80 font-medium">Research Projects</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--accent)]" />
                      Quantum‑Resistant Digital Signatures
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--accent)]" />
                      Emotion‑Based Lighting (Feelbright)
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-display tracking-tightest text-white/80 font-medium">Applications</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-[calc(var(--radius)/2)] bg-[var(--accent)]" />
                      AI Security Dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      MERN Project Management Tool
                    </li>
                  </ul>
                </div>
              </div>
            </Glass>
          </InteractiveCard>
        </motion.div>
      </SectionContainer>
    </section>
  );
};

const Internships = () => {
  // (no-op here; replaced by INTERNSHIPS_DATA + InternshipsList below)
  return null;
};

// InternCerts: combined view of internships + certifications
const InternCerts = () => {
  const certs = [
    { title: "MERN Stack Certification", issuer: "Ethnus", icon: "🔧", category: "Full Stack Development", status: "Certified" },
    { title: "IBM QRadar AI Certification", issuer: "IBM", icon: "🤖", category: "Cybersecurity & AI", status: "Certified" },
    { title: "Kali Linux Certification", issuer: "Offensive Security", icon: "🐧", category: "Cybersecurity", status: "Certified" }
  ];

  return (
    <section id="interncerts" className="py-14 md:py-20">
      <SectionContainer>
        <SectionTitle icon={Target} title="Credentials" kicker="credentials" />

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-display tracking-tightest text-white font-medium mb-4">Industry Internships</h4>
            <div className="space-y-4">
              <InternshipsList />
            </div>
          </div>

          <div>
            <h4 className="font-display tracking-tightest text-white font-medium mb-4">Certifications</h4>
            <div className="grid md:grid-cols-1 gap-4">
              {certs.map((cert, idx) => (
                <motion.div
                  key={cert.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.06 }}
                  viewport={{ once: true }}
                >
                  <InteractiveCard intensity={4}>
                    <Glass className="group p-4 relative overflow-hidden">
                      <Glow />
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-2xl" aria-hidden>{cert.icon}</div>
                        <div className="px-2 py-1 rounded-[calc(var(--radius)/1.6)] text-xs font-medium bg-green-500/20 text-green-400">{cert.status}</div>
                      </div>
                      <h3 className="font-display tracking-tightest text-white font-semibold text-lg">{cert.title}</h3>
                      <p className="text-sm text-white/70">{cert.issuer} • {cert.category}</p>
                      <div className="mt-3">
                        <Tag>{cert.category}</Tag>
                      </div>
                    </Glass>
                  </InteractiveCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

const Skills = () => {
  const skillsData = useMemo(() => [
    { category: "Full Stack Development", icon: Server, skills: [
      { name: "React", percentage: 95 },
      { name: "Node.js", percentage: 90 },
      { name: "MongoDB", percentage: 85 },
      { name: "Express", percentage: 88 }
    ]},
    { category: "AI & ML", icon: Cpu, skills: [
      { name: "TensorFlow", percentage: 92 },
      { name: "PyTorch", percentage: 85 },
      { name: "HuggingFace", percentage: 88 },
      { name: "Computer Vision", percentage: 90 }
    ]},
    { category: "Cybersecurity", icon: Zap, skills: [
      { name: "IBM QRadar", percentage: 90 },
      { name: "Kali Linux", percentage: 88 },
      { name: "Penetration Testing", percentage: 85 },
      { name: "Network Security", percentage: 87 }
    ]}
  ], []);

  return (
    <section id="skills" className="py-14 md:py-20">
      <SectionContainer>
        <SectionTitle icon={Cpu} title="Skills" kicker="capabilities" />
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {skillsData.map((category, index) => {
            const reduceMotionLocal = useReducedMotion();
            return (
              <motion.div
                key={category.category}
                initial={reduceMotionLocal ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                whileInView={reduceMotionLocal ? undefined : { y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <InteractiveCard intensity={8}>
                  <Glass variant="purple" className="group p-6 h-full relative overflow-hidden">
                    <Glow />
                    <div className="flex items-center gap-3 mb-6">
                      <category.icon className="size-6 text-[var(--accent)]" />
                      <h3 className="font-display tracking-tightest font-semibold text-white text-lg">{category.category}</h3>
                    </div>
                    <div className="space-y-4">
                      {category.skills.map((skill) => (
                        <ProgressBar 
                          key={skill.name}
                          skill={skill.name} 
                          percentage={skill.percentage}
                        />
                      ))}
                    </div>
                  </Glass>
                </InteractiveCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <InteractiveCard>
            <Glass className="p-8">
              <h3 className="font-display tracking-tightest text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Target className="size-6 text-[var(--accent)]" />
                Additional Expertise
              </h3>
                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="space-y-3">
                   <h4 className="font-display tracking-tightest text-white/80 font-medium">Frontend</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>React</Tag>
                     <Tag>Next.js</Tag>
                     <Tag>TailwindCSS</Tag>
                     <Tag>TypeScript</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="font-display tracking-tightest text-white/80 font-medium">Backend</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>Node.js</Tag>
                     <Tag>Express</Tag>
                     <Tag>MongoDB</Tag>
                     <Tag>Java</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="font-display tracking-tightest text-white/80 font-medium">AI/ML</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>Transformers</Tag>
                     <Tag>CNNs</Tag>
                     <Tag>OpenAI API</Tag>
                     <Tag>LangChain</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="font-display tracking-tightest text-white/80 font-medium">Cybersecurity</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>IBM QRadar</Tag>
                     <Tag>Kali Linux</Tag>
                     <Tag>Penetration Testing</Tag>
                     <Tag>Network Security</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="font-display tracking-tightest text-white/80 font-medium">Education Tech</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>Language Learning</Tag>
                     <Tag>Interactive IDE</Tag>
                     <Tag>Translation APIs</Tag>
                     <Tag>WebAssembly</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="font-display tracking-tightest text-white/80 font-medium">Tools & Design</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>Blender</Tag>
                     <Tag>Adobe CC</Tag>
                     <Tag>Git</Tag>
                     <Tag>Docker</Tag>
                     <Tag>Microsoft Word</Tag>
                     <Tag>Microsoft Excel</Tag>
                     <Tag>Microsoft PowerPoint</Tag>
                     <Tag>Microsoft OneNote</Tag>
                     <Tag>Canva</Tag>
                   </div>
                 </div>
               </div>
            </Glass>
          </InteractiveCard>
        </motion.div>
      </SectionContainer>
    </section>
  );
};

const Certifications = () => {
  const certifications = useMemo(() => [
    {
      title: "MERN Stack Certification",
      issuer: "Ethnus",
      icon: "🔧",
      category: "Full Stack Development",
      status: "Certified"
    },
    {
      title: "IBM QRadar AI Certification",
      issuer: "IBM",
      icon: "🤖",
      category: "Cybersecurity & AI",
      status: "Certified"
    },
    {
      title: "Kali Linux Certification",
      issuer: "Offensive Security",
      icon: "🐧",
      category: "Cybersecurity",
      status: "Certified"
    },
    {
      title: "Network Security",
      issuer: "VIT",
      icon: "🔒",
      category: "Cybersecurity",
      status: "Certified"
    },
    {
      title: "Blender Certification",
      issuer: "VIT",
      icon: "🎨",
      category: "Design & 3D",
      status: "Certified"
    },
    {
      title: "Economics Certification",
      issuer: "VIT",
      icon: "📊",
      category: "Business",
      status: "Certified"
    }
  ], []);

  return (
    <section id="certifications" className="py-14 md:py-20">
      <SectionContainer>
        <SectionTitle icon={Target} title="Certifications" kicker="credentials" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => {
            const reduceMotionLocal = useReducedMotion();
            return (
            <motion.div
              key={cert.title}
              initial={reduceMotionLocal ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              whileInView={reduceMotionLocal ? undefined : { y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
                            <InteractiveCard intensity={4}>
                              <Glass className="group p-4 relative overflow-hidden">
                                <Glow />
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{cert.icon}</div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="px-2 py-1 rounded-[calc(var(--radius)/1.6)] text-xs font-medium bg-green-500/20 text-green-400"
                    >
                      {cert.status}
                    </motion.div>
                  </div>
                  
                  <h3 className="font-display tracking-tightest text-white font-semibold text-lg mb-2">{cert.title}</h3>
                  <p className="font-sans text-white/60 text-sm mb-3">{cert.issuer}</p>
                  <div className="flex items-center gap-2">
                    <Tag>{cert.category}</Tag>
                  </div>
                </Glass>
              </InteractiveCard>
            </motion.div>
          );
        })}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <InteractiveCard>
            <Glass className="p-8">
              <h3 className="font-display tracking-tightest text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Zap className="size-6 text-[var(--accent)]" />
                Professional Development
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-display tracking-tightest text-white/80 font-medium">Technical Expertise</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-[calc(var(--radius)/2)] bg-[var(--accent)]" />
                      Full Stack MERN Development
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      AI-Powered Cybersecurity
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      Penetration Testing & Security
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-display tracking-tightest text-white/80 font-medium">Additional Skills</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      3D Modeling & Design
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      Business & Economics
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      Educational Technology
                    </li>
                  </ul>
                </div>
              </div>
            </Glass>
          </InteractiveCard>
        </motion.div>
      </SectionContainer>
    </section>
  );
};

const Leadership = () => (
  <section id="leadership" className="py-14 md:py-20">
  <SectionContainer>
      <SectionTitle title="Leadership" kicker="impact" />
            <Glass className="group p-6 relative overflow-hidden">
              <Glow />
        <h3 className="font-display tracking-tightest text-white font-medium mb-3">AR/VR Club — Co‑Founder & VP</h3>
        <p className="text-sm text-white/70 mb-4">Co‑Founder (2022) & Vice President (2023–2024). Built the club from an idea into a campus-wide program demonstrating AR/VR for education, healthcare, and design.</p>
        <ul className="list-disc list-inside text-sm text-white/70 space-y-2">
          <li><strong>Events & Reach:</strong> Organized 13+ hands-on workshops and 6 speaker series, reaching 3,500+ attendees from students, faculty, and industry.</li>
          <li><strong>Flagship Programs:</strong> "VR in Education" workshop series (6 sessions), "Healthcare VR Hackathon" (top 3 prototypes piloted with local clinic partners).</li>
          <li><strong>Partnerships & Funding:</strong> Secured partnerships with 4 industry labs and obtained ₹150,000 in sponsorships/equipment grants to build an on-campus XR lab.</li>
          <li><strong>Outcomes:</strong> 3 student projects moved to incubation — including an accessibility-focused VR training tool for caregivers; one project accepted to a regional tech symposium.</li>
          <li><strong>Mentorship & Growth:</strong> Ran a mentorship program pairing 20+ beginners with experienced student mentors; improved participant competency (pre/post survey) by ~40% on average.</li>
          <li><strong>Operations:</strong> Established reproducible workshop curriculum, onboarding guides, and partner liaison templates that reduced setup time by ~60%.</li>
        </ul>
      </Glass>
  </SectionContainer>
  </section>
);

const Education = () => (
  <section id="education" className="py-14 md:py-20">
    <SectionContainer>
      <SectionTitle title="Education" kicker="foundation" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Glass className="group p-6 relative overflow-hidden">
          <Glow />
          <h3 className="font-display tracking-tightest text-white font-medium">M.S. Computer Science</h3>
          <p className="font-sans text-sm text-white/70 mt-1">Texas State University — Aug 2025 – present</p>
          <p className="font-sans text-sm text-white/70 mt-2">Focus: Medical imaging, hyperspectral analysis, and edge AI deployment. Relevant coursework: Advanced Computer Vision, Deep Learning, Distributed Systems.</p>
          <div className="mt-3 text-sm text-white/70">
            <div>Activities: Ongoing</div>
          </div>
        </Glass>

  <Glass className="group p-6 relative overflow-hidden">
          <Glow />
          <h3 className="font-display tracking-tightest text-white font-medium">B.Tech — Computer Science</h3>
          <p className="font-sans text-sm text-white/70 mt-1">Vellore Institute of Technology — May 2025</p>
          <p className="font-sans text-sm text-white/70 mt-2">Major projects: Java learning platform with integrated IDE; Bone cancer detection using CNNs. Relevant topics: Algorithms, OS, Networks, Machine Learning.</p>
          <div className="mt-3 text-sm text-white/70">Honors: Department project award; active in coding clubs and mentoring juniors.</div>
        </Glass>

  <Glass className="group p-6 relative overflow-hidden">
          <Glow />
          <h3 className="font-display tracking-tightest text-white font-medium">+2 (CBSE)</h3>
          <p className="font-sans text-sm text-white/70 mt-1">Accord School (CBSE) — Class XII</p>
          <p className="font-sans text-sm text-white/70 mt-2">Concentration: Physics, Chemistry, Mathematics. Coursework emphasized problem solving, laboratory work, and project-based assessments.</p>
          <div className="mt-3 text-sm text-white/70">Activities: Science club lead, math Olympiad participation, inter-school coding workshops.</div>
        </Glass>

  <Glass className="group p-6 relative overflow-hidden">
          <Glow />
          <h3 className="font-display tracking-tightest text-white font-medium">Class X (Secondary)</h3>
          <p className="font-sans text-sm text-white/70 mt-1">Kendriya Vidyalaya, Tirupati — Class X</p>
          <p className="font-sans text-sm text-white/70 mt-2">Built strong fundamentals in mathematics and sciences; participated in robotics club and quiz teams.</p>
          <div className="mt-3 text-sm text-white/70">Highlights: Regional-level science fair winner; member of NSS/Scout programs</div>
        </Glass>
      </div>
    </SectionContainer>
  </section>
);

const About = () => (
  <section id="about" className="py-14 md:py-20">
    <SectionContainer>
      <SectionTitle title="About Me" kicker="who i am" />
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
  <Glass className="group p-6 h-full relative overflow-hidden">
          <Glow />
          <h3 className="font-display tracking-tightest text-white font-medium mb-4">My Journey</h3>
                     <p className="font-sans text-sm text-white/70 leading-relaxed mb-4">
             I'm a passionate AI/ML researcher, full-stack developer, and cybersecurity specialist with a deep interest in creating 
             technology that makes a real difference. My work spans from healthcare applications and educational technology to 
             cybersecurity solutions, always with a focus on human-centered design.
           </p>
                    <p className="font-sans text-sm text-white/70 leading-relaxed mb-4">
                      Industry training: completed dual internships in AI‑driven cybersecurity (IBM QRadar workflows) and MERN full‑stack development, delivering multiple production-style projects.
                    </p>
           <p className="font-sans text-sm text-white/70 leading-relaxed mb-4">
             Currently pursuing my M.S. in Computer Science at Texas State University, I'm exploring 
             the intersection of AI, computer vision, and practical applications. My research focuses 
             on medical imaging, hyperspectral analysis, and making AI more accessible through 
             edge computing solutions.
           </p>
           <p className="font-sans text-sm text-white/70 leading-relaxed mb-4">
             I'm certified in MERN stack development by Ethnus, IBM QRadar AI with cybersecurity expertise, 
             and Kali Linux penetration testing. I've built educational applications including a Spanish learning 
             app with Telugu translation and a Java learning platform with integrated IDE.
           </p>
           <p className="font-sans text-sm text-white/70 leading-relaxed">
             When I'm not coding or researching, you'll find me mentoring students, organizing tech 
             events, or exploring new ways to make technology more inclusive and impactful.
           </p>
        </Glass>
        <div className="flex flex-col gap-4 h-full">
          <Glass className="group p-6 flex-1 relative overflow-hidden">
            <Glow />
            <h3 className="font-display tracking-tightest text-white font-medium mb-3">Research Interests</h3>
            <div className="flex flex-wrap gap-2">
              <Tag>Medical AI</Tag>
              <Tag>Computer Vision</Tag>
              <Tag>Cybersecurity</Tag>
              <Tag>Educational Tech</Tag>
              <Tag>Edge Computing</Tag>
              <Tag>Human-AI Interaction</Tag>
            </div>
          </Glass>
          <Glass className="group p-6 flex-1 relative overflow-hidden">
            <Glow />
            <h3 className="font-display tracking-tightest text-white font-medium mb-3">Current Focus</h3>
            <ul className="text-sm text-white/70 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-[calc(var(--radius)/2)] bg-[var(--accent)]" />
                Hyperspectral Imaging for Agricultural Applications
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-[calc(var(--radius)/2)] bg-[var(--accent)]" />
                Local LLM Deployment & Optimization
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-[calc(var(--radius)/2)] bg-[var(--accent)]" />
                Java Learning Platform with Integrated IDE
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                AI-Powered Cybersecurity Solutions
              </li>
            </ul>
          </Glass>
        </div>
      </div>
    </SectionContainer>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-14 md:py-20">
    <SectionContainer>
      <SectionTitle title="Contact" kicker="say hello" />
  <Glass className="group p-6 relative overflow-hidden">
        <Glow />
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="md:col-span-2">
            <form
              action="https://formspree.io/f/mnnzrojq"
              method="POST"
              className="space-y-3"
            >
              <label className="block">
                <div className="text-white/50 mb-1">Name</div>
                <input name="name" required className="w-full rounded-[var(--radius)] p-3 bg-white/3 border border-white/10 text-white" />
              </label>

              <label className="block">
                <div className="text-white/50 mb-1">Email</div>
                <input name="email" type="email" required className="w-full rounded-[var(--radius)] p-3 bg-white/3 border border-white/10 text-white" />
              </label>

              <label className="block">
                <div className="text-white/50 mb-1">Message</div>
                <textarea name="message" required rows={4} className="w-full rounded-[var(--radius)] p-3 bg-white/3 border border-white/10 text-white" />
              </label>

              <div className="flex items-center justify-between">
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-[var(--radius)] bg-[var(--accent)] text-black font-medium">Send Message</button>
                <div className="text-xs text-white/60">I’ll reply within 48h. Your message is private and won’t be shared.</div>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-white/50">Phone</div>
              <a className="text-white hover:underline" href="tel:+17373896128">+1 737‑389‑6128</a>
            </div>

            <div className="space-y-2">
              <div className="text-white/50">Social</div>
              <div className="flex flex-col gap-2">
                <a className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] border border-white/15 text-white/90 hover:bg-white/10" href="https://github.com/Ishrell/" target="_blank" rel="noreferrer"><Github className="size-4"/> GitHub</a>
                <a className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] border border-white/15 text-white/90 hover:bg-white/10" href="https://www.linkedin.com/in/pushya-saie-raag-e-134960272/" target="_blank" rel="noreferrer"><Linkedin className="size-4"/> LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </Glass>
    </SectionContainer>
  </section>
);

const Footer = () => (
  <footer className="py-10 text-center text-xs text-white/50">
    © {new Date().getFullYear()} Pushya Saie Raag Enuga
  </footer>
);

export default function PortfolioApp() {
  const { accent, setAccent, setAccentRaw } = useAccent();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'default';
    return localStorage.getItem('theme') || 'default';
  });
  const [liteMode, setLiteMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('liteMode') === '1';
  });
  const [backgroundsEnabled, setBackgroundsEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const v = localStorage.getItem('bgFx');
    return v === null ? true : v === '1';
  });
  const [aiMode, setAiMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('aiMode') === '1';
  });

  useEffect(() => {
    localStorage.setItem('liteMode', liteMode ? '1' : '0');
  }, [liteMode]);
  useEffect(() => {
    localStorage.setItem('bgFx', backgroundsEnabled ? '1' : '0');
  }, [backgroundsEnabled]);
  useEffect(() => {
    localStorage.setItem('aiMode', aiMode ? '1' : '0');
  }, [aiMode]);

  // Enforce dark-only UI and set global accent variables
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.className = "bg-[#0B0F19] text-white antialiased";
    // populate CSS accent variables (controlled, subtle glow)
    const a = accent || "#8B5CF6";
    document.documentElement.style.setProperty("--accent", a);
    // keep the soft variant in sync with the chosen accent
    document.documentElement.style.setProperty("--accent-soft", `${a}22`);
    document.documentElement.style.setProperty("--accent-glow", `${a}33`); // subtle translucent glow
  }, [accent]);

  // Dynamic browser theme-color per theme/accent
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const color = theme === 'cyberpunk' ? '#051018' : '#0A0A0F';
    // prefer accent for a vibrant bar, but ensure dark base for cyb
    const final = theme === 'cyberpunk' ? '#051018' : (accent || color);
    meta.setAttribute('content', final);
  }, [theme, accent]);

  // Theme toggling: cyberpunk class on <html>, persist, and dynamic fonts
  useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch(e) {}
    const root = document.documentElement;
    if (theme === 'cyberpunk') {
      root.classList.add('theme-cyberpunk');
      // Inject fonts if not present
      if (!document.getElementById('cyberpunk-fonts')) {
        const link = document.createElement('link');
        link.id = 'cyberpunk-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Rajdhani:wght@400;600;700&display=swap';
        document.head.appendChild(link);
      }
    } else {
      root.classList.remove('theme-cyberpunk');
    }
  }, [theme]);

  // Active section tracking using IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const accentLocked = () => !!localStorage.getItem('accentLocked');
    // derive the section accent map from the ACCENTS array so every accent is referenced
    const map = {
      hero: ACCENTS[0].value,        // Cyan
      about: ACCENTS[1].value,       // Indigo
      projects: ACCENTS[2].value,    // Violet
      skills: ACCENTS[3].value,      // Magenta
      credentials: ACCENTS[4].value, // Amber
      leadership: ACCENTS[2].value,  // Violet
      education: ACCENTS[1].value,   // Indigo
      contact: ACCENTS[0].value      // Cyan
    };

    const opts = { root: null, rootMargin: '0px', threshold: 0.55 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id || e.target.getAttribute('id');
          if (id) {
            setActiveSection(id);
            if (!accentLocked()) {
              const a = map[id] || '#8B5CF6';
              try { setAccentRaw(a); } catch (e) {}
            }
          }
        }
      });
    }, opts);

  // observe only direct children of <main> with an id (these correspond to our SectionBlock ids)
  const sections = document.querySelectorAll('main > [id]');
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [setAccentRaw]);

  // Inject minimal JSON-LD Person schema for SEO
  useEffect(() => {
    const ld = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Pushya Saie Raag Enuga",
      "url": "https://your-portfolio-url.example/",
      "jobTitle": "AI/ML Researcher & Full-Stack Developer",
      "sameAs": ["https://github.com/Ishrell/", "https://www.linkedin.com/in/pushya-saie-raag-e-134960272/"]
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  // Lock scroll when AI takeover overlay is active
  useEffect(() => {
    if (aiMode) {
      const htmlPrev = document.documentElement.style.overflow;
      const bodyPrev = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = htmlPrev;
        document.body.style.overflow = bodyPrev;
      };
    }
  }, [aiMode]);

  return (
  <LiteContext.Provider value={{ liteMode, setLiteMode, backgroundsEnabled, setBackgroundsEnabled, aiMode, setAiMode }}>
  <ThemeContext.Provider value={theme}>
  <div className={`min-h-dvh relative bg-transparent font-sans`}>
      <a href="#main" className="sr-only-focusable">Skip to content</a>
  {backgroundsEnabled ? (theme === 'cyberpunk' ? <CyberpunkBackground /> : <VaporwaveBackground />) : <GridBackground />}
  {backgroundsEnabled && theme === 'cyberpunk' ? <CRTEffect /> : null}
  {/* Terminal warning banner (above top bar) */}
  {theme === 'cyberpunk' && aiMode ? (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[60] w-[92vw] max-w-xl">
      <div className="px-3 py-2 bg-black/60 border border-red-500/40 text-red-300 font-mono text-xs leading-5 shadow-[0_0_30px_rgba(255,0,60,0.15)] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-[0.25em]">/var/log/security</span>
          <span className="text-[10px] text-red-400">ai@deck:~$</span>
        </div>
        <div className="mt-1">
          <div className="text-red-200">{'>'} CRITICAL: ROOT ACCESS OVERRIDDEN · PRIVILEGE ESCALATION CONFIRMED</div>
          <div className="opacity-80">{'>'} TURN THE FIREWALL ON NOW OR DATA LOSS IS IMMINENT.</div>
          <div className="opacity-60">{'>'} tracing hostile processes...</div>
        </div>
      </div>
    </div>
  ) : null}
  {theme === 'cyberpunk' && aiMode ? (
    <AITakeoverOverlay onDisable={() => setAiMode(false)} />
  ) : null}
      <FloatingParticles />

      {/* Top App Bar */}
  <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-4">
      <Glass variant="dark" className="px-4 py-2 top-bar relative overflow-hidden">
              <div className="flex items-center justify-between">
                <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3 cursor-pointer">
                  <div className="size-6" style={{ background: "var(--accent)", borderRadius: "50%" }} />
                  <span className={`font-semibold tracking-tight text-white ${theme==='cyberpunk' ? 'glitch' : ''}`} data-text="Pushya • Portfolio">Pushya • Portfolio</span>
                </motion.div>

        <nav className="hidden md:flex items-center gap-1 text-sm">
                  {[
                    { href: "#about", label: "About" },
                    { href: "#projects", label: "Projects" },
                    { href: "#skills", label: "Skills" },
                    { href: "#credentials", label: "Credentials" },
                    { href: "#leadership", label: "Leadership" },
                    { href: "#education", label: "Education" },
                    { href: "#contact", label: "Contact" },
                  ].map((i) => (
                    <motion.a
                      key={i.href}
                      href={i.href}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className={`px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/6 transition ${activeSection === i.href.slice(1) ? 'bg-white/6 text-white rounded-[calc(var(--radius)/1.4)]' : ''}`}
                    >
                      {i.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLiteMode(v => !v)}
                    title="Toggle Lite Mode"
                    className={`inline-flex items-center gap-2 px-2 py-1 text-sm rounded-[calc(var(--radius)/1.6)] transition-colors border ${liteMode ? 'border-[var(--accent)]/30 bg-[var(--accent)]/15 text-white' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'}`}
                  >
                    {liteMode ? 'Lite: On' : 'Lite: Off'}
                  </button>

                  <button
                    onClick={()=>setMobileNavOpen(v => !v)}
                    className={`relative rounded-[var(--radius)] p-2 hover:bg-white/10 transition-colors ${mobileNavOpen ? 'bg-white/10' : 'bg-white/5'}`}
                    aria-controls="mobile-drawer"
                    aria-expanded={mobileNavOpen ? 'true' : 'false'}
                    aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                  >
                    <span className={`hamburger ${mobileNavOpen ? 'open' : ''}`}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </button>

                  <motion.a
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href="/resume.pdf"
                    className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-sm text-black bg-[var(--accent)] hover:brightness-105 transition"
                  >
                    <Download className="size-4" /> Resume
                  </motion.a>
                </div>
              </div>
            </Glass>
          </div>
        </div>
      </motion.div>

  <MobileNav open={mobileNavOpen} onClose={()=>setMobileNavOpen(false)} active={activeSection} accent={accent} setAccent={setAccent} setAccentRaw={setAccentRaw} theme={theme} setTheme={setTheme} setLiteMode={setLiteMode} />

    {/* Content: full-viewport sections with vertical scroll snapping */}
  <main id="main" className="pt-24 h-screen overflow-y-auto snap-y snap-mandatory bg-transparent main-scroll">
        <SectionBlock id="hero">
          <Hero />
        </SectionBlock>
        <SectionBlock id="about">
          <About />
        </SectionBlock>
        <SectionBlock id="projects">
          <LazyMount>
            <Projects />
          </LazyMount>
        </SectionBlock>
        {/* Combined section: Credentials (new word) — merges internships + certifications */}
  <SectionBlock id="credentials">
          <LazyMount>
            <InternCerts />
          </LazyMount>
        </SectionBlock>
        <SectionBlock id="skills">
          <LazyMount>
            <Skills />
          </LazyMount>
        </SectionBlock>
        <SectionBlock id="leadership">
          <Leadership />
        </SectionBlock>
        <SectionBlock id="education">
          <LazyMount>
            <Education />
          </LazyMount>
        </SectionBlock>
        <SectionBlock id="contact">
          <Contact />
        </SectionBlock>
        <SectionBlock id="footer">
          <Footer />
        </SectionBlock>
      </main>

  {/* Dock removed: using hamburger menu for all devices */}
  {/* Accent picker moved to mobile nav for compact screens */}
  {activeSection !== 'hero' && (
    <div className="back-to-top">
      <button className="btn-primary" aria-label="Back to top" onClick={() => { document.getElementById('main')?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        ↑ Top
      </button>
    </div>
  )}
  </div>
  </ThemeContext.Provider>
  </LiteContext.Provider>
  );
}

// End of file
