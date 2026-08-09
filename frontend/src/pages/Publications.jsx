import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import DocumentRow from "@/components/DocumentRow";

const CATEGORIES = [
  "All",
  "Annual Reports",
  "Impact Reports",
  "Financial Reports",
  "Policy Documents",
];

const Publications = () => {
  const [annualReports, setAnnualReports] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    api
      .get("/annual-reports")
      .then((res) => setAnnualReports(res.data || []))
      .catch(() => setAnnualReports([]));
  }, []);

  const documents = useMemo(() => {
    return annualReports.map((r) => ({
      id: r.id,
      title: r.title || `Annual Report ${r.year || ""}`.trim(),
      category: "Annual Reports",
      date: r.year || "",
      meta: "PDF",
      fileUrl: r.file_url,
    }));
  }, [annualReports]);

  const filtered = documents.filter((d) => category === "All" || d.category === category);

  return (
    <div>
      <PageHeader
        eyebrow="Publications & Documents"
        title="Publications & Document Library"
        description="Official reports, publications, and policy documents. Documents are made available for public review as part of our commitment to transparency."
        breadcrumbs={[{ label: "Publications" }]}
        testId="publications-header"
      />

      <section className="bg-white py-12 md:py-16">
        <div className="gov-container">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gov-line pb-4" role="tablist" aria-label="Document categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={category === cat}
                onClick={() => setCategory(cat)}
                className={`rounded-sm px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  category === cat
                    ? "bg-gov-navy text-white"
                    : "border border-gov-line text-gov-charcoal hover:bg-gov-mist"
                }`}
                data-testid={`publications-tab-${cat.toLowerCase().replace(/\s/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-6 gov-card p-2 sm:p-4" data-testid="publications-list">
            {filtered.length === 0 ? (
              <div className="p-10 text-center" data-testid="publications-empty">
                <p className="text-sm font-semibold text-gov-navy">No documents in this category yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-gov-slate">
                  Reports and publications will be added here as they are finalised. Administrators can upload
                  documents from the dashboard.
                </p>
              </div>
            ) : (
              filtered.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  title={doc.title}
                  category={doc.category}
                  date={doc.date}
                  meta={doc.meta}
                  fileUrl={doc.fileUrl}
                  testId={`publication-${doc.id}`}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Publications;
