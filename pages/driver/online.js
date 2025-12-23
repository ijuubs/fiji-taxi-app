import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DriverOnline() {
  const [status, setStatus] = useState('Offline')
  const driverId = crypto.randomUUID()

  useEffect(() => {
    setStatus('Online – sending location')

    const interval = setInterval(async () => {
      await supabase.from('driver_locations').upsert({
        driver_id: driverId,
        lat: -18.1416 + Math.random() / 1000,
        lng: 178.4419 + Math.random() / 1000,
        updated_at: new Date(),
      })
    }, 5000)

    const channel = supabase
      .channel('driver-assignments')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rides' },
        payload => {
          if (payload.new.driver_id === driverId) {
            alert('You have been assigned a ride!')
          }
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div style={styles.container}>
      <h2>Driver Status</h2>
      <p style={styles.status}>{status}</p>
    </div>
  )
}

const styles = {
  container: {
    padding: 20,
    fontFamily: 'system-ui',
  },
  status: {
    fontSize: 18,
    marginTop: 10,
    color: 'green',
  },
}
