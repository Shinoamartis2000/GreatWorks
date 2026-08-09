import { missionValues, organisation, institutionalFacts } from "@/data/siteData";
import PageHeader from "@/components/PageHeader";

const About = () => {
  return (
    <div>
      <PageHeader
        eyebrow="About the Organisation"
        title="About GreatWorks Foundation"
        description="A non-profit organisation working with communities in Enugu, Nigeria across education, welfare, and relief."
        breadcrumbs={[{ label: "About" }]}
        testId="about-header"
      />

      {/* Who we are */}
      <section className="bg-white py-14 md:py-20" data-testid="about-who">
        <div className="gov-container grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="gov-eyebrow">Who We Are</p>
            <h2 className="mt-2 gov-h2">An institutionally governed community organisation</h2>
            <div className="mt-4 space-y-4 gov-prose">
              <p>
                GreatWorks Foundation is a non-profit organisation based in Enugu, Nigeria. We work directly with
                communities to plan and deliver programmes in three areas: education and scholarships, community
                welfare and outreach, and relief and recovery.
              </p>
              <p>
                Our approach is practical and evidence-based. We identify needs together with community members,
                deliver programmes with local volunteers and partners, and document our activities so that
                supporters, partners, and institutions can review our work.
              </p>
            </div>
          </div>
          <aside className="gov-card p-6" data-testid="about-glance">
            <h3 className="gov-h3">At a glance</h3>
            <dl className="mt-4 divide-y divide-gov-line">
              {institutionalFacts.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between py-3">
                  <dt className="text-sm text-gov-slate">{fact.label}</dt>
                  <dd className="text-sm font-semibold text-gov-navy">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="border-y border-gov-line bg-gov-mist py-14 md:py-20" data-testid="about-mission-vision">
        <div className="gov-container grid gap-6 md:grid-cols-2">
          <div className="border-l-4 border-gov-blue bg-white p-6">
            <h2 className="font-serif text-xl font-bold text-gov-navy">Our Mission</h2>
            <p className="mt-3 gov-prose">{organisation.mission}</p>
          </div>
          <div className="border-l-4 border-gov-green bg-white p-6">
            <h2 className="font-serif text-xl font-bold text-gov-navy">Our Vision</h2>
            <p className="mt-3 gov-prose">{organisation.vision}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-14 md:py-20" data-testid="about-values">
        <div className="gov-container">
          <p className="gov-eyebrow">Our Values</p>
          <h2 className="mt-2 gov-h2">Principles that guide our work</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {missionValues.map((value) => (
              <div key={value.title} className="gov-card p-6" data-testid={`about-value-${value.title.toLowerCase()}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-gov-navy text-white">
                  <value.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-bold text-gov-navy">{value.title}</h3>
                <p className="mt-2 text-sm text-gov-charcoal">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership (empty state, no fabrication) */}
      <section className="border-t border-gov-line bg-gov-mist py-14 md:py-20" data-testid="about-leadership">
        <div className="gov-container">
          <p className="gov-eyebrow">Leadership & Governance</p>
          <h2 className="mt-2 gov-h2">Our leadership</h2>
          <div className="mt-6 gov-card border-dashed p-8 text-center">
            <p className="mx-auto max-w-xl text-sm text-gov-slate" data-testid="about-leadership-empty">
              Leadership and board profiles will be published in this section. Profiles will include each member's
              name, official designation, and professional background once confirmed for publication.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
