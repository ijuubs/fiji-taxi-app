import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function BookRide() {
  const [status, setStatus] = useState('')

  const bookRide = async () => {
    const { error } = await supabase.from('rides').insert({
      passenger_id: crypto.randomUUID(),
      pickup_lat: -18.1416,
      pickup_lng: 178.4419,
      pickup_note: 'Suva Test Pickup'
    })

    if (error) {
      setStatus(error.message)
    } else {
      setStatus('Ride requested successfully')
    }
  }

  return (
    <div>
      <h1>Book Taxi (Suva)</h1>
      <button onClick={bookRide}>Request Ride</button>
      <p>{status}</p>
    </div>
  )
}
