import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

/* ─── WireframeBrain ────────────────────────────────────── */
/* A genuinely volumetric 3-D brain — an icosphere displaced by layered
   simplex noise for cortical folds, carved by a Gaussian groove along
   the x=0 plane for the longitudinal fissure, flattened at the base, then
   rendered as a pure edge-line wireframe (no fill) so it reads as the
   same kind of x-ray line-art as a wireframe render. The mesh has real
   geometry — its silhouette is correct from every angle, not a flat
   image tilted in a perspective box. Rotation is driven by the mouse
   position over the whole container (not r3f raycasting, so the full
   square area is hoverable, not just where lines are drawn) and idles in
   a slow spin when the cursor isn't present. Clicking it opens a set of
   thought-experiment nodes branching out on both sides, connected back
   to the brain by neural-style lines; clicking one of those nodes in
   turn branches three one-line follow-ups off of it — the same
   hub-and-spoke pattern one level deeper.

   Lives in its own module (rather than App.tsx) so Vite code-splits the
   three.js/@react-three/fiber chunk behind a lazy import — this is the
   only place in the app that needs a WebGL dependency, and it shouldn't
   inflate the initial bundle for every other page load. */

type PointerState = { x: number; y: number; hovering: boolean };

function useIsMobile() {
  const [mobile, setMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function buildBrainGeometry() {
  const geo = new THREE.IcosahedronGeometry(1, 4);
  const noise3D = createNoise3D();
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const dir = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    dir.copy(v).normalize();
    // abs(dir.x) mirrors the noise sample across the x=0 fissure plane, so
    // both hemispheres get identical fold patterns — without this, raw
    // noise gives each side unrelated bumps and the mesh's visual mass
    // skews off-axis even though the fissure is geometrically centered.
    const n1 = noise3D(Math.abs(dir.x) * 2.2, dir.y * 2.2, dir.z * 2.2);
    const n2 = noise3D(Math.abs(dir.x) * 5.2 + 9, dir.y * 5.2 + 9, dir.z * 5.2 + 9);
    const fold = n1 * 0.09 + n2 * 0.045;
    const fissure = Math.exp(-((dir.x / 0.1) ** 2)) * 0.24 * Math.max(dir.y * 0.5 + 0.5, 0);
    const flattenBase = dir.y < -0.25 ? (dir.y + 0.25) * 0.35 : 0;
    const r = 1 + fold - fissure + flattenBase;
    v.copy(dir).multiplyScalar(r);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.scale(1, 0.86, 1.15);
  return geo;
}

function BrainMesh({ pointerRef, open }: { pointerRef: React.MutableRefObject<PointerState>; open: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const idleAngle = useRef(0);
  const brainGeometry = useMemo(buildBrainGeometry, []);
  const brainEdges = useMemo(() => new THREE.EdgesGeometry(brainGeometry, 12), [brainGeometry]);

  useFrame((_, delta) => {
    const p = pointerRef.current;
    let targetX: number;
    let targetY: number;
    if (p.hovering && !open) {
      targetX = 0.12 - p.y * 0.55;
      targetY = p.x * 1.0;
      idleAngle.current = targetY;
    } else if (open) {
      targetX = 0.12;
      targetY = idleAngle.current;
    } else {
      idleAngle.current += delta * 0.22;
      targetX = 0.12;
      targetY = idleAngle.current;
    }
    const g = groupRef.current;
    if (g) {
      g.rotation.x += (targetX - g.rotation.x) * 0.06;
      g.rotation.y += (targetY - g.rotation.y) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={brainEdges}>
        <lineBasicMaterial color="#181818" transparent opacity={0.82} />
      </lineSegments>
    </group>
  );
}

/* ─── thought nodes ─────────────────────────────────────── */

const THOUGHT_NODES = [
  {
    id: "t1",
    question: "Why does most onboarding fail in the first five minutes?",
    take: "Users scan for the fastest path to value, not the product team's mental model.",
    side: "left" as const,
    subs: [
      "The fastest path is rarely the one designers imagine.",
      "Every extra step costs more attention than it earns trust.",
      "The first success moment matters more than the full tour.",
    ],
  },
  {
    id: "t2",
    question: "Why build tools nobody asked for?",
    take: "The best way to understand a workflow is to try to automate it yourself.",
    side: "right" as const,
    subs: [
      "Automating a task exposes the assumptions hiding inside it.",
      "Unrequested tools surface needs people hadn't named yet.",
      "Building it yourself is faster than surveying for permission.",
    ],
  },
  {
    id: "t3",
    question: "What does travel planning get wrong?",
    take: "It's a group consensus problem before it's a logistics one.",
    side: "left" as const,
    subs: [
      "Most apps optimize for one planner, not a group.",
      "Consensus friction shows up before the itinerary does.",
      "Logistics are easy once everyone agrees on the plan.",
    ],
  },
  {
    id: "t4",
    question: "Why does curiosity compound?",
    take: "Each answer reveals the shape of the next question.",
    side: "right" as const,
    subs: [
      "Understanding one layer exposes the layer beneath it.",
      "Good answers are specific enough to provoke better questions.",
      "Compounding curiosity looks like depth from the outside.",
    ],
  },
  {
    id: "t5",
    question: "What makes a system feel alive?",
    take: "Feedback loops tight enough that cause and effect stay visible.",
    side: "left" as const,
    subs: [
      "Delay between action and feedback reads as dead weight.",
      "Visible cause and effect is what makes a system legible.",
      "Aliveness is a latency problem as much as a design one.",
    ],
  },
];

// Hoisted to module scope, not computed per-render: THOUGHT_NODES.filter(...)
// would otherwise return a new array identity every render, and these two
// arrays are a useEffect dependency in useConnectors that also calls
// setState — a new identity each render would re-fire that effect every
// render, forever.
const LEFT_THOUGHT_NODES = THOUGHT_NODES.filter((n) => n.side === "left");
const RIGHT_THOUGHT_NODES = THOUGHT_NODES.filter((n) => n.side === "right");

function ThoughtNode({ question, take, subs, shown, delay }: { question: string; take: string; subs: string[]; shown: boolean; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      style={{
        background: "#f7f7f7",
        padding: "14px 16px",
        cursor: "pointer",
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(10px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "6px", lineHeight: 1.35 }}>
          {question}
        </p>
        <span style={{
          flexShrink: 0,
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
          color: "#bbb",
          transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}>
          +
        </span>
      </div>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#888", lineHeight: 1.5 }}>
        {take}
      </p>

      <div style={{
        maxHeight: expanded ? "200px" : "0px",
        opacity: expanded ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.35s ease, opacity 0.3s ease",
      }}>
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px", borderLeft: "1px solid #ddd", paddingLeft: "10px" }}>
          {subs.map((s, i) => (
            <p key={i} style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#999", lineHeight: 1.5 }}>
              {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

type ConnectorPath = { id: string; d: string };

/* Hub-and-spoke connectors from the brain's edge out to each card — drawn
   from real measured DOM positions (pixels, 1:1, no viewBox scaling)
   rather than assumed percentages. The brain sits in a fixed-width `auto`
   grid column while the card columns are flexible `1fr`s, so the brain's
   share of the total width changes with viewport size; a percentage-based
   guess (e.g. "the right column is centered around x=92%") is only ever
   correct at one specific container width and visibly drifts off the
   actual card edges at every other size — which is why the right-side
   lines weren't reaching their cards. Recomputed via ResizeObserver so it
   also stays correct as a card's own height changes (e.g. expanding its
   sub-nodes shifts the cards below it). Desktop only — on mobile the
   layout collapses to a single stacked column where a hub-spoke diagram
   no longer corresponds to anything. */
function useConnectors(open: boolean, shown: boolean, leftNodes: typeof THOUGHT_NODES, rightNodes: typeof THOUGHT_NODES) {
  const gridRef = useRef<HTMLDivElement>(null);
  const brainBoxRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<ConnectorPath[]>([]);

  useEffect(() => {
    if (!open) return;
    const grid = gridRef.current;
    const brain = brainBoxRef.current;
    if (!grid || !brain) return;

    const measure = () => {
      const gridRect = grid.getBoundingClientRect();
      setSvgSize({ w: gridRect.width, h: gridRect.height });
      const brainRect = brain.getBoundingClientRect();
      const brainLeftX = brainRect.left - gridRect.left;
      const brainRightX = brainRect.right - gridRect.left;
      const brainY = brainRect.top + brainRect.height / 2 - gridRect.top;

      const next: ConnectorPath[] = [];
      [...leftNodes, ...rightNodes].forEach((n) => {
        const el = cardRefs.current.get(n.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cardY = r.top + r.height / 2 - gridRect.top;
        if (n.side === "left") {
          const cardX = r.right - gridRect.left;
          const midX = (cardX + brainLeftX) / 2;
          next.push({ id: n.id, d: `M ${brainLeftX} ${brainY} Q ${midX} ${cardY} ${cardX} ${cardY}` });
        } else {
          const cardX = r.left - gridRect.left;
          const midX = (cardX + brainRightX) / 2;
          next.push({ id: n.id, d: `M ${brainRightX} ${brainY} Q ${midX} ${cardY} ${cardX} ${cardY}` });
        }
      });
      setPaths(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    cardRefs.current.forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [open, shown, leftNodes, rightNodes]);

  return { gridRef, brainBoxRef, cardRefs, svgSize, paths };
}

export default function WireframeBrain() {
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, hovering: false });
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) { setShown(false); return; }
    const t = setTimeout(() => setShown(true), 30);
    return () => clearTimeout(t);
  }, [open]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };

  const leftNodes = LEFT_THOUGHT_NODES;
  const rightNodes = RIGHT_THOUGHT_NODES;
  const { gridRef, brainBoxRef, cardRefs, svgSize, paths } = useConnectors(open, shown, leftNodes, rightNodes);

  const brainCanvas = (
    <div
      ref={brainBoxRef}
      onMouseEnter={() => { pointerRef.current.hovering = true; }}
      onMouseMove={handleMove}
      onMouseLeave={() => { pointerRef.current.hovering = false; }}
      onClick={() => setOpen((v) => !v)}
      style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", aspectRatio: "1", cursor: "pointer", justifySelf: "center", margin: isMobile ? "0 auto" : undefined }}
    >
      <Canvas camera={{ position: [0, 0, 3.9], fov: 40 }} gl={{ alpha: true, antialias: true }}>
        <BrainMesh pointerRef={pointerRef} open={open} />
      </Canvas>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: open && !isMobile ? "900px" : "460px", margin: "12px auto 0", transition: "max-width 0.5s var(--ease-response)" }}>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {brainCanvas}
          {open && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {THOUGHT_NODES.map((n, i) => (
                <ThoughtNode key={n.id} question={n.question} take={n.take} subs={n.subs} shown={shown} delay={i * 70} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div ref={gridRef} style={{
          display: "grid",
          gridTemplateColumns: open ? "1fr auto 1fr" : "1fr",
          alignItems: "center",
          gap: "20px",
          position: "relative",
        }}>
          {open && svgSize.w > 0 && (
            <svg
              width={svgSize.w}
              height={svgSize.h}
              style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: shown ? 1 : 0, transition: "opacity 0.4s ease" }}
            >
              {paths.map((p) => (
                <path key={p.id} d={p.d} stroke="#ccc" strokeWidth={1} fill="none" />
              ))}
            </svg>
          )}

          {open && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 1 }}>
              {leftNodes.map((n, i) => (
                <div key={n.id} ref={(el) => { if (el) cardRefs.current.set(n.id, el); else cardRefs.current.delete(n.id); }}>
                  <ThoughtNode question={n.question} take={n.take} subs={n.subs} shown={shown} delay={i * 90} />
                </div>
              ))}
            </div>
          )}

          {brainCanvas}

          {open && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 1 }}>
              {rightNodes.map((n, i) => (
                <div key={n.id} ref={(el) => { if (el) cardRefs.current.set(n.id, el); else cardRefs.current.delete(n.id); }}>
                  <ThoughtNode question={n.question} take={n.take} subs={n.subs} shown={shown} delay={i * 90} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p style={{
        textAlign: "center",
        fontFamily: "'DM Mono', monospace",
        fontSize: "10px",
        color: "#bbb",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginTop: "10px",
      }}>
        {open ? "click brain to close · click a card to go deeper" : "click to explore"}
      </p>
    </div>
  );
}
