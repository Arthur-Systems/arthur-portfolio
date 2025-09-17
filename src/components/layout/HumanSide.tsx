'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HumanSide() {
  return (
    <section aria-label="Human Side" className="py-24">
      <div className="mx-auto w-full max-w-[1200px] px-[var(--space-24)]">
        <Card aria-labelledby="human-title" className="overflow-hidden">
          <CardHeader>
            <CardTitle id="human-title" className="text-[20px] font-semibold">Human Side</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="hobbies" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
                <TabsTrigger value="music">Now Playing</TabsTrigger>
              </TabsList>
              <div className="min-h-[220px]">
                <TabsContent value="hobbies">
                  <p className="text-[16px] leading-6 text-[hsl(var(--text-2))] max-w-[68ch]">I like building things, exploring outdoors, and learning by shipping. Weekends are for trails and cameras; weekdays for code and demos.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Mountain biking','Photography','Videography','Coding','Reading','Hackathons'].map((chip) => (
                      <span key={chip} className="chip" data-interactive>{chip}</span>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="music">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-[var(--radius)] bg-[rgb(255_255_255/0.06)] border border-[rgba(255,255,255,0.08)]" />
                    <div className="flex-1">
                      <div className="text-[16px]">Playlist Title</div>
                      <div className="text-[14px] text-[hsl(var(--text-2))]">Curated weekly</div>
                    </div>
                    <button className="rounded-[var(--radius)] px-3 py-2 border border-[rgba(255,255,255,0.08)] text-white/90">Play</button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


