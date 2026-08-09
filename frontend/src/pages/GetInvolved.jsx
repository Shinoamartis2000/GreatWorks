import { useEffect, useMemo, useState } from "react";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { toast } from "sonner";
import { HandHeart, Handshake, Megaphone } from "lucide-react";
import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";

const roles = [
  { icon: HandHeart, title: "Volunteer", text: "Support scholarship students and community outreach teams in Enugu." },
  { icon: Handshake, title: "Partner", text: "Fund scholarships, care packs, and relief activities through partnership." },
  { icon: Megaphone, title: "Advocate", text: "Share programme updates and help raise awareness of our work." },
];

const GetInvolved = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [form, setForm] = useState({ name: "", email: "", phone: "", skills: "", availability: "", motivation: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get("/events").then(({ data }) => setEvents(data || []));
    const saved = localStorage.getItem("volunteerDraft");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const eventsForDate = useMemo(
    () => events.filter((e) => new Date(e.start_datetime).toDateString() === selectedDate.toDateString()),
    [events, selectedDate]
  );

  const submitVolunteer = async (event) => {
    event.preventDefault();
    const v = {};
    if (!form.name) v.name = "Name is required";
    if (!form.email) v.email = "Email is required";
    setErrors(v);
    if (Object.keys(v).length) return;
    if (!navigator.onLine) {
      localStorage.setItem("volunteerDraft", JSON.stringify(form));
      toast.message("You are offline. Your application has been saved for later.");
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, val]) => fd.append(k, val));
    if (resumeFile) fd.append("resume", resumeFile);
    await api.post("/volunteers", fd);
    toast.success("Your volunteer application has been submitted.");
    setForm({ name: "", email: "", phone: "", skills: "", availability: "", motivation: "" });
    setResumeFile(null);
    localStorage.removeItem("volunteerDraft");
  };

  const registerForEvent = async (id) => {
    await api.post(`/events/${id}/register`, { name: "Guest", email: "guest@example.com", phone: "" });
    toast.success("Registration received.");
  };

  const field = "h-12 w-full rounded-sm border border-gov-line px-4 text-sm text-gov-navy";

  return (
    <div>
      <PageHeader
        eyebrow="Get Involved"
        title="Volunteer, Partner, or Advocate"
        description="There are several ways to support the work of GreatWorks Foundation. Apply to volunteer or register for an upcoming activity below."
        breadcrumbs={[{ label: "Get Involved" }]}
        testId="get-involved-header"
      />

      <section className="bg-white py-12 md:py-16" data-testid="get-involved-page">
        <div className="gov-container grid gap-6 md:grid-cols-3">
          {roles.map((role, index) => (
            <div key={role.title} className="gov-card p-6" data-testid={`involved-option-${index}`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-gov-navy text-white"><role.icon className="h-5 w-5" aria-hidden="true" /></span>
              <h3 className="mt-4 font-serif text-lg font-bold text-gov-navy">{role.title}</h3>
              <p className="mt-2 text-sm text-gov-charcoal">{role.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gov-line bg-gov-mist py-14 md:py-20">
        <div className="gov-container grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <form className="gov-card p-6 md:p-8" onSubmit={submitVolunteer} noValidate data-testid="volunteer-form">
            <h2 className="gov-h3">Volunteer application</h2>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="v-name" className="text-sm font-semibold text-gov-navy">Full name</label>
                  <input id="v-name" className={`mt-1 ${field}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="volunteer-name-input" />
                  {errors.name && <p className="mt-1 text-xs text-gov-red">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="v-email" className="text-sm font-semibold text-gov-navy">Email</label>
                  <input id="v-email" type="email" className={`mt-1 ${field}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="volunteer-email-input" />
                  {errors.email && <p className="mt-1 text-xs text-gov-red">{errors.email}</p>}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input placeholder="Phone" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="volunteer-phone-input" />
                <input placeholder="Availability" className={field} value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} data-testid="volunteer-availability-input" />
              </div>
              <input placeholder="Skills (comma separated)" className={field} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} data-testid="volunteer-skills-input" />
              <textarea placeholder="Why would you like to volunteer?" className="h-28 w-full rounded-sm border border-gov-line px-4 py-3 text-sm text-gov-navy" value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} data-testid="volunteer-motivation-input" />
              <div>
                <label htmlFor="v-resume" className="text-sm font-semibold text-gov-navy">Attach CV / résumé (optional)</label>
                <input id="v-resume" type="file" accept="application/pdf,application/msword,image/*" className="mt-1 block w-full text-sm" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} data-testid="volunteer-resume-upload" />
              </div>
              <button type="submit" className="gov-btn-primary w-full sm:w-auto" data-testid="volunteer-submit-button">Submit application</button>
            </div>
          </form>

          <div className="gov-card p-6" data-testid="event-calendar">
            <h2 className="gov-h3">Upcoming activities</h2>
            <div className="mt-4">
              <DayPicker mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} />
            </div>
            <div className="mt-4 space-y-3" data-testid="event-list">
              {eventsForDate.length === 0 && <p className="text-sm text-gov-slate">No activities scheduled for this date.</p>}
              {eventsForDate.map((e) => (
                <div key={e.id} className="rounded-sm border border-gov-line p-4">
                  <p className="text-sm font-semibold text-gov-navy" data-testid={`event-title-${e.id}`}>{e.title}</p>
                  <p className="text-xs text-gov-slate">{e.location}</p>
                  <button onClick={() => registerForEvent(e.id)} className="mt-3 rounded-sm border border-gov-blue px-3 py-1.5 text-xs font-semibold text-gov-blue transition-colors duration-200 hover:bg-gov-mist" data-testid={`event-register-${e.id}`}>
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
