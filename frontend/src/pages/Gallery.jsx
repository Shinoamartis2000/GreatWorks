import { useEffect, useMemo, useState } from "react";
import { api, buildFileUrl } from "@/lib/api";
import { localGallery } from "@/data/siteData";
import PageHeader from "@/components/PageHeader";

const FILTERS = ["All", "Urban Scholarship", "Valentine Outreach", "Community Relief"];

const Gallery = () => {
  const [program, setProgram] = useState("All");
  const [media, setMedia] = useState([]);

  useEffect(() => {
    api.get("/media").then(({ data }) => setMedia(data || []));
  }, []);

  const combined = useMemo(() => {
    const uploaded = media.map((item) => ({
      id: item.id,
      src: buildFileUrl(item.optimized_url || item.original_url),
      programType: item.program_type || "General",
      label: item.filename,
    }));
    return [...uploaded, ...localGallery];
  }, [media]);

  const filtered = combined.filter((i) => program === "All" || i.programType === program);

  return (
    <div>
      <PageHeader
        eyebrow="Media Library"
        title="Programme Documentation"
        description="Photographs documenting GreatWorks Foundation programmes and community activities in Enugu, Nigeria."
        breadcrumbs={[{ label: "Media Library" }]}
        testId="gallery-header"
      />

      <section className="bg-white py-12 md:py-16" data-testid="gallery-page">
        <div className="gov-container">
          <div className="flex flex-wrap gap-2 border-b border-gov-line pb-4">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setProgram(f)}
                className={`rounded-sm px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  program === f ? "bg-gov-navy text-white" : "border border-gov-line text-gov-charcoal hover:bg-gov-mist"
                }`}
                data-testid={`gallery-filter-${f.toLowerCase().replace(/\s/g, "-")}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item) => (
              <figure key={item.id} className="gov-card overflow-hidden" data-testid={`gallery-item-${item.id}`}>
                <div className="h-40 w-full overflow-hidden bg-gov-mist">
                  <img src={item.src} alt={item.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]" />
                </div>
                <figcaption className="px-3 py-2 text-xs text-gov-slate">{item.programType}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
