import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [rides, setRides] = useState([])

  useEffect(() => {
    supabase.from('rides').select('*').then(({ data }) => {
      setRides(data || [])
    })
  }, [])

  return (
    <div>
      <h2>Controller Dashboard</h2>
      {rides.map(r => (
        <p key={r.id}>{r.pickup_note} — {r.status}</p>
      ))}
    </div>
  )
}
