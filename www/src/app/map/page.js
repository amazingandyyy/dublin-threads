'use client'
import { useEffect, useState } from 'react'

import Map, { Source, Layer, Marker, ScaleControl, GeolocateControl, NavigationControl } from 'react-map-gl'
import DublinOSM from './dublin-osm.json' // https://osm-boundaries.com/
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore, useThreadStore } from '@/stores'
import GlobalHeader from '@/header'
import { PinMarker } from './markers'
import Link from 'next/link'
import { fetchDevelopments } from '@/utils'

export default function Threads ({ params, searchParams }) {
  const locations = useMapStore(state => state.locations)
  useEffect(() => {
    document.title = 'Map - DublinThreads'
    document.description = 'Explore Dublin projects and developments on a map.'
    document.url = 'https://dublin.amazyyy.com/map'
    document.siteName = 'DublinThreads'
    document.type = 'website'
    document.locale = 'en_US'
  }, [])

  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        console.log('fetching developments event', data[0])
        useThreadStore.getState().update(data)
      })
  }, [])

  const mapConfig = {
    initialViewState: {
      longitude: -121.909645,
      latitude: 37.714861,
      zoom: 12
    },
    borderRadius: '0px'
  }
  const [zoom, setZoom] = useState(mapConfig.initialViewState.zoom)

  function labelClassName (zoom) {
    if (zoom < 14.5) {
      return 'inline-block translate-y-4 font-bold text-center opacity-0'
    }
    return 'inline-block translate-y-4 font-bold text-center'
  }

  return (<>
    <GlobalHeader />
    <main className="flex h-screen w-screen bg-[#F3F2EE]">
      <div className="flex flex-col bg-white w-full h-full">
          <Map
            onZoom={(i) => setZoom(i.viewState.zoom)}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={mapConfig.initialViewState}
            style={{ borderRadius: mapConfig.borderRadius }}
            mapStyle="mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h"
          >
            {locations.map((location) => (<Link href={`/project/${location.id}`} key={location.id}>
              <Marker longitude={location?.geolocation?.lon} latitude={location?.geolocation?.lat}>
              <PinMarker iconName={location?.geolocation?.iconName || 'dot'} data={location} />
              <div className={labelClassName(zoom)}>{location?.title}</div>
              </Marker>
            </Link>))}

            <Source id="dublin-boundary" type="geojson" data={DublinOSM}>
              <Layer id="dublin-boundary-line" type='line' paint={{
                'line-width': 3,
                'line-blur': 1,
                'line-color': '#000',
                'line-opacity': 0.5
              }}/>
              <Layer id="dublin-boundary-fill" type="fill" paint={{
                'fill-color': '#fff',
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
      {/* <div className="flex flex-col bg-white border-[1.5px] w-[0px] h-full md:rounded-xl shadow-xl ml-4">
      </div> */}
    </main>
  </>)
}
