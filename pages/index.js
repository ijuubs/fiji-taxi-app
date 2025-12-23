export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Fiji Taxi MVP</h1>
      <p style={styles.subtitle}>Choose your role</p>

      <a href="/passengers/book" style={styles.link}>
        <button style={styles.button}>🚕 Passenger</button>
      </a>

      <a href="/driver/online" style={styles.link}>
        <button style={styles.button}>🧭 Driver</button>
      </a>

      <a href="/controller/dashboard" style={styles.link}>
        <button style={styles.button}>📡 Controller</button>
      </a>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'system-ui, sans-serif',
    background: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#555',
  },
  link: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 15,
    textDecoration: 'none',
  },
  button: {
    width: '100%',
    padding: '14px 0',
    fontSize: 18,
    borderRadius: 8,
    border: 'none',
    background: '#111',
    color: '#fff',
  },
}
