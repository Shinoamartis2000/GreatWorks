import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";

const Stories = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    api.get("/posts").then(({ data }) => setPosts(data || []));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(posts.map((p) => p.category).filter(Boolean))],
    [posts]
  );
  const filtered = posts.filter((p) => category === "All" || p.category === category);
  const [featured, ...rest] = filtered;

  return (
    <div>
      <PageHeader
        eyebrow="News & Notices"
        title="News & Public Notices"
        description="Announcements, project updates, and community stories from GreatWorks Foundation."
        breadcrumbs={[{ label: "News & Notices" }]}
        testId="stories-header"
      />

      <section className="bg-white py-12 md:py-16" data-testid="stories-page">
        <div className="gov-container">
          <div className="flex flex-wrap gap-2 border-b border-gov-line pb-4">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-sm px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  category === c ? "bg-gov-navy text-white" : "border border-gov-line text-gov-charcoal hover:bg-gov-mist"
                }`}
                data-testid={`stories-category-${c.toLowerCase().replace(/\s/g, "-")}`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 gov-card border-dashed p-10 text-center text-sm text-gov-slate">
              No news items published yet.
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {featured && (
                <Link to={`/stories/${featured.slug}`} className="gov-card grid gap-0 overflow-hidden md:grid-cols-2" data-testid={`story-featured-${featured.id}`}>
                  {featured.cover_image && (
                    <div className="h-56 w-full overflow-hidden bg-gov-mist md:h-auto">
                      <img src={featured.cover_image} alt={featured.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gov-blue">{featured.category || "Update"}</span>
                    <h2 className="mt-2 font-serif text-2xl font-bold text-gov-navy">{featured.title}</h2>
                    <p className="mt-3 text-sm text-gov-charcoal">{featured.excerpt}</p>
                    <p className="mt-4 text-xs text-gov-slate">By {featured.author}</p>
                  </div>
                </Link>
              )}
              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-3">
                  {rest.map((post) => (
                    <Link key={post.id} to={`/stories/${post.slug}`} className="gov-card overflow-hidden" data-testid={`story-card-${post.id}`}>
                      {post.cover_image && (
                        <div className="h-40 w-full overflow-hidden bg-gov-mist">
                          <img src={post.cover_image} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gov-blue">{post.category || "Update"}</span>
                        <h3 className="mt-2 font-serif text-base font-bold text-gov-navy">{post.title}</h3>
                        <p className="mt-2 text-sm text-gov-charcoal line-clamp-2">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Stories;
