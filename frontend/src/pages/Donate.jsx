import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { givingOptions, organisation } from "@/data/siteData";
import PageHeader from "@/components/PageHeader";

const Donate = () => {
  const [settings, setSettings] = useState({});
  const [goals, setGoals] = useState([]);
  const [donation, setDonation] = useState({ name: "", email: "", amount: 50, recurring: false, frequency: "Monthly" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, goalsRes] = await Promise.all([api.get("/settings"), api.get("/goals")]);
      setSettings(settingsRes.data || {});
      setGoals(goalsRes.data || []);
    };
    fetchData();
  }, []);

  const submitDonation = async (event) => {
    event.preventDefault();
    const v = {};
    if (!donation.name) v.name = "Full name is required";
    if (!donation.email) v.email = "Email is required";
    if (!donation.amount || Number(donation.amount) < 5) v.amount = "Minimum contribution is 5";
    setErrors(v);
    if (Object.keys(v).length) return;
    await api.post("/donations", {
      donor_name: donation.name,
      donor_email: donation.email,
      amount: Number(donation.amount),
      recurring: donation.recurring,
      frequency: donation.frequency,
    });
    toast.success("Thank you. Your contribution has been recorded.");
    setDonation({ name: "", email: "", amount: 50, recurring: false, frequency: "Monthly" });
  };

  const goal = goals[0];
  const progress = goal && goal.target_amount ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100)) : null;
  const field = "h-12 w-full rounded-sm border border-gov-line px-4 text-sm text-gov-navy";

  return (
    <div>
      <PageHeader
        eyebrow="Support Our Work"
        title="Donate"
        description="Contributions support our education, welfare, and relief programmes in Enugu, Nigeria. Donations are recorded and acknowledged."
        breadcrumbs={[{ label: "Donate" }]}
        testId="donate-header"
      />

      <section className="bg-white py-14 md:py-20" data-testid="donate-page">
        <div className="gov-container grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <form className="gov-card p-6 md:p-8" onSubmit={submitDonation} noValidate>
            <h2 className="gov-h3">Make a contribution</h2>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="d-name" className="text-sm font-semibold text-gov-navy">Full name</label>
                  <input id="d-name" className={`mt-1 ${field}`} value={donation.name} onChange={(e) => setDonation({ ...donation, name: e.target.value })} data-testid="donate-name-input" />
                  {errors.name && <p className="mt-1 text-xs text-gov-red">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="d-email" className="text-sm font-semibold text-gov-navy">Email</label>
                  <input id="d-email" type="email" className={`mt-1 ${field}`} value={donation.email} onChange={(e) => setDonation({ ...donation, email: e.target.value })} data-testid="donate-email-input" />
                  {errors.email && <p className="mt-1 text-xs text-gov-red">{errors.email}</p>}
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold text-gov-navy">Select an amount</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {givingOptions.map((o) => (
                    <button
                      type="button"
                      key={o.amount}
                      onClick={() => setDonation({ ...donation, amount: o.amount })}
                      className={`rounded-sm border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                        Number(donation.amount) === o.amount ? "border-gov-blue bg-gov-blue text-white" : "border-gov-line text-gov-charcoal hover:bg-gov-mist"
                      }`}
                      data-testid={`donate-preset-${o.amount}`}
                    >
                      ${o.amount}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="d-amount" className="text-sm font-semibold text-gov-navy">Or enter an amount (USD)</label>
                <input id="d-amount" type="number" min="5" className={`mt-1 ${field}`} value={donation.amount} onChange={(e) => setDonation({ ...donation, amount: e.target.value })} data-testid="donate-amount-input" />
                {errors.amount && <p className="mt-1 text-xs text-gov-red">{errors.amount}</p>}
              </div>
              <label className="flex items-center gap-3 text-sm text-gov-charcoal">
                <input type="checkbox" checked={donation.recurring} onChange={(e) => setDonation({ ...donation, recurring: e.target.checked })} data-testid="donate-recurring-toggle" />
                Make this a recurring contribution
              </label>
              {donation.recurring && (
                <select className={field} value={donation.frequency} onChange={(e) => setDonation({ ...donation, frequency: e.target.value })} data-testid="donate-frequency-select">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
              )}
              <button type="submit" className="gov-btn-primary w-full sm:w-auto" data-testid="donate-submit-button">Submit contribution</button>
            </div>
          </form>

          <div className="space-y-6">
            {goal && (
              <div className="gov-card p-6" data-testid="donate-goal">
                <h3 className="gov-h3">Current funding goal</h3>
                <p className="mt-1 text-sm text-gov-charcoal" data-testid="donation-goal-title">{goal.title}</p>
                {progress !== null && (
                  <>
                    <div className="mt-4 h-2.5 w-full rounded-sm bg-gov-line">
                      <div className="h-2.5 rounded-sm bg-gov-green" style={{ width: `${progress}%` }} data-testid="donation-goal-progress" />
                    </div>
                    <p className="mt-2 text-xs text-gov-slate">{progress}% of ${goal.target_amount?.toLocaleString()} funded</p>
                  </>
                )}
              </div>
            )}

            <div className="gov-card p-6">
              <h3 className="gov-h3">How contributions are used</h3>
              <ul className="mt-4 divide-y divide-gov-line">
                {givingOptions.map((o) => (
                  <li key={o.label} className="py-3" data-testid={`giving-option-${o.amount}`}>
                    <p className="text-sm font-semibold text-gov-navy">${o.amount} — {o.label}</p>
                    <p className="text-sm text-gov-slate">{o.impact}</p>
                  </li>
                ))}
              </ul>
            </div>

            {settings.gofundme_url && (
              <div className="gov-card border-l-4 border-gov-blue p-6">
                <h3 className="gov-h3">External campaign</h3>
                <a href={settings.gofundme_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex gov-btn-secondary" data-testid="gofundme-link">
                  Support our campaign
                </a>
              </div>
            )}

            <p className="text-xs text-gov-slate">
              For institutional or CSR giving, please <a href={`mailto:${organisation.email}`} className="gov-link">contact our team</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
