'use client';

import React, { useMemo, useState } from 'react';
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
  const genres = useMemo(() => ['Electronic', 'Indie', 'Lo-fi', 'Hip-hop', 'House', 'Ambient'], []);
  const eras = useMemo(() => ['2010s', '90s', '2000s', '80s'], []);
  const moods = useMemo(() => ['Focus', 'Night drive', 'Weekend', 'Instrumental'], []);
  const artists = useMemo(() => ['ODESZA', 'Tycho', 'Bonobo', 'The xx', 'Phoebe Bridgers', 'FKJ'], []);

  const [showGenresAll, setShowGenresAll] = useState(false);
  const [showArtistsAll, setShowArtistsAll] = useState(false);
  const [showMoodsAll, setShowMoodsAll] = useState(false);
  const [showErasAll, setShowErasAll] = useState(false);

  const playlistHref = playlistUrl ?? spotifyProfileUrl;
  const trackTitle = nowPlaying?.title ?? 'Not playing';
  const trackArtist = nowPlaying?.artist ?? '—';
  const albumArt = nowPlaying?.albumArtUrl;
  const trackUrl = nowPlaying?.url ?? spotifyProfileUrl;

  return (
    <div data-about-embeds data-stable className={className}>
      <div
        className="relative rounded-2xl p-[2px] bg-[hsl(250,20%,10%)]/100 shadow-sm border border-white/10"
        data-hover-card
        data-no-tilt
      >
        <div className="rounded-[1rem] overflow-hidden bg-white/5 ring-1 ring-inset ring-white/10">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 pt-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-emerald-300" aria-hidden />
              <div className="eyebrow">Music</div>
            </div>
            <a
              href={playlistHref}
              target="_blank"
              rel="noreferrer noopener"
              className="text-emerald-300 hover:text-emerald-200 text-[13px]"
            >
              Open playlist
            </a>
          </div>

          {/* Split layout */}
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Now Playing */}
            <div className="md:col-span-12 p-4 pt-3 border-b border-white/10">
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
                  <div className="mt-3 h-1.5 w-full bg-white/10 rounded">
                    <div className="h-full w-1/3 bg-emerald-300/60 rounded" />
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

            {/* Taste Profile */}
            <div className="md:col-span-12 p-4 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Genres */}
                <div>
                  <div className="eyebrow mb-2">Genres</div>
                  <div className="flex flex-wrap gap-2">
                    {(showGenresAll ? genres : genres.slice(0, 3)).map((g) => (
                      <span key={g} className="chip">{g}</span>
                    ))}
                    {!showGenresAll && genres.length > 3 && (
                      <button className="chip" onClick={() => setShowGenresAll(true)}>+{genres.length - 3}</button>
                    )}
                  </div>
                </div>

                {/* Artists */}
                <div>
                  <div className="eyebrow mb-2">Artists</div>
                  <div className="flex flex-wrap gap-2">
                    {(showArtistsAll ? artists : artists.slice(0, 3)).map((a) => (
                      <span key={a} className="chip">{a}</span>
                    ))}
                    {!showArtistsAll && artists.length > 3 && (
                      <button className="chip" onClick={() => setShowArtistsAll(true)}>+{artists.length - 3}</button>
                    )}
                  </div>
                </div>

                {/* Moods / Eras */}
                <div>
                  <div className="eyebrow mb-2">Moods / Eras</div>
                  <div className="flex flex-wrap gap-2">
                    {(showMoodsAll ? moods : moods.slice(0, 3)).map((m) => (
                      <span key={m} className="chip">{m}</span>
                    ))}
                    {(showErasAll ? eras : eras.slice(0, 3)).map((e) => (
                      <span key={e} className="chip">{e}</span>
                    ))}
                    {(!showMoodsAll && moods.length > 3) && (
                      <button className="chip" onClick={() => setShowMoodsAll(true)}>+{moods.length - 3}</button>
                    )}
                    {(!showErasAll && eras.length > 3) && (
                      <button className="chip" onClick={() => setShowErasAll(true)}>+{eras.length - 3}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="border-t border-white/10 bg-white/5 px-4 py-3 flex items-center justify-end">
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


