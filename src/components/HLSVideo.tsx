import { useEffect, useRef, type CSSProperties } from "react";
import Hls from "hls.js";

interface HLSVideoProps {
  src: string;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  style?: CSSProperties;
}

export default function HLSVideo({
  src,
  className = "",
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  style,
}: HLSVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch((e) => console.error("HLS autoplay failed:", e));
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        if (autoPlay) {
          video.play().catch((e) => console.error("Native HLS autoplay failed:", e));
        }
      });
    }
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      style={style}
    />
  );
}
