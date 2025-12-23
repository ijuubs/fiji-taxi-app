import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Book() {
  const [message, setMessage] = useState('')

  const bookRide = async () => {
    const { error } = await supabase.from('rides').insert({
      pickup_note: 'Suva pickup',
      pickup_lat: -18.1416,
      pickup_lng: 178.4419,
      status: 'requested'
    })

    setMessage(error ? error.message : 'Ride requested successfully')
  }

  return (
    <div>
      <h2>Passenger Booking</h2>
      <button onClick={bookRide}>Request Taxi</button>
      <p>{message}</p>
    </div>
  )
}
