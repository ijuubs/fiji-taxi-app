export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
      <h1>Fiji Taxi MVP</h1>

      <a href="/passengers/book"><button>Passenger</button></a>
      <a href="/driver/online"><button>Driver</button></a>
      <a href="/controller/dashboard"><button>Controller</button></a>
    </div>
  )
}
