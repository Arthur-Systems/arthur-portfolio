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
    id: 'polynomial',
    title: 'Polynomial – CSE 115A Team Management System',
    description: 'A real-time project and team management platform integrated with Discord.',
    date: 'Spring 2024',
    technologies: ['React', 'Node.js', 'MongoDB', 'Discord API', 'WebSockets', 'GitHub Pages'],
    codeSnippet: `import express from 'express';
import type { Request, Response } from 'express';

const app = express();

app.post('/api/tasks', async (req: Request, res: Response) => {
  const task = await db.collection('tasks').insertOne(req.body);
  await discordClient.channels.cache.get(process.env.CHANNEL_ID!)?.send(
    'New task created: ' + req.body.title
  );
  res.json(task);
});`,
    highlights: [
      'Project creation & team member management',
      'Real-time status dashboard',
      'Card and stacked list task views',
      'Discord notifications',
      'WBS, Scrum + CPM',
    ],
  },
  {
    id: 'pan-audit-ai',
    title: 'Pan-Audit AI Toolkit – MetafoodX Internship',
    description: 'AI-powered system for auditing commercial kitchen pans.',
    date: 'Jan 2024 – Apr 2024',
    technologies: [
      'Python',
      'PyTorch',
      'YOLOv8',
      'TensorFlow Lite',
      'AWS S3',
      'AWS Lambda',
      'API Gateway',
      'DynamoDB',
      'CUDA',
    ],
    codeSnippet: `import torch
from ultralytics import YOLO

model = YOLO('pan-seg.pt')  # YOLOv8 segmentation
pred = model(depth_image)[0]
mask = pred.masks.data[0]
volume_ml = estimate_volume(depth_map, mask)

s3.put_object(Bucket='pans', Key=key, Body=json.dumps({'volume_ml': float(volume_ml)}))`,
    highlights: [
      'Depth image processing for volume + empty weight',
      'YOLOv8-based detection and classification',
      'Segmentation for filled vs empty pans',
      'Android tablet-optimized inference',
    ],
  },
  {
    id: 'grading-automation',
    title: 'Grading Automation Platform – UCSC Course Reader',
    description: 'Automatic Zybooks → Canvas grade uploader and feedback publisher.',
    date: 'Sep 2024 – Present',
    technologies: ['Python', 'Pandas', 'Zybooks API', 'Canvas API'],
    codeSnippet: `import pandas as pd

zy = fetch_zybooks_grades(token)
df = pd.DataFrame(zy).rename(columns={'user_id': 'student_id'})

for row in df.itertuples():
    canvas.update_grade(course_id, row.student_id, row.assignment_id, row.score)`,
    highlights: [
      'Pulls Zybooks grades via API',
      'Publishes grades and comments to Canvas',
      'Handles entire gradebook',
      'Secure token-based config',
    ],
  },
  {
    id: 'yolov8-android',
    title: 'YOLOv8 Android Integration – Personal Project',
    description: 'Deploying YOLOv8 segmentation models on Android tablets for real-time classification.',
    date: 'Summer 2025',
    technologies: [
      'Android',
      'Java',
      'YOLOv8',
      'ONNX',
      'TensorFlow Lite',
      'GPU Delegate',
      'Quantization',
    ],
    codeSnippet: `GpuDelegate delegate = new GpuDelegate();
Interpreter.Options options = new Interpreter.Options().addDelegate(delegate);
Interpreter tflite = new Interpreter(loadModelFile("yolov8-seg.tflite"), options);
tflite.run(inputBuffer, outputBuffer);`,
    highlights: [
      'PyTorch → ONNX → TFLite',
      'Handled missing TFLite metadata',
      'Manual preprocessing pipeline',
      'Fixed segmentation mask scaling',
    ],
  },
  {
    id: 'waymo-research',
    title: 'Waymo Dataset – Autonomous Vehicle Lab Research',
    description:
      'Adapted computer vision models to work effectively with Waymo dataset for human–vehicle interaction research.',
    date: '2023 – Early 2024',
    technologies: ['PyTorch', 'TensorFlow', 'Waymo Open Dataset'],
    codeSnippet: `for frame in load_waymo_frames(tfrecord_path):
    images = extract_images(frame)
    detections = model(images)
    track(detections)`,
    highlights: ['Model adaptation', 'Dataset preprocessing', 'Detection & tracking'],
  },
  {
    id: 'discord-collab',
    title: 'Discord Real-time Collaboration Tool – Polynomial spin-off',
    description:
      'A Discord bot and dashboard that supports collaborative project tracking in real time.',
    date: '2024',
    technologies: ['Node.js', 'Express', 'MongoDB', 'Discord API', 'WebSockets'],
    codeSnippet: `wss.on('connection', (socket) => {
  socket.on('message', (msg) => {
    broadcast(msg);
    discordClient.channels.cache.get(CHANNEL_ID).send('Update: ' + msg);
  });
});`,
    highlights: [
      'Real-time updates via WebSockets',
      'Discord bot integration',
      'Project tracking dashboard',
    ],
  },
  {
    id: 'pan-selection-spec',
    title: '2D Pan Selection Feature Using YOLOv8 – Functional Specification',
    description:
      'Specification for adding a YOLOv8-powered 2D bounding box selector for pans in the audit tool.',
    date: 'Jul 2025',
    technologies: ['YOLOv8', 'Python', 'Segmentation'],
    codeSnippet: `boxes = yolo(frame).boxes.xyxy
selected = pick_highest_confidence(boxes, class_name='pan')
return selected`,
    highlights: [
      'YOLOv8-powered 2D selector',
      'Integrates with existing audit pipeline',
      'Unit-testable interface',
    ],
  },
];

