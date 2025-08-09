import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Flip from 'gsap/Flip';
import SplitText from 'gsap/SplitText';
import Observer from 'gsap/Observer';
import Draggable from 'gsap/Draggable';
import { animations } from './gsap/config';

export interface HeroTimelineConfig {
  container: HTMLElement;
  headline: HTMLElement;
  subHeadline: HTMLElement;
  scrollIndicator: HTMLElement;
  reducedMotion?: boolean;
}

export class HeroTimeline {
  private config: HeroTimelineConfig;
  private mainTimeline!: gsap.core.Timeline;
  private scrollTimeline!: gsap.core.Timeline;
  private threeContext: any;
  private splitText: SplitText | null = null;
  private quickX: any = null;
  private quickY: any = null;
  private observer: any = null;
  private draggable: any = null;
  private handlePointerMove: ((e: PointerEvent) => void) | null = null;

  constructor(config: HeroTimelineConfig) {
    this.config = config;
    this.threeContext = null; // Three.js removed
    this.init();
  }

  private init() {
    gsap.registerPlugin(ScrollTrigger, Flip, SplitText, Observer, Draggable);

    // Set up matchMedia for reduced motion
    gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
      this.createReducedMotionTimeline();
    });

    if (!this.config.reducedMotion) {
      this.createMainTimeline();
      this.createScrollTimeline();
      this.setupMicroInteractions();
    }
  }

  private createMainTimeline() {
    const { headline, subHeadline, scrollIndicator } = this.config;
    const ctx = gsap.context(() => {
      this.mainTimeline = gsap.timeline();

      // 1. Zero-G orb idle animation
      // Three.js visuals removed; keep text/indicator animations only

      // 2. Text reveal with SplitText 3.13
      if (headline) {
        this.splitText = SplitText.create(headline, {
          type: 'lines,words,chars',
          mask: 'words',
        });

        this.mainTimeline.from(
          this.splitText.chars,
          {
            ...animations.heroText,
            duration: 1.2,
            ease: 'expo.out'
          },
          '-=0.5'
        );
      }

      // 3. Sub-headline entrance
      if (subHeadline) {
        this.mainTimeline.fromTo(
          subHeadline,
          { yPercent: 50, opacity: 0 },
          { 
            yPercent: 0, 
            opacity: 1, 
            duration: 0.8,
            ease: 'power3.out' 
          },
          '-=0.4'
        );
      }

      // 4. Scroll indicator animation
      if (scrollIndicator) {
        this.mainTimeline.fromTo(
          scrollIndicator,
          { opacity: 0, y: -20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5,
            ease: 'power2.out' 
          },
          '-=0.3'
        )
        .to(scrollIndicator, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }
    }, this.config.container);

    this.mainTimeline.play();
  }

  private createScrollTimeline() {
    const { container, headline } = this.config;
    const ctx = gsap.context(() => {
      // Master scroll timeline with clamp() triggers
      this.scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'clamp(top top)',
          end: 'clamp(bottom+=2000 top)',
          scrub: 1,
          pin: container,
          pinSpacing: true,
          onUpdate: () => {}
        }
      });

      // Phase 1: Orb → metaball droplets (0-0.3)
      // Removed phase changes tied to Three.js uniforms

      // Phase 2: Headline switch-out with Flip (0.3-0.6)
      if (headline && this.splitText) {
        // Create floating typographic cluster
        const floatingHeadline = headline.cloneNode(true) as HTMLElement;
        floatingHeadline.classList.add('headline--floating');
        floatingHeadline.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          font-size: 2rem;
        `;
        document.body.appendChild(floatingHeadline);

        // Flip to floating position
        const flipTween = Flip.fit(headline, floatingHeadline, {
          scale: true,
          absolute: true,
          duration: 0.3,
          ease: 'power2.inOut'
        }) as gsap.core.Tween;
        
        this.scrollTimeline.add(flipTween, 0.3);

        // Fade in floating headline
        this.scrollTimeline.to(floatingHeadline, {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out'
        }, 0.3);

        // MotionPath animation around orb
        this.scrollTimeline.to(floatingHeadline, {
          motionPath: {
            path: [
              { x: 0, y: 0 },
              { x: 100, y: -50 },
              { x: 0, y: -100 },
              { x: -100, y: -50 },
              { x: 0, y: 0 }
            ],
            curviness: 1,
            autoRotate: true
          },
          duration: 0.3,
          ease: 'power2.inOut'
        }, 0.4);
      }

      // Phase 3: Parallax & color-way (0.6-0.85)
      // Removed camera push-in

      // Animate CSS custom properties
      this.scrollTimeline.to(':root', {
        '--accent': '#45dbff',
        duration: 0.25,
        ease: 'power2.inOut'
      }, 0.6);

      // Phase 4: Droplets recombine into ring (0.85-1.0)
      // Removed uniforms-based transitions

      // Scene tilt for drama
      // Removed camera tilt

      // Final scroll indicator fade-in
      if (this.config.scrollIndicator) {
        this.scrollTimeline.fromTo(
          this.config.scrollIndicator,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
          0.9
        );
      }
    }, this.config.container);
  }

  private setupMicroInteractions() {
    const ctx = gsap.context(() => {
      // 1. Pointer move parallax with quickTo
      if (this.threeContext?.mesh) {
        this.quickX = gsap.quickTo(this.threeContext.mesh.rotation, 'y', {
          duration: 0.6,
          ease: 'power3'
        });
        this.quickY = gsap.quickTo(this.threeContext.mesh.rotation, 'x', {
          duration: 0.6,
          ease: 'power3'
        });

        this.handlePointerMove = (e: PointerEvent) => {
          if (!this.quickX || !this.quickY) return; // ← 1️⃣ guard
          const x = (e.clientX / window.innerWidth - 0.5) * 0.8;
          const y = (e.clientY / window.innerHeight - 0.5) * 0.4;
          this.quickX(x);
          this.quickY(-y);
        };

        window.addEventListener('pointermove', this.handlePointerMove, { passive: true });

        // Dev-mode hardening for Hot-Refresh
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          // Store cleanup function on window for hot reload
          const windowWithCleanup = window as Window & { __gsapCleanup?: (() => void)[] };
          if (!windowWithCleanup.__gsapCleanup) {
            windowWithCleanup.__gsapCleanup = [];
          }
          windowWithCleanup.__gsapCleanup.push(() => {
            window.removeEventListener('pointermove', this.handlePointerMove!);
            ScrollTrigger.getAll().forEach((t: any) => t.kill(true)); // true!
          });
        }
      }

      // 2. Touch "tilt" with Observer
      if (this.threeContext?.scene) {
        this.observer = Observer.create({
          onChangeY: (self: any) => {
            const velocity = self.velocityY || 0;
            gsap.to(this.threeContext.scene.rotation, {
              x: `+=${velocity * 0.1}`,
              duration: 0.8,
              ease: 'power2.out'
            });
          },
          onChangeX: (self: any) => {
            const velocity = self.velocityX || 0;
            gsap.to(this.threeContext.scene.rotation, {
              y: `+=${velocity * 0.1}`,
              duration: 0.8,
              ease: 'power2.out'
            });
          }
        });
      }

      // 3. Draggable orb (easter-egg)
      const orbElement = this.config.container.querySelector('[data-orb]');
      if (orbElement && !this.config.reducedMotion) {
        this.draggable = Draggable.create(orbElement, {
          type: 'rotation',
          inertia: true,
          onDrag: () => {
            // Optional: Add haptic feedback or sound
          }
        });
      }
    }, this.config.container);
  }

  private createReducedMotionTimeline() {
    const { headline, subHeadline, scrollIndicator } = this.config;
    const ctx = gsap.context(() => {
      this.mainTimeline = gsap.timeline();

      this.mainTimeline
        .fromTo(headline, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.5
        })
        .fromTo(subHeadline, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.3
        }, '-=0.3')
        .fromTo(scrollIndicator, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.2
        }, '-=0.2');

      this.mainTimeline.play();
    }, this.config.container);
  }

  // Public methods
  public play() {
    this.mainTimeline?.play();
    this.scrollTimeline?.play();
  }

  public pause() {
    this.mainTimeline?.pause();
    this.scrollTimeline?.pause();
  }

  public restart() {
    this.mainTimeline?.restart();
    this.scrollTimeline?.restart();
  }

  public revert() {
    // Use revert() instead of kill() for clean DOM state
    this.mainTimeline?.revert();
    this.scrollTimeline?.revert();

    // 🆕 hard-kill the pin so the spacer DIV disappears
    // Access ScrollTrigger from the timeline's scrollTrigger property
    if (this.scrollTimeline && (this.scrollTimeline as any).scrollTrigger) {
      (this.scrollTimeline as any).scrollTrigger.kill(true);
    }

    // Kill ALL ScrollTriggers to ensure no orphan spacers remain
    ScrollTrigger.getAll().forEach(trigger => {
      trigger.kill(true); // Force flag removes pin-spacer DIVs
    });

    // Clean up SplitText
    if (this.splitText) {
      this.splitText.revert();
      this.splitText = null;
    }
    
    // Clean up micro-interactions
    // Note: quickTo functions don't have a kill() method, they're just functions
    this.quickX = null;
    this.quickY = null;
    
    // Clean up Observer
    if (this.observer && typeof this.observer.kill === 'function') {
      this.observer.kill();
      this.observer = null;
    }
    
    // Clean up Draggable
    if (this.draggable && Array.isArray(this.draggable) && this.draggable[0]) {
      if (typeof this.draggable[0].kill === 'function') {
        this.draggable[0].kill();
      }
      this.draggable = null;
    }

    // Clean up pointermove event listener
    if (this.handlePointerMove) {
      window.removeEventListener('pointermove', this.handlePointerMove);
      this.handlePointerMove = null;
    }
    
    // Final cleanup - kill all remaining triggers
    ScrollTrigger.killAll();
  }

  public getMainTimeline() {
    return this.mainTimeline;
  }

  public getScrollTimeline() {
    return this.scrollTimeline;
  }
} 