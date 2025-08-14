import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, Download, ArrowRight, Sparkles, Cpu, Server, Palette, Calendar, Clock, MessageSquare, Zap, Target, TrendingUp } from "lucide-react";

// Ultra‑fresh, full‑bleed, glass/M3‑inspired dark UI
// TailwindCSS required. All content is in one file.

const ACCENTS = [
  { name: "Purple Haze", value: "#8B5CF6" },
  { name: "Deep Purple", value: "#6D28D9" },
  { name: "Violet Glow", value: "#A855F7" },
  { name: "Pink Fusion", value: "#EC4899" },
  { name: "Cyber Blue", value: "#3B82F6" },
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
  return { accent, setAccent };
}

const Glass = ({ className = "", children, variant = "default" }) => {
  const baseClasses = "backdrop-blur-xl border transition-all duration-300";
  
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
    className="px-2.5 py-1 rounded-full text-xs border border-purple-500/30 bg-purple-500/10 text-purple-300 cursor-pointer glow-purple hover:bg-purple-500/20 transition-all duration-300"
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
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
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

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
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
      <h2 className="mt-1 text-2xl md:text-3xl font-semibold text-white flex items-center gap-3">
        {Icon ? <Icon className="size-6 text-[var(--accent)]" /> : null}
        {title}
      </h2>
    </div>
  </div>
);

