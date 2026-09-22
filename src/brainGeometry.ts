import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

/* Shared by the on-page WireframeBrain and scripts/export-brain.ts, which
   bakes the same mesh into the .glb/.usdz files served for phone AR. The
   noise is seeded so both produce the identical brain — an unseeded
   createNoise3D() would give the AR model different folds from the one on
   the page. */

const BRAIN_SEED = 20020214;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildBrainGeometry() {
  const geo = new THREE.IcosahedronGeometry(1, 4);
  const noise3D = createNoise3D(mulberry32(BRAIN_SEED));
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

export function buildBrainEdges() {
  return new THREE.EdgesGeometry(buildBrainGeometry(), 12);
}
