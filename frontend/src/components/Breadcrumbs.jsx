import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-sm" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1.5 text-white/70">
        <li>
          <Link to="/" className="transition-colors duration-200 hover:text-white" data-testid="breadcrumb-home">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
              {isLast || !item.path ? (
                <span className="font-semibold text-white" aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.path} className="transition-colors duration-200 hover:text-white">{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
