import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate, testId }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-3" data-testid={testId}>
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="rounded-xl bg-white/70 p-4 text-center">
          <p className="text-2xl font-semibold text-brand-forest" data-testid={`${testId}-${label}`}>
            {value}
          </p>
          <p className="text-xs uppercase tracking-widest text-brand-muted">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
