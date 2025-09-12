'use client';

import React, { useMemo } from 'react';
import MapView from '@/components/MapView';
import { Source, Layer } from 'react-map-gl/maplibre';

type AboutLocationProps = {
  className?: string;
};

/**
 * SF Bay Area spotlight with a simple embedded OpenStreetMap and quick facts.
 */
const AboutLocation: React.FC<AboutLocationProps> = ({ className = '' }) => {
  const cityLineData = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-122.4194, 37.7749], // San Francisco
              [-122.2712, 37.8044], // Oakland
              [-121.8863, 37.3382], // San Jose
            ],
          },
        },
      ],
    }),
    []
  );

  const cityPointData = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'San Francisco' },
          geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        },
        {
          type: 'Feature',
          properties: { name: 'Oakland' },
          geometry: { type: 'Point', coordinates: [-122.2712, 37.8044] },
        },
        {
          type: 'Feature',
          properties: { name: 'San Jose' },
          geometry: { type: 'Point', coordinates: [-121.8863, 37.3382] },
        },
      ],
    }),
    []
  );

  return (
    <div
      data-about-location
      data-hover-card
      className={`relative w-full rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400/25 via-indigo-500/20 to-fuchsia-500/25 shadow-xl shadow-black/25 ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div className="relative rounded-[1rem] overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 card-elevate" data-meta-hover style={{ transformStyle: 'preserve-3d' }}>
        <span
          data-shine
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-1 inset-y-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0"
          style={{ filter: 'blur(2px)' }}
        />
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="text-white/90 text-sm font-medium">SF Bay Area</div>
          <div className="text-[11px] text-white/60">San Francisco • Oakland • San Jose</div>
        </div>
        <div className="p-4">
          <div className="relative w-full overflow-hidden rounded-md border border-white/10">
            <MapView
              height={260}
              initialViewState={{ latitude: 37.8, longitude: -122.3, zoom: 8.3 }}
              nonInteractive
              spotlight={false}
            >
              <Source id="city-lines" type="geojson" data={cityLineData as any}>
                <Layer id="city-lines-line" type="line" paint={{ 'line-color': '#60a5fa', 'line-width': 2.5, 'line-opacity': 0.9 }} />
              </Source>
              <Source id="city-points" type="geojson" data={cityPointData as any}>
                <Layer id="city-points-circles" type="circle" paint={{ 'circle-radius': 4, 'circle-color': '#f59e0b', 'circle-stroke-color': '#111827', 'circle-stroke-width': 1.5 }} />
                <Layer id="city-labels" type="symbol" layout={{ 'text-field': ['get', 'name'], 'text-size': 11, 'text-offset': [0, 1.2] }} paint={{ 'text-color': '#e5e7eb', 'text-halo-color': '#111827', 'text-halo-width': 0.6 }} />
              </Source>
            </MapView>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-white/85">
            {['Peninsula', 'South Bay', 'East Bay', 'North Bay'].map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] sm:text-xs backdrop-blur-sm ring-1 ring-white/10"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLocation;


