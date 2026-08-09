import { MapPin, Calendar, Tag } from "lucide-react";
import { buildFileUrl } from "@/lib/api";

const statusStyles = {
  Active: "bg-gov-green/10 text-gov-green border-gov-green/30",
  Ongoing: "bg-gov-green/10 text-gov-green border-gov-green/30",
  Completed: "bg-gov-slate/10 text-gov-slate border-gov-slate/30",
  Scheduled: "bg-gov-blue/10 text-gov-blue border-gov-blue/30",
  Planned: "bg-gov-amber/10 text-[#8a6400] border-gov-amber/40",
};

const ProjectCard = ({ project, onView, testId }) => {
  const badge = statusStyles[project.status] || "bg-gov-slate/10 text-gov-slate border-gov-slate/30";
  return (
    <article className="gov-card flex flex-col overflow-hidden hover:border-gov-blue" data-testid={testId}>
      <div className="relative h-44 w-full overflow-hidden bg-gov-mist">
        {project.image && (
          <img
            src={buildFileUrl(project.image)}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        )}
        <span className={`absolute left-3 top-3 rounded-sm border px-2 py-0.5 text-xs font-semibold ${badge}`}>
          {project.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-bold leading-snug text-gov-navy">{project.title}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-gov-slate">
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gov-blue" aria-hidden="true" />{project.location}</p>
          <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gov-blue" aria-hidden="true" />{project.period}</p>
          <p className="flex items-center gap-2"><Tag className="h-4 w-4 text-gov-blue" aria-hidden="true" />{project.program}</p>
        </div>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gov-charcoal">{project.description}</p>
        <button
          onClick={() => onView(project)}
          className="mt-4 self-start text-sm font-semibold text-gov-blue underline-offset-2 transition-colors duration-200 hover:text-gov-blueDark hover:underline"
          data-testid={`${testId}-view`}
        >
          View project details →
        </button>
      </div>
    </article>
  );
};

export default ProjectCard;
