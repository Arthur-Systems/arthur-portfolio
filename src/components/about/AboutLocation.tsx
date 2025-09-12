'use client';

import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import MapView from '@/components/MapView';
import { Source, Layer, Marker, type MapRef } from 'react-map-gl/maplibre';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type AboutLocationProps = {
  className?: string;
};

/**
 * California spotlight with a full-bleed map, glass UI, and region toggles.
 */
const AboutLocation: React.FC<AboutLocationProps> = ({ className = '' }) => {
  type RegionKey = 'statewide' | 'bayArea' | 'losAngeles' | 'irvine'

  const mapRef = useRef<MapRef | null>(null)
  const [activeRegion, setActiveRegion] = useState<RegionKey>('statewide')

  // Marker points
  const markers = useMemo(
    () => ([
      { id: 'bay-area', name: 'Bay Area', coordinates: [-122.4194, 37.7749] as [number, number] },
      { id: 'los-angeles', name: 'Los Angeles', coordinates: [-118.2437, 34.0522] as [number, number] },
      { id: 'irvine', name: 'Irvine', coordinates: [-117.8265, 33.6846] as [number, number] },
    ]),
    []
  )

  // Region bounds (approximate, for smooth camera fit)
  const boundsByRegion: Record<RegionKey, [[number, number], [number, number]]> = useMemo(
    () => ({
      statewide: [[-124.45, 32.4], [-114.1, 42.2]],
      bayArea: [[-123.1, 37.0], [-121.5, 38.5]],
      losAngeles: [[-118.9, 33.7], [-117.9, 34.4]],
      irvine: [[-118.0, 33.58], [-117.65, 33.78]],
    }),
    []
  )

  // Simple region outline polygons (approx bounding boxes)
  const regionPolygons = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: (
        Object.entries(boundsByRegion) as Array<[
          RegionKey,
          [[number, number], [number, number]]
        ]>
      )
        .filter(([key]) => key !== 'statewide')
        .map(([key, [[minLng, minLat], [maxLng, maxLat]]]) => ({
          type: 'Feature',
          properties: { region: key },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [minLng, minLat],
              [maxLng, minLat],
              [maxLng, maxLat],
              [minLng, maxLat],
              [minLng, minLat],
            ]],
          },
        })),
    }),
    [boundsByRegion]
  ) as any

  const fitToRegion = useCallback((key: RegionKey) => {
    const b = boundsByRegion[key]
    if (!b || !mapRef.current) return
    mapRef.current.fitBounds(b as any, {
      padding: { top: 72, bottom: 110, left: 16, right: 16 },
      duration: 260,
      maxZoom: key === 'statewide' ? 6 : 10,
      easing: (t) => t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t, // easeInOutQuad
    })
  }, [boundsByRegion])

  useEffect(() => {
    // Fit once on mount to statewide
    const id = requestAnimationFrame(() => fitToRegion(activeRegion))
    return () => cancelAnimationFrame(id)
  }, [])

  const cityPointData = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: markers.map(m => ({
        type: 'Feature',
        properties: { name: m.name },
        geometry: { type: 'Point', coordinates: m.coordinates },
      })),
    }),
    [markers]
  )

  return (
    <div
      data-about-location
      className={`relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-xl shadow-black/30 ${className}`}
    >
      <MapView
        height={'min(60vh, 560px)'}
        initialViewState={{ latitude: 36.3, longitude: -119.6, zoom: 5 }}
        nonInteractive={false}
        hideControls
        spotlight={false}
        mapRef={mapRef as any}
        styleUrl={'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'}
        overlay={(
          <div className="absolute inset-0">
            {/* Title chip - top-left */}
            <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/90 shadow-md backdrop-blur-md">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_1px_rgba(5,150,105,0.35)]" />
              Based in California
            </div>
            {/* Segmented control - bottom-left */}
            <div className="absolute bottom-3 left-3 flex flex-col items-start gap-2 pointer-events-auto">
              <div className="rounded-xl border border-white/15 bg-black/30 p-1 shadow-lg backdrop-blur-md">
                <ToggleGroup
                  type="single"
                  value={activeRegion}
                  onValueChange={(val) => {
                    if (!val) return
                    setActiveRegion(val as RegionKey)
                    fitToRegion(val as RegionKey)
                  }}
                  variant="outline"
                  size="lg"
                  className="text-white/90"
                >
                  <ToggleGroupItem value="statewide" className="data-[state=on]:bg-emerald-400 data-[state=on]:text-black">All CA</ToggleGroupItem>
                  <ToggleGroupItem value="bayArea" className="data-[state=on]:bg-emerald-400 data-[state=on]:text-black">Bay Area</ToggleGroupItem>
                  <ToggleGroupItem value="losAngeles" className="data-[state=on]:bg-emerald-400 data-[state=on]:text-black">LA</ToggleGroupItem>
                  <ToggleGroupItem value="irvine" className="data-[state=on]:bg-emerald-400 data-[state=on]:text-black">Irvine</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] text-white/80 shadow-md backdrop-blur-md">Tap pins</div>
            </div>
          </div>
        )}
      >
        {/* Region outlines (approximate) */}
        <Source id="region-polys" type="geojson" data={regionPolygons}>
          <Layer id="region-polys-fill" type="fill" paint={{ 'fill-color': '#10b981', 'fill-opacity': 0.08 }} />
          <Layer id="region-polys-outline" type="line" paint={{ 'line-color': '#34d399', 'line-width': 1.2, 'line-opacity': 0.7, 'line-dasharray': [2, 2] }} />
        </Source>

        {/* City labels (optional) */}
        <Source id="city-points" type="geojson" data={cityPointData as any}>
          <Layer id="city-labels" type="symbol" layout={{ 'text-field': ['get', 'name'], 'text-size': 11, 'text-offset': [0, 1.2] }} paint={{ 'text-color': '#e5e7eb', 'text-halo-color': '#111827', 'text-halo-width': 0.6 }} />
        </Source>

        {/* Emerald accent HTML markers with micro-interactions */}
        {markers.map((m) => (
          <Marker key={m.id} longitude={m.coordinates[0]} latitude={m.coordinates[1]}>
            <button
              aria-label={m.name}
              className="group relative -translate-x-1/2 -translate-y-1/2 rounded-full p-2"
              onClick={() => {
                const key = (m.id === 'bay-area' ? 'bayArea' : (m.id as RegionKey))
                setActiveRegion(key)
                fitToRegion(key)
              }}
            >
              <span className="absolute inset-0 -z-10 rounded-full bg-emerald-400/25 blur-md transition-opacity duration-200 group-hover:bg-emerald-400/35" />
              <span className="absolute left-1/2 top-1/2 -z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/60 [animation-duration:1200ms] animate-ping group-hover:opacity-0" />
              <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 shadow-[0_6px_16px_rgba(16,185,129,0.45)] transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute left-1/2 top-7 -translate-x-1/2 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] text-white/90 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
                {m.name}
              </span>
            </button>
          </Marker>
        ))}
      </MapView>
    </div>
  );
};

export default AboutLocation;


