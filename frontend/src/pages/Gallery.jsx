import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api, buildFileUrl } from "@/lib/api";
import { localGallery, localVideos } from "@/data/siteData";

const Gallery = () => {
  const [program, setProgram] = useState("All");
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await api.get("/media");
      setMedia(data || []);
    };
    fetchMedia();
  }, []);

  const combined = useMemo(() => {
    const uploaded = media.map((item) => ({
      id: item.id,
      src: buildFileUrl(item.optimized_url || item.original_url),
      programType: item.program_type || "General",
      label: item.filename,
      type: item.type,
    }));
    const local = localGallery.map((item) => ({ ...item, type: "image" }));
    return [...uploaded, ...local];
  }, [media]);

  const filtered = combined.filter((item) => program === "All" || item.programType === program);
  const videos = localVideos.filter((item) => program === "All" || item.programType === program);

  return (
    <motion.div
      className="section-gradient"
      data-testid="gallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <p className="text-xs uppercase tracking-widest text-brand-muted">Impact Gallery</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-forest">87+ moments of progress</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          {["All", "Urban Scholarship", "Valentine Outreach", "Community Relief"].map((item) => (
            <button
              key={item}
              onClick={() => setProgram(item)}
              className={`rounded-full px-4 py-2 text-sm ${program === item ? "bg-brand-forest text-white" : "border border-brand-forest/20 text-brand-forest"}`}
              data-testid={`gallery-filter-${item.toLowerCase().replace(/\s/g, "-")}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="group overflow-hidden rounded-2xl bg-white/70 shadow-sm">
              <img
                src={item.src}
                alt={item.label}
                className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                data-testid={`gallery-item-${item.id}`}
              />
              <div className="p-4">
                <p className="text-xs uppercase tracking-widest text-brand-muted">{item.programType}</p>
                <p className="mt-2 text-sm text-brand-muted">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h2 className="font-serif text-2xl text-brand-forest" data-testid="gallery-video-title">
            Field Videos
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <div key={video.id} className="rounded-2xl bg-white/70 p-4" data-testid={`gallery-video-${video.id}`}>
                <video controls className="w-full rounded-xl">
                  <source src={video.src} type="video/mp4" />
                </video>
                <p className="mt-2 text-sm text-brand-muted">{video.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Gallery;
