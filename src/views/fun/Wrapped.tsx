import { useEffect, useState } from "react";
import { PEOPLE } from "../../data/constants";
import type { PhotoDoc } from "./Photos";

type WrappedSlide =
  | { type: "intro" | "outro" | "empty"; eyebrow?: string; big?: string; title?: string; sub?: string }
  | { type: "photo"; eyebrow: string; img: string }
  | { type: "quote"; eyebrow: string; title: string; sub?: string }
  | { type: "crew"; eyebrow: string; crew: string[] };

type Quote = { text: string; attrib?: string; likes: string[] };

export function buildWrappedSlides(photos: PhotoDoc[], quotes: Quote[]): WrappedSlide[] {
  const slides: WrappedSlide[] = [];
  slides.push({
    type: "intro",
    eyebrow: "22 → 24 MAI 2026",
    big: "Le Wrapped",
    title: "<em>du chalet</em>",
    sub: "Matawinie · 15 personnes · des souvenirs à revoir",
  });

  const sortedPhotos = [...photos].filter((p) => p.url).sort((a, b) => a.createdAt - b.createdAt);
  const topQuotes = [...quotes]
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, Math.min(5, quotes.length));

  const interleaved: Array<{ kind: "photo"; data: PhotoDoc } | { kind: "quote"; data: Quote }> = [];
  const photoBlock = Math.ceil(sortedPhotos.length / Math.max(1, topQuotes.length + 1));
  let qi = 0;
  sortedPhotos.forEach((p, i) => {
    interleaved.push({ kind: "photo", data: p });
    if ((i + 1) % photoBlock === 0 && qi < topQuotes.length) {
      interleaved.push({ kind: "quote", data: topQuotes[qi] });
      qi++;
    }
  });
  while (qi < topQuotes.length) {
    interleaved.push({ kind: "quote", data: topQuotes[qi] });
    qi++;
  }

  if (interleaved.length === 0) {
    slides.push({
      type: "empty",
      eyebrow: "AÏE",
      big: "∅",
      title: "Pas encore de souvenirs",
      sub: "Ajoutez des photos et des citations pendant le weekend pour que le Wrapped soit beau",
    });
  } else {
    interleaved.forEach((item) => {
      if (item.kind === "photo" && item.data.url) {
        slides.push({
          type: "photo",
          eyebrow: "PAR " + item.data.author.toUpperCase(),
          img: item.data.url,
        });
      } else if (item.kind === "quote") {
        const q = item.data;
        slides.push({
          type: "quote",
          eyebrow: q.likes.length > 0 ? `♥ ${q.likes.length}` : "AU PASSAGE",
          title: q.text,
          sub: q.attrib ? "— " + q.attrib : undefined,
        });
      }
    });
  }

  slides.push({ type: "crew", eyebrow: "L'ÉQUIPAGE", crew: [...PEOPLE] });
  slides.push({
    type: "outro",
    big: "🤍",
    title: "À bientôt",
    sub: "le prochain chalet vous attend déjà quelque part",
  });
  return slides;
}

const GRADS = [
  "linear-gradient(135deg, #a855f7, #ff5722)",
  "linear-gradient(135deg, #06b6d4, #2563eb)",
  "linear-gradient(135deg, #ff5722, #fbbf24)",
  "linear-gradient(135deg, #16a34a, #84cc16)",
  "linear-gradient(135deg, #ec4899, #a855f7)",
  "linear-gradient(135deg, #0a0a0a, #2a2a2a)",
  "linear-gradient(135deg, #fbbf24, #ff5722)",
  "linear-gradient(135deg, #2563eb, #ec4899)",
];

