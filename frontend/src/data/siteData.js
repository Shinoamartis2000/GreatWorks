import {
  ShieldCheck,
  FileText,
  Users,
  HeartHandshake,
  Accessibility,
  Landmark,
} from "lucide-react";

// Primary institutional navigation
export const navLinks = [
  { name: "About", path: "/about", testId: "nav-link-about" },
  { name: "Programs", path: "/programs", testId: "nav-link-programs" },
  { name: "Projects", path: "/projects", testId: "nav-link-projects" },
  { name: "Impact", path: "/impact", testId: "nav-link-impact" },
  { name: "Publications", path: "/publications", testId: "nav-link-publications" },
  { name: "Partnerships", path: "/partnerships", testId: "nav-link-partnerships" },
  { name: "Get Involved", path: "/get-involved", testId: "nav-link-get-involved" },
  { name: "Contact", path: "/contact", testId: "nav-link-contact" },
];

export const organisation = {
  name: "GreatWorks Foundation",
  shortName: "GreatWorks",
  tagline: "Rebuilding Lives for the Future",
  mission:
    "GreatWorks Foundation works alongside communities in Enugu, Nigeria to deliver programmes in education, social welfare, and community relief. We provide scholarships and mentorship for students, support for widows and vulnerable families, and coordinated relief during periods of need.",
  vision:
    "Communities in which every individual has access to education, dignity, and the support required to build a stable future.",
  region: "Enugu, Nigeria",
  email: "hello@greatworksfoundation.org",
  phone: "+234 703 528 8648",
  phoneRaw: "+2347035288648",
  officeHours: "Monday – Friday, 9:00am – 5:00pm (WAT)",
  handle: "@greatworksf",
  socials: {
    facebook: "https://facebook.com/greatworksf",
    instagram: "https://instagram.com/greatworksf",
    x: "https://x.com/greatworksf",
  },
};

// Verified facts derived only from existing organisational content.
export const institutionalFacts = [
  { label: "Focus areas", value: "Education · Welfare · Relief" },
  { label: "Operating region", value: "Enugu, Nigeria" },
  { label: "Active programmes", value: "3" },
  { label: "Contact", value: organisation.phone },
];

export const missionValues = [
  {
    title: "Accountability",
    icon: ShieldCheck,
    text: "We take responsibility for our commitments and report on our activities openly.",
  },
  {
    title: "Transparency",
    icon: FileText,
    text: "We document our programmes and make information available for review.",
  },
  {
    title: "Community partnership",
    icon: Users,
    text: "We plan and deliver programmes together with the communities we serve.",
  },
  {
    title: "Dignity",
    icon: HeartHandshake,
    text: "We treat every beneficiary with respect and protect their privacy.",
  },
  {
    title: "Inclusion",
    icon: Accessibility,
    text: "We work to reach those most often left out of support systems.",
  },
  {
    title: "Stewardship",
    icon: Landmark,
    text: "We manage resources carefully and direct them towards measurable outcomes.",
  },
];

export const programsSeed = [
  {
    name: "Urban Scholarship Program (Enugu)",
    objective: "Improve access to education for urban youth in Enugu.",
    beneficiaries: "Students in Enugu",
    area: "Enugu, Nigeria",
    activities: ["Tuition support", "Learning materials", "Mentorship"],
    outcome: "Students supported to continue their education.",
    status: "Active",
    impact: "Scholarships + mentorship for urban youth",
    description:
      "Supporting students in Enugu with tuition, mentorship, and learning resources so that financial hardship does not interrupt their education.",
    image: "/assets/Great works/WhatsApp Image 22.jpeg",
  },
  {
    name: "Valentine Outreach 2022 (Widows & Street)",
    objective: "Provide care and essential support to widows and street families.",
    beneficiaries: "Widows and street families",
    area: "Enugu, Nigeria",
    activities: ["Meals & care kits", "Counselling", "Community visits"],
    outcome: "Families reached with essential support and care.",
    status: "Completed",
    impact: "Compassionate care + essentials",
    description:
      "A community outreach delivering meals, care kits, and emotional support to widows and street families, restoring dignity and connection.",
    image: "/assets/Great works/WhatsApp Image 23.jpeg",
  },
  {
    name: "Community Relief & Recovery",
    objective: "Coordinate emergency relief and recovery support for families.",
    beneficiaries: "Families in need across Enugu",
    area: "Enugu, Nigeria",
    activities: ["Emergency relief", "Food support", "Recovery partnerships"],
    outcome: "Ongoing relief for families affected by hardship.",
    status: "Active",
    impact: "Ongoing aid for families",
    description:
      "Emergency relief, food support, and recovery partnerships across Enugu, coordinated with local volunteers and community leaders.",
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
  label: "GreatWorks field documentation",
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
  { label: "Scholarship support", amount: 35, impact: "Contributes to a student's learning resources" },
  { label: "Outreach care pack", amount: 75, impact: "Provides essentials for a widow or family" },
  { label: "Community relief", amount: 250, impact: "Supports a full outreach day" },
];

export const contactMethods = [
  { label: "Registered office", value: "Enugu, Nigeria" },
  { label: "Email", value: organisation.email },
  { label: "Telephone", value: organisation.phone },
  { label: "Office hours", value: organisation.officeHours },
];

// Footer structure
export const footerColumns = [
  {
    heading: "The organisation",
    links: [
      { name: "About us", path: "/about" },
      { name: "Programs", path: "/programs" },
      { name: "Projects", path: "/projects" },
      { name: "Impact", path: "/impact" },
    ],
  },
  {
    heading: "Transparency",
    links: [
      { name: "Publications", path: "/publications" },
      { name: "Partnerships", path: "/partnerships" },
      { name: "Media library", path: "/gallery" },
      { name: "News & notices", path: "/stories" },
    ],
  },
  {
    heading: "Engage",
    links: [
      { name: "Get involved", path: "/get-involved" },
      { name: "Donate", path: "/donate" },
      { name: "Contact", path: "/contact" },
      { name: "Staff login", path: "/login" },
    ],
  },
];
