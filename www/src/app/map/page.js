'use client'
import { useEffect, useState } from 'react'

import Map, { Source, Layer, Marker, ScaleControl, GeolocateControl, NavigationControl } from 'react-map-gl'
import DublinOSM from './dublin-osm.json' // https://osm-boundaries.com/
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '@/stores'
import GlobalHeader from '../header'
import { PinMarker } from './markers'

function Item ({ setActiveLocation, location }) {
  return (<>
    <Marker onClick={() => setActiveLocation(location.id)} longitude={location?.geolocation?.lon} latitude={location?.geolocation?.lat}>
      <PinMarker iconName={location?.geolocation?.iconName || 'dot'} />
    </Marker>
  </>
  )
}

export default function Threads ({ params, searchParams }) {
  const [activeLocation, setActiveLocation] = useState('')
  const locations = useMapStore(state => state.locations)

  useEffect(() => {
    console.log('activeLocation', activeLocation)
  }, [activeLocation])
  return (<>
    <GlobalHeader />
    <main className="bg-[#F3F2EE] h-screen w-screen p-4 pt-[82px]">
      <div className="bg-white border-[1.5px] w-full h-full rounded-xl shadow-xl">
      <Map
        className='rounded-xl'
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -121.909645,
          latitude: 37.714861,
          zoom: 12.7
        }}
        style={{ borderRadius: '12px' }}
        mapStyle="mapbox://styles/amazingandyyy/clkj48ygk004o01r27gz8dub3"
      >
         {locations.map((location) => (<Item key={location.id} setActiveLocation={setActiveLocation} location={location} />))}
         {/* {locations.map((location) => (
          <Popup className={`${location.id === activeLocation}`} style={{ translate: '10px -30px' }} key={location.id} longitude={location?.geolocation?.lon} latitude={location?.geolocation?.lat} anchor="bottom">
            {location?.geolocation?.title}
          </Popup>
         ))} */}

        <Source id="dublin-boundary" type="geojson" data={DublinOSM}>
          <Layer id="dublin-boundary" type="fill" paint={{
            'fill-color': '#57b7ff',
            'fill-outline-color': '#000',
            'fill-opacity': 0.2
          }} />
        </Source>
        <div className='ctrl-panel-container'>
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            showAccuracyCircle={true}
            showUserLocation={true}
            timeout={60000}
          />
          <NavigationControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          />
        </div>
        <ScaleControl />
      </Map>
      </div>
    </main>
  </>)
}
