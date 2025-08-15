import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion } from "framer-motion";
import "./index.css";
import { Github, Linkedin, Mail, ExternalLink, Download, ArrowRight, Sparkles, Cpu, Server, Palette, Calendar, Clock, MessageSquare, Zap, Target, TrendingUp } from "lucide-react";

// Ultra‑fresh, full‑bleed, glass/M3‑inspired dark UI
// TailwindCSS required. All content is in one file.

const ACCENTS = [
  { name: "Cyan", value: "#06B6D4" }, // primary
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Magenta", value: "#EC4899" },
  { name: "Amber", value: "#F59E0B" },
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
  const setAccentLocked = (value) => {
    localStorage.setItem('accent', value);
    localStorage.setItem('accentLocked', '1');
    setAccent(value);
  };

  return { accent, setAccent: setAccentLocked };
}

const GLASS_ROUNDED = "rounded-2xl";
const Glass = ({ className = "", children, variant = "default" }) => {
  // subtle shadow for depth; keep glass variants for color presets
  const baseClasses = `${GLASS_ROUNDED} backdrop-blur-xl border shadow-md hover:shadow-lg transition-all duration-300`;
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

const Tag = ({ children }) => (
  <motion.span 
  whileHover={{ scale: 1.05, y: -2 }}
  className="px-2.5 py-1 rounded-2xl text-xs border border-purple-500/30 bg-purple-500/10 text-purple-300 cursor-pointer transition-all duration-300"
  >
    {children}
  </motion.span>
);

// Interactive 3D Card Component
const InteractiveCard = ({ children, className = "", intensity = 15 }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const rotateX = useSpring(
    isHovered ? (mousePosition.y - 150) / intensity : 0,
    { stiffness: 300, damping: 30 }
  );
  const rotateY = useSpring(
    isHovered ? (mousePosition.x - 200) / intensity : 0,
    { stiffness: 300, damping: 30 }
  );
  
  const scale = useSpring(
    isHovered ? 1.02 : 1,
    { stiffness: 300, damping: 30 }
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        scale,
      }}
      className={`${className} perspective-3d transition-all duration-300`}
    >
      {children}
    </motion.div>
  );
};

