export const navLinks = [
  { name: "Home", path: "/", testId: "nav-link-home" },
  { name: "About", path: "/about", testId: "nav-link-about" },
  { name: "Stories", path: "/stories", testId: "nav-link-stories" },
  { name: "Gallery", path: "/gallery", testId: "nav-link-gallery" },
  { name: "Donate", path: "/donate", testId: "nav-link-donate" },
  { name: "Get Involved", path: "/get-involved", testId: "nav-link-get-involved" },
  { name: "Contact", path: "/contact", testId: "nav-link-contact" },
  { name: "Login", path: "/login", testId: "nav-link-login" },
  { name: "Dashboard", path: "/admin", testId: "nav-link-admin" },
];

export const programsSeed = [
  {
    name: "Urban Scholarship Program (Enugu)",
    impact: "Scholarships + mentorship for urban youth",
    description: "Supporting students in Enugu with tuition, mentorship, and learning resources.",
    image: "/assets/Great works/WhatsApp Image 22.jpeg",
  },
  {
    name: "Valentine Outreach 2022 (Widows & Street)",
    impact: "Compassionate care + essentials",
    description: "Community outreach delivering meals, care kits, and emotional support.",
    image: "/assets/Great works/WhatsApp Image 23.jpeg",
  },
  {
    name: "Community Relief & Recovery",
    impact: "Ongoing aid for families",
    description: "Emergency relief, food support, and recovery partnerships across Enugu.",
    image: "/assets/Great works/WhatsApp Image 25.jpeg",
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

const programTypes = ["Urban Scholarship", "Valentine Outreach", "Community Relief"];

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
  { label: "Scholarship Support", amount: 35, impact: "Supports student learning resources" },
  { label: "Outreach Care Pack", amount: 75, impact: "Provides a widow with essentials" },
  { label: "Community Relief", amount: 250, impact: "Funds a full outreach day" },
];

export const contactMethods = [
  { label: "Email", value: "hello@greatworksfoundation.org" },
  { label: "Phone", value: "+2347035288648" },
  { label: "Address", value: "145 Hope Street, Suite 22, Austin, TX" },
];
