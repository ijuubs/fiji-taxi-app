import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import maplibregl from 'maplibre-gl'

export default function ControllerDashboard() {
  const [map, setMap] = useState(null)
  const [drivers, setDrivers] = useState([])

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
    const subscription = supabase
      .channel('driver-tracking')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'driver_locations' },
        (payload) => {
          const updated = drivers.filter(d => d.driver_id !== payload.new.driver_id)
          updated.push(payload.new)
          setDrivers(updated)
        }
      )
      .subscribe()
    return () => supabase.removeChannel(subscription)
  }, [drivers])

  useEffect(() => {
    if (!map) return
    map.eachLayer((layer) => { if(layer.id.startsWith('driver')) map.removeLayer(layer.id) })
    drivers.forEach(driver => {
      new maplibregl.Marker().setLngLat([driver.lng, driver.lat]).addTo(map)
    })
  }, [drivers, map])

  return (
    <div style={{ padding: 10 }}>
      <h2>Controller Dashboard</h2>
      <div id="map" style={{ height: '500px', width: '100%' }} />
    </div>
  )
}
