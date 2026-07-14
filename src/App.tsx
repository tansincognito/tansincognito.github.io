import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowUpRight,
  Laptop,
  Briefcase,
  Zap,
  BarChart2,
  Layers,
  Code2,
  Plus,
  X,
} from "lucide-react";

/* ─── types ─────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = React.ComponentType<any>;

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  gradient: { from: string; to: string };
  Icon: IconComponent;
  github: string;
  live: string;
  active: boolean;
}

type PanelKey = "tanishaa" | "sinha" | null;

/* ─── data ─────────────────────────────────────────────── */

const projects: Project[] = [
  {
    id: "python-project",
    name: "Codescope",           // TODO: replace with project name
    tagline: "Analyze any python repo",           // TODO: replace
    description: "Chrome extension to enable first time users understand python based repositories", // TODO: replace
    stack: ["Python"],                // TODO: replace
    gradient: { from: "#4facfe", to: "#ffd32a" },
    Icon: Code2,
    github: "#https://github.com/tan-sinha/Codescope",                      // TODO: replace
    live: "#",                        // TODO: replace
    active: true,
  },
  {
    id: "briefcase-project",
    name: "TripSync",        // TODO: replace with project name
    tagline: "Plan in minutes instead of weeks/months",           // TODO: replace
    description: "A web app to enable trip planning easier for groups and individuals", // TODO: replace
    stack: ["TB"],                   // TODO: replace
    gradient: { from: "#11998e", to: "#38ef7d" },
    Icon: Briefcase,
    github: "https://github.com/tan-sinha/TripSynce",                      // TODO: replace
    live: "#",                        // TODO: replace
    active: true,
  },
  {
    id: "inside-the-machine",
    name: "Inside the Machine",
    tagline: "Visualise laptop behind-the-scenes",
    description:
      "3-D visualisation of laptops dissembler to understand workflows between hardware triggered by processes.",
    stack: ["React", "Next.js", "Vercel"],
    gradient: { from: "#f953c6", to: "#b91d73" },
    Icon: Laptop,
    github: "#",   // TODO: replace
    live: "#",     // TODO: replace
    active: true,
  },
  { id: "p4", name: "Coming Soon", tagline: "", description: "", stack: [], gradient: { from: "#43e97b", to: "#38f9d7" }, Icon: Zap,      github: "#", live: "#", active: false },
  { id: "p5", name: "Coming Soon", tagline: "", description: "", stack: [], gradient: { from: "#667eea", to: "#764ba2" }, Icon: BarChart2, github: "#", live: "#", active: false },
  { id: "p6", name: "Coming Soon", tagline: "", description: "", stack: [], gradient: { from: "#f093fb", to: "#f5576c" }, Icon: Layers,   github: "#", live: "#", active: false },
];

const blogArticles = [
  // TODO: replace title + excerpt with real post content
  { id: "post-1", title: "Why most B2B onboarding fails in the first five minutes", excerpt: "Placeholder excerpt — swap in the real opening paragraph when the post is ready." },
  { id: "post-2", title: "Building a Chrome extension nobody asked for", excerpt: "Placeholder excerpt — swap in the real opening paragraph when the post is ready." },
  { id: "post-3", title: "What travel-planning software gets wrong", excerpt: "Placeholder excerpt — swap in the real opening paragraph when the post is ready." },
];

