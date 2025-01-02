'use client'
import { useEffect, useState } from 'react'
import Map, { Source, Layer, Marker, ScaleControl, GeolocateControl, NavigationControl } from 'react-map-gl'
import DublinOSM from './dublin-osm.json'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore, useThreadStore } from '@/stores'
import GlobalHeader from '@/header'
import { PinMarker } from './markers'
import Link from 'next/link'
import { fetchDevelopments } from '@/utils'

export default function MapPage ({ params, searchParams }) {
  const locations = useMapStore(state => state.locations)
  const [mapToken, setMapToken] = useState('')
  const [viewState, setViewState] = useState({
    longitude: -121.909645,
    latitude: 37.714861,
    zoom: 12
  })
  const [zoom, setZoom] = useState(12)

  useEffect(() => {
    document.title = 'Map - DublinThreads'
    document.description = 'Explore Dublin projects and developments on a map.'
    document.url = 'https://dublin.amazyyy.com/map'
    document.siteName = 'DublinThreads'
    document.type = 'website'
    document.locale = 'en_US'

    // Get Mapbox token
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error('Mapbox token is missing')
      return
    }
    setMapToken(token)
  }, [])

  useEffect(() => {
    fetchDevelopments('/logs/global.json')
      .then(res => res.json())
      .then(data => {
        useThreadStore.getState().update(data)
      })
      .catch(err => console.error('Error fetching developments:', err))
  }, [])

  function labelClassName (zoom) {
    if (zoom < 14.5) {
      return 'inline-block translate-y-4 font-bold text-center opacity-0'
    }
    return 'inline-block translate-y-4 font-bold text-center'
  }

  if (!mapToken) {
    return (
      <>
        <GlobalHeader />
        <main className="flex h-screen w-screen bg-gray-50">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="text-gray-500">Loading map...</div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <GlobalHeader />
      <main className="flex h-screen w-screen bg-gray-50">
        <div className="flex flex-col bg-white w-full h-full">
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            onZoom={evt => setZoom(evt.viewState.zoom)}
            mapboxAccessToken={mapToken}
            style={{ borderRadius: '0px' }}
            mapStyle="mapbox://styles/amazingandyyy/clkj4hghc005b01r14qvccv1h"
            interactiveLayerIds={['dublin-boundary-line', 'dublin-boundary-fill']}
          >
            {locations.map((location) => (
              location?.geolocation?.lon && location?.geolocation?.lat && (
                <Link href={`/project/${location.id}`} key={location.id}>
                  <Marker
                    longitude={location.geolocation.lon}
                    latitude={location.geolocation.lat}
                    anchor="bottom"
                  >
                    <PinMarker iconName={location?.geolocation?.iconName || 'dot'} data={location} />
                    <div className={labelClassName(zoom)}>{location?.title}</div>
                  </Marker>
                </Link>
              )
            ))}

            <Source id="dublin-boundary" type="geojson" data={DublinOSM}>
              <Layer
                id="dublin-boundary-line"
                type="line"
                paint={{
                  'line-width': 3,
                  'line-blur': 1,
                  'line-color': '#000',
                  'line-opacity': 0.5
                }}
              />
              <Layer
                id="dublin-boundary-fill"
                type="fill"
                paint={{
                  'fill-color': '#fff',
                  'fill-opacity': 0.2
                }}
              />
            </Source>

            <div className='absolute bottom-4 right-4 flex flex-col gap-2'>
              <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
                showAccuracyCircle={true}
                showUserLocation={true}
              />
              <NavigationControl />
            </div>
            <ScaleControl />
          </Map>
        </div>
      </main>
    </>
  )
}
