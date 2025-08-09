'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTiltCard } from '@/hooks/useTiltCard';

interface TechProject {
  id: string;
  title: string;
  description: string;
  date: string;
  technologies: string[];
  codeSnippet: string;
  highlights: string[];
}

const techProjects: TechProject[] = [
  {
    id: '1',
    title: '3D Portfolio Engine',
    description: 'A custom Three.js engine for interactive portfolio experiences with real-time rendering.',
    date: '2024 Q1',
    technologies: ['Three.js', 'WebGL', 'React', 'TypeScript'],
    codeSnippet: `function createInteractiveScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Add interactive objects
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x00ff00,
    shininess: 100
  });
  
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  return { scene, camera, renderer };
}`,
    highlights: ['Real-time rendering', 'Interactive controls', 'Performance optimized'],
  },
  {
    id: '2',
    title: 'Motion Design System',
    description: 'A comprehensive animation system using GSAP for complex web interactions.',
    date: '2023 Q4',
    technologies: ['GSAP', 'React', 'Framer Motion', 'TypeScript'],
    codeSnippet: `export const useParallaxEffect = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      gsap.to(element, {
        y: rate,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);
};`,
    highlights: ['Smooth animations', 'Scroll-triggered effects', 'Performance optimized'],
  },
  {
    id: '3',
    title: 'AI-Powered Image Generator',
    description: 'Integration with AI APIs for dynamic image generation and manipulation.',
    date: '2023 Q3',
    technologies: ['Next.js', 'OpenAI API', 'Prisma', 'PostgreSQL'],
    codeSnippet: `async function generateImage(prompt: string) {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Image generation failed:', error);
    return null;
  }
}`,
    highlights: ['Real-time generation', 'API integration', 'Error handling'],
  },
];

const techStack = [
  { name: 'React', icon: '⚛️', color: '#61DAFB' },
  { name: 'Next.js', icon: '▲', color: '#000000' },
  { name: 'TypeScript', icon: '📝', color: '#3178C6' },
  { name: 'Three.js', icon: '🎮', color: '#000000' },
  { name: 'GSAP', icon: '🎬', color: '#88CE02' },
  { name: 'Node.js', icon: '🟢', color: '#339933' },
  { name: 'Python', icon: '🐍', color: '#3776AB' },
  { name: 'Docker', icon: '🐳', color: '#2496ED' },
];

export const TechTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [highlightedTech, setHighlightedTech] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate timeline
    if (timelineRef.current) {
      gsap.from(timelineRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Animate project cards
    techProjects.forEach((project, index) => {
      const element = document.getElementById(`project-${project.id}`);
      if (element) {
        gsap.from(element, {
          opacity: 0,
          y: 50,
          duration: 1,
          delay: index * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
              setActiveProject(project.id);
              // Highlight matching tech stack items
              project.technologies.forEach(tech => {
                setHighlightedTech(tech);
                setTimeout(() => setHighlightedTech(null), 2000);
              });
            },
          },
        });
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tech Stack Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-2xl font-bold mb-6">Tech Stack</h3>
              <div className="space-y-3">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      highlightedTech === tech.name
                        ? 'bg-primary text-primary-foreground scale-105'
                        : 'bg-card hover:bg-card/80'
                    }`}
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <span className="font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className="lg:col-span-3">
            <h2 className="text-4xl font-bold mb-12">Technical Journey</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-12">
                {techProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: TechProject;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useTiltCard({
    maxTilt: 8,
    scale: 1.02,
    speed: 0.6,
  });

  return (
    <div
      id={`project-${project.id}`}
      className="relative flex items-start space-x-8"
    >
      {/* Timeline dot */}
      <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg z-10">
        {index + 1}
      </div>

      {/* Project Card */}
      <Card
        ref={cardRef}
        className="flex-1 p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-all duration-300 cursor-pointer"
        data-interactive
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{project.title}</CardTitle>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {project.date}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {project.description}
          </p>
          
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
          
          {/* Code Snippet */}
          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-muted-foreground font-mono">
              <code>{project.codeSnippet}</code>
            </pre>
          </div>
          
          {/* Highlights */}
          <div className="flex flex-wrap gap-2">
            {project.highlights.map((highlight, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
              >
                {highlight}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}