const socials = [
  { icon: Github,   label: "GitHub",   href: "https://github.com/tan-sinha" },
  { icon: Twitter,  label: "Twitter",  href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/tansinha/" },
  { icon: Mail,     label: "Email",    href: "mailto:sinhatan2002@gmail.com" },
];

/* ─── panel content ─────────────────────────────────────── */

const TERRACOTTA = "#C1654A";

const panelContent: Record<
  "tanishaa" | "sinha",
  { title: string; sections: { heading: string; body: string }[] }
> = {
  tanishaa: {
    title: "Hi, I'm Tanishaa.",
    sections: [
      { heading: "Who I am",        body: "Someone who thinks too much about why people click on things. Consumer by nature, curious by choice." },
      { heading: "why i'm here",    body: "To explore and showcase ideas which I wanted to bring to life in some capacity." },
      { heading: "when i'm offline", body: "Reading, playing TT, travelling, and honestly just talking to people from different walks of life." },
      { heading: "into",             body: "Consumer psychology · Workflow Automation· Travel · Music " },
    ],
  },
  sinha: {
    title: "Sinha.",
    sections: [
      { heading: "Studying",  body: "Focused on developing in three domains: people , tech and business." }, // TODO: add degree / school
      { heading: "Building",  body: "Side projects tinkering with my high IQ assistant" },
      { heading: "Areas",     body: "Product thinking · Consumer tech · Writing in public" },
      { heading: "Open To",   body: "Opportunities and good comversations." },
    ],
  },
};

/* ─── hooks ─────────────────────────────────────────────── */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ─── InfoPanel ─────────────────────────────────────────── */

function InfoPanel({ type, onClose }: { type: PanelKey; onClose: () => void }) {
  const open = type !== null;
  const isMobile = useIsMobile();

  const lastDataRef = useRef<(typeof panelContent)["tanishaa"] | null>(null);
  if (type) lastDataRef.current = panelContent[type];
  const data = lastDataRef.current;

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.07)",
          backdropFilter: open ? "blur(3px)" : "none",
          WebkitBackdropFilter: open ? "blur(3px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
          zIndex: 100,
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          zIndex: 110,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          overflowY: "auto",
          transition: "transform 0.4s cubic-bezier(.22,1,.36,1)",
          ...(isMobile
            ? {
                bottom: 0,
                left: 0,
                right: 0,
                height: "72vh",
                maxHeight: "72vh",
                borderRadius: "22px 22px 0 0",
                borderTop: `3px solid ${TERRACOTTA}`,
                transform: open ? "translateY(0)" : "translateY(100%)",
                padding: "32px 24px 48px",
              }
            : {
                top: 0,
                right: 0,
                bottom: 0,
                width: "360px",
                borderLeft: `3px solid ${TERRACOTTA}`,
                transform: open ? "translateX(0)" : "translateX(100%)",
                padding: "56px 40px 48px",
              }),
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position: "absolute",
            top: isMobile ? 18 : 24,
            right: isMobile ? 20 : 24,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#bbb",
            padding: 6,
            display: "flex",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          <X size={18} strokeWidth={2} />
        </button>

        {data && (
          <>
            <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "22px", fontWeight: 700, color: "#111", lineHeight: 1.1, marginBottom: "40px" }}>
              {data.title}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {data.sections.map((s) => (
                <div key={s.heading}>
                  <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "9px", fontWeight: 700, color: TERRACOTTA, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "7px" }}>
                    {s.heading}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#444", lineHeight: 1.72 }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ─── TracedIcon ────────────────────────────────────────── */
/* Overlays a black copy of the icon whose stroke draws itself in on hover,
   using pathLength normalization so the dash animation works uniformly
   across an icon's mixed path/circle/line children. */

function TracedIcon({ Icon, size, hovered }: { Icon: IconComponent; size: number; hovered: boolean }) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const svg = wrapRef.current?.querySelector("svg");
    if (!svg) return;
    const shapes = svg.querySelectorAll("path, line, circle, polyline, rect, ellipse");
    shapes.forEach((el) => {
      el.setAttribute("pathLength", "100");
      const style = (el as unknown as SVGElement).style;
      style.strokeDasharray = "100";
      style.transition = "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)";
      style.strokeDashoffset = hovered ? "0" : "100";
    });
  }, [hovered]);

  return (
    <span ref={wrapRef} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={size} color="#000" strokeWidth={1.8} />
    </span>
  );
}

/* ─── ProjectCard ───────────────────────────────────────── */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, visible } = useReveal();
  const isMobile = useIsMobile();
  const ProjectIcon = project.Icon;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? (project.active ? 1 : 0.35) : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${index * 55}ms, transform 0.55s ease ${index * 55}ms`,
        position: "relative",
        filter: project.active ? "none" : "saturate(0.3)",
      }}
      onMouseEnter={() => { if (project.active && !isMobile) setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tile */}
      <div style={{
        borderRadius: 20,
        padding: "12px 6px 9px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}>
        {/* Icon anchor — stays fixed size/position so the popup gap never moves */}
        <div style={{ width: 82, height: 82, position: "relative", flexShrink: 0 }}>
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.4s cubic-bezier(.34,1.56,.64,1)",
          }}>
            <ProjectIcon size={46} color={`url(#icon-grad-${project.id})`} strokeWidth={1.8} />
            <TracedIcon Icon={ProjectIcon} size={46} hovered={hovered} />
          </div>

          {/* Hover popup — desktop only, slides out from the icon's right edge */}
          {project.active && !isMobile && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "calc(100% + 4px)",
              zIndex: 50,
              width: 210,
              transform: hovered ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-14px)",
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? "auto" : "none",
              transition: "opacity 0.3s ease, transform 0.45s cubic-bezier(.22,1,.36,1)",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 12px 48px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.95)",
            }}>
              {/* Content */}
              <div style={{ padding: "7px 8px 7px" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#555", lineHeight: 1.65, marginBottom: 12 }}>{project.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {project.stack.map((t) => (
                    <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: project.gradient.from, background: `${project.gradient.from}1c`, padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <a href={project.github} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#222", fontWeight: 500 }}>
                    <Github size={12} strokeWidth={2} /> GitHub
                  </a>
                  <a href={project.live} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontSize: "11px", color: project.gradient.from, fontWeight: 600 }}>
                    <ArrowUpRight size={12} strokeWidth={2} /> Live
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: project.active ? "#222" : "#bbb", textAlign: "center", lineHeight: 1.3 }}>
          {project.name}
        </span>
      </div>
    </div>
  );
}

/* ─── TypingReveal ──────────────────────────────────────── */
/* Splits text into words and reveals them in sequence — sliding up + fading
   in with a staggered delay — starting automatically once the page has loaded. */

