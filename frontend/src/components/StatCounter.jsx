import { useEffect, useRef, useState } from "react";

const StatCounter = ({ value, label, suffix = "", note, testId }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            if (prefersReduced || value <= 0) {
              setCount(value);
              return;
            }
            const duration = 1000;
            const start = performance.now();
            const tick = (now) => {
              const progress = Math.min(1, (now - start) / duration);
              setCount(Math.round(progress * value));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="border-l-4 border-gov-blue bg-white px-5 py-6" data-testid={testId}>
      <p className="font-serif text-3xl font-bold text-gov-navy sm:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-sm font-semibold text-gov-charcoal">{label}</p>
      {note && <p className="mt-1 text-xs text-gov-slate">{note}</p>}
    </div>
  );
};

export default StatCounter;
