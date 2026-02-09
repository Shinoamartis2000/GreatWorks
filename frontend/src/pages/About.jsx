import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, buildFileUrl } from "@/lib/api";

const About = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await api.get("/annual-reports");
      setReports(data || []);
    };
    fetchReports();
  }, []);

  return (
    <motion.div className="section-gradient" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12" data-testid="about-story">
        <p className="text-xs uppercase tracking-widest text-brand-muted">Our Story</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-forest">Rooted in hope, powered by neighbors</h1>
        <p className="mt-6 max-w-3xl text-lg text-brand-muted">
          GreatWorks Foundation focuses on Enugu communities through our Urban Scholarship Program and Valentine
          Outreach 2022. We deliver education funding, care packs, and compassionate relief that restores dignity and
          long-term stability.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 md:grid-cols-2 md:px-12" data-testid="about-team">
        <div className="rounded-2xl bg-white/70 p-6 shadow-sm">
          <h2 className="font-serif text-2xl text-brand-forest">Leadership Team</h2>
          <div className="mt-6 grid gap-4">
            {[
              { name: "Amara Nwosu", role: "Executive Director", image: "/assets/Great works/team.jpeg" },
              { name: "Luis Moreno", role: "Programs Lead", image: "/assets/Great works/WhatsApp Image 22.jpeg" },
              { name: "Sana Patel", role: "Community Partnerships", image: "/assets/Great works/WhatsApp Image 24.jpeg" },
            ].map((member, index) => (
              <div key={member.name} className="flex items-center gap-4" data-testid={`team-member-${index}`}>
                <img src={member.image} alt={member.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-brand-forest">{member.name}</p>
                  <p className="text-sm text-brand-muted">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 p-6 shadow-sm" data-testid="about-transparency">
          <h2 className="font-serif text-2xl text-brand-forest">Financial Transparency</h2>
          <p className="mt-4 text-sm text-brand-muted">
            We publish full annual reports, audited statements, and real-time impact data for every program. Your trust
            matters.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-2xl font-semibold text-brand-forest" data-testid="transparency-programs">
                86%
              </p>
              <p className="text-sm text-brand-muted">Direct program funding</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-2xl font-semibold text-brand-forest" data-testid="transparency-local">
                72%
              </p>
              <p className="text-sm text-brand-muted">Local partners employed</p>
            </div>
          </div>
          {reports[0] && (
            <a
              href={buildFileUrl(reports[0].file_url)}
              className="mt-6 inline-flex rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white"
              data-testid="annual-report-download"
            >
              Download Annual Report
            </a>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12" data-testid="about-metrics">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Communities supported", value: "120+" },
            { label: "Emergency deployments", value: "64" },
            { label: "Volunteer hours", value: "31,800" },
          ].map((metric, index) => (
            <div key={metric.label} className="rounded-2xl bg-white/70 p-6 shadow-sm">
              <p className="text-3xl font-semibold text-brand-forest" data-testid={`about-metric-${index}`}>
                {metric.value}
              </p>
              <p className="text-sm text-brand-muted">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default About;
