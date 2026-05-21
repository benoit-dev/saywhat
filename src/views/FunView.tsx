import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { REVEAL_TIME } from "../data/constants";
import { Polls } from "./fun/Polls";
import { Wall } from "./fun/Wall";
import { Photos, type PhotoDoc } from "./fun/Photos";
import { PhotoViewer } from "./fun/PhotoViewer";
import { Wrapped, buildWrappedSlides } from "./fun/Wrapped";

function formatCountdown(ms: number): string {
  if (ms <= 0) return "maintenant";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function FunView() {
  const [now, setNow] = useState<number>(() => Date.now());
  const [viewerPhoto, setViewerPhoto] = useState<PhotoDoc | null>(null);
  const [wrappedOn, setWrappedOn] = useState(false);

  const revealed = now >= REVEAL_TIME;

  useEffect(() => {
    if (revealed) return;
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, [revealed]);

  // Pull wall + photos for the wrapped builder (separately from sub-components, which also subscribe)
  const wallItems =
    (useQuery(api.wall.list) ?? []) as { text: string; attrib?: string; likes: string[] }[];
  const photos = (useQuery(api.photos.list) ?? []) as PhotoDoc[];

  const slides = useMemo(
    () => buildWrappedSlides(photos, wallItems),
    [photos, wallItems]
  );

  return (
    <section className="view">
      <div className={`fun-hero ${revealed ? "unlocked" : "locked"}`}>
        {revealed ? (
          <>
            <div className="fun-hero-label">✨ La galerie est ouverte</div>
            <div className="fun-hero-title">
              Souvenirs du <em>weekend</em>
            </div>
            <div className="countdown-sub" style={{ marginTop: 8 }}>
              Photos, citations, sondages · tout est là
            </div>
          </>
        ) : (
          <>
            <div className="fun-hero-label">🔒 Verrouillé pour l'instant</div>
            <div className="fun-hero-title">
              La galerie ouvre <em>dimanche midi</em>
            </div>
            <div className="countdown">{formatCountdown(REVEAL_TIME - now)}</div>
            <div className="countdown-sub">
              avant le grand reveal des photos · sondages & citations dispo dès maintenant
            </div>
          </>
        )}
      </div>

      {revealed && (
        <div className="souvenir-cta" onClick={() => setWrappedOn(true)}>
          <div className="souvenir-cta-eyebrow">RÉCAP DU WE</div>
          <div className="souvenir-cta-title">
            Ton p'tit Wrapped
            <br />
            du chalet
          </div>
          <button className="souvenir-cta-btn">▶ lancer ({slides.length} slides)</button>
        </div>
      )}

      <Polls />
      <Wall />
      <Photos unlocked={revealed} onOpen={(p) => setViewerPhoto(p)} />

      {viewerPhoto && <PhotoViewer photo={viewerPhoto} onClose={() => setViewerPhoto(null)} />}
      {wrappedOn && <Wrapped slides={slides} onClose={() => setWrappedOn(false)} />}
    </section>
  );
}
