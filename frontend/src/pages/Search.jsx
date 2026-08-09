import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";

const Search = () => {
  const [params] = useSearchParams();
  const query = (params.get("q") || "").trim();
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/posts?status=published"),
      api.get("/events"),
      api.get("/programs"),
    ]).then(([p, e, pr]) => {
      setPosts(p.data || []);
      setEvents(e.data || []);
      setPrograms(pr.data || []);
    });
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return [];
    const match = (text) => (text || "").toLowerCase().includes(q);
    const out = [];
    posts.filter((p) => match(p.title) || match(p.excerpt) || match(p.content)).forEach((p) =>
      out.push({ id: p.id, type: "News", title: p.title, text: p.excerpt || "", path: "/stories" })
    );
    events.filter((e) => match(e.title) || match(e.description) || match(e.location)).forEach((e) =>
      out.push({ id: e.id, type: "Project", title: e.title, text: e.location || "", path: "/projects" })
    );
    programs.filter((p) => match(p.name) || match(p.description)).forEach((p) =>
      out.push({ id: p.id || p.name, type: "Programme", title: p.name, text: p.description || "", path: "/programs" })
    );
    return out;
  }, [query, posts, events, programs]);

  return (
    <div>
      <PageHeader
        eyebrow="Search"
        title={query ? `Search results for "${query}"` : "Search"}
        description={query ? `${results.length} result(s) found across programmes, projects, and news.` : "Enter a search term to find programmes, projects, and news."}
        breadcrumbs={[{ label: "Search" }]}
        testId="search-header"
      />
      <section className="bg-white py-14 md:py-20">
        <div className="gov-container">
          {results.length === 0 ? (
            <div className="gov-card border-dashed p-10 text-center text-sm text-gov-slate" data-testid="search-empty">
              {query ? "No matching results. Try a different search term." : "No search term provided."}
            </div>
          ) : (
            <ul className="divide-y divide-gov-line" data-testid="search-results">
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`} className="py-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gov-blue">{r.type}</span>
                  <Link to={r.path} className="mt-1 block font-serif text-lg font-bold text-gov-navy hover:underline" data-testid={`search-result-${r.id}`}>
                    {r.title}
                  </Link>
                  {r.text && <p className="mt-1 text-sm text-gov-charcoal line-clamp-2">{r.text}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;
