import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DriverOnline() {
  const [status, setStatus] = useState('Offline')

  useEffect(() => {
    const driverId = crypto.randomUUID()

    const interval = setInterval(async () => {
      await supabase.from('driver_locations').upsert({
        driver_id: driverId,
        lat: -18.1416 + Math.random() / 1000,
        lng: 178.4419 + Math.random() / 1000,
        updated_at: new Date()
      })
    }, 5000)

    setStatus('Online (broadcasting location)')

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h1>Driver Online</h1>
      <p>{status}</p>
    </div>
  )
}
