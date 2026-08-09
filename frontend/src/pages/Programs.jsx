import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Target, Users, MapPin, ListChecks, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { programsSeed } from "@/data/siteData";
import PageHeader from "@/components/PageHeader";

const Programs = () => {
  const [programs, setPrograms] = useState(programsSeed);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data } = await api.get("/programs");
      if (data?.length) {
        setPrograms(data.map((p, i) => ({ ...programsSeed[i % programsSeed.length], ...p })));
      }
    };
    fetchPrograms();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Programs & Areas of Work"
        title="Our Programmes"
        description="Structured overview of GreatWorks Foundation programmes, including objectives, beneficiaries, activities, and status."
        breadcrumbs={[{ label: "Programs" }]}
        testId="programs-header"
      />

      <section className="bg-white py-14 md:py-20">
        <div className="gov-container space-y-10">
          {programs.map((program, index) => (
            <article
              key={program.id || index}
              className="gov-card grid gap-0 overflow-hidden lg:grid-cols-[0.9fr_1.4fr]"
              data-testid={`program-${index}`}
            >
              <div className="h-56 w-full overflow-hidden bg-gov-mist lg:h-auto">
                <img src={program.image} alt={program.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-sm border border-gov-line bg-gov-mist px-2.5 py-1 text-xs font-semibold text-gov-slate">
                    {program.status || "Active"}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gov-blue">{program.area || "Enugu, Nigeria"}</span>
                </div>
                <h2 className="mt-3 font-serif text-2xl font-bold text-gov-navy">{program.name}</h2>
                <p className="mt-3 gov-prose">{program.description}</p>

                <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <Target className="mt-0.5 h-5 w-5 shrink-0 text-gov-blue" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gov-slate">Objective</dt>
                      <dd className="text-sm text-gov-charcoal">{program.objective || "—"}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-gov-blue" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gov-slate">Beneficiaries</dt>
                      <dd className="text-sm text-gov-charcoal">{program.beneficiaries || "—"}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-gov-blue" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gov-slate">Key activities</dt>
                      <dd className="text-sm text-gov-charcoal">
                        {(program.activities || []).join(", ") || "—"}
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-gov-green" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gov-slate">Outcome</dt>
                      <dd className="text-sm text-gov-charcoal">{program.outcome || program.impact || "—"}</dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/projects" className="gov-btn-secondary" data-testid={`program-projects-${index}`}>
                    Related projects
                  </Link>
                  <Link to="/get-involved" className="text-sm font-semibold text-gov-blue hover:underline" data-testid={`program-involve-${index}`}>
                    Get involved →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Programs;
