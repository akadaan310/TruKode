export function MilestoneBlockOverlay() {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Access blocked"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "42rem" }}>
        <p
          style={{
            fontSize: "clamp(1.75rem, 5vw, 3.25rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Client Refuses to pay Milestone #4.
        </p>
        <p
          style={{
            fontSize: "clamp(1.25rem, 3.5vw, 2rem)",
            fontWeight: 600,
            marginTop: "1.25rem",
            color: "#ff5a5a",
          }}
        >
          No access granted.
        </p>
      </div>
    </div>
  );
}
