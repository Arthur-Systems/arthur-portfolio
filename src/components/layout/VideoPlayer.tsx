'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import SkeletonPane from '@/components/SkeletonPane';
import { useLoader } from '@/state/useLoader';
import { Loader } from '@/state/loaderBus';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  url: string;
  date: string;
}

const videoItems: VideoItem[] = [
  {
    id: '1',
    title: 'Creative Process',
    description: 'Behind the scenes of my creative workflow',
    thumbnail: '/api/placeholder/400/225',
    duration: '5:23',
    url: '#',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: '3D Animation Tutorial',
    description: 'Learn the basics of web animation',
    thumbnail: '/api/placeholder/400/225',
    duration: '12:45',
    url: '#',
    date: '2024-02-20',
  },
  {
    id: '3',
    title: 'Motion Design Tips',
    description: 'Professional motion design techniques',
    thumbnail: '/api/placeholder/400/225',
    duration: '8:30',
    url: '#',
    date: '2024-03-10',
  },
  {
    id: '4',
    title: 'Web Development Journey',
    description: 'My journey as a web developer',
    thumbnail: '/api/placeholder/400/225',
    duration: '15:12',
    url: '#',
    date: '2024-04-05',
  },
];

interface ScrollScrubVideoProps {
  video: VideoItem;
}

function ScrollScrubVideo({ video }: ScrollScrubVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { start, step, finish } = useLoader();

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Create scroll-triggered video playback
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        if (videoRef.current) {
          const progress = self.progress;
          videoRef.current.currentTime = progress * 10; // 10 second video
          
          if (progressRef.current) {
            progressRef.current.style.width = `${progress * 100}%`;
          }
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  const handlePlay = () => {
    // Simulate first seek to Start/End markers on initial play
    start('Priming playback…');
    setTimeout(() => step(20, 'Seeking to start…'), 120);
    setTimeout(() => step(20, 'Seeking to end…'), 240);
    setTimeout(() => finish(), 420);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div ref={containerRef} className="relative h-screen flex items-center justify-center">
      {/* Video Container */}
      <div className="relative w-full max-w-4xl mx-auto px-4">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* Video Placeholder */}
          <div className="relative w-full h-0 pb-[56.25%] bg-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">▶️</span>
                </div>
                <p className="text-lg font-medium">{video.title}</p>
                <p className="text-sm">{video.duration}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/20">
            <div
              ref={progressRef}
              className="h-full bg-primary transition-all duration-100"
              style={{ width: '0%' }}
            />
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
              <span className="text-3xl text-black">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
            </div>
          </button>
        </div>

        {/* Video Info */}
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {video.title}
          </h3>
          <p className="text-muted-foreground mb-4">
            {video.description}
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <span>{video.duration}</span>
            <span>•</span>
            <span>{video.date}</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

interface VideoGridProps {
  onVideoSelect: (video: VideoItem) => void;
}

function VideoGrid({ onVideoSelect }: VideoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.from(gridRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videoItems.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onClick={() => onVideoSelect(video)}
        />
      ))}
    </div>
  );
}

interface VideoCardProps {
  video: VideoItem;
  onClick: () => void;
}

function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
      onClick={onClick}
      data-interactive
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">▶️</span>
            </div>
            <p className="text-sm font-medium">{video.title}</p>
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
          {video.duration}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {video.description}
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          {video.date}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VideoPlayer() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const { isLoading, start, step, finish } = useLoader();

  const handleVideoSelect = (video: VideoItem) => {
    // Trigger loader flow: Reading file → Extracting metadata → Poster capture → Range init
    Loader.start('Reading file…');
    setSelectedVideo(video);
    setShowGrid(false);

    // Simulate: URL.createObjectURL + basic validation
    setTimeout(() => {
      Loader.step(20, 'Extracting metadata…');
      // Simulate loadedmetadata
      setTimeout(() => {
        Loader.step(20, 'Capturing poster…');
        // Simulate poster capture
        setTimeout(() => {
          Loader.step(20, 'Calibrating ranges…');
          // Simulate range init and sync loop warm-up
          setTimeout(() => {
            Loader.step(39, 'Sync engine warming up…');
            Loader.finish();
          }, 300);
        }, 250);
      }, 300);
    }, 250);
  };

  const handleBackToGrid = () => {
    setShowGrid(true);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleBackToGrid}
          className={`px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-all duration-300 ${
            showGrid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
          }`}
          disabled={showGrid}
        >
          ← Back to Gallery
        </button>
      </div>

      {/* Scroll Scrub Video or Skeleton */}
      {!showGrid && selectedVideo && (
        isLoading ? <div className="px-4"><SkeletonPane label="Preparing video…" /></div> : <ScrollScrubVideo video={selectedVideo} />
      )}

      {/* Video Grid (skeleton cards while loading) */}
      {showGrid && (
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Video Gallery
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore my creative process and tutorials
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonPane key={i} />
                ))}
              </div>
            ) : (
              <VideoGrid onVideoSelect={handleVideoSelect} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}