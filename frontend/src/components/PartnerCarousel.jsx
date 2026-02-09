import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { api } from "@/lib/api";

const PartnerCarousel = () => {
  const [partners, setPartners] = useState([]);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await api.get("/partners");
      setPartners(data || []);
    };
    fetchPartners();
  }, []);

  return (
    <div className="overflow-hidden" ref={emblaRef} data-testid="partner-carousel">
      <div className="flex gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex min-w-[200px] flex-col items-center justify-center rounded-xl bg-white/70 px-6 py-4"
          >
            <img src={partner.logo_url} alt={partner.name} className="h-12 object-contain" />
            <p className="mt-2 text-xs text-brand-muted" data-testid={`partner-${partner.id}`}>
              {partner.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerCarousel;
