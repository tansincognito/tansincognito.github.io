import { useState, useEffect, useLayoutEffect, useRef, lazy, Suspense } from "react";
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
  Cog,
  Puzzle,
} from "lucide-react";

const WireframeBrain = lazy(() => import("./WireframeBrain"));

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
    name: "Integrelli",           // TODO: replace with project name
    tagline: "Analyze any python repo",           // TODO: replace
    description: "Developer tool to help understand , design and debug third party integrations.", // TODO: replace
    stack: ["Next.js", "TypeScript", "Tailwind", "Zustand", "Zod"],
    gradient: { from: "#4facfe", to: "#ffd32a" },
    Icon: Puzzle,
    github: "https://github.com/tansincognito/integrelli",                      // TODO: replace
    live: "https://integrelli.vercel.app",                        // TODO: replace
    active: true,
  },
  {
    id: "briefcase-project",
    name: "TripSync",        // TODO: replace with project name
    tagline: "Plan in minutes instead of weeks/months",           // TODO: replace
    description: "A web app to enable trip planning easier for groups and individuals", // TODO: replace
    stack: ["React", "Vite", "Tailwind", "Supabase"],
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
    stack: ["React", "Next.js", "Vercel" , "vibe coded"],
    gradient: { from: "#f953c6", to: "#b91d73" },
    Icon: Laptop,
    github: "https://github.com/tansincognito/inside-the-machine",   // TODO: replace
    live: "https://inside-the-machine.vercel.app/",     // TODO: replace
    active: true,
  },
  { id: "p4", name: "Coming Soon", tagline: "", description: "", stack: [], gradient: { from: "#43e97b", to: "#38f9d7" }, Icon: Zap,      github: "#", live: "#", active: false },
  { id: "p5", name: "Coming Soon", tagline: "", description: "", stack: [], gradient: { from: "#667eea", to: "#764ba2" }, Icon: BarChart2, github: "#", live: "#", active: false },
  { id: "p6", name: "Coming Soon", tagline: "", description: "", stack: [], gradient: { from: "#f093fb", to: "#f5576c" }, Icon: Layers,   github: "#", live: "#", active: false },
];

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/tansinha/" },
  { icon: Twitter,  label: "Twitter",  href: "https://x.com/tansincognito?s=11" },
  { icon: Github,   label: "GitHub",   href: "https://github.com/tansincognito" },
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
      { heading: "what drives me",        body: "figuring out my purpose, people and potential" },
      { heading: "why i'm here",    body: "to showcase ideas which I wanted to bring to life in some capacity." },
      { heading: "when i'm offline", body: "travel , play TT , read , sing" },
      { heading: "into",             body: "Consumer psychology · Workflow Automation· Travel · Music " },
    ],
  },
  sinha: {
    title: "Sinha.",
    sections: [
      { heading: "Studying",  body: "Focused on developing in three domains: people , tech and business." }, // TODO: add degree / school
      { heading: "Building",  body: "Side projects tinkering with my high IQ assistant" },
      { heading: "Areas",     body: "Product engg · Consumer tech · Applied Technology · Writing" },
      { heading: "Open To",   body: "Opportunities around consumer tech, travel, AI, enterprise technology" },
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

/* Hides nav on scroll-down past a small threshold, brings it back on
   scroll-up — the only orientation feedback the page gives across four
   sections, without adding a new visual element (progress bar, dots). */
function useNavVisible() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 80) setVisible(true);
      else if (delta > 4) setVisible(false);
      else if (delta < -4) setVisible(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return visible;
}

/* Tracks how far the hero has scrolled past, as a 0→1 progress value:
   0 at the top of the page, 1 once the hero's bottom has reached the
   viewport top. Drives the hero "door" split and the résumé scanner's
   scroll-linked enlarge, so both react to the same physical scroll
   distance instead of drifting out of sync. */
function useHeroScrollProgress(heroRef: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const compute = () => {
      ticking = false;
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = -rect.top / rect.height;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [heroRef]);
  return progress;
}

/* Measures targetRef's top edge relative to outerRef's, in px — used to
   pin the "What I've Done" heading to the résumé scanner's actual top
   instead of a guessed viewport-relative offset, so it stays aligned as
   the scanner's height changes (e.g. once a scan completes). */
function useTopOffset(outerRef: React.RefObject<HTMLElement>, targetRef: React.RefObject<HTMLElement>, deps: unknown[]) {
  const [top, setTop] = useState(0);
  useEffect(() => {
    const outer = outerRef.current;
    const target = targetRef.current;
    if (!outer || !target) return;
    const measure = () => setTop(target.getBoundingClientRect().top - outer.getBoundingClientRect().top);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(target);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return top;
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
  const activeRef = useRef(false);

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
      onClick={() => {
        activeRef.current = !activeRef.current;
        scrambleTo(activeRef.current ? hoverText : text);
      }}
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
  { heading: "my most reread book is", body: "The Almanack of Naval Ravikant" },
  { heading: "where i'm headed", body: "Toward roles where product thinking, curiosity, and shipping fast all matter." },
];

const OMITTED_HEADINGS = new Set(["into", "Studying", "Building"]);

// PHRASE_STYLES is assigned by position, not by content — "when i'm
// offline" happens to land on the 54px (largest) variant, visibly out of
// scale with its neighbors. Override by heading text instead of
// reshuffling the style array and risking every other phrase's size.
const PHRASE_SIZE_OVERRIDES: Record<string, string> = {
  "when i'm offline": "30px",
};

/* Fixed set of size/color/weight/style variants — bright, mixed palette —
   so the "scattered" look is consistent across renders instead of relying
   on Math.random(). Libre Baskerville only ships 400/700 (and italic), so
   weight variety comes from alternating those two plus italics. */
const PHRASE_STYLES = [
  { fontSize: "42px", color: "#E8437E", fontWeight: 700, fontStyle: "normal", maxWidth: "260px" },
  { fontSize: "24px", color: "#111", fontWeight: 400, fontStyle: "italic", maxWidth: "200px" },
  { fontSize: "54px", color: "#FF6B35", fontWeight: 700, fontStyle: "normal", maxWidth: "320px" },
  { fontSize: "28px", color: "#2F6FED", fontWeight: 700, fontStyle: "italic", maxWidth: "220px" },
  { fontSize: "38px", color: TERRACOTTA, fontWeight: 700, fontStyle: "normal", maxWidth: "260px" },
  { fontSize: "26px", color: "#1FAA59", fontWeight: 400, fontStyle: "italic", maxWidth: "200px" },
  { fontSize: "48px", color: "#8B5CF6", fontWeight: 700, fontStyle: "normal", maxWidth: "290px" },
];

/* Explicit (top%, left%) per phrase — a real 2-D scatter across the full
   width of the canvas. Left values are spread across the whole 0-90% range
   (not clustered near either edge) so the collage actually fills the page
   instead of leaving a dead middle band; translateX handles the items
   anchored toward the right edge so their own width can't push them past
   100%. */
const PHRASE_POSITIONS: { top: string; left: string; transform?: string }[] = [
  { top: "0%", left: "0%" },
  { top: "6%", left: "83%" },
  { top: "2%", left: "48%" },
  { top: "22%", left: "34%", transform: "translateX(-100%)" },
  { top: "66%", left: "6%" },
  { top: "56%", left: "75%" },
  { top: "calc(65% + 9px)", left: "50%", transform: "translateX(-50%)" },
];

function PhraseScatter({ stacked = false }: { stacked?: boolean }) {
  const isMobile = useIsMobile();
  const { ref, visible } = useReveal();
  const phrases = [...panelContent.tanishaa.sections, ...panelContent.sinha.sections, ...EXTRA_PHRASES]
    .filter((s) => !OMITTED_HEADINGS.has(s.heading));

  if (isMobile || stacked) {
    return (
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {phrases.map((s, i) => {
          const v = PHRASE_STYLES[i % PHRASE_STYLES.length];
          return (
            <ScrambleText
              key={s.heading}
              text={s.heading}
              hoverText={s.body}
              style={{
                display: "block",
                fontFamily: "'Libre Baskerville', serif",
                fontSize: `clamp(22px, 8vw, ${PHRASE_SIZE_OVERRIDES[s.heading] ?? v.fontSize})`,
                fontWeight: v.fontWeight,
                fontStyle: v.fontStyle,
                color: v.color,
                lineHeight: 1.25,
                cursor: "pointer",
                whiteSpace: "normal",
                wordBreak: "break-word",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(14px)",
                transition: `opacity var(--dur-base) var(--ease-reveal) ${i * 45}ms, transform var(--dur-base) var(--ease-reveal) ${i * 45}ms`,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative", minHeight: "331px" }}>
      {phrases.map((s, i) => {
        const v = PHRASE_STYLES[i % PHRASE_STYLES.length];
        const p = PHRASE_POSITIONS[i % PHRASE_POSITIONS.length];
        const restingTransform = p.transform ? `${p.transform} translateY(0)` : "translateY(0)";
        const hiddenTransform = p.transform ? `${p.transform} translateY(14px)` : "translateY(14px)";
        return (
          <ScrambleText
            key={s.heading}
            text={s.heading}
            hoverText={s.body}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              transform: visible ? restingTransform : hiddenTransform,
              display: "inline-block",
              maxWidth: v.maxWidth,
              fontFamily: "'Libre Baskerville', serif",
              fontSize: PHRASE_SIZE_OVERRIDES[s.heading] ?? v.fontSize,
              fontWeight: v.fontWeight,
              fontStyle: v.fontStyle,
              color: v.color,
              lineHeight: 1.15,
              cursor: "pointer",
              whiteSpace: "normal",
              wordBreak: "break-word",
              opacity: visible ? 1 : 0,
              transition: `opacity var(--dur-base) var(--ease-reveal) ${i * 45}ms, transform var(--dur-base) var(--ease-reveal) ${i * 45}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── VideoEmbed ────────────────────────────────────────── */
/* Same corner-tick frame language as the résumé scanner's ghost document,
   wrapping a real looping, muted <video>. Always fills its container at
   100% — sizing is the caller's job via a wrapping element with a definite
   width. (A percentage width here, when the caller's box is itself an
   "auto"-sized grid/flex track, resolves against the near-zero intrinsic
   size those tracks fall back to — the video/corner-ticks are all
   position:absolute so they don't contribute to that intrinsic size — and
   the whole thing collapses to invisible.) */

const VIDEO_SRC = "/videos/myvideo.mp4";

function VideoEmbed() {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        background: "#f9f9f9",
        borderRadius: "16px",
        overflow: "hidden",
        opacity: visible ? 0.9 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity var(--dur-section) var(--ease-reveal), transform var(--dur-section) var(--ease-reveal)",
      }}
    >
      {CORNER_TICKS.map((c, i) => (
        <div key={i} style={{ position: "absolute", width: "14px", height: "14px", zIndex: 1, ...c }} />
      ))}
      <video
        src={VIDEO_SRC}
        muted
        loop
        autoPlay
        playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
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
      style.transition = "stroke-dashoffset 1.4s var(--ease-reveal)";
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
        transition: `opacity var(--dur-base) var(--ease-reveal) ${80 + index * 55}ms, transform var(--dur-base) var(--ease-reveal) ${80 + index * 55}ms`,
        position: "relative",
        // Each card is its own stacking context (the transform above forces
        // that), so the mobile popup's z-index only ever wins against ITS
        // OWN siblings — not against the card in the grid row below, which
        // sits later in DOM order and would otherwise paint (and intercept
        // taps) on top of an open popup. Promoting the whole card's z-index
        // while its popup is open lifts it above every other grid item.
        zIndex: hovered ? 5 : 0,
        filter: project.active ? "none" : "saturate(0.3)",
      }}
      onMouseEnter={() => { if (project.active && !isMobile) setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (project.active && isMobile) setHovered((v) => !v); }}
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

          {/* Popup — slides out from the icon's right edge on desktop hover;
              drops below the icon on mobile tap, since a right-edge popup
              would overflow the viewport from the grid's right column. */}
          {project.active && (
            <div style={isMobile ? {
              position: "absolute",
              top: "calc(100% + 8px)",
              left: "50%",
              zIndex: 50,
              width: "min(210px, 78vw)",
              transform: hovered ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-10px)",
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? "auto" : "none",
              transition: "opacity var(--dur-base) var(--ease-response), transform var(--dur-base) var(--ease-reveal)",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 12px 48px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.95)",
            } : {
              position: "absolute",
              top: "50%",
              left: "calc(100% + 4px)",
              zIndex: 50,
              width: 210,
              transform: hovered ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-14px)",
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? "auto" : "none",
              transition: "opacity var(--dur-base) var(--ease-response), transform var(--dur-base) var(--ease-reveal)",
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
                  <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#222", fontWeight: 500 }}>
                    <Github size={12} strokeWidth={2} /> GitHub
                  </a>
                  <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontSize: "11px", color: project.gradient.from, fontWeight: 600 }}>
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

/* ─── HeroName ──────────────────────────────────────────── */
/* The main "Tanishaa Sinha" heading — each word eases its own
   letter-spacing open on hover, independently of the other. */

function HoverWord({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        letterSpacing: hovered ? "0.02em" : "-0.02em",
        transition: "letter-spacing var(--dur-base) var(--ease-response)",
      }}
    >
      {text}
    </span>
  );
}

function HeroName() {
  return (
    <h1
      style={{
        fontFamily: "'Chakra Petch', sans-serif",
        fontWeight: 700,
        fontSize: "clamp(42px, 7.4vw, 82px)",
        lineHeight: 0.95,
        color: "#111",
        marginBottom: "28px",
        cursor: "default",
      }}
    >
      <HoverWord text="Tanishaa" />{" "}
      <HoverWord text="Sinha" />
    </h1>
  );
}

/* ─── HeroText ──────────────────────────────────────────── */
/* The full paragraph renders immediately (no typing effect) — only the
   pastel underline beneath each highlighted phrase animates in, growing
   left-to-right like a highlighter stroke, staggered phrase by phrase in
   the order they appear in the text. */

const HIGHLIGHT_PHRASES = [
  { text: "understand how things and people work", color: "#FFDCC2" }, // peach
  { text: "create workflows", color: "#C7F0DC" }, // mint
  { text: "how products are built", color: "#E1D7F5" }, // lavender
];

// TODO: placeholder text, to be replaced
const HERO_PARAGRAPH_TEXT = "Hi , I like to understand how things and people work , create workflows to make lives (or atleast my life) easier and do things which expand my mind . I am super interested in how products are built, how they influence behaviour, and what happens behind-the-scenes most people never see. take a look around!";

/* ─── closing-line highlight words ─────────────────────── */
/* Same pastel bleed-through underline as the hero typewriter's highlighted
   phrases, as the shared base — wider letter-spacing than body text and a
   slight scale-up on hover apply to all three. Each word then layers its
   own hover behavior on top: code swaps its "d" for angle brackets
   (co<>e), cognition swaps its "o" for a small spinning gear, curiosity
   gains a trailing "?" — all three accent marks share one dark-grey color. */

const ACCENT_COLOR = "#555";

const HIGHLIGHT_BASE: React.CSSProperties = {
  fontWeight: 600,
  color: "#111",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 9px",
  backgroundPosition: "0 92%",
  position: "relative",
  display: "inline-block",
  cursor: "default",
  letterSpacing: "0.04em",
  transition: "transform 0.25s var(--ease-response)",
};

function CodeHighlight({ text, color }: { text: string; color: string }) {
  const [hovered, setHovered] = useState(false);
  const dIndex = text.indexOf("d"); // the "d" in "code" — swaps for angle brackets, co<>e
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...HIGHLIGHT_BASE,
        backgroundImage: `linear-gradient(${color}, ${color})`,
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}
    >
      {text.split("").map((ch, i) => {
        if (i !== dIndex) return <span key={i}>{ch}</span>;
        // Fixed-width box, both states just toggle opacity in place — a
        // width-driven reveal grows the hovered box itself while it's
        // under the cursor, which can nudge the pointer outside it
        // mid-transition and fire a mouseleave/mouseenter loop ("glitching"
        // on hover). Keeping the box size constant avoids that entirely.
        return (
          <span key={i} style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "0.85em", verticalAlign: "baseline" }}>
            <span style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.15s ease" }}>{ch}</span>
            <span style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'DM Mono', monospace",
              fontWeight: 700,
              color: ACCENT_COLOR,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}>
              {"<>"}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function CognitionHighlight({ text, color }: { text: string; color: string }) {
  const [hovered, setHovered] = useState(false);
  const oIndex = text.indexOf("o"); // the "o" in "c-o-gnition" — cog[wheel]nition
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...HIGHLIGHT_BASE,
        backgroundImage: `linear-gradient(${color}, ${color})`,
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}
    >
      {text.split("").map((ch, i) => {
        if (i !== oIndex) return <span key={i}>{ch}</span>;
        return (
          <span key={i} style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "0.78em",
            height: "0.78em",
            verticalAlign: "-0.02em",
          }}>
            <span style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.15s ease" }}>{ch}</span>
            <Cog
              strokeWidth={2}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                color: ACCENT_COLOR,
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.15s ease",
                animation: hovered ? "spin-gear 1.1s linear infinite" : "none",
              }}
            />
          </span>
        );
      })}
    </span>
  );
}

function CuriosityHighlight({ text, color }: { text: string; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...HIGHLIGHT_BASE,
        backgroundImage: `linear-gradient(${color}, ${color})`,
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}
    >
      {text}
      <span style={{
        display: "inline-block",
        color: ACCENT_COLOR,
        fontWeight: 700,
        maxWidth: hovered ? "0.7em" : "0px",
        marginLeft: hovered ? "3px" : "0px",
        opacity: hovered ? 1 : 0,
        overflow: "hidden",
        verticalAlign: "-0.15em",
        transition: "max-width 0.25s ease, opacity 0.2s ease, margin-left 0.25s ease",
      }}>
        ?
      </span>
    </span>
  );
}

function buildHighlightSegments(text: string) {
  const matches: { start: number; end: number; color: string }[] = [];
  HIGHLIGHT_PHRASES.forEach(({ text: phrase, color }) => {
    const idx = text.indexOf(phrase);
    if (idx !== -1) matches.push({ start: idx, end: idx + phrase.length, color });
  });
  matches.sort((a, b) => a.start - b.start);

  const segments: { text: string; highlight: boolean; color?: string }[] = [];
  let cursor = 0;
  matches.forEach(({ start, end, color }) => {
    if (start > cursor) segments.push({ text: text.slice(cursor, start), highlight: false });
    segments.push({ text: text.slice(start, end), highlight: true, color });
    cursor = end;
  });
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlight: false });
  return segments;
}

// The wrapping div in the hero (see App()) fades this whole block in via
// `animation: heroIn 0.6s ... 220ms forwards`, finishing at ~820ms. Starting
// the underline reveal any earlier means the first phrase's whole animation
// plays out while the text is still invisible — it "doesn't work" because
// it's already finished by the time anyone can see it.
const HERO_TEXT_REVEAL_START_MS = 850;
const HIGHLIGHT_MS_PER_CHAR = 29;
const HIGHLIGHT_GAP_MS = 117;

// Same per-phrase duration/gap math as HeroText's own render loop, run
// once up front so a sibling (the typewriter lines below the paragraph)
// can know when the underline animations actually finish, instead of
// guessing a fixed delay that drifts out of sync if the paragraph text
// changes length.
function computeHighlightEndMs(text: string) {
  const segments = buildHighlightSegments(text);
  let cumulative = 0;
  segments.forEach((seg) => {
    if (!seg.highlight) return;
    const duration = Math.min(1170, Math.max(420, seg.text.length * HIGHLIGHT_MS_PER_CHAR));
    cumulative += duration + HIGHLIGHT_GAP_MS;
  });
  return cumulative;
}

function HeroText({ text }: { text: string }) {
  const segments = useRef(buildHighlightSegments(text)).current;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), HERO_TEXT_REVEAL_START_MS);
    return () => clearTimeout(t);
  }, []);

  let cumulativeDelay = 0;

  return (
    <div style={{ marginTop: "32px" }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(19px, 3vw, 24px)", fontWeight: 400, color: "#111", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
        {segments.map((seg, i) => {
          if (!seg.highlight) return <span key={i}>{seg.text}</span>;
          // Duration scales with phrase length — like a highlighter moving
          // at reading speed rather than a fixed-time wipe — and each
          // phrase's delay starts only once the previous one has finished,
          // so the three highlights draw in sequence, not in a burst.
          const duration = Math.min(1170, Math.max(420, seg.text.length * HIGHLIGHT_MS_PER_CHAR));
          const delay = cumulativeDelay;
          cumulativeDelay += duration + HIGHLIGHT_GAP_MS;
          return (
            <span key={i} style={{
              fontWeight: 600,
              color: "#111",
              backgroundImage: `linear-gradient(${seg.color}, ${seg.color})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: revealed ? "100% 9px" : "0% 9px",
              backgroundPosition: "0 92%",
              transition: `background-size ${duration}ms linear ${delay}ms`,
            }}>
              {seg.text}
            </span>
          );
        })}
      </p>
    </div>
  );
}

/* ─── TypewriterLines ───────────────────────────────────── */
/* Two lines typed out one at a time, terminal-style, reusing the same
   blinking-cursor class as the résumé scanner's "Scanning_" state. Starts
   only after the hero paragraph's highlight underlines finish drawing in
   (via startDelay, computed by computeHighlightEndMs) rather than on its
   own scroll-visibility, since it sits directly below that paragraph and
   was starting to type before the highlights above it had settled. The
   second line only begins after the first finishes typing. */

const TYPEWRITER_LINES = [
  "> building with intent , shipping with precision", // TODO: replace placeholder line
  "> still convinced curiosity beats certainty.", // TODO: replace placeholder line

];

/* Days alive, computed fresh on each render from birth date (2002-04-28)
   to now — never hardcoded, so it stays correct as time passes. */
function daysSinceBirth(): number {
  const birth = new Date(2002, 3, 28);
  const now = new Date();
  return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
}

function TypewriterLines({ lines, startDelay = 0, fontSize = "clamp(13px, 1.6vw, 15px)" }: { lines: string[]; startDelay?: number; fontSize?: string }) {
  const [displayed, setDisplayed] = useState<string[]>(() => lines.map(() => ""));
  const [lineIndex, setLineIndex] = useState(-1);

  useEffect(() => {
    const t = setTimeout(() => setLineIndex(0), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (lineIndex < 0 || lineIndex >= lines.length) return;
    const full = lines[lineIndex];
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed((prev) => {
        const next = [...prev];
        next[lineIndex] = full.slice(0, i);
        return next;
      });
      if (i >= full.length) {
        clearInterval(interval);
        setTimeout(() => setLineIndex((v) => v + 1), 300);
      }
    }, 32);
    return () => clearInterval(interval);
  }, [lineIndex, lines]);

  return (
    <div style={{ marginTop: "20px" }}>
      {lines.map((_, i) => (
        <p key={i} style={{
          margin: 0,
          minHeight: "1.7em",
          fontFamily: "'DM Mono', monospace",
          fontSize,
          color: "#888",
          lineHeight: 1.7,
        }}>
          {displayed[i].split(/(\d[\d,]*)/g).map((chunk, ci) =>
            /\d/.test(chunk) ? <span key={ci} style={{ color: "#555" }}>{chunk}</span> : chunk
          )}
          {i === lineIndex && lineIndex < lines.length && <span className="typewriter-cursor">_</span>}
        </p>
      ))}
    </div>
  );
}

/* ─── ResumeScanner ─────────────────────────────────────── */
/* A ghost résumé document scans perpetually; clicking runs two fast beam
   passes (1s) into a flash, then the right panel reveals parsed
   résumé content in stages — name, experience, skills, education. */

type ScanStatus = "idle" | "scanning" | "flash" | "complete";

const resumeData = {
  name: "Tanishaa Sinha",
  title: "Software Engineer", // TODO: confirm tagline
  experience: [
    { role: "Software Engineer II", org: "Dell Technologies", period: "Aug'24 — Current", blurb: "Built and deployed enterprise grade microservices , automation scripts , and lots of errors." }, // TODO: replace with real role
    { role: "Winter/Summer Intern", org: "Dell Technologies", period: "May '23 — May '24", blurb: "Analysed data for 300k+ orders , automated testing and had a lot of coffee chats/TT sessions" }, // TODO: replace with real role
    { role: "Writing & Editorial Freelancer", org: "Markovate", period: "May '22— July '22", blurb: "Explored writing technical articles " }, // TODO: replace with real role
  ],
  skills: [
    { label: "Build", items: ["Python", "React", "REST APIs", "SQL", "Distributed Systems", "System Design"] },
    { label: "Ship", items: ["Docker", "Kubernetes", "CI/CD", "Cloud", "Automation", "Observability"] },
    { label: "Understand", items: ["Data Visualisation", "Database Design", "Product Thinking", "Analytics"] },
    { label: "Explore", items: ["LLM Applications", "RAG", "Agents", "MCP"] },
  ],
  education: { degree: "Computer Science And Engineering", school: "Manipal University Jaipur", period: "2020 — 2024" }, // TODO: replace
};

const CORNER_TICKS: React.CSSProperties[] = [
  { top: 0, left: 0, borderTop: "1.5px solid #bbb", borderLeft: "1.5px solid #bbb" },
  { top: 0, right: 0, borderTop: "1.5px solid #bbb", borderRight: "1.5px solid #bbb" },
  { bottom: 0, left: 0, borderBottom: "1.5px solid #bbb", borderLeft: "1.5px solid #bbb" },
  { bottom: 0, right: 0, borderBottom: "1.5px solid #bbb", borderRight: "1.5px solid #bbb" },
];

function GhostDocument({ status }: { status: ScanStatus }) {
  const scanning = status === "scanning";
  return (
    <div style={{ position: "relative", width: "120px", height: "170px", background: "#f9f9f9", flexShrink: 0 }}>
      {CORNER_TICKS.map((c, i) => (
        <div key={i} style={{ position: "absolute", width: "9px", height: "9px", ...c }} />
      ))}

      <div style={{ padding: "13px 11px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ height: "6px", width: "65%", background: "#ddd" }} />
        <div style={{ height: "4px", width: "40%", background: "#e6e6e6", marginBottom: "8px" }} />
        <div style={{ height: "4px", width: "80%", background: "#e6e6e6" }} />
        <div style={{ height: "4px", width: "70%", background: "#e6e6e6" }} />
        <div style={{ height: "4px", width: "55%", background: "#e6e6e6", marginBottom: "8px" }} />
        <div style={{ height: "4px", width: "75%", background: "#e6e6e6" }} />
        <div style={{ height: "4px", width: "60%", background: "#e6e6e6" }} />
        <div style={{ height: "4px", width: "45%", background: "#e6e6e6" }} />
      </div>

      <div className={`scan-beam ${scanning ? "scan-beam-fast" : ""} ${status === "complete" ? "scan-beam-paused" : ""}`} />

      {scanning && (
        <div style={{ position: "absolute", bottom: "9px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "4px" }}>
          <span className="scan-dot" style={{ animationDelay: "0s" }} />
          <span className="scan-dot" style={{ animationDelay: "0.2s" }} />
          <span className="scan-dot" style={{ animationDelay: "0.4s" }} />
        </div>
      )}

      <div className={`scan-flash ${status === "flash" ? "scan-flash-active" : ""}`} />
    </div>
  );
}

function Reveal({ delay = 0, scale = false, children }: { delay?: number; scale?: boolean; children: React.ReactNode }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: shown ? 1 : 0,
      transform: shown ? (scale ? "scale(1)" : "translateX(0)") : (scale ? "scale(0.7)" : "translateX(-36px)"),
      transition: "opacity var(--dur-base) var(--ease-reveal), transform var(--dur-base) var(--ease-reveal)",
      display: scale ? "inline-block" : "block",
    }}>
      {children}
    </div>
  );
}

const RESUME_LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: "11px",
  fontWeight: 500,
  color: "#bbb",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginBottom: "10px",
};

function ResumeScanner({ scale = 1 }: { scale?: number }) {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [runId, setRunId] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMobile = useIsMobile();

  // Measures this element's own (untransformed) layout height — CSS
  // transforms don't change offsetHeight/ResizeObserver's contentRect, so
  // this stays the "natural" size even while `scale` visually enlarges it.
  // The gap that opens up below the natural box as scale grows is reserved
  // via marginBottom, so the enlarged scanner never overlaps the next
  // section instead of just visually overflowing into it.
  const scannerRef = useRef<HTMLDivElement>(null);
  const [naturalHeight, setNaturalHeight] = useState(0);

  useEffect(() => {
    const el = scannerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setNaturalHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const runScan = () => {
    timeoutsRef.current.forEach(clearTimeout);
    setRunId((n) => n + 1);
    setStatus("scanning");
    timeoutsRef.current = [
      setTimeout(() => setStatus("flash"), 1000),
      setTimeout(() => setStatus("complete"), 1150),
    ];
  };

  const resetScan = () => {
    timeoutsRef.current.forEach(clearTimeout);
    setStatus("idle");
  };

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  return (
    <div
      ref={scannerRef}
      className="hero-grid"
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        marginBottom: isMobile ? 0 : `${naturalHeight * (scale - 1)}px`,
        transform: isMobile ? "none" : `scale(${scale})`,
        transformOrigin: "top center",
        transition: "transform 0.05s linear",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
        <GhostDocument status={status} />
        <button
          className="scan-btn"
          disabled={status === "scanning" || status === "flash"}
          onClick={runScan}
        >
          {status === "idle" && "Scan Résumé"}
          {(status === "scanning" || status === "flash") && <>Scanning<span className="typewriter-cursor">_</span></>}
          {status === "complete" && "✓ extracted"}
        </button>
        {status === "complete" && (
          <button className="scan-reset-btn" onClick={resetScan}>Reset</button>
        )}
      </div>

      <div style={{ minWidth: "240px" }}>
        {status !== "complete" ? (
          <div>
            <p style={RESUME_LABEL_STYLE}>Awaiting scan</p>
            {[70, 90, 55, 80, 62].map((w, i) => (
              <div key={i} style={{ height: "3px", width: `${w}%`, background: "#eee", marginBottom: "12px" }} />
            ))}
          </div>
        ) : (
          <div key={runId} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <Reveal delay={0}>
              <div>
                <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 400, color: "#111", marginBottom: "6px" }}>
                  {resumeData.name}
                </h3>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "#888" }}>{resumeData.title}</p>
              </div>
            </Reveal>

            <Reveal delay={140}><div style={{ height: "1px", background: "#eee" }} /></Reveal>

            <div>
              <Reveal delay={200}><p style={RESUME_LABEL_STYLE}>Experience</p></Reveal>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {resumeData.experience.map((e, i) => (
                  <Reveal key={e.role} delay={260 + i * 110}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#111",
                        }}>
                          {e.role}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#bbb" }}>{e.period}</span>
                      </div>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#555", marginTop: "2px", marginBottom: "6px" }}>{e.org}</p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#111", lineHeight: 1.55 }}>{e.blurb}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={650}><div style={{ height: "1px", background: "#eee" }} /></Reveal>

            <div>
              <Reveal delay={700}><p style={RESUME_LABEL_STYLE}>Skills</p></Reveal>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {resumeData.skills.map((group, gi) => (
                  <Reveal key={group.label} delay={760 + gi * 90}>
                    <div>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", fontWeight: 700, color: "#111", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                        {group.label}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {group.items.map((s, i) => (
                          <Reveal key={s} delay={800 + gi * 90 + i * 50} scale>
                            <span style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "11px",
                              color: "#111",
                              background: "#fff",
                              border: "1px solid #ddd",
                              padding: "5px 12px",
                              borderRadius: "4px",
                            }}>
                              {s.toUpperCase()}
                            </span>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={1350}><div style={{ height: "1px", background: "#eee" }} /></Reveal>

            <div>
              <Reveal delay={1400}><p style={RESUME_LABEL_STYLE}>Education</p></Reveal>
              <Reveal delay={1450}>
                <div>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "15px", fontWeight: 700, color: "#111" }}>{resumeData.education.degree}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#888", marginTop: "3px" }}>{resumeData.education.school}, {resumeData.education.period}</p>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── RevealSection ─────────────────────────────────────── */

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: `opacity var(--dur-section) var(--ease-reveal) ${delay}ms, transform var(--dur-section) var(--ease-reveal) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── PositioningGraph ──────────────────────────────────── */
/* Deep/Broad (vertical) x Technical/Product-Human (horizontal) scatter
   chart — same four groups as the reference matrix, plotted as points
   instead of table cells. Dot colors cycle through the same "from"
   swatches used across the project-card gradients (see `projects` above)
   so the chart reads as part of the same palette. */

const POSITIONING_PALETTE = ["#4facfe", "#11998e", "#f953c6", "#43e97b", "#667eea", "#f093fb"];

// tx/ty are independent quadrant-relative offsets (0..1) for each point, so
// points scatter across both axes instead of stacking along a single line;
// resolved to viewBox coordinates in PositioningGraph.
const POSITIONING_QUADRANTS: { align: "start" | "end"; items: { label: string; tx: number; ty: number }[] }[] = [
  {
    // top-left: Deep x Technical
    align: "start",
    items: [
      { label: "System Design", tx: 0.15, ty: 0.05 },
      { label: "Backend", tx: 0.05, ty: 0.3 },
      { label: "APIs", tx: 0.4, ty: 0.5 },
      { label: "Automation", tx: 0.6, ty: 0.72 },
      { label: "Microservices", tx: 0.2, ty: 0.95 },
    ],
  },
  {
    // top-right: Deep x Product/Human
    align: "end",
    items: [
      { label: "Problem Framing", tx: 0.85, ty: 0.05 },
      { label: "Product Thinking", tx: 0.65, ty: 0.32 },
      { label: "Communication", tx: 0.9, ty: 0.6 },
      { label: "Ownership", tx: 0.65, ty: 0.92 },
    ],
  },
  {
    // bottom-left: Broad x Technical
    align: "start",
    items: [
      { label: "Intelligent Systems / AI", tx: 0.05, ty: 0.05 },
      { label: "DevOps", tx: 0.4, ty: 0.35 },
      { label: "Integrations", tx: 0.15, ty: 0.65 },
      { label: "Testing", tx: 0.5, ty: 0.95 },
    ],
  },
  {
    // bottom-right: Broad x Product/Human
    align: "end",
    items: [
      { label: "Research", tx: 0.85, ty: 0.05 },
      { label: "User Empathy", tx: 0.6, ty: 0.35 },
      { label: "Adaptability", tx: 0.9, ty: 0.65 },
      { label: "Cross-functional Thinking", tx: 0.65, ty: 0.95 },
    ],
  },
];

const POSITIONING_AXIS_LABEL_STYLE = { fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", fill: "#999" } as const;
const POSITIONING_POINT_LABEL_STYLE = { fontFamily: "'DM Mono', monospace", fontSize: "12px", fill: "#444" } as const;

function PositioningGraph() {
  const axisX = 350;
  const axisTop = 30;
  const axisBottom = 490;
  const axisLeft = 20;
  const axisRight = 680;
  const axisY = 260;

  const quadrantBounds = [
    { x0: 70, x1: 320, y0: 45, y1: 235 }, // top-left
    { x0: 380, x1: 650, y0: 45, y1: 235 }, // top-right
    { x0: 70, x1: 320, y0: 285, y1: 475 }, // bottom-left
    { x0: 380, x1: 650, y0: 285, y1: 475 }, // bottom-right
  ];

  return (
    <svg viewBox="0 0 700 540" style={{ width: "100%", maxWidth: "700px", height: "auto", overflow: "visible", display: "block", margin: "0 auto" }}>
      {/* horizontal axis — TECHNICAL / PRODUCT & HUMAN. Labels sit just
          inside the arrows (in the blank gap between the quadrant rows)
          rather than past the line ends, so they stay inside the viewBox
          instead of relying on overflow past the body's overflow-x:hidden. */}
      <line x1={axisLeft} y1={axisY} x2={axisRight} y2={axisY} stroke="#ddd" strokeWidth="1" />
      <polygon points={`${axisLeft + 15},${axisY - 6} ${axisLeft},${axisY} ${axisLeft + 15},${axisY + 6}`} fill="#ddd" />
      <text x={axisLeft + 25} y={axisY - 10} style={POSITIONING_AXIS_LABEL_STYLE} textAnchor="start">TECHNICAL</text>
      <polygon points={`${axisRight - 15},${axisY - 6} ${axisRight},${axisY} ${axisRight - 15},${axisY + 6}`} fill="#ddd" />
      <text x={axisRight - 25} y={axisY - 10} style={POSITIONING_AXIS_LABEL_STYLE} textAnchor="end">PRODUCT / HUMAN</text>

      {/* vertical axis — DEEP / BROAD */}
      <line x1={axisX} y1={axisBottom} x2={axisX} y2={axisTop} stroke="#ddd" strokeWidth="1" />
      <polygon points={`${axisX - 6},${axisTop + 15} ${axisX},${axisTop} ${axisX + 6},${axisTop + 15}`} fill="#ddd" />
      <text x={axisX} y={axisTop - 10} style={POSITIONING_AXIS_LABEL_STYLE} textAnchor="middle">DEEP</text>
      <polygon points={`${axisX - 6},${axisBottom - 15} ${axisX},${axisBottom} ${axisX + 6},${axisBottom - 15}`} fill="#ddd" />
      <text x={axisX} y={axisBottom + 24} style={POSITIONING_AXIS_LABEL_STYLE} textAnchor="middle">BROAD</text>

      {POSITIONING_QUADRANTS.map((q, qi) => {
        const bounds = quadrantBounds[qi];
        const labelDx = q.align === "start" ? 10 : -10;
        return q.items.map((p, i) => {
          const x = bounds.x0 + p.tx * (bounds.x1 - bounds.x0);
          const y = bounds.y0 + p.ty * (bounds.y1 - bounds.y0);
          const color = POSITIONING_PALETTE[(qi * 3 + i) % POSITIONING_PALETTE.length];
          return (
            <g key={p.label}>
              <circle cx={x} cy={y} r={4} fill={color} />
              <text x={x + labelDx} y={y + 4} style={POSITIONING_POINT_LABEL_STYLE} textAnchor={q.align}>{p.label}</text>
            </g>
          );
        });
      })}
    </svg>
  );
}

/* ─── Agent mode ────────────────────────────────────────── */
/* AI crawlers/agents (GPTBot, ClaudeBot, PerplexityBot, etc.) get a plain,
   semantic-HTML summary instead of the full animated/WebGL/video
   experience — same underlying data (projects, résumé, about content),
   rendered as headings and lists a model can parse without waiting on
   lazy-loaded three.js or hover-driven reveals. Auto-detected from the
   user agent string; also toggleable by hand from the nav for any visitor
   who just wants the fast, plain version. */

const AI_AGENT_UA_PATTERNS = [
  /GPTBot/i, /ChatGPT-User/i, /OAI-SearchBot/i, /CCBot/i, /anthropic-ai/i,
  /ClaudeBot/i, /Claude-Web/i, /PerplexityBot/i, /Google-Extended/i,
  /Bytespider/i, /Applebot-Extended/i, /Diffbot/i, /cohere-ai/i,
  /YouBot/i, /Amazonbot/i, /Bingbot/i,
];

function detectAgentUA() {
  if (typeof navigator === "undefined") return false;
  return AI_AGENT_UA_PATTERNS.some((re) => re.test(navigator.userAgent));
}

const AGENT_SECTION_STYLE: React.CSSProperties = { fontSize: "18px", fontWeight: 700, marginTop: "32px", marginBottom: "12px" };
const AGENT_LIST_STYLE: React.CSSProperties = { paddingLeft: "20px", marginBottom: "8px" };

function AgentModePage() {
  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "96px 24px 80px", fontFamily: "Inter, sans-serif", color: "#111", lineHeight: 1.6 }}>
      <h1 style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "30px", marginBottom: "4px" }}>{resumeData.name}</h1>
      <p style={{ color: "#555", marginBottom: "24px" }}>{resumeData.title} — A consumer trying to understand consumers, while exploring the black box known as technology.</p>

      <p>{HERO_PARAGRAPH_TEXT}</p>

      <h2 style={AGENT_SECTION_STYLE}>Projects</h2>
      <ul style={AGENT_LIST_STYLE}>
        {projects.filter((p) => p.active).map((p) => (
          <li key={p.id} style={{ marginBottom: "12px" }}>
            <strong>{p.name}</strong> — {p.tagline}. {p.description} Stack: {p.stack.join(", ")}.{" "}
            <a href={p.github}>GitHub</a>{p.live !== "#" && <> · <a href={p.live}>Live</a></>}
          </li>
        ))}
      </ul>

      <h2 style={AGENT_SECTION_STYLE}>Experience</h2>
      <ul style={AGENT_LIST_STYLE}>
        {resumeData.experience.map((e) => (
          <li key={e.role} style={{ marginBottom: "12px" }}>
            <strong>{e.role}</strong>, {e.org} ({e.period}) — {e.blurb}
          </li>
        ))}
      </ul>

      <h2 style={AGENT_SECTION_STYLE}>Skills</h2>
      <ul style={AGENT_LIST_STYLE}>
        {resumeData.skills.map((group) => (
          <li key={group.label} style={{ marginBottom: "6px" }}>
            <strong>{group.label}:</strong> {group.items.join(", ")}
          </li>
        ))}
      </ul>

      <h2 style={AGENT_SECTION_STYLE}>Education</h2>
      <p>{resumeData.education.degree}, {resumeData.education.school} ({resumeData.education.period})</p>

      <h2 style={AGENT_SECTION_STYLE}>About</h2>
      {(["tanishaa", "sinha"] as const).map((key) => (
        <div key={key} style={{ marginBottom: "12px" }}>
          {panelContent[key].sections.map((s) => (
            <p key={s.heading} style={{ marginBottom: "8px" }}>
              <strong>{s.heading}:</strong> {s.body}
            </p>
          ))}
        </div>
      ))}

      <h2 style={AGENT_SECTION_STYLE}>Contact</h2>
      <ul style={AGENT_LIST_STYLE}>
        {socials.map(({ label, href }) => (
          <li key={label}><a href={href}>{label}</a></li>
        ))}
      </ul>
    </main>
  );
}

/* ─── App ───────────────────────────────────────────────── */

export default function App() {
  const navVisible = useNavVisible();
  const isMobile = useIsMobile();
  const [agentMode, setAgentMode] = useState(detectAgentUA);
  const heroRef = useRef<HTMLElement>(null);
  const heroProgress = useHeroScrollProgress(heroRef);
  const resumeScale = 0.85 + heroProgress * 0.15;
  const resumeOuterRef = useRef<HTMLDivElement>(null);
  const resumeScannerWrapRef = useRef<HTMLDivElement>(null);
  const resumeHeadingTop = useTopOffset(resumeOuterRef, resumeScannerWrapRef, [isMobile, resumeScale]);
  // Measured on the untransformed row itself (not the phrases div that
  // gets moved), same split used for heroRef vs. its transformed children
  // above — measuring an element while also transforming it would feed
  // back into its own scroll progress.
  const whoIAmRef = useRef<HTMLDivElement>(null);
  const whoIAmProgress = useHeroScrollProgress(whoIAmRef);
  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-gear {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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
          transition: opacity var(--dur-micro) var(--ease-response), text-decoration-color var(--dur-micro) var(--ease-response);
        }
        .name-word:hover {
          opacity: 0.58;
          text-decoration-color: currentColor;
        }
        .nav-icon {
          display: flex;
          align-items: center;
          color: #aaa;
          transition: color var(--dur-micro) var(--ease-response);
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
        @keyframes scanBeam {
          0% { top: 0%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-beam {
          position: absolute;
          left: 5%;
          right: 5%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(17,17,17,0.55), transparent);
          animation: scanBeam 1.8s ease-in-out infinite;
        }
        .scan-beam-fast {
          animation-duration: 0.5s;
        }
        .scan-beam-paused {
          animation-play-state: paused;
          opacity: 0;
        }
        @keyframes dotBlink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
        .scan-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #111;
          display: inline-block;
          animation: dotBlink 1.2s ease-in-out infinite;
        }
        .scan-flash {
          position: absolute;
          inset: 0;
          background: #111;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.1s ease;
        }
        .scan-flash-active {
          opacity: 0.55;
          transition: opacity 0.05s ease;
        }
        .scan-btn {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 9px 16px;
          background: #fff;
          color: #111;
          border: 1px solid #111;
          cursor: pointer;
          transition: background var(--dur-micro) var(--ease-response), color var(--dur-micro) var(--ease-response), transform var(--dur-micro) var(--ease-response);
        }
        .scan-btn:hover:not(:disabled) {
          background: #111;
          color: #fff;
        }
        .scan-btn:active:not(:disabled) {
          transform: scale(0.96);
        }
        .scan-btn:disabled {
          color: #bbb;
          border-color: #ddd;
          cursor: default;
        }
        .scan-reset-btn {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #888;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color var(--dur-micro) var(--ease-response), transform var(--dur-micro) var(--ease-response);
        }
        .scan-reset-btn:hover { color: #111; }
        .scan-reset-btn:active { transform: scale(0.94); }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform var(--dur-base) var(--ease-response)",
      }}>
        <button
          onClick={() => setAgentMode((v) => !v)}
          title="Plain, semantic-HTML view built for AI agents/crawlers"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: isMobile ? "11px" : "14px",
            color: "#111",
            letterSpacing: "0.04em",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          {agentMode ? "Exit" : "For Agents"}
        </button>
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isMobile && (
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "14px",
              color: "#111",
              letterSpacing: "0.04em",
              marginRight: "14px",
            }}>
              Find me on -&gt;
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            {socials.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} title={label} className="nav-icon" target="_blank" rel="noopener noreferrer">
                <Icon size={26} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {agentMode ? <AgentModePage /> : (
      <>
      {/* ── Hero + Projects ── */}
      <section ref={heroRef} style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px", width: "100%" }}>
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
          {/* LEFT — name, subheading, dynamic reveal text. Each cascades in
              after the last (0 / 120 / 220ms) instead of fading as one
              block, so the hero reads as a sequence — name first, then
              context, then the voice that keeps going — rather than a
              single blob that happens to contain three different things. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              transform: `translateX(${-heroProgress * 140}px)`,
              opacity: 1 - heroProgress,
              transition: "transform 0.05s linear, opacity 0.05s linear",
              pointerEvents: heroProgress > 0.5 ? "none" : "auto",
            }}
          >
            <div style={{ opacity: 0, animation: "heroIn 0.6s var(--ease-reveal) 0ms forwards" }}>
              <HeroName />
            </div>
            <div style={{ opacity: 0, animation: "heroIn 0.6s var(--ease-reveal) 120ms forwards" }}>
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(16px, 2.4vw, 19px)",
                fontWeight: 400,
                color: "#888",
                maxWidth: "560px",
                lineHeight: 1.55,
              }}>
                A consumer trying to understand consumers — while exploring the black box known as technology.
              </p>
            </div>
            {/* TODO: placeholder text, to be replaced */}
            <div style={{ opacity: 0, animation: "heroIn 0.6s var(--ease-reveal) 220ms forwards", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              <HeroText text={HERO_PARAGRAPH_TEXT} />
              <TypewriterLines lines={TYPEWRITER_LINES} startDelay={HERO_TEXT_REVEAL_START_MS + computeHighlightEndMs(HERO_PARAGRAPH_TEXT) + 600} fontSize="clamp(14px, 1.75vw, 16px)" />
            </div>
          </div>

          {/* RIGHT — projects, 2 × 3. On mobile, hero-grid collapses to a
              single stacked column, so tying this to heroProgress made it
              slide/fade away while scrolling through the hero itself,
              before "What I've Built" had even been read. Desktop keeps
              the door-split parallax; mobile just lets each project card's
              own on-scroll reveal (see ProjectCard's useReveal) handle it
              once the section comes into view. */}
          <div
            style={isMobile ? { marginTop: "24px" } : {
              marginTop: "24px",
              transform: `translateX(${heroProgress * 140}px)`,
              opacity: 1 - heroProgress,
              transition: "transform 0.05s linear, opacity 0.05s linear",
              pointerEvents: heroProgress > 0.5 ? "none" : "auto",
            }}
          >
            <RevealSection delay={40}>
              <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "22px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "28px" }}>
                What I've Built
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

      {/* ── Resume ── */}
      {/* Label and content reveal as two beats, not one blob — the label
          arrives, then the scanner follows, same lead-in used for every
          other section so scrolling into a new part of the page always
          reads as "heading, then what it's a heading for." */}
      <section style={{ padding: "0 24px 60px", width: "100%", minHeight: isMobile ? "auto" : "70vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* This wrapper is a normal-flow child of the padded section, so its
            left edge lands exactly where "Who I Am" and the other headings'
            text starts — 24/48/80px depending on breakpoint (index.css
            overrides section padding responsively). Anchoring the absolute
            heading to `left: 0` on THIS box, instead of a hardcoded px value
            on the section itself, is what keeps it aligned across
            breakpoints. RevealSection's own wrapper has a `transform` (which
            would otherwise become the containing block for an absolute
            child), so the heading is positioned on a plain div, not on
            RevealSection's div, with RevealSection nested inside for the
            reveal animation only.

            top is measured from the scanner's actual top edge (useTopOffset)
            rather than a guessed viewport-relative value, so the heading
            lines up with the top of the résumé object itself regardless of
            how much content is stacked underneath it.

            On mobile this absolute overlay isn't used at all — a fixed
            viewport-relative top plus a much taller stacked (non-scaled)
            scanner risked the heading landing mid-résumé instead of above
            it, so mobile falls back to a plain static heading in normal
            flow, like every other section label. */}
        <div ref={resumeOuterRef} style={{ position: "relative", width: "100%" }}>
          {isMobile ? (
            <RevealSection>
              <p style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "#bbb",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}>
                What I've Done
              </p>
            </RevealSection>
          ) : (
            <div style={{ position: "absolute", left: 0, top: `${resumeHeadingTop}px` }}>
              <RevealSection>
                <p style={{
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#bbb",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}>
                  What I've Done
                </p>
              </RevealSection>
            </div>
          )}
          <div ref={resumeScannerWrapRef}>
            <RevealSection delay={100}>
              <ResumeScanner scale={resumeScale} />
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── Positioning ── */}
      <section style={{ padding: "0 24px 96px", width: "100%" }}>
        <RevealSection>
          <PositioningGraph />
        </RevealSection>
      </section>

      {/* ── About ── */}
      <section style={{ padding: "0 24px 96px", width: "100%" }}>
        {/* whoIAmRef sits on this untransformed row so its scroll progress
            can be measured cleanly; only the phrases column inside actually
            moves. Progress reaches 1 once this row has fully scrolled past
            the viewport top — right around when "How do I think" arrives —
            so the phrases translate up and fade out over exactly that
            transition instead of drifting through the whole About section. */}
        <div
          ref={whoIAmRef}
          style={isMobile ? { display: "flex", flexDirection: "column", gap: "32px" } : {
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "40px",
            // Reserves enough room for the video's own natural height
            // (340px wide at a 4:5 aspect ratio ≈ 425px tall) plus the
            // scroll-driven phrase transform above — without it, the row
            // sized down to its shortest column and "How do I think"
            // crowded up against the video's bottom edge.
            minHeight: "85vh",
          }}
        >
          {/* On mobile the flex column otherwise renders in DOM order
              (phrases, video, heading) — every other section on the page
              leads with its heading, so the heading gets moved first here
              via `order` rather than reshuffling the JSX (which would also
              reorder the desktop grid's left-to-right column layout). */}
          <div style={{
            order: isMobile ? 2 : undefined,
            transform: `translateY(${-whoIAmProgress * 80}px)`,
            opacity: 1 - whoIAmProgress,
            transition: "transform 0.05s linear, opacity 0.05s linear",
            pointerEvents: whoIAmProgress > 0.6 ? "none" : "auto",
          }}>
            <RevealSection delay={100}>
              <PhraseScatter stacked />
            </RevealSection>
          </div>

          {/* Video's own width:100% fills whatever this wrapper gives it —
              a definite px width here (not a percentage) so the "auto"
              grid track sizes to it correctly on desktop. */}
          <div style={{ order: isMobile ? 3 : undefined, width: isMobile ? "100%" : "340px" }}>
            <RevealSection delay={140}>
              <VideoEmbed />
            </RevealSection>
          </div>

          <div style={{
            order: isMobile ? 1 : undefined,
            transform: `translateX(${whoIAmProgress * 80}px)`,
            opacity: 1 - whoIAmProgress,
            transition: "transform 0.05s linear, opacity 0.05s linear",
            pointerEvents: whoIAmProgress > 0.6 ? "none" : "auto",
          }}>
            <RevealSection>
              <p style={{
                fontFamily: "'Chakra Petch', sans-serif",
                fontSize: "26px",
                fontWeight: 600,
                color: "#bbb",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textAlign: isMobile ? "left" : "center",
              }}>
                Who Am I
              </p>
            </RevealSection>
            <div style={{ textAlign: isMobile ? "left" : "center", transform: isMobile ? undefined : "translateX(calc(5% - 4px))" }}>
              <TypewriterLines
                lines={[`based on the ${daysSinceBirth().toLocaleString()} days I've been here`]}
                startDelay={300}
                fontSize="clamp(15px, 1.9vw, 18px)"
              />
            </div>
          </div>
        </div>
        <RevealSection>
          <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "22px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "56px", marginBottom: "20px" }}>
            How do I think
          </p>
        </RevealSection>
        <RevealSection delay={70}>
          <Suspense fallback={<div style={{ width: "100%", maxWidth: "420px", aspectRatio: "1", margin: "12px auto 0" }} />}>
            <WireframeBrain />
          </Suspense>
        </RevealSection>
      </section>

      {/* ── Closing line ── */}
      <section style={{ padding: "0 24px 80px", width: "100%", textAlign: "center" }}>
        <RevealSection>
          <p style={{
            fontFamily: "'Libre Baskerville', serif",
            fontStyle: "italic",
            fontSize: "clamp(20px, 3.4vw, 30px)",
            color: "#111",
            maxWidth: "720px",
            margin: "0 auto",
            lineHeight: 1.55,
            letterSpacing: "0.015em",
          }}>
            In short, the goal is to max out using <CodeHighlight text="code" color="#FFDCC2" />,{" "}
            <CognitionHighlight text="cognition" color="#C7F0DC" />, and{" "}
            <CuriosityHighlight text="curiosity" color="#E1D7F5" />.
          </p>
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
              <a key={label} href={href} title={label} className="nav-icon" style={{ color: "#ccc" }} target="_blank" rel="noopener noreferrer">
                <Icon size={23} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </footer>
      </RevealSection>
      </>
      )}

    </div>
  );
}
