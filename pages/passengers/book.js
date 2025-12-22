import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import maplibregl from 'maplibre-gl'

export default function PassengerBooking() {
  const [user, setUser] = useState(null)
  const [map, setMap] = useState(null)
  const [pickup, setPickup] = useState(null)
  const [pickupNote, setPickupNote] = useState('')
  const [ride, setRide] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (map) return

    const m = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [178.4419, -18.1416],
      zoom: 14
    })

    m.on('click', (e) => {
      setPickup({ lng: e.lngLat.lng, lat: e.lngLat.lat })
    })

    setMap(m)
  }, [map])

  useEffect(() => {
    if (!map || !pickup) return
    new maplibregl.Marker().setLngLat([pickup.lng, pickup.lat]).addTo(map)
  }, [pickup])

  async function bookTaxi() {
    if (!pickup || !user) return

    const { data, error } = await supabase
      .from('rides')
      .insert({
        passenger_id: user.id,
        pickup_lat: pickup.lat,
        pickup_lng: pickup.lng,
        pickup_note: pickupNote,
        status: 'requested'
      })
      .select()
      .single()

    if (!error) {
      setRide(data)
      subscribeToRide(data.id)
    }
  }

  function subscribeToRide(rideId) {
    supabase
      .channel('ride-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${rideId}`
        },
        (payload) => setRide(payload.new)
      )
      .subscribe()
  }

  return (
    <div style={{ padding: 10 }}>
      <h2>Book a Taxi</h2>
      <div id="map" style={{ height: '300px', width: '100%', marginBottom: 10 }} />
      {!ride && (
        <>
          <textarea
            placeholder="Pickup note (e.g. Koroi Place, blue house)"
            value={pickupNote}
            onChange={(e) => setPickupNote(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={bookTaxi} disabled={!pickup}>Book Taxi</button>
        </>
      )}
      {ride && (
        <div style={{ marginTop: 20 }}>
          <strong>Status:</strong> {ride.status}
          {ride.driver_id && <p>Driver assigned</p>}
        </div>
      )}
    </div>
  )
}
