import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;
  const hasMany = count > 1;

  const goTo = (next: number) => {
    setIndex((next + count) % count);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMany) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) goTo(delta < 0 ? index + 1 : index - 1);
    touchStartX.current = null;
  };

  if (count === 0) {
    return (
      <div className="aspect-[3/4] overflow-hidden rounded-xl border border-soft bg-sunken">
        <div
          className="grid h-full w-full place-items-center text-gold-700"
          style={{ fontSize: 56 }}
        >
          ◈
        </div>
      </div>
    );
  }

  const arrowClass =
    'bb-focusable absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-soft bg-card text-muted shadow-sm transition hover:text-gold-text hover:shadow-gold';

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-xl border border-soft bg-sunken"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: 'transform var(--dur-base) var(--ease-out)',
          }}
        >
          {images.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={count > 1 ? `${alt} — foto ${i + 1} de ${count}` : alt}
              className="h-full w-full flex-shrink-0 object-cover"
              draggable={false}
            />
          ))}
        </div>

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Foto anterior"
              className={`${arrowClass} left-3`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Próxima foto"
              className={`${arrowClass} right-3`}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {hasMany && (
        <div className="flex items-center justify-center gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index}
              className="bb-focusable rounded-pill"
              style={{
                width: i === index ? 22 : 8,
                height: 8,
                background: i === index ? 'var(--gold-500)' : 'var(--white-400)',
                transition:
                  'width var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
