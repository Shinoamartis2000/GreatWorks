import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { programsSeed } from "@/data/siteData";
import StoryCard from "@/components/StoryCard";
import ImpactCounter from "@/components/ImpactCounter";
import CountdownTimer from "@/components/CountdownTimer";
import PartnerCarousel from "@/components/PartnerCarousel";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [programs, setPrograms] = useState(programsSeed);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [postsRes, programsRes, eventsRes, settingsRes] = await Promise.all([
        api.get("/posts?status=published"),
        api.get("/programs"),
        api.get("/events"),
        api.get("/settings"),
      ]);
      setPosts(postsRes.data || []);
      if (programsRes.data?.length) setPrograms(programsRes.data);
      setEvents(eventsRes.data || []);
      setSettings(settingsRes.data || {});
    };
    fetchData();
  }, []);

  const nextEvent = useMemo(() => {
    const upcoming = [...events].sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
    return upcoming[0];
  }, [events]);

  return (
    <div className="hero-pattern">
      <section className="relative overflow-hidden" data-testid="home-hero-section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/Great works/WhatsApp Image 23.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-forest/40 to-brand-forest/90" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-24 text-white md:px-12 md:py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80" data-testid="home-hero-tag">
              GreatWorks Foundation
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-6xl" data-testid="home-hero-title">
              Rebuilding lives today so communities thrive tomorrow.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/90" data-testid="home-hero-subtitle">
              We restore water systems, rebuild schools, and provide shelter for families recovering from crisis.
            </p>
          </motion.div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/donate"
              className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand-forest shadow-lg"
              data-testid="home-hero-donate"
            >
              Donate Now
            </Link>
            <a
              href={settings.gofundme_url || "#"}
              className="rounded-full border border-white/60 px-8 py-4 text-sm font-semibold text-white"
              data-testid="home-hero-gofundme"
            >
              GoFundMe Campaign
            </a>
          </div>
          <p className="text-sm text-white/80" data-testid="home-social-proof">
            Follow the movement: @greatworksf
          </p>
        </div>
      </section>

      <section className="section-gradient py-20" data-testid="home-programs-section">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-muted">Core Programs</p>
            <h2 className="mt-3 font-serif text-3xl text-brand-forest">Where your giving creates change</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {programs.map((program, index) => (
              <div key={program.id || index} className="rounded-2xl bg-white/70 p-6 shadow-sm" data-testid={`program-card-${index}`}>
                <img src={program.image || "/assets/Great works/WhatsApp Image 24.jpeg"} alt={program.name} className="h-40 w-full rounded-xl object-cover" />
                <h3 className="mt-4 font-serif text-xl text-brand-forest">{program.name}</h3>
                <p className="mt-2 text-sm text-brand-muted">{program.description}</p>
                <p className="mt-4 text-sm font-semibold text-brand-forest" data-testid={`program-impact-${index}`}>
                  {program.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="home-impact-section">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            <ImpactCounter label="Communities served" value={120} suffix="+" testId="impact-communities" />
            <ImpactCounter label="Homes rebuilt" value={3500} suffix="" testId="impact-homes" />
            <ImpactCounter label="Volunteers mobilized" value={860} suffix="" testId="impact-volunteers" />
          </div>
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="font-serif text-3xl text-brand-forest">Next community activation</h2>
              <p className="mt-3 text-sm text-brand-muted">
                Join the next deployment to bring clean water and emergency shelter to families rebuilding.
              </p>
              {nextEvent ? (
                <div className="mt-6 rounded-2xl bg-white/70 p-6 shadow-sm" data-testid="next-event-card">
                  <p className="text-xs uppercase tracking-widest text-brand-muted">Upcoming Event</p>
                  <h3 className="mt-2 font-serif text-xl text-brand-forest" data-testid="next-event-title">
                    {nextEvent.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-muted">
                    {new Date(nextEvent.start_datetime).toLocaleString()} · {nextEvent.location}
                  </p>
                  <div className="mt-4">
                    <CountdownTimer targetDate={nextEvent.start_datetime} testId="event-countdown" />
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-brand-muted" data-testid="no-event-message">
                  New events are being scheduled now.
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-white/70 p-6 shadow-sm" data-testid="home-latest-stories">
              <p className="text-xs uppercase tracking-widest text-brand-muted">Latest Stories</p>
              <div className="mt-4 grid gap-4">
                {posts.slice(0, 2).map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
              <Link
                to="/stories"
                className="mt-4 inline-flex text-sm font-semibold text-brand-forest"
                data-testid="home-stories-link"
              >
                View all stories →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gradient py-20" data-testid="home-partners-section">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-muted">Partners</p>
              <h2 className="mt-3 font-serif text-3xl text-brand-forest">Trusted by communities and partners</h2>
            </div>
            <Link
              to="/get-involved"
              className="rounded-full border border-brand-forest px-6 py-3 text-sm font-semibold text-brand-forest"
              data-testid="home-partner-cta"
            >
              Become a partner
            </Link>
          </div>
          <div className="mt-8">
            <PartnerCarousel />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
