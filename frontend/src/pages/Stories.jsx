import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import StoryCard from "@/components/StoryCard";

const Stories = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get("/posts");
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => ["All", ...new Set(posts.map((post) => post.category))], [posts]);
  const filtered = posts.filter((post) => category === "All" || post.category === category);

  return (
    <div className="section-gradient" data-testid="stories-page">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <p className="text-xs uppercase tracking-widest text-brand-muted">Success Stories</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-forest">Stories from the field</h1>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm ${category === item ? "bg-brand-forest text-white" : "border border-brand-forest/20 text-brand-forest"}`}
              data-testid={`stories-category-${item.toLowerCase()}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {filtered.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Stories;
