import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Driver() {
  const driverId = 'driver-demo-1'

  useEffect(() => {
    const interval = setInterval(async () => {
      await supabase.from('driver_locations').upsert({
        driver_id: driverId,
        lat: -18.1416,
        lng: 178.4419
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h2>Driver Online</h2>
      <p>Sending live location…</p>
    </div>
  )
}
