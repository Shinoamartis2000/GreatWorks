import { useEffect, useState } from "react";

const ImpactCounter = ({ label, value, suffix, testId }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = value / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.round(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="rounded-2xl bg-white/70 p-6 shadow-sm" data-testid={testId}>
      <p className="text-3xl font-semibold text-brand-forest">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-brand-muted">{label}</p>
    </div>
  );
};

export default ImpactCounter;
