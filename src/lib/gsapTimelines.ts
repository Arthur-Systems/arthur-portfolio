// Re-export GSAP utilities from the central config to ensure a single instance
// and consistent global configuration across the app.
export { gsap, ScrollTrigger } from '@/lib/gsap/config';

export interface HeroTimelineConfig {
  // Elements
  heroContainer: HTMLElement;
  orbElement: HTMLElement;
  headlineElement: HTMLElement;
  subHeadlineElement: HTMLElement;
  scrollIndicator: HTMLElement;
  droplets: HTMLElement[];
  
  // Configuration
  duration?: number;
  ease?: string;
  reducedMotion?: boolean;
}

export class HeroTimelines {
  private config: HeroTimelineConfig;
  private mainTimeline: gsap.core.Timeline;
  private scrollTimeline: gsap.core.Timeline;

  constructor(config: HeroTimelineConfig) {
    this.config = {
      duration: 2,
      ease: 'power3.inOut',
      reducedMotion: false,
      ...config,
    };

    this.mainTimeline = gsap.timeline({ paused: true });
    this.scrollTimeline = gsap.timeline({ paused: true });
    
    this.init();
  }

  private init() {
    if (this.config.reducedMotion) {
      this.createReducedMotionTimeline();
    } else {
      this.createMainTimeline();
      this.createScrollTimeline();
    }
  }

  private createMainTimeline() {
    const { 
      orbElement, 
      headlineElement, 
      subHeadlineElement, 
      scrollIndicator,
      duration,
      ease 
    } = this.config;

    // Initial orb animation
    this.mainTimeline
      .from(orbElement, {
        scale: 0,
        opacity: 0,
        duration: duration! * 0.5,
        ease: 'back.out(1.7)',
      })
      .to(orbElement, {
        y: -20,
        duration: duration! * 0.3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1,
      }, '-=0.2');

    // Text animations without SplitText
    if (headlineElement) {
      this.mainTimeline
        .from(headlineElement, {
          opacity: 0,
          y: 50,
          scale: 0.8,
          duration: duration! * 0.6,
          ease: 'power4.out',
        }, '-=0.8');
    }

    if (subHeadlineElement) {
      this.mainTimeline
        .from(subHeadlineElement, {
          opacity: 0,
          y: 30,
          duration: duration! * 0.4,
          ease: 'power3.out',
        }, '-=0.6');
    }

    // Scroll indicator
    if (scrollIndicator) {
      this.mainTimeline
        .from(scrollIndicator, {
          opacity: 0,
          y: -20,
          duration: duration! * 0.3,
          ease: 'power2.out',
        }, '-=0.4')
        .to(scrollIndicator, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
    }

    // Start the timeline
    this.mainTimeline.play();
  }

  private createScrollTimeline() {
    const { 
      heroContainer, 
      orbElement, 
      headlineElement, 
      droplets,
      duration,
      ease 
    } = this.config;

    // Scroll-triggered animations
    this.scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroContainer,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          // Update scroll progress in store
          const progress = self.progress;
          // This will be connected to the store
        },
      },
    });

    // Orb morphing animation
    this.scrollTimeline
      .to(orbElement, {
        scale: 1.2,
        borderRadius: '30%',
        duration: duration! * 0.3,
        ease: 'power1.inOut',
      }, 0)
      .to(orbElement, {
        opacity: 0.3,
        scale: 0.8,
        duration: duration! * 0.4,
        ease: 'power1.inOut',
      }, 0.3);

    // Headline positioning without Flip
    if (headlineElement) {
      this.scrollTimeline.to(headlineElement, {
        position: 'fixed',
        top: '2rem',
        left: '2rem',
        scale: 0.8,
        duration: duration! * 0.2,
        ease: 'power2.inOut',
      }, 0.5);
    }

    // Droplet animations
    if (droplets.length > 0) {
      droplets.forEach((droplet, index) => {
        this.scrollTimeline
          .from(droplet, {
            opacity: 0,
            scale: 0,
            x: gsap.utils.random(-100, 100),
            y: gsap.utils.random(-100, 100),
            duration: duration! * 0.3,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
          }, 0.4)
          .to(droplet, {
            x: gsap.utils.random(-50, 50),
            y: gsap.utils.random(-50, 50),
            duration: duration! * 0.6,
            ease: 'power1.inOut',
          }, 0.7);
      });
    }
  }

  private createReducedMotionTimeline() {
    const { 
      orbElement, 
      headlineElement, 
      subHeadlineElement, 
      scrollIndicator,
      duration 
    } = this.config;

    // Simplified animations for reduced motion
    this.mainTimeline
      .from(orbElement, {
        opacity: 0,
        duration: duration! * 0.5,
      })
      .from(headlineElement, {
        opacity: 0,
        duration: duration! * 0.3,
      }, '-=0.3')
      .from(subHeadlineElement, {
        opacity: 0,
        duration: duration! * 0.3,
      }, '-=0.2')
      .from(scrollIndicator, {
        opacity: 0,
        duration: duration! * 0.2,
      }, '-=0.1');

    this.mainTimeline.play();
  }

  public play() {
    this.mainTimeline.play();
    this.scrollTimeline.play();
  }

  public pause() {
    this.mainTimeline.pause();
    this.scrollTimeline.pause();
  }

  public restart() {
    this.mainTimeline.restart();
    this.scrollTimeline.restart();
  }

  public kill() {
    this.mainTimeline.kill();
    this.scrollTimeline.kill();
  }

  public getMainTimeline(): gsap.core.Timeline {
    return this.mainTimeline;
  }

  public getScrollTimeline(): gsap.core.Timeline {
    return this.scrollTimeline;
  }
}