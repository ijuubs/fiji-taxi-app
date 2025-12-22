import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import maplibregl from 'maplibre-gl'

export default function DriverOnline() {
  const [user, setUser] = useState(null)
  const [online, setOnline] = useState(false)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [intervalId, setIntervalId] = useState(null)

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

    setMap(m)
  }, [map])

  useEffect(() => {
    if (!online) {
      if (intervalId) clearInterval(intervalId)
      return
    }
    const id = setInterval(() => {
      if (!navigator.geolocation || !user) return
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords
        await supabase
          .from('driver_locations')
          .upsert(
            { driver_id: user.id, lat: latitude, lng: longitude },
            { onConflict: 'driver_id' }
          )
        if (map) {
          if (marker) marker.setLngLat([longitude, latitude])
          else setMarker(new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(map))
          map.setCenter([longitude, latitude])
        }
      })
    }, 6000)
    setIntervalId(id)
    return () => clearInterval(id)
  }, [online, user, map, marker])

  return (
    <div style={{ padding: 10 }}>
      <h2>Driver Online</h2>
      <button onClick={() => setOnline(!online)}>
        {online ? 'Go Offline' : 'Go Online'}
      </button>
      <div id="map" style={{ height: '400px', width: '100%', marginTop: 10 }} />
    </div>
  )
}
