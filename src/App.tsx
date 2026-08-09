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

const thoughtExperiments = [
  // TODO: replace question + each flowchart stage with real content
  {
    id: "te-1",
    question: "Why does most B2B onboarding fail in the first five minutes?",
    badge: "Product",
    firstPrinciples: "Users don't read — they scan for the fastest path to value.",
    possibleExplanations: "Onboarding is usually built around the product team's mental model, not the user's.",
    counterArguments: "Some of that drop-off is just poor product-market fit, not a UX problem.",
    conclusion: "Cut every step that doesn't map directly to the user's first real 'aha' moment.",
    openQuestions: "How do you measure the 'aha' moment before it's already happened?",
  },
  {
    id: "te-2",
    question: "Why build a Chrome extension nobody asked for?",
    badge: "Build",
    firstPrinciples: "The best way to understand a workflow is to try to automate it yourself.",
    possibleExplanations: "Existing tools solve the general case, not the specific friction I actually feel.",
    counterArguments: "Building for an audience of one rarely generalises into something others want.",
    conclusion: "Ship it anyway — the learning compounds even if the tool doesn't.",
    openQuestions: "At what point does a personal tool become worth polishing for other people?",
  },
  {
    id: "te-3",
    question: "What does travel-planning software get wrong?",
    badge: "Notes",
    firstPrinciples: "Planning a trip is a group decision problem before it's a logistics problem.",
    possibleExplanations: "Most tools optimise for a single planner, not for consensus among a group.",
    counterArguments: "Group consensus tools add friction that solo planners don't want to pay for.",
    conclusion: "Default to solo-friendly, make group mode an explicit, opt-in layer on top.",
    openQuestions: "Can one interface serve both modes without feeling like two different products?",
  },
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
  { heading: "what i've built", body: "A chrome extension, a trip planner, and a laptop dissected — with more in the pipeline." },
  { heading: "where i'm headed", body: "Toward roles where product thinking, curiosity, and shipping fast all matter." },
];

const OMITTED_HEADINGS = new Set(["into", "Studying", "Building"]);

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
  { top: "6%", left: "83%" },
  { top: "2%", left: "48%" },
  { top: "22%", left: "34%", transform: "translateX(-100%)" },
  { top: "66%", left: "6%" },
  { top: "56%", left: "75%" },
  { top: "calc(65% + 9px)", left: "50%", transform: "translateX(-50%)" },
];

