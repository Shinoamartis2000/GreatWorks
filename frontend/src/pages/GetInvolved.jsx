import { useEffect, useMemo, useState } from "react";
import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

const GetInvolved = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [volunteerForm, setVolunteerForm] = useState({ name: "", email: "", phone: "", skills: "", availability: "", motivation: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await api.get("/events");
      setEvents(data || []);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("volunteerDraft");
    if (saved) {
      setVolunteerForm(JSON.parse(saved));
    }
  }, []);

  const eventsForDate = useMemo(() => {
    return events.filter((event) => new Date(event.start_datetime).toDateString() === selectedDate.toDateString());
  }, [events, selectedDate]);

  const submitVolunteer = async (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (!volunteerForm.name) validationErrors.name = "Name is required";
    if (!volunteerForm.email) validationErrors.email = "Email is required";
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    if (!navigator.onLine) {
      localStorage.setItem("volunteerDraft", JSON.stringify(volunteerForm));
      toast.message("You are offline. We saved your application for later.");
      return;
    }
    const formData = new FormData();
    Object.entries(volunteerForm).forEach(([key, value]) => formData.append(key, value));
    if (resumeFile) formData.append("resume", resumeFile);
    await api.post("/volunteers", formData);
    toast.success("Volunteer application submitted!");
    setVolunteerForm({ name: "", email: "", phone: "", skills: "", availability: "", motivation: "" });
    setResumeFile(null);
    localStorage.removeItem("volunteerDraft");
  };

  const registerForEvent = async (eventId, name, email) => {
    await api.post(`/events/${eventId}/register`, { name, email, phone: "" });
    toast.success("Registration received!");
  };

  return (
    <motion.div className="section-gradient" data-testid="get-involved-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <p className="text-xs uppercase tracking-widest text-brand-muted">Get Involved</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-forest">Volunteer. Partner. Advocate.</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: "Volunteer", text: "Support Enugu scholarship students and outreach teams." },
            { title: "Partner", text: "Fund scholarships and outreach care packs." },
            { title: "Advocate", text: "Share Urban Scholarship and Valentine Outreach updates." },
          ].map((item, index) => (
            <div key={item.title} className="rounded-2xl bg-white/70 p-6 shadow-sm" data-testid={`involved-option-${index}`}>
              <h3 className="font-serif text-xl text-brand-forest">{item.title}</h3>
              <p className="mt-2 text-sm text-brand-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 md:grid-cols-[1.1fr_0.9fr] md:px-12" data-testid="volunteer-section">
        <form className="rounded-2xl bg-white/70 p-6 shadow-sm" onSubmit={submitVolunteer}>
          <h2 className="font-serif text-2xl text-brand-forest">Volunteer application</h2>
          <div className="mt-6 grid gap-4">
            <input
              type="text"
              placeholder="Full name"
              className="h-12 rounded-lg border border-brand-forest/20 px-4"
              value={volunteerForm.name}
              onChange={(event) => setVolunteerForm({ ...volunteerForm, name: event.target.value })}
              data-testid="volunteer-name-input"
            />
            {errors.name && <p className="text-xs text-brand-red">{errors.name}</p>}
            <input
              type="email"
              placeholder="Email"
              className="h-12 rounded-lg border border-brand-forest/20 px-4"
              value={volunteerForm.email}
              onChange={(event) => setVolunteerForm({ ...volunteerForm, email: event.target.value })}
              data-testid="volunteer-email-input"
            />
            {errors.email && <p className="text-xs text-brand-red">{errors.email}</p>}
            <input
              type="text"
              placeholder="Phone"
              className="h-12 rounded-lg border border-brand-forest/20 px-4"
              value={volunteerForm.phone}
              onChange={(event) => setVolunteerForm({ ...volunteerForm, phone: event.target.value })}
              data-testid="volunteer-phone-input"
            />
            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="h-12 rounded-lg border border-brand-forest/20 px-4"
              value={volunteerForm.skills}
              onChange={(event) => setVolunteerForm({ ...volunteerForm, skills: event.target.value })}
              data-testid="volunteer-skills-input"
            />
            <input
              type="text"
              placeholder="Availability"
              className="h-12 rounded-lg border border-brand-forest/20 px-4"
              value={volunteerForm.availability}
              onChange={(event) => setVolunteerForm({ ...volunteerForm, availability: event.target.value })}
              data-testid="volunteer-availability-input"
            />
            <textarea
              placeholder="Why do you want to volunteer?"
              className="h-28 rounded-lg border border-brand-forest/20 px-4 py-3"
              value={volunteerForm.motivation}
              onChange={(event) => setVolunteerForm({ ...volunteerForm, motivation: event.target.value })}
              data-testid="volunteer-motivation-input"
            />
            <input
              type="file"
              accept="application/pdf,application/msword,image/*"
              capture="environment"
              onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
              data-testid="volunteer-resume-upload"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-forest px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              data-testid="volunteer-submit-button"
            >
              Submit application
            </button>
          </div>
        </form>
        <div className="rounded-2xl bg-white/70 p-6 shadow-sm" data-testid="event-calendar">
          <h2 className="font-serif text-2xl text-brand-forest">Event calendar</h2>
          <div className="mt-4 flex gap-3">
            {["month", "week", "day"].map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`rounded-full px-4 py-2 text-sm ${view === item ? "bg-brand-forest text-white" : "border border-brand-forest/20 text-brand-forest"}`}
                data-testid={`calendar-view-${item}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} />
          </div>
          <div className="mt-4 space-y-4" data-testid="event-list">
            {eventsForDate.length === 0 && <p className="text-sm text-brand-muted">No events for this date.</p>}
            {eventsForDate.map((eventItem) => (
              <div key={eventItem.id} className="rounded-xl border border-brand-forest/10 p-4">
                <p className="text-sm font-semibold text-brand-forest" data-testid={`event-title-${eventItem.id}`}>
                  {eventItem.title}
                </p>
                <p className="text-xs text-brand-muted">{eventItem.location}</p>
                <button
                  onClick={() => registerForEvent(eventItem.id, "Guest", "guest@example.com")}
                  className="mt-3 rounded-full border border-brand-forest/20 px-3 py-1 text-xs text-brand-forest"
                  data-testid={`event-register-${eventItem.id}`}
                >
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default GetInvolved;
