export const navLinks = [
  { name: "Home", path: "/", testId: "nav-link-home" },
  { name: "About", path: "/about", testId: "nav-link-about" },
  { name: "Stories", path: "/stories", testId: "nav-link-stories" },
  { name: "Gallery", path: "/gallery", testId: "nav-link-gallery" },
  { name: "Donate", path: "/donate", testId: "nav-link-donate" },
  { name: "Get Involved", path: "/get-involved", testId: "nav-link-get-involved" },
  { name: "Contact", path: "/contact", testId: "nav-link-contact" },
  { name: "Dashboard", path: "/admin", testId: "nav-link-admin" },
];

export const programsSeed = [
  {
    name: "Safe Water Access",
    impact: "45,000+ people served",
    description: "We restore water systems, install pumps, and train local caretakers.",
    image: "/assets/Great works/WhatsApp Image 25.jpeg",
  },
  {
    name: "Education Recovery",
    impact: "12,000+ students supported",
    description: "Rebuild classrooms, supply learning kits, and mentor educators.",
    image: "/assets/Great works/WhatsApp Image 22.jpeg",
  },
  {
    name: "Shelter & Relief",
    impact: "8,500+ families rehoused",
    description: "Emergency shelter, food deliveries, and trauma-informed care.",
    image: "/assets/Great works/WhatsApp Image 23.jpeg",
  },
];

const galleryFiles = [
  "7877878.jpeg",
  "WhatsApp Imag.jpeg",
  "WhatsApp Image .jpeg",
  "WhatsApp Image 20.jpeg",
  "WhatsApp Image 202.jpeg",
  "WhatsApp Image 2026-.jpeg",
  "WhatsApp Image 2026-0.jpeg",
  "WhatsApp Image 2026-02-.jpeg",
  "WhatsApp Image 2026-02-0.jpeg",
  "WhatsApp Image 2026-02-09 .jpeg",
  "WhatsApp Image 2026-02-09 a.jpeg",
  "WhatsApp Image 2026-02-09 at .jpeg",
  "WhatsApp Image 2026-02-09 at 1.jpeg",
  "WhatsApp Image 2026-02-09 at 13..jpeg",
  "WhatsApp Image 2026-02-09 at 13.03..jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.1.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.16.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.17.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.18.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.19.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.2.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.20.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.21.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.22.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.23.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.24.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.26.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.27.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.28.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.29.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.3.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.30.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.31.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.32.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.323.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.367.jpeg",
  "WhatsApp Image 2026-02-09 at 13.03.jpeg",
  "WhatsApp Image 2026-02-09 at.jpeg",
  "WhatsApp Image 2026-02-09.jpeg",
  "WhatsApp Image 2026.jpeg",
  "WhatsApp Image 21.jpeg",
  "WhatsApp Image 22.jpeg",
  "WhatsApp Image 23.jpeg",
  "WhatsApp Image 232.jpeg",
  "WhatsApp Image 24.jpeg",
  "WhatsApp Image 25.jpeg",
  "WhatsApp Image 26.jpeg",
  "WhatsApp Image 27.jpeg",
  "WhatsApp Image 28.jpeg",
  "WhatsApp Image 30.jpeg",
  "WhatsApp Image.jpeg",
  "WhatsApp Image29.jpeg",
  "book.jpeg",
  "cgj.jpeg",
  "food.jpeg",
  "gift.jpeg",
  "hdfh.jpeg",
  "hfgh.jpeg",
  "hjhjr.jpeg",
  "jty.jpeg",
  "team.jpeg",
  "uif.jpeg",
];

const programTypes = ["Water", "Education", "Shelter", "Relief"];

export const localGallery = galleryFiles.map((file, index) => ({
  id: `local-${index}`,
  src: `/assets/Great works/${file}`,
  programType: programTypes[index % programTypes.length],
  label: "GreatWorks field impact",
}));

export const localVideos = [
  {
    id: "video-1",
    src: "/assets/Great works/WhatsApp Video 2026-02-09 at 13.03.16.mp4",
    programType: "Relief",
    label: "Volunteer response footage",
  },
];

export const givingOptions = [
  { label: "Emergency Relief", amount: 35, impact: "Provides a family with clean water for a month" },
  { label: "Education Kit", amount: 75, impact: "Supplies a student for an entire term" },
  { label: "Rebuild a Home", amount: 250, impact: "Rebuilds a safe shelter for a family" },
];

export const contactMethods = [
  { label: "Email", value: "hello@greatworksfoundation.org" },
  { label: "Phone", value: "+1 (555) 021-1942" },
  { label: "Address", value: "145 Hope Street, Suite 22, Austin, TX" },
];
