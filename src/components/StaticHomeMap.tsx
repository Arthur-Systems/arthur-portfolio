'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { MapViewProps } from '@/components/MapView';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function StaticHomeMap(props: Omit<MapViewProps, 'nonInteractive'>) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
      <MapView {...props} nonInteractive />
    </div>
  );
}


