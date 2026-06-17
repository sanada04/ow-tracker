"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function AbilityVideoPlayer({
  thumbnail,
  mp4,
  webm,
  name,
}: {
  thumbnail: string;
  mp4: string;
  webm: string;
  name: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handlePlay() {
    setPlaying(true);
    // give DOM time to render the video element
    setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 50);
  }

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-sm">
      {playing ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          autoPlay
          playsInline
          muted
          onClick={() => { videoRef.current?.pause(); setPlaying(false); }}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      ) : (
        <>
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className="w-12 h-12 rounded-full bg-[#f4a029]/90 hover:bg-[#f4a029] flex items-center justify-center transition-colors shadow-lg"
              aria-label={`Play ${name} video`}
            >
              <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
