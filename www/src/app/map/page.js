'use client'
import {useState} from "react";

import Map, { Source, Layer, Marker, ScaleControl, GeolocateControl, NavigationControl, Popup } from 'react-map-gl'
import DublinOSM from './dublin-osm.json' // https://osm-boundaries.com/
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '@/stores'
import GlobalHeader from '@/header'
import { PinMarker } from './markers'
import Link from 'next/link'

export default function Threads ({ params, searchParams }) {
  const locations = useMapStore(state => state.locations)

  const mapConfig = {
    initialViewState: {
      longitude: -121.909645,
      latitude: 37.714861,
      zoom: 12
    },
    borderRadius: '0px'
  }
  const [zoom, setZoom] = useState(mapConfig.initialViewState.zoom)

  return (<>
    <GlobalHeader />
    <main className="flex bg-white h-screen w-screen pt-[60px]">
      <div className="flex flex-col bg-white w-full h-full">
          <Map
            onZoom={(i)=>setZoom(i.viewState.zoom)}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={mapConfig.initialViewState}
            style={{ borderRadius: mapConfig.borderRadius }}
            mapStyle="mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h"
          >
            {locations.map((location) => (<Link href={`/project/${location.id}`} key={location.id}>
              <Marker longitude={location?.geolocation?.lon} latitude={location?.geolocation?.lat}>
              <PinMarker iconName={location?.geolocation?.iconName || 'dot'} data={location} />
              <div className={`inline-block translate-y-3 opacity-${Math.floor(zoom/14.1)*100} text-center`}>{location?.title}</div>
              </Marker>)</Link>))}

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