// Animated Progress Bar
const ProgressBar = ({ skill, percentage, color = "var(--accent)" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-purple-200 font-medium">{skill}</span>
        <span className="text-xs text-purple-300 font-semibold">{percentage}%</span>
      </div>
      <div className="h-3 bg-purple-900/30 rounded-full overflow-hidden border border-purple-500/20">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{ 
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 10px ${color}40`
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute inset-0 bg-white/20 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

// Floating Particles Background
const FloatingParticles = () => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
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
            duration: Math.random() * 25 + 15,
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

const SectionTitle = ({ icon: Icon, title, kicker }) => (
  <div className="flex items-end justify-between gap-6 mb-6">
    <div>
      {kicker && (
        <div className="text-[12px] uppercase tracking-[0.2em] text-white/50">{kicker}</div>
      )}
      <h2 className="font-display tracking-tightest mt-1 text-2xl md:text-3xl font-semibold text-white flex items-center gap-3">
        {Icon ? <Icon className="size-6 text-[var(--accent)]" /> : null}
        {title}
      </h2>
    </div>
  </div>
);

const SectionContainer = ({ children, className = "" }) => (
  <div className={`max-w-6xl mx-auto px-6 w-full ${className}`}>
    {children}
  </div>
);

// Central internships data (used by credentials view)
const INTERNSHIPS_DATA = [
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

const InternshipsList = ({ compact = false }) => (
  <div className="grid md:grid-cols-2 gap-6">
    {INTERNSHIPS_DATA.map((it, idx) => (
      <motion.div key={it.company} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: idx * 0.06 }} viewport={{ once: true }}>
        <InteractiveCard intensity={6}>
          <Glass className="rounded-2xl p-6 h-full">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display tracking-tightest text-white font-semibold text-lg">{it.company}</h3>
                <div className="text-sm text-white/70">{it.role} • <span className="text-white/60">{it.dates}</span></div>
              </div>
              <div className="text-xs text-[var(--accent)] font-semibold">{it.tech.join(' • ')}</div>
            </div>

            <ul className="text-sm text-white/70 list-disc list-inside space-y-2 mb-4">
              {it.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <div className="text-sm text-white/70">
              <strong className="text-white">Outcome:</strong> {it.outcomes}
            </div>
          </Glass>
        </InteractiveCard>
      </motion.div>
    ))}
  </div>
);

// SectionBlock: subtle entrance animation + once-only glow when the section scrolls into view
const SectionBlock = ({ id, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.36 });
  const reduceMotion = useReducedMotion();

  const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.995 };
  const animate = inView ? (reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }) : {};
  const transition = reduceMotion ? {} : { duration: 0.72, ease: "easeOut" };

  return (
    <div id={id} className="snap-start min-h-screen flex items-center justify-center">
      <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        transition={transition}
        className={`w-full transition-all duration-700 ${inView ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={inView ? { boxShadow: '0 18px 60px rgba(2,6,23,0.65)' } : {}}
        onViewportEnter={() => {
          try {
            const locked = localStorage.getItem('accentLocked');
            if (!locked) {
              const secColor = SECTION_ACCENTS[id] || SECTION_ACCENTS['hero'];
              document.documentElement.style.setProperty('--accent', secColor);
            }
          } catch (e) { /* ignore */ }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Section -> accent map (used when user hasn't manually selected an accent)
const SECTION_ACCENTS = {
  hero: ACCENTS[0].value,
  about: ACCENTS[2].value,
  projects: ACCENTS[1].value,
  credentials: ACCENTS[3].value,
  skills: ACCENTS[0].value,
  leadership: ACCENTS[4].value,
  education: ACCENTS[2].value,
  contact: ACCENTS[0].value,
};

const GridBackground = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 animated-bg bg-[#06070b]">
    {/* Multiple radial spotlights (subtle, low-opacity) */}
    <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_-10%,rgba(139,92,246,.06),transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_30%_80%,rgba(236,72,153,.04),transparent_60%)]" />
    
    {/* Enhanced grid with perspective */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="0.8" />
        </pattern>
        <pattern id="grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#grid-small)" />
    </svg>
    
    {/* Multiple flowing accent blobs */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.06, 0.12, 0.06], 
        x: [0, 30, -15, 0], 
        y: [0, -8, 20, 0],
        scale: [1, 1.04, 1]
      }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-28 left-1/3 w-[720px] h-[720px] rounded-full blur-[140px]"
      style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
    />
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.04, 0.1, 0.04], 
        x: [0, -20, 12, 0], 
        y: [0, 12, -10, 0],
        scale: [1, 0.98, 1]
      }}
      transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 right-1/4 w-[520px] h-[520px] rounded-full blur-[100px]"
      style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent)" }}
    />
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.06, 0.1, 0.06], 
        x: [0, 18, -10, 0], 
        y: [0, -18, 14, 0],
        rotate: [0, 120, 240]
      }}
      transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-1/4 left-1/4 w-[420px] h-[420px] rounded-full blur-[80px]"
      style={{ background: "radial-gradient(closest-side, #EC4899, transparent)" }}
    />
    
    {/* Floating particles */}
  {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-purple-400 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: 0
        }}
        animate={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: Math.random() * 15 + 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
  </div>
);

const Dock = () => (
  <Glass variant="purple" className="fixed bottom-6 left-1/2 -translate-x-1/2 px-3 py-2 flex items-center gap-1">
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
  className="px-3 py-1.5 rounded-2xl text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
      >
        {item.label}
      </a>
    ))}
  </Glass>
);

const AccentPicker = ({ accent, setAccent }) => (
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
          className="h-6 w-6 rounded-2xl border border-white/20 hover:scale-[1.05] transition"
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
        onClick={() => { localStorage.removeItem('accentLocked'); alert('Accent auto mode enabled — sections will control accents.'); }}
        className="h-6 w-6 rounded-2xl border border-white/20 flex items-center justify-center text-xs text-white/80 hover:scale-[1.05] transition"
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
                             <h1 className=" rounded-2xl font-display tracking-tightest text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                 <span className="gradient-text">Pushya Saie Raag Enuga</span>
               </h1>
              <div className=" rounded-2xl h-8 md:h-10 flex items-center">
                <TypingEffect 
                  text="AI/ML researcher & HCI‑minded full‑stack developer — shipped 8 projects used by 5k+ users; published medical‑AI paper."
                  className="text-white/70 text-lg max-w-2xl"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-black bg-[var(--accent)] hover:brightness-110 transition font-medium shadow-md"
              >
                Explore Projects <ArrowRight className="size-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="/resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 text-white/90 hover:bg-white/10 transition backdrop-blur-sm"
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
                    className="p-3 rounded-2xl border border-white/15 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
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
               <Glass variant="purple" className="rounded-2xl p-8 relative overflow-hidden">
                <motion.div
                  className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-20"
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
                    className="space-y-2 p-3 rounded-2xl bg-white/5"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">TOEFL</div>
                    <div className="text-white text-2xl font-bold">108</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 rounded-2xl bg-white/5"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">IELTS</div>
                    <div className="text-white text-2xl font-bold">8.0</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 rounded-2xl bg-white/5 col-span-2"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">Open to</div>
                    <div className="text-white font-medium">AI/ML • Full‑Stack • Product</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 rounded-2xl bg-white/5 col-span-2"
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
  <Glass className="rounded-2xl p-5 hover:bg-white/7 transition">
    <div className="flex items-center gap-3 mb-2">
      {Icon ? <Icon className="size-5 text-[var(--accent)]" /> : null}
      <h3 className="font-display tracking-tightest font-medium text-white">{title}</h3>
    </div>
    <p className="font-sans text-sm text-white/70 leading-relaxed">{children}</p>
  </Glass>
);

