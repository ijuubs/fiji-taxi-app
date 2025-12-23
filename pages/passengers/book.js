import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function BookRide() {
  const [status, setStatus] = useState('')
  const [rideId, setRideId] = useState(null)

  const bookRide = async () => {
    const { data, error } = await supabase
      .from('rides')
      .insert({
        passenger_id: crypto.randomUUID(),
        pickup_lat: -18.1416,
        pickup_lng: 178.4419,
        pickup_note: 'Suva pickup',
      })
      .select()
      .single()

    if (error) {
      setStatus(error.message)
    } else {
      setRideId(data.id)
      setStatus('Ride requested')
    }
  }

  useEffect(() => {
    if (!rideId) return

    const channel = supabase
      .channel('ride-status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rides', filter: `id=eq.${rideId}` },
        payload => {
          setStatus(`Ride status: ${payload.new.status}`)
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [rideId])

  return (
    <div style={styles.container}>
      <h2>Book a Taxi</h2>
      <button style={styles.button} onClick={bookRide}>
        Request Taxi
      </button>
      <p style={styles.status}>{status}</p>
    </div>
  )
}

const styles = {
  container: {
    padding: 20,
    fontFamily: 'system-ui',
  },
  button: {
    width: '100%',
    padding: 16,
    fontSize: 18,
    borderRadius: 8,
    border: 'none',
    background: '#0070f3',
    color: '#fff',
  },
  status: {
    marginTop: 20,
  },
}
