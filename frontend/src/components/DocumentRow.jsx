import { FileText, Download, ExternalLink } from "lucide-react";
import { buildFileUrl } from "@/lib/api";

const DocumentRow = ({ title, category, date, meta, fileUrl, testId }) => {
  return (
    <div className="flex flex-col gap-3 border-b border-gov-line py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between" data-testid={testId}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gov-mist text-gov-blue">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-gov-navy">{title}</p>
          <p className="mt-0.5 text-xs text-gov-slate">
            {category && <span className="font-medium text-gov-blue">{category}</span>}
            {category && (date || meta) && " · "}
            {date}
            {date && meta && " · "}
            {meta}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 pl-13 sm:pl-0">
        {fileUrl ? (
          <>
            <a
              href={buildFileUrl(fileUrl)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gov-blue transition-colors duration-200 hover:text-gov-blueDark"
              data-testid={`${testId}-view`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> View
            </a>
            <a
              href={buildFileUrl(fileUrl)}
              download
              className="inline-flex items-center gap-1.5 rounded-sm border border-gov-line px-3 py-1.5 text-sm font-semibold text-gov-charcoal transition-colors duration-200 hover:bg-gov-mist"
              data-testid={`${testId}-download`}
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Download
            </a>
          </>
        ) : (
          <span className="text-xs italic text-gov-slate">Document pending publication</span>
        )}
      </div>
    </div>
  );
};

export default DocumentRow;
