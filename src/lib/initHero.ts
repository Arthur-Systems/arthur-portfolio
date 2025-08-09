import { ScrollSmoother, SplitText, gsap } from 'gsap/all';

export function initHero(root: HTMLElement) {
  gsap.registerPlugin(ScrollSmoother, SplitText);

  // Check if ScrollSmoother already exists
  let smoother = ScrollSmoother.get();
  
  if (!smoother) {
    // Initialize ScrollSmoother only if it doesn't exist
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      normalizeScroll: true,
      speed: 1.25,          // smoother speed boost
      effects: root.matches('.reduce-motion') ? false : true,
    });
  }

  // Initialize SplitText for headline
  const headline = root.querySelector('h1');
  let split: SplitText | null = null;
  
  if (headline) {
    split = SplitText.create(headline, {
      type: 'lines,words,chars',
      mask: 'words',
    });
    
    gsap.from(split.chars, {
      yPercent: 110,
      stagger: 0.03,
      duration: 1.2,
      ease: 'expo.out',
    });
  }

  return { smoother, split };
}

export function killHero() {
  // Clean up ScrollSmoother
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.kill();
  }
} 