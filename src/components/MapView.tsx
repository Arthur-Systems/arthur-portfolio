'use client';

import React, { useMemo } from 'react';
import Map, { NavigationControl, ScaleControl } from 'react-map-gl/maplibre';

export type MapViewProps = {
  initialViewState?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  styleUrl?: string;
  className?: string;
  height?: string | number;
  width?: string | number;
  mapRef?: React.Ref<any>;
  nonInteractive?: boolean; // static map box
  overlay?: React.ReactNode; // optional overlay content (e.g., label)
  spotlight?: boolean; // dim outside a spotlight area
  spotlightPosition?: { xPercent: number; yPercent: number; inner: number; outer: number }; // 0-100
  children?: React.ReactNode; // optional overlays (Source/Layer, markers)
};

/**
 * MapView (MapLibre via react-map-gl)
 * - Defaults to MapTiler's free basic style (requires MAPTILER_KEY to avoid watermark)
 * - For full OSS usage, provide your own styleUrl (e.g., MapLibre demo style)
 * Docs: https://visgl.github.io/react-map-gl/docs
 */
export default function MapView({
  initialViewState = { latitude: 37.7749, longitude: -122.4194, zoom: 10 },
  styleUrl,
  className = '',
  height = 480,
  width = '100%',
  mapRef,
  nonInteractive = true,
  overlay,
  spotlight = true,
  spotlightPosition,
  children,
}: MapViewProps) {
  const defaultStyle = useMemo(() => {
    // Public demo style that works without tokens (MapLibre demo). Replace as needed.
    // Alternative (with MapTiler, set NEXT_PUBLIC_MAPTILER_KEY):
    // `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
    return 'https://demotiles.maplibre.org/style.json';
  }, []);

  const spotlightCss = useMemo(() => {
    const x = spotlightPosition?.xPercent ?? 50;
    const y = spotlightPosition?.yPercent ?? 48;
    const inner = spotlightPosition?.inner ?? 34; // fully clear center radius
    const outer = spotlightPosition?.outer ?? 64; // where full dim reaches
    // Create an inverse radial gradient: center is clear, edges are dimmed
    return `radial-gradient( circle at ${x}% ${y}%, rgba(0,0,0,0.00) ${inner}%, rgba(0,0,0,0.25) ${inner + 8}%, rgba(0,0,0,0.50) ${outer}%, rgba(0,0,0,0.55) 100% )`;
  }, [spotlightPosition]);

  return (
    <div
      className={className}
      style={{ width, height, position: 'relative' }}
    >
      <Map
        ref={mapRef as any}
        initialViewState={initialViewState}
        mapStyle={styleUrl || defaultStyle}
        attributionControl={true}
        dragRotate={false}
        pitchWithRotate={nonInteractive ? false : true}
        touchPitch={nonInteractive ? false : true}
        touchZoomRotate={!nonInteractive}
        scrollZoom={!nonInteractive}
        doubleClickZoom={!nonInteractive}
        keyboard={!nonInteractive}
        boxZoom={!nonInteractive}
        dragPan={!nonInteractive}
        style={{ pointerEvents: nonInteractive ? 'none' : undefined }}
        styleDiffing
      >
        {!nonInteractive && <NavigationControl position="top-right" visualizePitch={false} />}
        {!nonInteractive && <ScaleControl position="bottom-left" unit="metric" />}
        {children}
      </Map>
      <div className="pointer-events-none absolute inset-0">
        {spotlight && (
          <div aria-hidden className="absolute inset-0" style={{ background: spotlightCss }} />
        )}
        {overlay ? (
          <div className="absolute inset-0 flex items-end justify-between p-3">
            {/* gradient scrim for readability */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="relative ml-1 inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur-sm">
              {overlay}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


