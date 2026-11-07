"use client";

import { useSyncExternalStore } from "react";

const PHONE_QUERY = "(max-width: 767px)";
const SIZES = {
  pc: { width: 728, height: 90 },
  sp: { width: 300, height: 250 },
};

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function currentSlot(): keyof typeof SIZES {
  return window.matchMedia(PHONE_QUERY).matches ? "sp" : "pc";
}

/**
 * One banner per screen size. The tags use document.write, so each runs in its own
 * page inside an iframe, which also keeps the ad within its box. The wrapper reserves
 * the height before the screen size is known, so the page does not shift.
 */
export default function AdSlot() {
  const slot = useSyncExternalStore(subscribe, currentSlot, () => null);

  return (
    <div className="flex justify-center mt-12 px-4 h-[250px] md:h-[90px]">
      {slot && (
        <iframe
          key={slot}
          src={`/ads/${slot}.html`}
          title="Advertisement"
          width={SIZES[slot].width}
          height={SIZES[slot].height}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          className="border-0 max-w-full"
        />
      )}
    </div>
  );
}
