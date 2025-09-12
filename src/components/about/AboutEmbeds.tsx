'use client';

import React, { useMemo } from 'react';
import { Disc3, ExternalLink, Music } from 'lucide-react';

type NowPlayingData = {
  title?: string;
  artist?: string;
  albumArtUrl?: string;
  url?: string;
};

type AboutEmbedsProps = {
  className?: string;

  spotifyShieldUrl?: string;
  spotifyProfileUrl?: string;
  appleMusicUrl?: string;
  playlistUrl?: string;
  nowPlaying?: NowPlayingData;
};

export const AboutEmbeds: React.FC<AboutEmbedsProps> = ({
  className = '',

  spotifyShieldUrl = 'https://novatorem-three-weld.vercel.app/api/spotify',
  spotifyProfileUrl = 'https://open.spotify.com/user/22qxmelpc5gmkycawd5zkuwfq',
  appleMusicUrl,
  playlistUrl,
  nowPlaying,
}) => {
  const genres = useMemo(
    () => ['Electronic', 'Indie', 'Lo-fi', 'Hip-hop', 'House', 'Ambient'],
    []
  );
  const moods = useMemo(
    () => ['Focus', 'Night drive', 'Weekend', '2010s', '90s', 'Instrumental'],
    []
  );
  const artists = useMemo(
    () => ['ODESZA', 'Tycho', 'Bonobo', 'The xx', 'Phoebe Bridgers', 'FKJ'],
    []
  );

  const playlistHref = playlistUrl ?? spotifyProfileUrl;
  const trackTitle = nowPlaying?.title ?? 'Not playing';
  const trackArtist = nowPlaying?.artist ?? '—';
  const albumArt = nowPlaying?.albumArtUrl;
  const trackUrl = nowPlaying?.url ?? spotifyProfileUrl;

  return (
    <div data-about-embeds className={className}>
      <div
        className="relative rounded-2xl p-[2px] bg-gradient-to-br from-teal-400/20 via-indigo-500/15 to-violet-500/20 shadow-xl shadow-black/30"
        data-hover-card
      >
        <div className="rounded-[1rem] overflow-hidden bg-white/5 backdrop-blur-xl ring-1 ring-inset ring-white/10">
          {/* Header: subtle context */}
          <div className="flex items-center gap-2 px-4 pt-4">
            <Music className="h-4 w-4 text-emerald-300" aria-hidden />
            <div className="text-white/85 text-sm font-medium">Music</div>
          </div>

          {/* Split layout */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left: Now Playing (40%) */}
            <div className="md:col-span-5 p-4 pt-3 border-b md:border-b-0 md:border-r border-white/10">
              {albumArt || nowPlaying ? (
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-md overflow-hidden ring-1 ring-white/10 bg-white/5 flex items-center justify-center">
                      {albumArt ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={albumArt} alt="Album art" className="h-full w-full object-cover" loading="lazy" width={56} height={56} />
                      ) : (
                        <Disc3 className="h-6 w-6 text-white/60" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white/90 truncate">{trackTitle}</div>
                      <div className="text-xs text-white/60 truncate">{trackArtist}</div>
                    </div>
                  </div>
                  <div className="mt-3 h-3">
                    <div className="eq-line">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <span
                          key={i}
                          style={{
                            animationDelay: `${(i % 5) * 90}ms`,
                            animationDuration: `${900 + (i % 4) * 140}ms`,
                            height: `${6 + (i % 5) * 2}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-md overflow-hidden ring-1 ring-white/10 bg-white/5">
                  {/* Fallback shield */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={spotifyShieldUrl}
                    alt="Spotify now playing"
                    className="w-full h-auto"
                    loading="lazy"
                    width={400}
                    height={140}
                  />
                </div>
              )}
            </div>

            {/* Right: Taste (60%) */}
            <div className="md:col-span-7 p-4 pt-3">
              <div className="text-xs text-white/60 mb-2">Top genres</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((g) => (
                  <span key={g} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[12px] text-white/85 ring-1 ring-white/10">
                    {g}
                  </span>
                ))}
              </div>

              <div className="text-xs text-white/60 mb-2">Favorite artists</div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-white/90 mb-4">
                {artists.map((a) => (
                  <li key={a} className="truncate">{a}</li>
                ))}
              </ul>

              <div className="text-xs text-white/60 mb-2">Moods / decades</div>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <span key={m} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[12px] text-white/85 ring-1 ring-white/10">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="border-t border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
            <a
              href={playlistHref}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-[13px] text-emerald-300 hover:text-emerald-200"
              aria-label="Open playlist"
            >
              Open playlist
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
            <div className="flex items-center gap-3 text-[12px]">
              <a href={spotifyProfileUrl} target="_blank" rel="noreferrer noopener" className="text-white/70 hover:text-white/90 inline-flex items-center gap-1">
                Spotify
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
              {appleMusicUrl && (
                <a href={appleMusicUrl} target="_blank" rel="noreferrer noopener" className="text-white/70 hover:text-white/90 inline-flex items-center gap-1">
                  Apple
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutEmbeds;