const GridBackground = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 animated-bg">
    {/* Multiple radial spotlights */}
    <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_-10%,rgba(139,92,246,.08),transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_30%_80%,rgba(236,72,153,.06),transparent_60%)]" />
    
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
        opacity: [0.1, 0.2, 0.1], 
        x: [0, 40, -20, 0], 
        y: [0, -10, 30, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-24 left-1/3 w-[800px] h-[800px] rounded-full blur-[120px]"
      style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
    />
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.05, 0.15, 0.05], 
        x: [0, -30, 20, 0], 
        y: [0, 20, -15, 0],
        scale: [1, 0.9, 1]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
      style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent)" }}
    />
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.08, 0.12, 0.08], 
        x: [0, 25, -15, 0], 
        y: [0, -25, 20, 0],
        rotate: [0, 180, 360]
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[80px]"
      style={{ background: "radial-gradient(closest-side, #EC4899, transparent)" }}
    />
    
    {/* Floating particles */}
    {[...Array(15)].map((_, i) => (
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
  <Glass variant="purple" className="fixed bottom-6 left-1/2 -translate-x-1/2 px-3 py-2 rounded-[20px] flex items-center gap-1 animate-pulse-glow">
    {[
      { href: "#about", label: "About" },
      { href: "#projects", label: "Projects" },
      { href: "#skills", label: "Skills" },
      { href: "#certifications", label: "Certs" },
      { href: "#education", label: "Education" },
      { href: "#contact", label: "Contact" },
    ].map((item) => (
      <a
        key={item.href}
        href={item.href}
        className="px-3 py-1.5 rounded-[12px] text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
      >
        {item.label}
      </a>
    ))}
  </Glass>
);

const AccentPicker = ({ accent, setAccent }) => (
  <Glass variant="dark" className="fixed top-6 right-6 p-3 rounded-2xl animate-pulse-glow">
    <div className="flex items-center gap-2 text-white/70 text-xs mb-2">
      <Palette className="size-4" /> Accent
    </div>
    <div className="flex gap-2">
      {ACCENTS.map((c) => (
        <button
          key={c.value}
          aria-label={c.name}
          onClick={() => setAccent(c.value)}
          className="h-6 w-6 rounded-full border border-white/20 hover:scale-[1.05] transition"
          style={{
            background: c.value,
            outline: accent === c.value ? `2px solid ${c.value}` : "none",
            boxShadow: accent === c.value ? `0 0 0 3px ${c.value}55` : "none",
          }}
        />
      ))}
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
        className="max-w-7xl mx-auto px-6"
      >
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
                             <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                 <span className="gradient-text animate-pulse-glow">Pushya Saie Raag Enuga</span>
               </h1>
              <div className="h-8 md:h-10 flex items-center">
                <TypingEffect 
                  text="AI/ML researcher & human‑centered full‑stack developer crafting useful, elegant systems for healthcare, accessibility, and immersive tech."
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black bg-[var(--accent)] hover:brightness-110 transition font-medium shadow-lg"
              >
                Explore Projects <ArrowRight className="size-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="/resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/90 hover:bg-white/10 transition backdrop-blur-sm"
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
                    className="p-3 rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
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
               <Glass variant="purple" className="rounded-3xl p-8 relative overflow-hidden animate-pulse-glow">
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
                    className="space-y-2 p-3 rounded-xl bg-white/5"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">TOEFL</div>
                    <div className="text-white text-2xl font-bold">108</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 rounded-xl bg-white/5"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">IELTS</div>
                    <div className="text-white text-2xl font-bold">8.0</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 rounded-xl bg-white/5 col-span-2"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">Open to</div>
                    <div className="text-white font-medium">AI/ML • Full‑Stack • Product</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2 p-3 rounded-xl bg-white/5 col-span-2"
                  >
                    <div className="text-white/50 text-xs uppercase tracking-wider">Location</div>
                    <div className="text-white font-medium">Texas State University</div>
                  </motion.div>
                </div>
              </Glass>
            </InteractiveCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const SkillCard = ({ title, icon: Icon, children }) => (
  <Glass className="rounded-2xl p-5 hover:bg-white/7 transition">
    <div className="flex items-center gap-3 mb-2">
      {Icon ? <Icon className="size-5 text-[var(--accent)]" /> : null}
      <h3 className="font-medium text-white">{title}</h3>
    </div>
    <p className="text-sm text-white/70 leading-relaxed">{children}</p>
  </Glass>
);

const Projects = () => {
  const projects = [
    {
      title: "Bone Cancer Detection (CNN)",
      desc: "Aug–Dec 2024 • Convolutional model with augmentation & dropout for X‑ray diagnosis. Published IEEE paper.",
      href: "https://ieeexplore.ieee.org/document/10941267",
      image: "🔬",
      tech: ["Python", "TensorFlow", "CNN", "Medical AI"],
      impact: "Published IEEE Paper",
      status: "Completed"
    },
    {
      title: "Spanish Learning App with Telugu Translation",
      desc: "2024 • MERN stack application for Spanish language learning with integrated Telugu translation support.",
      image: "🇪🇸",
      tech: ["React", "Node.js", "MongoDB", "Express", "Translation API"],
      impact: "Bilingual Learning",
      status: "Completed"
    },
    {
      title: "Java Learning App with Integrated IDE",
      desc: "2024 • Interactive Java learning platform with built-in code editor and real-time compilation.",
      image: "☕",
      tech: ["React", "Java", "WebAssembly", "CodeMirror", "Compiler API"],
      impact: "Interactive Learning",
      status: "In Progress"
    },
    {
      title: "Hyper Spectral Imaging (ISRO RESPOND)",
      desc: "Jan–Apr 2025 • CNN‑Transformer hybrid; +18% accuracy on Odisha HSI datasets; stakeholder presentations.",
      image: "🛰️",
      tech: ["Python", "PyTorch", "Transformers", "Remote Sensing"],
      impact: "+18% Accuracy",
      status: "In Progress"
    },
    {
      title: "LLM Localization on USB",
      desc: "Jun–Jul 2025 • Run LLMs from a 64GB drive with GPU offload via HuggingFace, Llamafile, Ollama (Win/Linux; macOS WIP).",
      image: "💾",
      tech: ["Python", "HuggingFace", "Ollama", "Edge Computing"],
      impact: "Portable AI",
      status: "Active"
    },
    {
      title: "AI Weapon Detection",
      desc: "Feb–May 2024 • EfficientDet + NAS for fast, precise real‑time detection.",
      image: "🛡️",
      tech: ["Python", "EfficientDet", "NAS", "Real-time"],
      impact: "Real-time Detection",
      status: "Completed"
    }
  ];

  return (
    <section id="projects" className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
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
                    
                    <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
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
                    
                    <p className="text-sm text-white/70 mb-4 leading-relaxed">{project.desc}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="size-4 text-[var(--accent)]" />
                        <span className="text-sm text-white/80 font-medium">Impact:</span>
                        <span className="text-sm text-[var(--accent)] font-semibold">{project.impact}</span>
                      </div>
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
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Zap className="size-6 text-[var(--accent)]" />
                Other Highlights
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white/80 font-medium">Research Projects</h4>
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
                  <h4 className="text-white/80 font-medium">Applications</h4>
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
      </div>
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
      <div className="max-w-7xl mx-auto px-6">
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
                    <h3 className="font-semibold text-white text-lg">{category.category}</h3>
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
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Target className="size-6 text-[var(--accent)]" />
                Additional Expertise
              </h3>
                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="space-y-3">
                   <h4 className="text-white/80 font-medium">Frontend</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>React</Tag>
                     <Tag>Next.js</Tag>
                     <Tag>TailwindCSS</Tag>
                     <Tag>TypeScript</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="text-white/80 font-medium">Backend</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>Node.js</Tag>
                     <Tag>Express</Tag>
                     <Tag>MongoDB</Tag>
                     <Tag>Java</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="text-white/80 font-medium">AI/ML</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>Transformers</Tag>
                     <Tag>CNNs</Tag>
                     <Tag>OpenAI API</Tag>
                     <Tag>LangChain</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="text-white/80 font-medium">Cybersecurity</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>IBM QRadar</Tag>
                     <Tag>Kali Linux</Tag>
                     <Tag>Penetration Testing</Tag>
                     <Tag>Network Security</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="text-white/80 font-medium">Education Tech</h4>
                   <div className="flex flex-wrap gap-2">
                     <Tag>Language Learning</Tag>
                     <Tag>Interactive IDE</Tag>
                     <Tag>Translation APIs</Tag>
                     <Tag>WebAssembly</Tag>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <h4 className="text-white/80 font-medium">Tools & Design</h4>
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
      </div>
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
      <div className="max-w-7xl mx-auto px-6">
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
                  
                  <h3 className="text-white font-semibold text-lg mb-2">{cert.title}</h3>
                  <p className="text-white/60 text-sm mb-3">{cert.issuer}</p>
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
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center gap-3">
                <Zap className="size-6 text-[var(--accent)]" />
                Professional Development
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white/80 font-medium">Technical Expertise</h4>
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
                  <h4 className="text-white/80 font-medium">Additional Skills</h4>
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
      </div>
    </section>
  );
};

const Leadership = () => (
  <section id="leadership" className="py-14 md:py-20">
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle title="Leadership" kicker="impact" />
      <Glass className="rounded-2xl p-6">
        Co‑Founder (2022) & Vice President (2023–2024), AR/VR Club — launched workshops and events to show VR beyond gaming (education, healthcare, design). Organized 13+ events, 3,500+ participants; mentoring, operations, partnerships.
      </Glass>
    </div>
  </section>
);

const Education = () => (
  <section id="education" className="py-14 md:py-20">
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle title="Education" kicker="foundation" />
      <div className="grid md:grid-cols-2 gap-6">
        <Glass className="rounded-2xl p-6">
          <h3 className="text-white font-medium">M.S. Computer Science</h3>
          <p className="text-sm text-white/70 mt-1">Texas State University — Aug 2025 – present</p>
          <p className="text-sm text-white/70">TOEFL 108 • IELTS 8.0</p>
        </Glass>
        <Glass className="rounded-2xl p-6">
          <h3 className="text-white font-medium">B.Tech Computer Science</h3>
          <p className="text-sm text-white/70 mt-1">Vellore Institute of Technology — May 2025</p>
          <p className="text-sm text-white/70">CGPA: 8.26/10 • Certs: Blender, Economics, Network Security</p>
        </Glass>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-14 md:py-20">
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle title="About Me" kicker="who i am" />
      <div className="grid lg:grid-cols-2 gap-8">
        <Glass className="rounded-2xl p-6">
          <h3 className="text-white font-medium mb-4">My Journey</h3>
                     <p className="text-sm text-white/70 leading-relaxed mb-4">
             I'm a passionate AI/ML researcher, full-stack developer, and cybersecurity specialist with a deep interest in creating 
             technology that makes a real difference. My work spans from healthcare applications and educational technology to 
             cybersecurity solutions, always with a focus on human-centered design.
           </p>
           <p className="text-sm text-white/70 leading-relaxed mb-4">
             Currently pursuing my M.S. in Computer Science at Texas State University, I'm exploring 
             the intersection of AI, computer vision, and practical applications. My research focuses 
             on medical imaging, hyperspectral analysis, and making AI more accessible through 
             edge computing solutions.
           </p>
           <p className="text-sm text-white/70 leading-relaxed mb-4">
             I'm certified in MERN stack development by Ethnus, IBM QRadar AI with cybersecurity expertise, 
             and Kali Linux penetration testing. I've built educational applications including a Spanish learning 
             app with Telugu translation and a Java learning platform with integrated IDE.
           </p>
           <p className="text-sm text-white/70 leading-relaxed">
             When I'm not coding or researching, you'll find me mentoring students, organizing tech 
             events, or exploring new ways to make technology more inclusive and impactful.
           </p>
        </Glass>
        <div className="space-y-4">
                     <Glass className="rounded-2xl p-6">
             <h3 className="text-white font-medium mb-3">Research Interests</h3>
             <div className="flex flex-wrap gap-2">
               <Tag>Medical AI</Tag>
               <Tag>Computer Vision</Tag>
               <Tag>Cybersecurity</Tag>
               <Tag>Educational Tech</Tag>
               <Tag>Edge Computing</Tag>
               <Tag>Human-AI Interaction</Tag>
             </div>
           </Glass>
          <Glass className="rounded-2xl p-6">
            <h3 className="text-white font-medium mb-3">Current Focus</h3>
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
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-14 md:py-20">
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle title="Contact" kicker="say hello" />
      <Glass className="rounded-2xl p-6">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-white/50">Email</div>
            <a className="text-white hover:underline" href="mailto:pushyasaie@gmail.com">pushyasaie@gmail.com</a>
          </div>
          <div className="space-y-1">
            <div className="text-white/50">Phone</div>
            <a className="text-white hover:underline" href="tel:+17373896128">+1 737‑389‑6128</a>
          </div>
          <div className="flex items-center gap-2">
            <a
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 text-white/90 hover:bg-white/10"
              href="https://github.com/Ishrell/"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="size-4" /> GitHub
            </a>
            <a
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 text-white/90 hover:bg-white/10"
              href="https://www.linkedin.com/in/pushya-saie-raag-e-134960272/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="size-4" /> LinkedIn
            </a>
          </div>
        </div>
      </Glass>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-10 text-center text-xs text-white/50">
    © {new Date().getFullYear()} Pushya Saie Raag Enuga
  </footer>
);

export default function PortfolioApp() {
  const { accent, setAccent } = useAccent();

  useEffect(() => {
    document.documentElement.classList.add("dark"); // full dark mode
    document.body.className = "bg-[#0B0F19] text-white antialiased";
  }, []);

  return (
    <div className="min-h-dvh relative bg-[#0A0A0F]">
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
                         <Glass variant="dark" className="rounded-2xl px-4 py-2 animate-pulse-glow">
              <div className="flex items-center justify-between">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <motion.div 
                    className="size-6 rounded-md"
                    style={{ background: "var(--accent)" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="font-semibold tracking-tight">Pushya • Portfolio</span>
                </motion.div>
                <nav className="hidden md:flex items-center gap-1 text-sm">
                  {[
                    { href: "#about", label: "About" },
                    { href: "#projects", label: "Projects" },
                    { href: "#skills", label: "Skills" },
                    { href: "#certifications", label: "Certifications" },
                    { href: "#education", label: "Education" },
                    { href: "#contact", label: "Contact" },
                  ].map((i) => (
                    <motion.a
                      key={i.href}
                      href={i.href}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3 py-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
                    >
                      {i.label}
                    </motion.a>
                  ))}
                </nav>
                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="/resume.pdf"
                  className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-black bg-[var(--accent)] hover:brightness-110 transition text-sm"
                >
                  <Download className="size-4" /> Resume
                </motion.a>
              </div>
            </Glass>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <main className="pt-24">
        <Hero />
        <About />
        <Projects />
        <section id="skills-anchor"><Skills /></section>
        <Certifications />
        <section id="leadership-anchor"><Leadership /></section>
        <Education />
        <Contact />
        <Footer />
      </main>

      <Dock />
      <AccentPicker accent={accent} setAccent={setAccent} />
    </div>
  );
}

// End of file
