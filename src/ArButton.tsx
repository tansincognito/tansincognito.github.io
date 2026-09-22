import { useState } from "react";

/* "View in your space" — hands the baked brain model (scripts/export-brain.ts)
   to the phone's built-in AR viewer instead of shipping a WebXR/model-viewer
   runtime: iOS Safari opens a rel="ar" link to the .usdz in Quick Look,
   Android opens the .glb in Scene Viewer via an intent URL, and desktop
   (no AR) gets a QR code pointing a phone back at this section. */

type ArMode = "quicklook" | "sceneviewer" | "qr";

function detectArMode(): ArMode {
  if (typeof document === "undefined") return "qr";
  if (document.createElement("a").relList.supports("ar")) return "quicklook";
  if (/android/i.test(navigator.userAgent)) return "sceneviewer";
  return "qr";
}

const base = import.meta.env.BASE_URL;
const USDZ_PATH = `${base}ar/brain.usdz`;
const GLB_PATH = `${base}ar/brain.glb`;
const QR_PATH = `${base}ar/brain-qr.svg`;

function sceneViewerUrl() {
  const glb = new URL(GLB_PATH, window.location.href).href;
  const fallback = window.location.href;
  const params = `file=${encodeURIComponent(glb)}&mode=ar_preferred&title=${encodeURIComponent("How I think")}`;
  return (
    `intent://arvr.google.com/scene-viewer/1.0?${params}` +
    `#Intent;scheme=https;package=com.google.android.googlequicksearchbox;` +
    `action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(fallback)};end;`
  );
}

// Quick Look only intercepts a rel="ar" link whose first child is an <img>.
const CUBE_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>',
  );

const labelStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: "'DM Mono', monospace",
  fontSize: "10px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#999",
  background: "none",
  border: "1px solid #e2e2e2",
  padding: "8px 14px",
  cursor: "pointer",
  textDecoration: "none",
};

export default function ArButton() {
  const [mode] = useState(detectArMode);
  const [qrOpen, setQrOpen] = useState(false);

  const icon = <img src={CUBE_ICON} alt="" width={14} height={14} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", marginTop: "18px" }}>
      {mode === "quicklook" && (
        <a rel="ar" href={USDZ_PATH} style={labelStyle}>
          {icon}
          view in your space
        </a>
      )}
      {mode === "sceneviewer" && (
        <a href={sceneViewerUrl()} style={labelStyle}>
          {icon}
          view in your space
        </a>
      )}
      {mode === "qr" && (
        <>
          <button type="button" onClick={() => setQrOpen((v) => !v)} style={labelStyle} aria-expanded={qrOpen}>
            {icon}
            {qrOpen ? "hide qr" : "view in AR on your phone"}
          </button>
          {qrOpen && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <img src={QR_PATH} alt="QR code linking to this section for viewing the brain in AR" width={132} height={132} />
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#999", maxWidth: "220px", textAlign: "center", lineHeight: 1.5 }}>
                Scan, then tap "view in your space" to place the brain on your desk.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
