"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function animateWhatIDo(root: HTMLElement) {
  if (reduceMotion()) return fadeOnce(root, ".cap-card");
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: {
      trigger: root,
      start: "top 75%",
      end: "bottom 30%",
      once: true,
    },
  });

  {
    const cards = root.querySelectorAll('.cap-card');
    if (cards.length) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 28, rotateX: -4 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.12 }
      );
    }
  }

  root.querySelectorAll<HTMLElement>(".cap-card").forEach((card) => {
    const st = gsap.timeline({ defaults: { ease: "power3.out" } });
    const icon = card.querySelector(".cap-icon");
    const titleBody = card.querySelectorAll(".cap-title, .cap-body");
    const chips = card.querySelectorAll(".cap-chip");
    st.fromTo(icon, { opacity: 0, y: 10, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.35 });
    st.fromTo(titleBody, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 }, "<0.04");
    st.fromTo(chips, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.04 }, "<0.02");
    ScrollTrigger.create({ trigger: card, start: "top 85%", once: true, animation: st });
  });

  gsap.to(root, {
    yPercent: -3,
    scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.5 },
  });
}

export function animateCreds(root: HTMLElement) {
  if (reduceMotion()) return fadeOnce(root, ".creds-card, .wins-card");

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    scrollTrigger: { trigger: root, start: "top 75%", once: true },
  });

  {
    const creds = root.querySelector('.creds-card');
    const wins = root.querySelector('.wins-card');
    if (creds) tl.fromTo(creds, { opacity: 0, x: -32 }, { opacity: 1, x: 0, duration: 0.5 });
    if (wins) tl.fromTo(wins, { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: 0.5 }, creds ? '<0.08' : 0);
  }

  {
    const credLines = root.querySelectorAll('.cred-line');
    const winLines = root.querySelectorAll('.win-line');
    if (credLines.length) tl.fromTo(credLines, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.06 }, '<0.05');
    if (winLines.length) tl.fromTo(winLines, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.06 }, '<0.02');
  }

  const badge = root.querySelector(".badge-verified") as HTMLElement | null;
  if (badge) {
    gsap.fromTo(badge, { scale: 0.9, filter: "brightness(0.9)" }, { scale: 1, filter: "brightness(1.2)", duration: 0.35, delay: 0.2 });
  }

  {
    const chips = root.querySelectorAll('.footprint-chip');
    if (chips.length) gsap.fromTo(chips, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.05, delay: 0.2 });
  }
}

function fadeOnce(root: HTMLElement, sel: string) {
  root.querySelectorAll<HTMLElement>(sel).forEach((el, i) => {
    el.style.opacity = "0";
    setTimeout(() => {
      el.style.transition = "opacity .4s ease, transform .4s ease";
      el.style.opacity = "1";
      el.style.transform = "none";
    }, 60 * i);
  });
}

export function attachCardHoverMotion(root: HTMLElement) {
  if (reduceMotion()) return;
  root.querySelectorAll<HTMLElement>(".cap-card, .creds-card, .wins-card").forEach((card) => {
    const toY = gsap.quickTo(card, "y", { duration: 0.2, ease: "power2.out" });
    const toR = gsap.quickTo(card, "rotateX", { duration: 0.2 });
    const toS = gsap.quickTo(card, "scale", { duration: 0.2 });
    card.addEventListener("mouseenter", () => { toY(-4); toR(0.5); toS(1.01); });
    card.addEventListener("mouseleave", () => { toY(0);  toR(0);   toS(1);    });
  });
}


