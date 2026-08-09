import { Link } from "react-router-dom";
import { Landmark, Building2, Briefcase, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { organisation } from "@/data/siteData";

const SEGMENTS = [
  {
    key: "government",
    icon: Landmark,
    title: "Government Partners",
    text: "Relationships with government departments, agencies, and local authorities that support or collaborate on our programmes.",
  },
  {
    key: "institutional",
    icon: Building2,
    title: "Institutional Partners",
    text: "International development organisations, foundations, and multilateral bodies that partner on programme delivery.",
  },
  {
    key: "corporate",
    icon: Briefcase,
    title: "Corporate / CSR Partners",
    text: "Companies and CSR programmes contributing funding, in-kind support, or expertise to our work.",
  },
  {
    key: "community",
    icon: Users,
    title: "Community Partners",
    text: "Community groups, faith-based organisations, and local volunteers we work alongside on the ground.",
  },
];

const Partnerships = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Partnerships"
        title="Partnerships & Collaboration"
        description="GreatWorks Foundation works with a range of partners to deliver its programmes. Confirmed partnerships are published in the categories below."
        breadcrumbs={[{ label: "Partnerships" }]}
        testId="partnerships-header"
      />

      <section className="bg-white py-14 md:py-20">
        <div className="gov-container">
          <div className="grid gap-6 md:grid-cols-2">
            {SEGMENTS.map((segment) => (
              <div key={segment.key} className="gov-card p-6" data-testid={`partnership-${segment.key}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-gov-navy text-white">
                    <segment.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-serif text-lg font-bold text-gov-navy">{segment.title}</h2>
                </div>
                <p className="mt-4 text-sm text-gov-charcoal">{segment.text}</p>
                <div className="mt-5 rounded-sm border border-dashed border-gov-line bg-gov-mist p-5 text-center">
                  <p className="text-sm text-gov-slate" data-testid={`partnership-empty-${segment.key}`}>
                    Confirmed partners in this category will be listed here.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 gov-card border-l-4 border-gov-blue p-6 md:p-8" data-testid="partnership-invite">
            <h2 className="font-serif text-xl font-bold text-gov-navy">Partner with GreatWorks Foundation</h2>
            <p className="mt-3 max-w-3xl gov-prose">
              We welcome enquiries from government departments, institutional donors, and CSR partners interested in
              supporting community development, education, and relief programmes in Enugu, Nigeria. Our team can
              provide programme information and discuss collaboration on request.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/contact" className="gov-btn-primary" data-testid="partnership-contact">
                Contact our partnerships team
              </Link>
              <a href={`mailto:${organisation.email}`} className="gov-btn-secondary" data-testid="partnership-email">
                {organisation.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;
