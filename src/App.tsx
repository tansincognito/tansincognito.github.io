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
  // TODO: replace title + excerpt + badge with real post content
  { id: "post-1", title: "Why most B2B onboarding fails in the first five minutes", excerpt: "Placeholder excerpt — swap in the real opening paragraph when the post is ready.", badge: "Product" },
  { id: "post-2", title: "Building a Chrome extension nobody asked for", excerpt: "Placeholder excerpt — swap in the real opening paragraph when the post is ready.", badge: "Build" },
  { id: "post-3", title: "What travel-planning software gets wrong", excerpt: "Placeholder excerpt — swap in the real opening paragraph when the post is ready.", badge: "Notes" },
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

/* ─── ScrambleText ──────────────────────────────────────── */
/* Hovering a phrase scrambles it through random characters before
   resolving into a different string (a snippet of its body text), then
   scrambles back to the original heading on mouse-leave. */

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#";

function ScrambleText({ text, hoverText, style }: { text: string; hoverText: string; style: React.CSSProperties }) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrambleTo = (target: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((ch, i) => (i < iteration ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
          .join("")
      );
      iteration += target.length / 14;
      if (iteration >= target.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplay(target);
      }
    }, 30);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <span
      style={style}
      onMouseEnter={() => scrambleTo(hoverText)}
      onMouseLeave={() => scrambleTo(text)}
    >
      {display}
    </span>
  );
}

/* ─── PhraseScatter ─────────────────────────────────────── */
/* A static, artistic scatter of the section headings from both people's
   content — bold, oversized, mixed colors, spread horizontally along a
   shared baseline. Hovering a phrase scrambles it into a snippet of its
   body text via ScrambleText. */

const EXTRA_PHRASES = [
  { heading: "what i've built", body: "A chrome extension, a trip planner, and a laptop dissected — with more in the pipeline." },
  { heading: "where i'm headed", body: "Toward roles where product thinking, curiosity, and shipping fast all matter." },
];

const OMITTED_HEADINGS = new Set(["into", "Studying", "Building"]);

/* Fixed set of size/color/weight/style variants — bright, mixed palette —
   so the "scattered" look is consistent across renders instead of relying
   on Math.random(). Libre Baskerville only ships 400/700 (and italic), so
   weight variety comes from alternating those two plus italics. */
const PHRASE_STYLES = [
  { fontSize: "42px", color: "#E8437E", fontWeight: 700, fontStyle: "normal" },
  { fontSize: "24px", color: "#111", fontWeight: 400, fontStyle: "italic" },
  { fontSize: "54px", color: "#FF6B35", fontWeight: 700, fontStyle: "normal" },
  { fontSize: "28px", color: "#2F6FED", fontWeight: 700, fontStyle: "italic" },
  { fontSize: "38px", color: TERRACOTTA, fontWeight: 700, fontStyle: "normal" },
  { fontSize: "26px", color: "#1FAA59", fontWeight: 400, fontStyle: "italic" },
  { fontSize: "48px", color: "#8B5CF6", fontWeight: 700, fontStyle: "normal" },
];

function truncate(body: string, max = 22) {
  return body.length > max ? `${body.slice(0, max).trim()}…` : body;
}

/* Explicit (top%, left%) per phrase — a real 2-D scatter across the full
   width of the canvas. Left values are spread across the whole 0-90% range
   (not clustered near either edge) so the collage actually fills the page
   instead of leaving a dead middle band; translateX handles the items
   anchored toward the right edge so their own width can't push them past
   100%. */
const PHRASE_POSITIONS: { top: string; left: string; transform?: string }[] = [
  { top: "0%", left: "0%" },
  { top: "2%", left: "58%" },
  { top: "24%", left: "18%" },
  { top: "12%", left: "84%", transform: "translateX(-100%)" },
  { top: "66%", left: "6%" },
  { top: "56%", left: "81%" },
  { top: "calc(60% + 9px)", left: "55%", transform: "translateX(-50%)" },
];

