"use client";

// Last line of defence: error.tsx cannot catch a failure in the root layout
// itself, because the boundary lives inside it. This one replaces the whole
// document, so it has to render its own <html> and <body> and cannot rely on
// the app's fonts or global stylesheet being present.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          background: "#05080a",
          color: "#e8efe9",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", letterSpacing: "0.16em", margin: 0 }}>SHRENIK.YD</h1>
        <p style={{ color: "#8fa3ab", fontSize: "0.85rem", maxWidth: "24rem", lineHeight: 1.7 }}>
          This page failed to load. You can still reach me at{" "}
          <a href="mailto:shrenikyd@gmail.com" style={{ color: "#39ff8e" }}>
            shrenikyd@gmail.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "transparent",
            border: "1px solid #1c2621",
            borderRadius: "999px",
            color: "#c9d1d9",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            padding: "0.85rem 2rem",
            textTransform: "uppercase",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