function TypingReveal({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 650);
    return () => clearTimeout(t);
  }, []);
  const words = text.split(" ");
  return (
    <div style={{
      fontFamily: "Inter, sans-serif",
      fontSize: "clamp(14px, 2.1vw, 19px)",
      fontWeight: 400,
      color: "#111",
      maxWidth: "560px",
      lineHeight: 1.55,
      marginTop: "32px",
    }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: `opacity 0.5s ease ${i * 45}ms, transform 0.5s cubic-bezier(.22,1,.36,1) ${i * 45}ms`,
          }}
        >
          {w}&nbsp;
        </span>
      ))}
    </div>
  );
}

/* ─── BlogRow ───────────────────────────────────────────── */
/* Accordion row — click the "+" (rotates into an "×") to expand/collapse the excerpt. */

function BlogRow({ title, excerpt }: { title: string; excerpt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "14px" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
          font: "inherit",
        }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(15px, 1.7vw, 18px)", fontWeight: 500, color: "#222", lineHeight: 1.4 }}>{title}</span>
        <Plus
          size={18}
          strokeWidth={1.8}
          color="#aaa"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(.22,1,.36,1)",
          }}
        />
      </button>
      <div style={{
        maxHeight: open ? 80 : 0,
        opacity: open ? 1 : 0,
        marginTop: open ? "10px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.35s cubic-bezier(.22,1,.36,1), opacity 0.3s ease, margin-top 0.35s ease",
      }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#999", lineHeight: 1.6 }}>{excerpt}</p>
      </div>
    </div>
  );
}

/* ─── RevealSection ─────────────────────────────────────── */

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── App ───────────────────────────────────────────────── */

export default function App() {
  const [panel, setPanel] = useState<PanelKey>(null);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .name-word {
          cursor: pointer;
          display: inline-block;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
          text-decoration: underline;
          text-decoration-color: transparent;
          text-decoration-thickness: 1px;
          text-underline-offset: 8px;
          transition: opacity 0.18s ease, text-decoration-color 0.18s ease;
        }
        .name-word:hover {
          opacity: 0.58;
          text-decoration-color: currentColor;
        }
        .nav-icon {
          display: flex;
          align-items: center;
          color: #aaa;
          transition: color 0.15s ease;
        }
        .nav-icon:hover { color: #111; }
      `}</style>

      <InfoPanel type={panel} onClose={() => setPanel(null)} />

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        padding: "16px 24px",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {socials.map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} title={label} className="nav-icon">
              <Icon size={26} strokeWidth={1.8} />
            </a>
          ))}
        </div>
      </nav>

      {/* ── Hero + Projects ── */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px", width: "100%" }}>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            {projects.map((p) => (
              <linearGradient key={p.id} id={`icon-grad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p.gradient.from} />
                <stop offset="100%" stopColor={p.gradient.to} />
              </linearGradient>
            ))}
          </defs>
        </svg>
        <div className="hero-grid">
          {/* LEFT — name, subheading, dynamic reveal text */}
          <div style={{ animation: "heroIn 0.8s cubic-bezier(.22,1,.36,1) forwards" }}>
            <h1 style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(37px, 6.8vw, 82px)",
              lineHeight: 0.95,
              color: "#111",
              letterSpacing: "-0.02em",
              marginBottom: "28px",
            }}>
              <span className="name-word" onClick={() => setPanel("tanishaa")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setPanel("tanishaa")}>
                Tanishaa
              </span>
              {" "}
              <span className="name-word" onClick={() => setPanel("sinha")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setPanel("sinha")}>
                Sinha
              </span>
            </h1>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(14px, 2.1vw, 19px)",
              fontWeight: 400,
              color: "#888",
              maxWidth: "560px",
              lineHeight: 1.55,
            }}>
              A consumer trying to understand consumers — while exploring the black box known as technology.
            </p>
            {/* TODO: paragraph text is a placeholder, to be replaced */}
            <TypingReveal text="More on how I think, build, and take things apart — written up right here soon." />
          </div>

          {/* RIGHT — projects, 2 × 3 */}
          <div style={{ marginTop: "24px" }}>
            <RevealSection>
              <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "16px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "28px" }}>
                Projects
              </p>
            </RevealSection>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}
              className="project-grid">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section style={{ padding: "0 24px 96px", width: "100%" }}>
        <RevealSection>
          <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "16px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "28px" }}>
            About
          </p>
          <div className="about-grid">
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(17px, 1.9vw, 20px)", color: "#222", lineHeight: 1.75, marginBottom: "16px" }}>
                I'm curious about the systems behind everyday technology — how products are built, how they influence behaviour, and what happens inside the machine most people never see.
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(15px, 1.7vw, 18px)", color: "#999", lineHeight: 1.75 }}>
                When I'm not building, I'm usually breaking something apart to understand how it works — or thinking about why people use technology the way they do.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {blogArticles.map((post) => (
                <BlogRow key={post.id} title={post.title} excerpt={post.excerpt} />
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── Footer ── */}
      <RevealSection>
        <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", borderTop: "1px solid #f0f0f0" }}>
          <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "12px", color: "#ccc" }}>
            © 2026 Tanishaa Sinha
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            {socials.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} title={label} className="nav-icon" style={{ color: "#ccc" }}>
                <Icon size={23} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </footer>
      </RevealSection>

    </div>
  );
}