function PhraseScatter() {
  const isMobile = useIsMobile();
  const { ref, visible } = useReveal();
  const phrases = [...panelContent.tanishaa.sections, ...panelContent.sinha.sections, ...EXTRA_PHRASES]
    .filter((s) => !OMITTED_HEADINGS.has(s.heading));

  if (isMobile) {
    return (
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {phrases.map((s, i) => {
          const v = PHRASE_STYLES[i % PHRASE_STYLES.length];
          return (
            <ScrambleText
              key={s.heading}
              text={s.heading}
              hoverText={truncate(s.body)}
              style={{
                display: "block",
                fontFamily: "'Libre Baskerville', serif",
                fontSize: `clamp(22px, 8vw, ${v.fontSize})`,
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
            hoverText={truncate(s.body)}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              transform: visible ? restingTransform : hiddenTransform,
              display: "inline-block",
              maxWidth: v.maxWidth,
              fontFamily: "'Libre Baskerville', serif",
              fontSize: v.fontSize,
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
        fontSize: "clamp(37px, 6.8vw, 82px)",
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

/* ─── Typewriter ────────────────────────────────────────── */
/* One continuous, uniformly-styled block of text typed out character by
   character — like watching someone type a long document. Lives in a
   fixed-height panel that fills the remaining space next to the project
   grid; as the text grows past the panel's height, it smooth-scrolls up
   to keep the writing edge in view. A handful of key phrases get a thick
   pastel underline drawn behind the text (not over it) as they're typed,
   so the color bleeds through descenders and letter gaps like a
   highlighter held low against the baseline. */

const HIGHLIGHT_PHRASES = [
  { text: "understand how things and people work", color: "#FFDCC2" }, // peach
  { text: "create workflows", color: "#C7F0DC" }, // mint
  { text: "how products are built", color: "#E1D7F5" }, // lavender
];

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

function renderTyped(segments: { text: string; highlight: boolean; color?: string }[], upto: number) {
  const nodes: React.ReactNode[] = [];
  let consumed = 0;
  for (let i = 0; i < segments.length && consumed < upto; i++) {
    const seg = segments[i];
    const slice = seg.text.slice(0, upto - consumed);
    if (slice.length > 0) {
      nodes.push(
        seg.highlight ? (
          <span key={i} style={{
            fontWeight: 600,
            color: "#111",
            backgroundImage: `linear-gradient(${seg.color}, ${seg.color})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 9px",
            backgroundPosition: "0 92%",
          }}>
            {slice}
          </span>
        ) : (
          <span key={i}>{slice}</span>
        )
      );
    }
    consumed += seg.text.length;
  }
  return nodes;
}

function Typewriter({ text }: { text: string }) {
  const [typed, setTyped] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const segments = useRef(buildHighlightSegments(text)).current;

  useEffect(() => {
    if (typed.length >= text.length) return;
    const t = setTimeout(() => setTyped(text.slice(0, typed.length + 1)), 24);
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
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(18px, 2.8vw, 24px)", fontWeight: 400, color: "#111", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
        {renderTyped(segments, typed.length)}
        {!finished && <span className="typewriter-cursor">|</span>}
      </p>
    </div>
  );
}

/* ─── ThoughtCard ───────────────────────────────────────── */
/* Drawer pattern up top (unchanged): a dark face shows title + index at
   rest, sliding off to the left on hover to reveal a teaser underneath.
   Clicking the card toggles a flowchart panel below it that walks the
   question through First Principles → Possible Explanations → Counter
   Arguments → My Conclusion → Open Questions. */

type ThoughtExperiment = typeof thoughtExperiments[number];

const FLOW_STAGES: { key: keyof ThoughtExperiment; label: string }[] = [
  { key: "question", label: "Question" },
  { key: "firstPrinciples", label: "First Principles" },
  { key: "possibleExplanations", label: "Possible Explanations" },
  { key: "counterArguments", label: "Counter Arguments" },
  { key: "conclusion", label: "My Conclusion" },
  { key: "openQuestions", label: "Open Questions" },
];

function ThoughtCard({ index, te }: { index: number; te: ThoughtExperiment }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const num = String(index).padStart(2, "0");
  return (
    <div>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setExpanded((v) => !v)}
        style={{
          position: "relative",
          height: "76px",
          borderRadius: 0,
          overflow: "hidden",
          background: "#f7f7f7",
          cursor: "pointer",
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
            <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "14px", fontWeight: 700, color: "#111", marginBottom: "3px" }}>{te.question}</p>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: "#888",
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {te.firstPrinciples}
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
            {te.badge}
          </span>
          <span style={{
            flexShrink: 0,
            fontFamily: "'DM Mono', monospace",
            fontSize: "14px",
            color: "#bbb",
            transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform var(--dur-base) var(--ease-response)",
          }}>
            +
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
          transition: "transform 0.5s var(--ease-response)",
        }}>
          <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "14px", fontWeight: 700, color: "#fff" }}>{te.question}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{num}</span>
        </div>
      </div>

      {/* Flowchart panel — stages cascade in one after another on open
          (each stage its own opacity/translateY delay) so the reveal
          matches what the copy claims: walking the question through each
          step, not dumping all five at once. Collapsing skips the cascade
          (delay 0) since a staggered close reads as sluggish, not narrative. */}
      <div style={{
        maxHeight: expanded ? "1000px" : "0px",
        opacity: expanded ? 1 : 0,
        overflow: "hidden",
        background: "#fafafa",
        transition: `max-height var(--dur-section) var(--ease-reveal), opacity var(--dur-base) var(--ease-reveal)`,
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px" }}>
          {FLOW_STAGES.map((stage, i) => {
            const stageDelay = expanded ? 150 + i * 90 : 0;
            return (
              <div
                key={stage.key}
                style={{
                  width: "100%",
                  maxWidth: "540px",
                  textAlign: "center",
                  opacity: expanded ? 1 : 0,
                  transform: expanded ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity var(--dur-base) var(--ease-reveal) ${stageDelay}ms, transform var(--dur-base) var(--ease-reveal) ${stageDelay}ms`,
                }}
              >
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                  {stage.label}
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#111", lineHeight: 1.55 }}>
                  {te[stage.key]}
                </p>
                {i < FLOW_STAGES.length - 1 && (
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "16px", color: "#ccc", margin: "14px 0" }}>↓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
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
    { role: "Software Engineer II", org: "Dell Technologies", period: "Aug'24 — Current", blurb: "Created enterprise grade microservices , automation scripts , and lots of errors." }, // TODO: replace with real role
    { role: "Winter/Summer Intern", org: "Dell Technologies", period: "May '23 — May '24", blurb: "Did data analysis and automated testing to ensure smooth workflows" }, // TODO: replace with real role
    { role: "Writing & Editorial Freelancer", org: "Markovate", period: "TODO — Dates", blurb: "Explored writing technical articles " }, // TODO: replace with real role
  ],
  skills: ["Python", "REST APIs", "SQL", "React.JS", "Automation Workflows", "Distributed Systems", "CI/CD", "Data Visualisation", "LLM/RAG Applications"], // TODO: replace
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

function ResumeScanner() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [runId, setRunId] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMobile = useIsMobile();

  const runScan = () => {
    timeoutsRef.current.forEach(clearTimeout);
    setRunId((n) => n + 1);
    setStatus("scanning");
    timeoutsRef.current = [
      setTimeout(() => setStatus("flash"), 1000),
      setTimeout(() => setStatus("complete"), 1150),
    ];
  };

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  return (
    <div className="hero-grid">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", marginLeft: isMobile ? 0 : "20%" }}>
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
          <button className="scan-reset-btn" onClick={runScan}>Reset</button>
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
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#bbb", marginTop: "2px", marginBottom: "6px" }}>{e.org}</p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#111", lineHeight: 1.55 }}>{e.blurb}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={650}><div style={{ height: "1px", background: "#eee" }} /></Reveal>

            <div>
              <Reveal delay={700}><p style={RESUME_LABEL_STYLE}>Skills</p></Reveal>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {resumeData.skills.map((s, i) => (
                  <Reveal key={s} delay={760 + i * 70} scale>
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

            <Reveal delay={1150}><div style={{ height: "1px", background: "#eee" }} /></Reveal>

            <div>
              <Reveal delay={1200}><p style={RESUME_LABEL_STYLE}>Education</p></Reveal>
              <Reveal delay={1250}>
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

/* ─── App ───────────────────────────────────────────────── */

export default function App() {
  const navVisible = useNavVisible();
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
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        padding: "16px 24px",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        transform: navVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform var(--dur-base) var(--ease-response)",
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
          {/* LEFT — name, subheading, dynamic reveal text. Each cascades in
              after the last (0 / 120 / 220ms) instead of fading as one
              block, so the hero reads as a sequence — name first, then
              context, then the voice that keeps going — rather than a
              single blob that happens to contain three different things. */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ opacity: 0, animation: "heroIn 0.6s var(--ease-reveal) 0ms forwards" }}>
              <HeroName />
            </div>
            <div style={{ opacity: 0, animation: "heroIn 0.6s var(--ease-reveal) 120ms forwards" }}>
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
            </div>
            {/* TODO: placeholder text, to be replaced */}
            <div style={{ opacity: 0, animation: "heroIn 0.6s var(--ease-reveal) 220ms forwards", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              <Typewriter text="hi , I like to understand how things and people work , create workflows to make lives (or atleast my life) easier and try out things which expand my mind . I am super interested in how products are built, how they influence behaviour, and what happens behind-the-scenes most people never see. take a look around!" />
            </div>
          </div>

          {/* RIGHT — projects, 2 × 3 */}
          <div style={{ marginTop: "24px" }}>
            <RevealSection delay={40}>
              <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "16px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "28px" }}>
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
      <section style={{ padding: "0 24px 96px", width: "100%" }}>
        <RevealSection>
          <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "16px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "28px" }}>
            What I've Done
          </p>
        </RevealSection>
        <RevealSection delay={100}>
          <ResumeScanner />
        </RevealSection>
      </section>

      {/* ── About ── */}
      <section style={{ padding: "0 24px 96px", width: "100%" }}>
        <RevealSection>
          <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "16px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "28px" }}>
            Who I Am
          </p>
        </RevealSection>
        <RevealSection delay={100}>
          <PhraseScatter />
        </RevealSection>
        <RevealSection>
          <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "16px", fontWeight: 600, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "56px", marginBottom: "20px" }}>
            How do I think
          </p>
        </RevealSection>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {thoughtExperiments.map((te, i) => (
            <RevealSection key={te.id} delay={i * 70}>
              <ThoughtCard index={i + 1} te={te} />
            </RevealSection>
          ))}
        </div>
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
