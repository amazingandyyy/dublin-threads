'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import Map, { Source, Layer, Marker, ScaleControl, GeolocateControl, NavigationControl } from 'react-map-gl'
import DublinOSM from './dublin-osm.json' // https://osm-boundaries.com/
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '@/stores'
import GlobalHeader from '@/header'
import { PinMarker } from './markers'

function Item ({ setActiveLocation, location }) {
  return (<Link href={`/project/${location.id}`}>
    <Marker onClick={() => setActiveLocation(location.id)} longitude={location?.geolocation?.lon} latitude={location?.geolocation?.lat}>
      <PinMarker iconName={location?.geolocation?.iconName || 'dot'} />
    </Marker>
  </Link>
  )
}

export default function Threads ({ params, searchParams }) {
  const [activeLocation, setActiveLocation] = useState('')
  const locations = useMapStore(state => state.locations)

  const mapConfig = {
    initialViewState: {
      longitude: -121.909645,
      latitude: 37.714861,
      zoom: 12
    },
    borderRadius: '0px'
  }

  useEffect(() => {
    console.log('activeLocation', activeLocation)
  }, [activeLocation])
  return (<>
    <GlobalHeader />
    <main className="flex bg-white h-screen w-screen pt-[60px]">
      <div className="flex flex-col bg-white w-full h-full">
        {/* <div className="bg-white md:rounded-t-xl border-[1.5px] w-full h-24 p-2"> */}
        {/*  turn goood */}
        {/* </div> */}
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={mapConfig.initialViewState}
            style={{ borderRadius: mapConfig.borderRadius }}
            mapStyle="mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h"
          >
            {locations.map((location) => (<Item key={location.id} setActiveLocation={setActiveLocation} location={location} />))}
            {/* {locations.map((location) => (
              <Popup className={`${location.id === activeLocation}`} style={{ translate: '10px -30px' }} key={location.id} longitude={location?.geolocation?.lon} latitude={location?.geolocation?.lat} anchor="bottom">
                {location?.geolocation?.title}
              </Popup>
            ))} */}

            <Source id="dublin-boundary" type="geojson" data={DublinOSM}>
              <Layer id="dublin-boundary" type='line' paint={{
                'line-width': 3,
                'line-blur': 1,
                'line-color': '#000',
                'line-opacity': 0.5
              }}/>
              <Layer id="dublin-boundary" type="fill" paint={{
                'fill-color': '#fff',
                'fill-opacity': 0.1
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
      {/* <div className="flex flex-col bg-white border-[1.5px] w-[0px] h-full md:rounded-xl shadow-xl ml-4">
      </div> */}
    </main>
  </>)
}