const Projects = () => {
  const projects = [
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
  ];

  return (
    <section id="projects" className="py-14 md:py-20">
      <SectionContainer>
        <SectionTitle icon={Sparkles} title="Selected Projects" kicker="work" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
                             <InteractiveCard intensity={10}>
                 <Glass variant="dark" className="group rounded-2xl p-8 relative overflow-hidden h-full">
                                     <motion.div
                     className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                     style={{
                       background: "radial-gradient(600px 160px at 20% 0%, rgba(139,92,246,0.3), transparent)",
                     }}
                   />
                   <motion.div
                     className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                     style={{
                       background: "radial-gradient(400px 120px at 80% 100%, rgba(236,72,153,0.2), transparent)",
                     }}
                   />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl mb-3">{project.image}</div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <InteractiveCard>
            <Glass className="rounded-2xl p-8">
              <h3 className="font-display tracking-tightest text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Zap className="size-6 text-[var(--accent)]" />
                Other Highlights
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-display tracking-tightest text-white/80 font-medium">Research Projects</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      Quantum‑Resistant Digital Signatures
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      Emotion‑Based Lighting (Feelbright)
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-display tracking-tightest text-white/80 font-medium">Applications</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
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
    }
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
              {certs.map((cert) => (
                <InteractiveCard key={cert.title} intensity={4}>
                  <Glass className="rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl">{cert.icon}</div>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">{cert.status}</div>
                    </div>
                    <h3 className="font-display tracking-tightest text-white font-semibold text-lg">{cert.title}</h3>
                    <p className="text-sm text-white/70">{cert.issuer} • {cert.category}</p>
                  </Glass>
                </InteractiveCard>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

const Skills = () => {
  const skillsData = [
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
  ];

  return (
    <section id="skills" className="py-14 md:py-20">
      <SectionContainer>
        <SectionTitle icon={Cpu} title="Skills" kicker="capabilities" />
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {skillsData.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
                             <InteractiveCard intensity={8}>
                 <Glass variant="purple" className="rounded-2xl p-6 h-full">
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
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <InteractiveCard>
            <Glass className="rounded-2xl p-8">
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
  const certifications = [
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
  ];

  return (
    <section id="certifications" className="py-14 md:py-20">
      <SectionContainer>
        <SectionTitle icon={Target} title="Certifications" kicker="credentials" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
                             <InteractiveCard intensity={6}>
                 <Glass variant="purple" className="rounded-2xl p-6 h-full group hover:bg-purple-500/10 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{cert.icon}</div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400"
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
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <InteractiveCard>
            <Glass className="rounded-2xl p-8">
              <h3 className="font-display tracking-tightest text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Zap className="size-6 text-[var(--accent)]" />
                Professional Development
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-display tracking-tightest text-white/80 font-medium">Technical Expertise</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
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
      <Glass className="rounded-2xl p-6">
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
        <Glass className="rounded-2xl p-6">
          <h3 className="font-display tracking-tightest text-white font-medium">M.S. Computer Science</h3>
          <p className="font-sans text-sm text-white/70 mt-1">Texas State University — Aug 2025 – present</p>
          <p className="font-sans text-sm text-white/70 mt-2">Focus: Medical imaging, hyperspectral analysis, and edge AI deployment. Relevant coursework: Advanced Computer Vision, Deep Learning, Distributed Systems.</p>
          <div className="mt-3 text-sm text-white/70">
            <div>Activities: Ongoing</div>
          </div>
        </Glass>

        <Glass className="rounded-2xl p-6">
          <h3 className="font-display tracking-tightest text-white font-medium">B.Tech — Computer Science</h3>
          <p className="font-sans text-sm text-white/70 mt-1">Vellore Institute of Technology — May 2025</p>
          <p className="font-sans text-sm text-white/70 mt-2">Major projects: Java learning platform with integrated IDE; Bone cancer detection using CNNs. Relevant topics: Algorithms, OS, Networks, Machine Learning.</p>
          <div className="mt-3 text-sm text-white/70">Honors: Department project award; active in coding clubs and mentoring juniors.</div>
        </Glass>

        <Glass className="rounded-2xl p-6">
          <h3 className="font-display tracking-tightest text-white font-medium">+2 (CBSE)</h3>
          <p className="font-sans text-sm text-white/70 mt-1">Accord School (CBSE) — Class XII</p>
          <p className="font-sans text-sm text-white/70 mt-2">Concentration: Physics, Chemistry, Mathematics. Coursework emphasized problem solving, laboratory work, and project-based assessments.</p>
          <div className="mt-3 text-sm text-white/70">Activities: Science club lead, math Olympiad participation, inter-school coding workshops.</div>
        </Glass>

        <Glass className="rounded-2xl p-6">
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
        <Glass className="rounded-2xl p-6 h-full">
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
          <Glass className="rounded-2xl p-6 flex-1">
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
          <Glass className="rounded-2xl p-6 flex-1">
            <h3 className="font-display tracking-tightest text-white font-medium mb-3">Current Focus</h3>
            <ul className="text-sm text-white/70 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                Hyperspectral Imaging for Agricultural Applications
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                Local LLM Deployment & Optimization
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
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
      <Glass className="rounded-2xl p-6">
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="md:col-span-2">
            <form
              action="https://formspree.io/f/mnnzrojq"
              method="POST"
              className="space-y-3"
            >
              <label className="block">
                <div className="text-white/50 mb-1">Name</div>
                <input name="name" required className="w-full rounded-2xl p-3 bg-white/3 border border-white/10 text-white" />
              </label>

              <label className="block">
                <div className="text-white/50 mb-1">Email</div>
                <input name="email" type="email" required className="w-full rounded-2xl p-3 bg-white/3 border border-white/10 text-white" />
              </label>

              <label className="block">
                <div className="text-white/50 mb-1">Message</div>
                <textarea name="message" required rows={4} className="w-full rounded-2xl p-3 bg-white/3 border border-white/10 text-white" />
              </label>

              <div className="flex items-center justify-between">
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--accent)] text-black font-medium">Send Message</button>
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
                <a className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/15 text-white/90 hover:bg-white/10" href="https://github.com/Ishrell/" target="_blank" rel="noreferrer"><Github className="size-4"/> GitHub</a>
                <a className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/15 text-white/90 hover:bg-white/10" href="https://www.linkedin.com/in/pushya-saie-raag-e-134960272/" target="_blank" rel="noreferrer"><Linkedin className="size-4"/> LinkedIn</a>
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
  const { accent, setAccent } = useAccent();

  // Enforce dark-only UI and set global accent variables
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.className = "bg-[#0B0F19] text-white antialiased";
    // populate CSS accent variables (controlled, subtle glow)
    const a = accent || "#8B5CF6";
    document.documentElement.style.setProperty("--accent", a);
    document.documentElement.style.setProperty("--accent-soft", "#6D28D9");
    document.documentElement.style.setProperty("--accent-glow", `${a}33`); // subtle translucent glow
  }, [accent]);

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

  return (
    <div className={`min-h-dvh relative bg-[#0A0A0F] font-sans`}>
      <a href="#main" className="sr-only-focusable">Skip to content</a>
      <GridBackground />
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
            <Glass variant="dark" className="px-4 py-2">
              <div className="flex items-center justify-between">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div 
                    className="size-6"
                    style={{ background: "var(--accent)", borderRadius: "50%" }}
                  />
                  <span className="font-semibold tracking-tight text-white">Pushya • Portfolio</span>
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
                      className="px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/6 transition"
                    >
                      {i.label}
                    </motion.a>
                  ))}
                </nav>
                <div className="flex items-center gap-2">
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

      {/* Content: full-viewport sections with vertical scroll snapping */}
      <main className="pt-24 h-screen overflow-y-auto snap-y snap-mandatory">
        <SectionBlock id="hero">
          <Hero />
        </SectionBlock>
        <SectionBlock id="about">
          <About />
        </SectionBlock>
        <SectionBlock id="projects">
          <Projects />
        </SectionBlock>
        {/* Combined section: Credentials (new word) — merges internships + certifications */}
        <SectionBlock id="credentials">
          <InternCerts />
        </SectionBlock>
        <SectionBlock id="skills">
          <Skills />
        </SectionBlock>
        <SectionBlock id="leadership">
          <Leadership />
        </SectionBlock>
        <SectionBlock id="education">
          <Education />
        </SectionBlock>
        <SectionBlock id="contact">
          <Contact />
        </SectionBlock>
        <SectionBlock id="footer">
          <Footer />
        </SectionBlock>
      </main>

      <Dock />
      <AccentPicker accent={accent} setAccent={setAccent} />
    </div>
  );
}

// End of file
