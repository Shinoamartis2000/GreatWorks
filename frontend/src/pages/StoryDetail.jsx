import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";

const StoryDetail = () => {
  const { slug } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      const { data } = await api.get(`/posts/${slug}`);
      setStory(data);
    };
    fetchStory();
  }, [slug]);

  const shareUrl = window.location.href;

  if (!story) {
    return <div className="px-6 py-20" data-testid="story-loading">Loading...</div>;
  }

  return (
    <div className="section-gradient" data-testid="story-detail-page">
      <section className="mx-auto max-w-3xl px-6 py-20 md:px-12">
        <p className="text-xs uppercase tracking-widest text-brand-muted" data-testid="story-category">
          {story.category}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-brand-forest" data-testid="story-title">
          {story.title}
        </h1>
        <p className="mt-3 text-sm text-brand-muted" data-testid="story-author">
          By {story.author} · {story.views} views
        </p>
        {story.cover_image && (
          <img src={story.cover_image} alt={story.title} className="mt-8 h-72 w-full rounded-2xl object-cover" />
        )}
        <p className="mt-8 text-lg text-brand-muted" data-testid="story-content">
          {story.content}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link copied");
            }}
            className="rounded-full border border-brand-forest/30 px-4 py-2 text-sm text-brand-forest"
            data-testid="story-share-copy"
          >
            Copy Link
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-brand-forest/30 px-4 py-2 text-sm text-brand-forest"
            data-testid="story-share-twitter"
          >
            Share on X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-brand-forest/30 px-4 py-2 text-sm text-brand-forest"
            data-testid="story-share-facebook"
          >
            Share on Facebook
          </a>
        </div>
      </section>
    </div>
  );
};

export default StoryDetail;
