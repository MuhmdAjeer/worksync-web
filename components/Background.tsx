export function Background() {
  return (
    <div style={styles.backgroundMain}>
      <div style={styles.backgroundMainBefore} />
      <div style={styles.backgroundMainAfter} />
      <div style={styles.backgroundContent} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  backgroundMain: {
    width: "100vw",
    minHeight: "100vh",
    position: "fixed",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "120px 24px 160px 24px",
    pointerEvents: "none",
  },
  backgroundMainBefore: {
    position: "absolute",
    content: '""',
    zIndex: 2,
    width: "100%",
    height: "100%",
    top: 0,
  },

  backgroundMainAfter: {
    content: '""',
    backgroundImage: "url(https://assets.dub.co/misc/grid.svg)",
    zIndex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    opacity: 0.4,
    filter: "invert(1)",
  },
  backgroundContent: {
    zIndex: 3,
    width: "100%",
    maxWidth: "640px",
    backgroundImage: `radial-gradient(at 25% 40%, hsla(280, 90%, 60%, 1) 0px, transparent 0%), 
                  radial-gradient(at 80% 20%, hsla(40, 90%, 70%, 1) 0px, transparent 50%),
                  radial-gradient(at 60% 100%, hsla(160, 90%, 60%, 1) 0px, transparent 50%),
                  radial-gradient(at 15% 30%, hsla(200, 80%, 65%, 1) 0px, transparent 50%),
                  radial-gradient(at 90% 95%, hsla(20, 60%, 70%, 1) 0px, transparent 50%),
                  radial-gradient(at 40% 50%, hsla(100, 70%, 70%, 1) 0px, transparent 50%),
                  radial-gradient(at 70% 60%, hsla(220, 70%, 75%, 1) 0px, transparent 50%)`,
    position: "absolute",
    height: "100%",
    filter: "blur(100px) saturate(150%)",
    top: "80px",
    opacity: 0.15,
  },
};
