'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Avoid SSR issues by dynamically importing the client map
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function MapPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Map</h1>
        <p className="text-muted-foreground mb-6">Static SF Bay map (react-map-gl + MapLibre) with overlay.</p>
        <div className="rounded-xl overflow-hidden border border-border/50">
          <MapView
            height={520}
            initialViewState={{ latitude: 37.7749, longitude: -122.4194, zoom: 9.5 }}
            nonInteractive
            overlay={<span>San Francisco Bay Area</span>}
          />
        </div>
      </div>
    </main>
  );
}


