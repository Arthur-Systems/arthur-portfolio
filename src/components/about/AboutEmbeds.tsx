'use client';

import React from 'react';

type AboutEmbedsProps = {
  className?: string;
  githubUsername?: string;
  spotifyShieldUrl?: string;
  spotifyProfileUrl?: string;
};

export const AboutEmbeds: React.FC<AboutEmbedsProps> = ({
  className = '',
  githubUsername = 'Arthur-Systems',
  spotifyShieldUrl = 'https://novatorem-three-weld.vercel.app/api/spotify',
  spotifyProfileUrl = 'https://open.spotify.com/user/22qxmelpc5gmkycawd5zkuwfq',
}) => {
  return (
    <div data-about-embeds className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {/* GitHub Top Languages */}
      <a
        href={`https://github.com/${githubUsername}`}
        target="_blank"
        rel="noreferrer noopener"
        className="relative rounded-2xl p-[2px] bg-gradient-to-br from-teal-400/20 via-indigo-500/15 to-violet-500/20 shadow-xl shadow-black/30"
        data-hover-card
        aria-label="View GitHub profile"
      >
        <div className="rounded-[1rem] overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 card-elevate">
          <div className="px-4 pt-4 text-white/90 text-sm font-medium">Top languages</div>
          <div className="p-4">
            <img
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&langs_count=6&theme=vue-dark&layout=compact`}
              alt="GitHub top languages"
              className="w-full h-auto rounded-md"
              loading="lazy"
              width={600}
              height={300}
            />
          </div>
        </div>
      </a>

      {/* Spotify Now Playing */}
      <a
        href={spotifyProfileUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="relative rounded-2xl p-[2px] bg-gradient-to-br from-teal-400/20 via-indigo-500/15 to-violet-500/20 shadow-xl shadow-black/30"
        data-hover-card
        aria-label="View Spotify profile"
      >
        <div className="rounded-[1rem] overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10 card-elevate">
          <div className="px-4 pt-4 text-white/90 text-sm font-medium">Now playing</div>
          <div className="p-4">
            <img
              src={spotifyShieldUrl}
              alt="Spotify now playing"
              className="w-full h-auto rounded-md"
              loading="lazy"
              width={600}
              height={180}
            />
          </div>
        </div>
      </a>
    </div>
  );
};

export default AboutEmbeds;