export function Wrapped({
  slides,
  onClose,
}: {
  slides: WrappedSlide[];
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);

  const goNext = () => setIdx((i) => i + 1);
  const goPrev = () => setIdx((i) => Math.max(0, i - 1));

  useEffect(() => {
    if (idx >= slides.length) {
      onClose();
      return;
    }
    const slide = slides[idx];
    let dur = 5000;
    if (slide.type === "photo") dur = 4200;
    else if (slide.type === "quote") dur = 6000;
    else if (slide.type === "crew") dur = 6500;
    const t = setTimeout(goNext, dur + 200);
    return () => clearTimeout(t);
  }, [idx, slides, onClose]);

  if (idx >= slides.length) return null;
  const slide = slides[idx];
  const grad = GRADS[idx % GRADS.length];
  let dur = 5000;
  if (slide.type === "photo") dur = 4200;
  else if (slide.type === "quote") dur = 6000;
  else if (slide.type === "crew") dur = 6500;

  return (
    <div className="wrapped">
      <div className="wrapped-slide" style={{ background: grad, ["--wrap-dur" as never]: `${dur}ms` }}>
        <button className="wrapped-close" onClick={onClose}>
          ×
        </button>
        <div className="wrapped-progress">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`wrapped-progress-bar ${i < idx ? "done" : i === idx ? "active" : ""}`}
              style={i === idx ? { ["--wrap-dur" as never]: `${dur}ms` } : undefined}
            >
              <div className="wrapped-progress-fill" />
            </div>
          ))}
        </div>
        <div className="wrapped-tap-zones">
          <div className="wrapped-tap-zone prev" onClick={goPrev} />
          <div className="wrapped-tap-zone next" onClick={goNext} />
        </div>

        <SlideContent slide={slide} />
      </div>
    </div>
  );
}

function SlideContent({ slide }: { slide: WrappedSlide }) {
  if (slide.type === "photo") {
    return (
      <>
        <div className="wrapped-slide-eyebrow">{slide.eyebrow}</div>
        <img className="wrapped-slide-img" src={slide.img} alt="" />
      </>
    );
  }
  if (slide.type === "quote") {
    return (
      <>
        <div className="wrapped-slide-eyebrow">{slide.eyebrow}</div>
        <div className="wrapped-slide-title">« {slide.title} »</div>
        {slide.sub && (
          <div className="wrapped-slide-sub" style={{ marginTop: 10, fontStyle: "italic" }}>
            {slide.sub}
          </div>
        )}
      </>
    );
  }
  if (slide.type === "crew") {
    const half = Math.ceil(slide.crew.length / 2);
    const col1 = slide.crew.slice(0, half);
    const col2 = slide.crew.slice(half);
    return (
      <>
        <div className="wrapped-slide-eyebrow">{slide.eyebrow}</div>
        <div className="wrapped-slide-title" style={{ marginBottom: 18 }}>
          Vous
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            fontFamily: "'Instrument Serif', serif",
            fontSize: 18,
            lineHeight: 1.6,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            {col1.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>
          <div>
            {col2.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>
        </div>
      </>
    );
  }
  if (slide.type === "empty") {
    return (
      <>
        {slide.eyebrow && <div className="wrapped-slide-eyebrow">{slide.eyebrow}</div>}
        <div className="wrapped-slide-big" style={{ fontSize: 96 }}>
          {slide.big}
        </div>
        <div className="wrapped-slide-title">{slide.title}</div>
        {slide.sub && <div className="wrapped-slide-sub">{slide.sub}</div>}
      </>
    );
  }
  // intro / outro
  return (
    <>
      {slide.eyebrow && <div className="wrapped-slide-eyebrow">{slide.eyebrow}</div>}
      {slide.big && (
        <div
          className="wrapped-slide-big"
          dangerouslySetInnerHTML={{ __html: slide.big }}
        />
      )}
      {slide.title && (
        <div
          className="wrapped-slide-title"
          dangerouslySetInnerHTML={{ __html: slide.title }}
        />
      )}
      {slide.sub && <div className="wrapped-slide-sub">{slide.sub}</div>}
    </>
  );
}
