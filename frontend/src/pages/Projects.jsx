import { useEffect, useMemo, useState } from "react";
import { MapPin, Calendar, Tag, Users, Target, TrendingUp } from "lucide-react";
import { api, buildFileUrl } from "@/lib/api";
import { deriveProjects } from "@/lib/projects";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ALL = "All";

const Select = ({ label, value, options, onChange, testId }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="text-xs font-semibold uppercase tracking-wide text-gov-slate">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-sm border border-gov-line bg-white px-3 text-sm text-gov-navy"
      data-testid={testId}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </label>
);

const Projects = () => {
  const [events, setEvents] = useState([]);
  const [program, setProgram] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await api.get("/events");
      setEvents(data || []);
    };
    fetchEvents();
  }, []);

  const projects = useMemo(() => deriveProjects(events), [events]);

  const options = useMemo(() => {
    const uniq = (arr) => [ALL, ...Array.from(new Set(arr.filter(Boolean)))];
    return {
      programs: uniq(projects.map((p) => p.program)),
      locations: uniq(projects.map((p) => p.location)),
      years: uniq(projects.map((p) => p.year)),
      statuses: uniq(projects.map((p) => p.status)),
    };
  }, [projects]);

  const filtered = projects.filter(
    (p) =>
      (program === ALL || p.program === program) &&
      (location === ALL || p.location === location) &&
      (year === ALL || p.year === year) &&
      (status === ALL || p.status === status)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Projects Directory"
        title="Projects & Events"
        description="A directory of documented projects and events. Use the filters to browse by programme, location, year, or status."
        breadcrumbs={[{ label: "Projects" }]}
        testId="projects-header"
      />

      <section className="bg-white py-12 md:py-16">
        <div className="gov-container">
          {/* Filters */}
          <div className="gov-card p-5" data-testid="projects-filters">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select label="Programme" value={program} options={options.programs} onChange={setProgram} testId="filter-program" />
              <Select label="Location" value={location} options={options.locations} onChange={setLocation} testId="filter-location" />
              <Select label="Year" value={year} options={options.years} onChange={setYear} testId="filter-year" />
              <Select label="Status" value={status} options={options.statuses} onChange={setStatus} testId="filter-status" />
            </div>
          </div>

          <p className="mt-5 text-sm text-gov-slate" data-testid="projects-count">
            Showing <span className="font-semibold text-gov-navy">{filtered.length}</span> of {projects.length} projects
          </p>

          {filtered.length === 0 ? (
            <div className="mt-6 gov-card border-dashed p-10 text-center text-sm text-gov-slate" data-testid="projects-empty">
              No projects match the selected filters.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, index) => (
                <ProjectCard key={project.id} project={project} onView={setActive} testId={`project-${index}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail dialog */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-2xl gap-0 rounded-sm p-0" data-testid="project-detail-dialog">
          {active && (
            <div>
              <div className="h-52 w-full overflow-hidden bg-gov-mist">
                <img src={buildFileUrl(active.image)} alt={active.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-gov-navy">{active.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-sm text-gov-charcoal"><MapPin className="h-4 w-4 text-gov-blue" />{active.location}</p>
                  <p className="flex items-center gap-2 text-sm text-gov-charcoal"><Calendar className="h-4 w-4 text-gov-blue" />{active.period}</p>
                  <p className="flex items-center gap-2 text-sm text-gov-charcoal"><Tag className="h-4 w-4 text-gov-blue" />{active.program}</p>
                  <p className="flex items-center gap-2 text-sm text-gov-charcoal"><Users className="h-4 w-4 text-gov-blue" />{active.beneficiaries}</p>
                </div>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gov-slate"><Target className="h-4 w-4" />Description & objectives</p>
                    <p className="mt-1 text-sm text-gov-charcoal">{active.description || "Details will be published soon."}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gov-slate"><TrendingUp className="h-4 w-4" />Outcomes</p>
                    <p className="mt-1 text-sm text-gov-charcoal">{active.outcomes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
