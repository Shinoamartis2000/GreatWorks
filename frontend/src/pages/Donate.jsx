import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { givingOptions } from "@/data/siteData";

const Donate = () => {
  const [settings, setSettings] = useState({});
  const [goals, setGoals] = useState([]);
  const [donation, setDonation] = useState({ name: "", email: "", amount: 50, recurring: false, frequency: "Monthly" });
  const [calculator, setCalculator] = useState(50);

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, goalsRes] = await Promise.all([api.get("/settings"), api.get("/goals")]);
      setSettings(settingsRes.data || {});
      setGoals(goalsRes.data || []);
    };
    fetchData();
  }, []);

  const impact = useMemo(() => {
    return {
      meals: Math.floor(calculator * 3),
      kits: Math.floor(calculator / 25),
      nights: Math.floor(calculator / 40),
    };
  }, [calculator]);

  const submitDonation = async (event) => {
    event.preventDefault();
    await api.post("/donations", {
      donor_name: donation.name,
      donor_email: donation.email,
      amount: Number(donation.amount),
      recurring: donation.recurring,
      frequency: donation.frequency,
    });
    toast.success("Donation recorded. Thank you!");
    setDonation({ name: "", email: "", amount: 50, recurring: false, frequency: "Monthly" });
  };

  const goal = goals[0];
  const progress = goal ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100)) : 42;

  return (
    <div className="section-gradient" data-testid="donate-page">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <p className="text-xs uppercase tracking-widest text-brand-muted">Donate</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-forest">Your gift rebuilds futures</h1>
        <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl bg-white/70 p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-brand-forest">Give today</h2>
            <form className="mt-6 grid gap-4" onSubmit={submitDonation}>
              <input
                type="text"
                placeholder="Full name"
                className="h-12 rounded-lg border border-brand-forest/20 px-4"
                value={donation.name}
                onChange={(event) => setDonation({ ...donation, name: event.target.value })}
                data-testid="donate-name-input"
              />
              <input
                type="email"
                placeholder="Email address"
                className="h-12 rounded-lg border border-brand-forest/20 px-4"
                value={donation.email}
                onChange={(event) => setDonation({ ...donation, email: event.target.value })}
                data-testid="donate-email-input"
              />
              <input
                type="number"
                min="5"
                className="h-12 rounded-lg border border-brand-forest/20 px-4"
                value={donation.amount}
                onChange={(event) => setDonation({ ...donation, amount: event.target.value })}
                data-testid="donate-amount-input"
              />
              <label className="flex items-center gap-3 text-sm text-brand-muted">
                <input
                  type="checkbox"
                  checked={donation.recurring}
                  onChange={(event) => setDonation({ ...donation, recurring: event.target.checked })}
                  data-testid="donate-recurring-toggle"
                />
                Make this a recurring gift
              </label>
              {donation.recurring && (
                <select
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={donation.frequency}
                  onChange={(event) => setDonation({ ...donation, frequency: event.target.value })}
                  data-testid="donate-frequency-select"
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
              )}
              <button
                type="submit"
                className="rounded-full bg-brand-forest px-6 py-4 text-sm font-semibold text-white"
                data-testid="donate-submit-button"
              >
                Submit Donation
              </button>
            </form>
            <div className="mt-6 rounded-2xl border border-brand-forest/10 bg-white p-4">
              <p className="text-xs uppercase tracking-widest text-brand-muted">GoFundMe</p>
              <a
                href={settings.gofundme_url || "#"}
                className="mt-2 inline-flex rounded-full bg-brand-terracotta px-5 py-3 text-sm font-semibold text-white"
                data-testid="gofundme-link"
              >
                Support our GoFundMe
              </a>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/70 p-6 shadow-sm">
              <h3 className="font-serif text-xl text-brand-forest">Impact calculator</h3>
              <input
                type="range"
                min="10"
                max="500"
                value={calculator}
                onChange={(event) => setCalculator(Number(event.target.value))}
                className="mt-4 w-full"
                data-testid="impact-calculator-slider"
              />
              <p className="mt-3 text-sm text-brand-muted" data-testid="impact-calculator-amount">
                ${calculator} can provide {impact.meals} meals, {impact.kits} education kits, and {impact.nights} safe nights.
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-6 shadow-sm">
              <h3 className="font-serif text-xl text-brand-forest">Current goal</h3>
              <p className="mt-2 text-sm text-brand-muted" data-testid="donation-goal-title">
                {goal ? goal.title : "2024 Recovery Goal"}
              </p>
              <div className="mt-4 h-3 w-full rounded-full bg-brand-forest/10">
                <div
                  className="h-3 rounded-full bg-brand-forest"
                  style={{ width: `${progress}%` }}
                  data-testid="donation-goal-progress"
                />
              </div>
              <p className="mt-2 text-xs text-brand-muted">{progress}% funded</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-6 shadow-sm">
              <h3 className="font-serif text-xl text-brand-forest">Giving options</h3>
              <div className="mt-4 space-y-4">
                {givingOptions.map((option, index) => (
                  <div key={option.label} className="rounded-xl border border-brand-forest/10 p-4" data-testid={`giving-option-${index}`}>
                    <p className="font-semibold text-brand-forest">${option.amount} — {option.label}</p>
                    <p className="text-sm text-brand-muted">{option.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
