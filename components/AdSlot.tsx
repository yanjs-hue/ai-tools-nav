import { adSlots, type AdSlotId } from "@/data/ads";

interface AdSlotProps {
  slotId: AdSlotId;
  variant?: "banner" | "sidebar-ad" | "inline" | "footer-ad";
}

export default function AdSlot({ slotId, variant = "banner" }: AdSlotProps) {
  const ad = adSlots[slotId];
  if (!ad?.enabled) return null;

  return (
    <a
      className={`ad-slot ${variant}`}
      href={ad.href}
      target={ad.href.startsWith("http") ? "_blank" : undefined}
      rel={ad.href.startsWith("http") ? "noopener noreferrer sponsored" : undefined}
      aria-label={ad.label}
    >
      <span className="ad-label">Ad · {ad.size}</span>
      <div className="ad-body">
        <div className="ad-copy">
          <h3>{ad.title}</h3>
          <p>{ad.description}</p>
          <div className="ad-meta">可在 data/ads.ts 中修改文案、链接与开关</div>
        </div>
        <span className="ad-cta">{ad.cta}</span>
      </div>
    </a>
  );
}