const techStack = [
  { name: 'React', icon: '⚛️', color: '#61DAFB' },
  { name: 'Node.js', icon: '🟢', color: '#339933' },
  { name: 'Express', icon: '🚏', color: '#000000' },
  { name: 'MongoDB', icon: '🍃', color: '#47A248' },
  { name: 'Discord API', icon: '💬', color: '#5865F2' },
  { name: 'WebSockets', icon: '🔌', color: '#333333' },
  { name: 'Python', icon: '🐍', color: '#3776AB' },
  { name: 'Pandas', icon: '🐼', color: '#150458' },
  { name: 'Zybooks API', icon: '📘', color: '#1E40AF' },
  { name: 'Canvas API', icon: '🧑\u200d🏫', color: '#CC3333' },
  { name: 'PyTorch', icon: '🔥', color: '#EE4C2C' },
  { name: 'YOLOv8', icon: '🧠', color: '#000000' },
  { name: 'TensorFlow Lite', icon: '🟠', color: '#FF6F00' },
  { name: 'ONNX', icon: '🔷', color: '#1F6FEB' },
  { name: 'CUDA', icon: '⚡', color: '#76B900' },
  { name: 'Android', icon: '🤖', color: '#3DDC84' },
  { name: 'Java', icon: '☕', color: '#007396' },
  { name: 'GPU Delegate', icon: '🧩', color: '#333333' },
  { name: 'Quantization', icon: '🎚️', color: '#999999' },
  { name: 'AWS S3', icon: '🪣', color: '#569A31' },
  { name: 'AWS Lambda', icon: 'λ', color: '#FF9900' },
  { name: 'API Gateway', icon: '🛣️', color: '#FF9900' },
  { name: 'DynamoDB', icon: '🗄️', color: '#527FFF' },
  { name: 'Waymo Open Dataset', icon: '🚘', color: '#000000' },
  { name: 'Docker', icon: '🐳', color: '#2496ED' },
  { name: 'GitHub Pages', icon: '📄', color: '#24292e' },
  { name: 'TypeScript', icon: '📝', color: '#3178C6' },
  { name: 'Next.js', icon: '▲', color: '#000000' },
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
                data-interactive
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