
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ControllerDashboard() {
  const [rides, setRides] = useState([])

  useEffect(() => {
    loadRides()

    const channel = supabase
      .channel('rides-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rides' },
        payload => {
          loadRides()
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const loadRides = async () => {
    const { data } = await supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false })

    setRides(data || [])
  }

  return (
    <div>
      <h1>Controller Dashboard</h1>
      {rides.map(r => (
        <div key={r.id}>
          <p>Status: {r.status}</p>
          <p>Pickup: {r.pickup_note}</p>
        </div>
      ))}
    </div>
  )
                 }
