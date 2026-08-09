import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { programsSeed } from "@/data/siteData";
import PageHeader from "@/components/PageHeader";
import StatCounter from "@/components/StatCounter";

const Impact = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [programs, setPrograms] = useState(programsSeed);

  useEffect(() => {
    const fetchData = async () => {
      const [postsRes, eventsRes, programsRes] = await Promise.all([
        api.get("/posts?status=published"),
        api.get("/events"),
        api.get("/programs"),
      ]);
      setPosts(postsRes.data || []);
      setEvents(eventsRes.data || []);
      if (programsRes.data?.length) {
        setPrograms(programsRes.data.map((p, i) => ({ ...programsSeed[i % programsSeed.length], ...p })));
      }
    };
    fetchData();
  }, []);

  const caseStudies = useMemo(() => posts.slice(0, 6), [posts]);

  return (
    <div>
      <PageHeader
        eyebrow="Impact & Results"
        title="Impact & Results"
        description="An evidence-based summary of our programme activity, results, and documented community stories. Figures reflect current records and are updated as new activities are reported."
        breadcrumbs={[{ label: "Impact" }]}
        testId="impact-header"
      />

      {/* Indicators */}
      <section className="bg-white py-14 md:py-20" data-testid="impact-indicators">
        <div className="gov-container">
          <p className="gov-eyebrow">Programme Indicators</p>
          <h2 className="mt-2 gov-h2">What we have documented</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCounter value={programs.length} label="Active programme areas" testId="impact-stat-programs" />
            <StatCounter value={events.length} label="Projects & events documented" testId="impact-stat-projects" />
            <StatCounter value={posts.length} label="Published field reports" testId="impact-stat-posts" />
            <StatCounter value={1} label="State of operation" note="Enugu, Nigeria" testId="impact-stat-region" />
          </div>
          <p className="mt-4 text-xs text-gov-slate">
            Note: Indicators are counts of records currently published on this platform. Programme-level beneficiary
            figures are reported within each project as outcomes are confirmed.
          </p>
        </div>
      </section>

      {/* Programme results */}
      <section className="border-y border-gov-line bg-gov-mist py-14 md:py-20" data-testid="impact-results">
        <div className="gov-container">
          <p className="gov-eyebrow">Results by Programme</p>
          <h2 className="mt-2 gov-h2">Outputs and outcomes</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gov-navy text-gov-navy">
                  <th className="py-3 pr-4 font-semibold">Programme</th>
                  <th className="py-3 pr-4 font-semibold">Area</th>
                  <th className="py-3 pr-4 font-semibold">Key activities</th>
                  <th className="py-3 pr-4 font-semibold">Reported outcome</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p, i) => (
                  <tr key={p.id || i} className={i % 2 === 0 ? "bg-white" : "bg-gov-mist"} data-testid={`impact-row-${i}`}>
                    <td className="py-3 pr-4 font-semibold text-gov-navy">{p.name}</td>
                    <td className="py-3 pr-4 text-gov-charcoal">{p.area || "Enugu, Nigeria"}</td>
                    <td className="py-3 pr-4 text-gov-charcoal">{(p.activities || []).join(", ") || "—"}</td>
                    <td className="py-3 pr-4 text-gov-charcoal">{p.outcome || p.impact || "—"}</td>
                    <td className="py-3">
                      <span className="rounded-sm border border-gov-line bg-white px-2 py-0.5 text-xs font-semibold text-gov-slate">
                        {p.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Case studies / community stories */}
      <section className="bg-white py-14 md:py-20" data-testid="impact-stories">
        <div className="gov-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="gov-eyebrow">Case Studies & Community Stories</p>
              <h2 className="mt-2 gov-h2">From the field</h2>
            </div>
            <Link to="/stories" className="text-sm font-semibold text-gov-blue hover:underline" data-testid="impact-stories-link">
              View all news & notices →
            </Link>
          </div>
          {caseStudies.length === 0 ? (
            <div className="mt-6 gov-card border-dashed p-10 text-center text-sm text-gov-slate">
              Case studies will be published here.
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {caseStudies.map((post) => (
                <article key={post.id} className="gov-card overflow-hidden" data-testid={`impact-story-${post.id}`}>
                  {post.cover_image && (
                    <div className="h-40 w-full overflow-hidden bg-gov-mist">
                      <img src={post.cover_image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gov-blue">{post.category || post.program_type || "Report"}</span>
                    <h3 className="mt-2 font-serif text-base font-bold text-gov-navy">{post.title}</h3>
                    <p className="mt-2 text-sm text-gov-charcoal line-clamp-3">{post.excerpt || ""}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Impact;
