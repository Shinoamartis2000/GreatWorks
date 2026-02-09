import { Link } from "react-router-dom";

const StoryCard = ({ story }) => {
  return (
    <Link
      to={`/stories/${story.slug}`}
      className="group rounded-2xl bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
      data-testid={`story-card-${story.id}`}
    >
      {story.cover_image && (
        <img
          src={story.cover_image}
          alt={story.title}
          className="h-44 w-full rounded-xl object-cover"
        />
      )}
      <div className="mt-4">
        <p className="text-xs uppercase tracking-widest text-brand-muted">{story.category}</p>
        <h3 className="mt-2 font-serif text-xl text-brand-forest">{story.title}</h3>
        <p className="mt-2 text-sm text-brand-muted">{story.excerpt}</p>
        <p className="mt-3 text-xs text-brand-muted">By {story.author}</p>
      </div>
    </Link>
  );
};

export default StoryCard;
