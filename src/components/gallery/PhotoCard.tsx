export interface PhotoCardProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  lqip?: string;
  onClick?: () => void;
}

import Image from 'next/image';

export function PhotoCard({ src, alt, width, height, lqip, onClick }: PhotoCardProps) {
  return (
    <button
      className="group relative block w-full overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg"
      onClick={onClick}
      aria-label={alt}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
      />
    </button>
  );
}
