/* Bakes the wireframe brain into public/ar/brain.glb (Android Scene Viewer)
   and public/ar/brain.usdz (iOS Quick Look). Native AR viewers can't draw
   GL line primitives, so each wireframe edge becomes a thin cylinder and
   they're all merged into one mesh. Also writes the desktop QR code that
   sends a phone to the brain section. Run with `npm run export:brain`
   whenever brainGeometry.ts or SITE_URL changes; outputs are committed. */

import { mkdirSync, writeFileSync } from "node:fs";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
import QRCode from "qrcode";
import { buildBrainEdges } from "../src/brainGeometry.ts";

const SITE_URL = "https://tansincognito.github.io/#how-i-think";

// GLTFExporter reads its output Blob through FileReader, which Node lacks.
class NodeFileReader {
  result: ArrayBuffer | string | null = null;
  onloadend: (() => void) | null = null;
  readAsArrayBuffer(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = `data:${blob.type};base64,${Buffer.from(buf).toString("base64")}`;
      this.onloadend?.();
    });
  }
}
Object.assign(globalThis, { FileReader: NodeFileReader });

const TUBE_RADIUS = 0.009; // model units, before real-world scaling
const REAL_LENGTH_M = 0.3; // front-to-back length once placed in AR

const edges = buildBrainEdges();
const pos = edges.attributes.position;
const a = new THREE.Vector3();
const b = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);
const tubes: THREE.BufferGeometry[] = [];

for (let i = 0; i < pos.count; i += 2) {
  a.fromBufferAttribute(pos, i);
  b.fromBufferAttribute(pos, i + 1);
  const dir = b.clone().sub(a);
  const tube = new THREE.CylinderGeometry(TUBE_RADIUS, TUBE_RADIUS, dir.length(), 5, 1, true);
  tube.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir.normalize()));
  tube.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  tubes.push(tube);
}

const merged = mergeGeometries(tubes);
if (!merged) throw new Error("mergeGeometries failed");

// Scale to real-world metres and rest the base on the floor plane, since
// both AR viewers place the model's origin on the detected surface.
merged.computeBoundingBox();
const size = new THREE.Vector3();
merged.boundingBox!.getSize(size);
const s = REAL_LENGTH_M / Math.max(size.x, size.y, size.z);
merged.scale(s, s, s);
merged.computeBoundingBox();
merged.translate(0, -merged.boundingBox!.min.y, 0);
merged.computeVertexNormals();

const mesh = new THREE.Mesh(
  merged,
  new THREE.MeshStandardMaterial({ color: "#181818", roughness: 0.55, metalness: 0 }),
);
mesh.name = "Brain";
const scene = new THREE.Scene();
scene.add(mesh);

mkdirSync("public/ar", { recursive: true });

const glb = await new GLTFExporter().parseAsync(scene, { binary: true });
writeFileSync("public/ar/brain.glb", Buffer.from(glb as ArrayBuffer));

const usdz = await new USDZExporter().parseAsync(scene);
writeFileSync("public/ar/brain.usdz", usdz);

const qr = await QRCode.toString(SITE_URL, { type: "svg", margin: 1, color: { dark: "#111111", light: "#ffffff" } });
writeFileSync("public/ar/brain-qr.svg", qr);

console.log(
  `edges=${pos.count / 2} tris=${merged.index ? merged.index.count / 3 : pos.count / 3} ` +
    `glb=${(glb as ArrayBuffer).byteLength}B usdz=${usdz.byteLength}B`,
);
