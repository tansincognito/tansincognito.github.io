import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

/* ─── WireframeBrain ────────────────────────────────────── */
/* A genuinely volumetric 3-D brain — an icosphere displaced by layered
   simplex noise for cortical folds, carved by a Gaussian groove along
   the x=0 plane for the longitudinal fissure, flattened at the base,
   then rendered as a pure edge-line wireframe (no fill) so it reads as
   the same kind of x-ray line-art as a wireframe render, plus a tapered
   brain-stem cylinder fused into the base — both live in the same
   rotating group so the stem turns with the mesh, not bolted on
   separately. The mesh has real geometry — its silhouette is correct
   from every angle, not a flat image tilted in a perspective box.
   Rotation is driven by the mouse position over the whole container
   (not r3f raycasting, so the full square area is hoverable, not just
   where lines are drawn) and idles in a slow spin when the cursor isn't
   present. Clicking it opens a set of thought-experiment nodes branching
   out on both sides, connected back to the brain by neural-style lines.

   Lives in its own module (rather than App.tsx) so Vite code-splits the
   three.js/@react-three/fiber chunk behind a lazy import — this is the
   only place in the app that needs a WebGL dependency, and it shouldn't
   inflate the initial bundle for every other page load. */

type PointerState = { x: number; y: number; hovering: boolean };

function buildBrainGeometry() {
  const geo = new THREE.IcosahedronGeometry(1, 4);
  const noise3D = createNoise3D();
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const dir = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    dir.copy(v).normalize();
    const n1 = noise3D(dir.x * 2.2, dir.y * 2.2, dir.z * 2.2);
    const n2 = noise3D(dir.x * 5.2 + 9, dir.y * 5.2 + 9, dir.z * 5.2 + 9);
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

/* Tapered cylinder fused into the brain's underside. The main geometry's
   base (after the y=0.86 squash) sits around y≈-0.62, so the stem's top
   starts a little above that and drives down through it — the overlap is
   what reads as "fused" rather than "stuck on" once both are drawn as one
   wireframe. */
function buildStemGeometry() {
  const topRadius = 0.3;
  const bottomRadius = 0.13;
  const height = 0.8;
  const geo = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 12, 3);
  geo.translate(0, -0.5 - height / 2, 0);
  return geo;
}

function BrainMesh({ pointerRef, open }: { pointerRef: React.MutableRefObject<PointerState>; open: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const idleAngle = useRef(0);
  const brainGeometry = useMemo(buildBrainGeometry, []);
  const brainEdges = useMemo(() => new THREE.EdgesGeometry(brainGeometry, 12), [brainGeometry]);
  const stemGeometry = useMemo(buildStemGeometry, []);
  const stemEdges = useMemo(() => new THREE.EdgesGeometry(stemGeometry, 20), [stemGeometry]);

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
      <lineSegments geometry={stemEdges}>
        <lineBasicMaterial color="#181818" transparent opacity={0.7} />
      </lineSegments>
    </group>
  );
}

/* ─── thought nodes ─────────────────────────────────────── */

const THOUGHT_NODES = [
  { id: "t1", question: "Why does most onboarding fail in the first five minutes?", take: "Users scan for the fastest path to value, not the product team's mental model.", side: "left" as const },
  { id: "t2", question: "Why build tools nobody asked for?", take: "The best way to understand a workflow is to try to automate it yourself.", side: "right" as const },
  { id: "t3", question: "What does travel planning get wrong?", take: "It's a group consensus problem before it's a logistics one.", side: "left" as const },
  { id: "t4", question: "Why does curiosity compound?", take: "Each answer reveals the shape of the next question.", side: "right" as const },
  { id: "t5", question: "What makes a system feel alive?", take: "Feedback loops tight enough that cause and effect stay visible.", side: "left" as const },
];

function ThoughtNode({ question, take, shown, delay }: { question: string; take: string; shown: boolean; delay: number }) {
  return (
    <div style={{
      background: "#f7f7f7",
      padding: "14px 16px",
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(10px)",
      transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
    }}>
      <p style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "6px", lineHeight: 1.35 }}>
        {question}
      </p>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#888", lineHeight: 1.5 }}>
        {take}
      </p>
    </div>
  );
}

/* Schematic hub-and-spoke connectors from the brain's center out to each
   card — percentage-based against a 0-100 viewBox with non-scaling
   strokes, so it stays legible without measuring real DOM positions. */
function connectorPath(endX: number, endY: number) {
  const midX = (50 + endX) / 2;
  return `M 50 50 Q ${midX} ${endY} ${endX} ${endY}`;
}

function nodeY(index: number, count: number) {
  if (count === 1) return 50;
  return 12 + (index / (count - 1)) * 76;
}

export default function WireframeBrain() {
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, hovering: false });
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

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

  const leftNodes = THOUGHT_NODES.filter((n) => n.side === "left");
  const rightNodes = THOUGHT_NODES.filter((n) => n.side === "right");

  return (
    <div style={{ width: "100%", maxWidth: open ? "900px" : "420px", margin: "12px auto 0", transition: "max-width 0.5s var(--ease-response)" }}>
      <div style={{ position: "relative" }}>
        {open && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: shown ? 1 : 0, transition: "opacity 0.4s ease" }}
          >
            {leftNodes.map((n, i) => (
              <path key={n.id} d={connectorPath(8, nodeY(i, leftNodes.length))} stroke="#ccc" strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke" />
            ))}
            {rightNodes.map((n, i) => (
              <path key={n.id} d={connectorPath(92, nodeY(i, rightNodes.length))} stroke="#ccc" strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: open ? "1fr auto 1fr" : "1fr",
          alignItems: "center",
          gap: "20px",
          position: "relative",
          zIndex: 1,
        }}>
          {open && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {leftNodes.map((n, i) => (
                <ThoughtNode key={n.id} question={n.question} take={n.take} shown={shown} delay={i * 90} />
              ))}
            </div>
          )}

          <div
            onMouseEnter={() => { pointerRef.current.hovering = true; }}
            onMouseMove={handleMove}
            onMouseLeave={() => { pointerRef.current.hovering = false; }}
            onClick={() => setOpen((v) => !v)}
            style={{ width: "100%", maxWidth: "420px", aspectRatio: "1", cursor: "pointer", justifySelf: "center" }}
          >
            <Canvas camera={{ position: [0, 0, 3.9], fov: 40 }} gl={{ alpha: true, antialias: true }}>
              <BrainMesh pointerRef={pointerRef} open={open} />
            </Canvas>
          </div>

          {open && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {rightNodes.map((n, i) => (
                <ThoughtNode key={n.id} question={n.question} take={n.take} shown={shown} delay={i * 90} />
              ))}
            </div>
          )}
        </div>
      </div>

      <p style={{
        textAlign: "center",
        fontFamily: "'DM Mono', monospace",
        fontSize: "10px",
        color: "#bbb",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginTop: "10px",
      }}>
        {open ? "click to close" : "click to explore"}
      </p>
    </div>
  );
}
