import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Calendar, MapPin, FileText, Users } from "lucide-react";
import { api } from "@/lib/api";
import { programsSeed, institutionalFacts, organisation } from "@/data/siteData";
import { deriveProjects } from "@/lib/projects";
import StatCounter from "@/components/StatCounter";
import ProjectCard from "@/components/ProjectCard";

const categoryFor = (post) => post.category || post.program_type || "Update";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [programs, setPrograms] = useState(programsSeed);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [postsRes, programsRes, eventsRes] = await Promise.all([
        api.get("/posts?status=published"),
        api.get("/programs"),
        api.get("/events"),
      ]);
      setPosts(postsRes.data || []);
      if (programsRes.data?.length) {
        // merge structured metadata from seed when API records are sparse
        setPrograms(
          programsRes.data.map((p, i) => ({ ...programsSeed[i % programsSeed.length], ...p }))
        );
      }
      setEvents(eventsRes.data || []);
    };
    fetchData();
  }, []);

  const projects = useMemo(() => deriveProjects(events).slice(0, 3), [events]);
  const announcements = useMemo(() => posts.slice(0, 4), [posts]);

  return (
    <div>
      {/* Institutional hero */}
      <section className="border-b border-gov-line bg-white" data-testid="home-hero-section">
        <div className="gov-container grid items-stretch gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center py-12 pr-0 lg:py-16 lg:pr-12">
            <p className="gov-eyebrow" data-testid="home-hero-tag">GreatWorks Foundation</p>
            <h1 className="mt-3 gov-h1 animate-fade-up" data-testid="home-hero-title">
              Working Together for Sustainable Community Development
            </h1>
            <p className="mt-5 max-w-xl gov-prose" data-testid="home-hero-subtitle">
              {organisation.mission}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/programs" className="gov-btn-primary" data-testid="home-hero-programs">
                Explore Our Programs <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/impact" className="gov-btn-secondary" data-testid="home-hero-impact">
                View Our Impact
              </Link>
            </div>
          </div>
          <div className="relative min-h-[280px] w-full overflow-hidden bg-gov-mist lg:min-h-[460px]">
            <img
              src="/assets/Great works/WhatsApp Image 25.jpeg"
              alt="GreatWorks Foundation community programme in Enugu"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        {/* Verified facts panel */}
        <div className="border-t border-gov-line bg-gov-mist">
          <div className="gov-container grid divide-y divide-gov-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {institutionalFacts.map((fact, index) => (
              <div key={fact.label} className="flex items-center gap-3 px-2 py-5 lg:px-6" data-testid={`home-fact-${index}`}>
                <CheckCircle2 className="h-5 w-5 shrink-0 text-gov-green" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gov-slate">{fact.label}</p>
                  <p className="text-sm font-semibold text-gov-navy">{fact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcement / latest updates strip */}
      <section className="border-b border-gov-line bg-gov-navy" data-testid="home-announcements">
        <div className="gov-container flex flex-col gap-4 py-4 lg:flex-row lg:items-center">
          <div className="flex shrink-0 items-center gap-2 pr-6 lg:border-r lg:border-white/20">
            <span className="rounded-sm bg-gov-amber px-2 py-1 text-xs font-bold uppercase tracking-wide text-gov-ink">
              Latest Updates
            </span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {announcements.length === 0 && (
              <p className="text-sm text-white/70">Programme updates and public notices will appear here.</p>
            )}
            {announcements.map((post) => (
              <Link
                key={post.id}
                to="/stories"
                className="group flex items-center gap-2 text-sm text-white/85 transition-colors duration-200 hover:text-white"
                data-testid={`announcement-${post.id}`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-gov-amber">{categoryFor(post)}</span>
                <span className="text-white/40">·</span>
                <span className="group-hover:underline">{post.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Key institutional indicators */}
      <section className="bg-white py-14 md:py-20" data-testid="home-indicators">
        <div className="gov-container">
          <p className="gov-eyebrow">Key Institutional Indicators</p>
          <h2 className="mt-2 gov-h2">Programme activity at a glance</h2>
          <p className="mt-3 max-w-2xl text-sm text-gov-slate">
            Figures below are drawn from the organisation's current programme records and are updated as new
            activities are documented.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCounter value={programs.length} label="Active programme areas" testId="indicator-programs" />
            <StatCounter value={events.length} label="Documented projects & events" testId="indicator-projects" />
            <StatCounter value={1} label="State of operation" note="Enugu, Nigeria" testId="indicator-region" />
            <StatCounter value={3} label="Areas of work" note="Education · Welfare · Relief" testId="indicator-areas" />
          </div>
        </div>
      </section>

      {/* About summary */}
      <section className="border-y border-gov-line bg-gov-mist py-14 md:py-20" data-testid="home-about">
        <div className="gov-container grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="gov-eyebrow">Who We Are</p>
            <h2 className="mt-2 gov-h2">A community organisation focused on measurable outcomes</h2>
            <p className="mt-4 gov-prose">
              GreatWorks Foundation is a non-profit organisation working in Enugu, Nigeria. Our work is organised
              around three areas: education and scholarships, community welfare and outreach, and relief and recovery.
              We plan and deliver programmes together with local communities and volunteers.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="border-l-4 border-gov-blue bg-white p-4">
                <h3 className="font-serif text-base font-bold text-gov-navy">Our Mission</h3>
                <p className="mt-1 text-sm text-gov-charcoal">{organisation.mission}</p>
              </div>
              <div className="border-l-4 border-gov-green bg-white p-4">
                <h3 className="font-serif text-base font-bold text-gov-navy">Our Vision</h3>
                <p className="mt-1 text-sm text-gov-charcoal">{organisation.vision}</p>
              </div>
            </div>
            <Link to="/about" className="mt-6 inline-flex gov-btn-secondary" data-testid="home-about-cta">
              Read more about the organisation
            </Link>
          </div>
          <div className="gov-card p-6">
            <h3 className="gov-h3">Quick links</h3>
            <ul className="mt-4 divide-y divide-gov-line">
              {[
                { icon: FileText, label: "Publications & reports", path: "/publications" },
                { icon: Users, label: "Partnerships", path: "/partnerships" },
                { icon: Calendar, label: "Projects & events", path: "/projects" },
                { icon: MapPin, label: "Contact & office", path: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="flex items-center justify-between py-3 text-sm font-semibold text-gov-navy transition-colors duration-200 hover:text-gov-blue"
                    data-testid={`home-quicklink-${item.path.replace("/", "")}`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-gov-blue" aria-hidden="true" />
                      {item.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gov-slate" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Programs preview */}
      <section className="bg-white py-14 md:py-20" data-testid="home-programs">
        <div className="gov-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="gov-eyebrow">Programs & Areas of Work</p>
              <h2 className="mt-2 gov-h2">Our programmes</h2>
            </div>
            <Link to="/programs" className="text-sm font-semibold text-gov-blue hover:underline" data-testid="home-programs-link">
              View all programmes →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {programs.slice(0, 3).map((program, index) => (
              <article key={program.id || index} className="gov-card overflow-hidden" data-testid={`home-program-${index}`}>
                <div className="h-40 w-full overflow-hidden bg-gov-mist">
                  <img src={program.image} alt={program.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <span className="rounded-sm border border-gov-line bg-gov-mist px-2 py-0.5 text-xs font-semibold text-gov-slate">
                    {program.status || "Active"}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-bold text-gov-navy">{program.name}</h3>
                  <p className="mt-2 text-sm text-gov-charcoal">{program.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="border-t border-gov-line bg-gov-mist py-14 md:py-20" data-testid="home-projects">
          <div className="gov-container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="gov-eyebrow">Projects Directory</p>
                <h2 className="mt-2 gov-h2">Recent projects & events</h2>
              </div>
              <Link to="/projects" className="text-sm font-semibold text-gov-blue hover:underline" data-testid="home-projects-link">
                Browse the full directory →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} onView={() => {}} testId={`home-project-${index}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Get involved / donate band */}
      <section className="bg-gov-navy py-14 md:py-16" data-testid="home-cta">
        <div className="gov-container grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Support our work in Enugu
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
              Governments, institutions, CSR partners, and individuals can support our programmes through
              partnership, volunteering, or a contribution. We welcome enquiries from institutional partners.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/donate" className="rounded-sm bg-white px-6 py-3 text-sm font-semibold text-gov-navy transition-colors duration-200 hover:bg-white/90" data-testid="home-cta-donate">
              Donate
            </Link>
            <Link to="/partnerships" className="rounded-sm border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10" data-testid="home-cta-partner">
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
