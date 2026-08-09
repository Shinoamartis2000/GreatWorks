import Breadcrumbs from "@/components/Breadcrumbs";

const PageHeader = ({ eyebrow, title, description, breadcrumbs, testId }) => {
  return (
    <section className="border-b border-gov-line bg-gov-navy" data-testid={testId || "page-header"}>
      <div className="gov-container py-10 md:py-14">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && (
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-gov-amber">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80">{description}</p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