function PhraseScatter() {
  const phrases = [...panelContent.tanishaa.sections, ...panelContent.sinha.sections, ...EXTRA_PHRASES]
    .filter((s) => !OMITTED_HEADINGS.has(s.heading));
  return (
    <div style={{ position: "relative", minHeight: "331px" }}>
      {phrases.map((s, i) => {
        const v = PHRASE_STYLES[i % PHRASE_STYLES.length];
        const p = PHRASE_POSITIONS[i % PHRASE_POSITIONS.length];
        return (
          <ScrambleText
            key={s.heading}
            text={s.heading}
            hoverText={truncate(s.body)}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              transform: p.transform,
              fontFamily: "'Libre Baskerville', serif",
              fontSize: v.fontSize,
              fontWeight: v.fontWeight,
              fontStyle: v.fontStyle,
              color: v.color,
              lineHeight: 1.05,
              cursor: "default",
              whiteSpace: "nowrap",
            }}
          />
        );
      })}
    </div>
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

/* ─── Typewriter ────────────────────────────────────────── */
/* One continuous, uniformly-styled block of text typed out character by
   character — like watching someone type a long document. Lives in a
   fixed-height panel that fills the remaining space next to the project
   grid; as the text grows past the panel's height, it smooth-scrolls up
   to keep the writing edge in view. */

function Typewriter({ text }: { text: string }) {
  const [typed, setTyped] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typed.length >= text.length) return;
    const t = setTimeout(() => setTyped(text.slice(0, typed.length + 1)), 35);
    return () => clearTimeout(t);
  }, [typed, text]);

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });
  }, [typed]);

  const finished = typed.length >= text.length;

  return (
    <div ref={panelRef} style={{
      flex: 1,
      minHeight: 0,
      overflowY: "hidden",
      marginTop: "32px",
    }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(21px, 2.8vw, 28px)", fontWeight: 400, color: "#111", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
        {typed}
        {!finished && <span className="typewriter-cursor">|</span>}
      </p>
    </div>
  );
}

/* ─── BlogCard ──────────────────────────────────────────── */
/* Drawer pattern: a full-width dark face shows just the title + index at
   rest. On hover it slides cleanly off to the left, revealing the
   structured content underneath — numbered sidebar, title, description,
   role badge. */

function BlogCard({ index, title, excerpt, badge }: { index: number; title: string; excerpt: string; badge: string }) {
  const [hovered, setHovered] = useState(false);
  const num = String(index).padStart(2, "0");
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        height: "76px",
        borderRadius: 0,
        overflow: "hidden",
        background: "#f7f7f7",
      }}
    >
      {/* Revealed content — always underneath */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "0 20px",
      }}>
        <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "20px", fontWeight: 700, color: "#e2e2e2", flexShrink: 0 }}>
          {num}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "14px", fontWeight: 700, color: "#111", marginBottom: "3px" }}>{title}</p>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            color: "#888",
            lineHeight: 1.4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {excerpt}
          </p>
        </div>
        <span style={{
          flexShrink: 0,
          fontFamily: "'DM Mono', monospace",
          fontSize: "9px",
          fontWeight: 600,
          color: TERRACOTTA,
          background: `${TERRACOTTA}1c`,
          padding: "3px 9px",
          borderRadius: 999,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>
          {badge}
        </span>
      </div>

      {/* Dark face — default state, slides off to the left on hover */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        transform: hovered ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.5s cubic-bezier(.65,0,.35,1)",
      }}>
        <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "14px", fontWeight: 700, color: "#fff" }}>{title}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{num}</span>
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typewriter-cursor {
          display: inline-block;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }
      `}</style>

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
          <div style={{ animation: "heroIn 0.8s cubic-bezier(.22,1,.36,1) forwards", display: "flex", flexDirection: "column" }}>
            <h1 style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(37px, 6.8vw, 82px)",
              lineHeight: 0.95,
              color: "#111",
              letterSpacing: "-0.02em",
              marginBottom: "28px",
            }}>
              Tanishaa Sinha
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
            {/* TODO: placeholder text, to be replaced */}
            <Typewriter text="Hi, this is a demo. More on how I think, build, and take things apart. I'm a consumer trying to understand consumers, curious about the systems behind everyday technology — how products are built, how they influence behaviour, and what happens inside the machine most people never see. Writing this up properly, soon. Thanks for scrolling this far." />
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
          <PhraseScatter />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "56px" }}>
            {blogArticles.map((post, i) => (
              <BlogCard key={post.id} index={i + 1} title={post.title} excerpt={post.excerpt} badge={post.badge} />
            ))}
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
