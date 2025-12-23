export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Fiji Taxi MVP</h1>

      <a href="/passengers/book">
        <button>Passenger</button>
      </a>

      <br /><br />

      <a href="/driver/online">
        <button>Driver</button>
      </a>

      <br /><br />

      <a href="/controller/dashboard">
        <button>Controller</button>
      </a>
    </div>
  )
}
