// Derives a project-directory shape from CMS events + program metadata.
const deriveProgram = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("scholar") || t.includes("education") || t.includes("mentor")) return "Education & Scholarships";
  if (t.includes("valentine") || t.includes("outreach") || t.includes("widow")) return "Community Outreach";
  if (t.includes("relief") || t.includes("recovery") || t.includes("food")) return "Relief & Recovery";
  return "Community Programmes";
};

const statusLabel = (status) => {
  if (!status) return "Active";
  const s = status.toLowerCase();
  if (s === "scheduled") return "Scheduled";
  if (s === "completed" || s === "past") return "Completed";
  if (s === "active" || s === "ongoing") return "Active";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const fmtYear = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.getFullYear().toString();
};

export const deriveProjects = (events = []) =>
  events.map((event) => {
    const year = fmtYear(event.start_datetime);
    return {
      id: event.id,
      title: event.title,
      location: event.location || "Enugu, Nigeria",
      period: year,
      year,
      program: deriveProgram(event.title),
      status: statusLabel(event.status),
      beneficiaries: event.capacity ? `Up to ${event.capacity} participants` : "Community members",
      description: event.description || "",
      objectives: event.description || "",
      outcomes: event.registration_count
        ? `${event.registration_count} registrations recorded to date.`
        : "Outcomes will be reported following completion.",
      image: event.cover_image || "/assets/Great works/WhatsApp Image 24.jpeg",
    };
  });
