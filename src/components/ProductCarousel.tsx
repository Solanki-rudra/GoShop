"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const isValidUrl = (url: string) => {
  try {
    if (!url) return false;
    new URL(url);
    return true;
  } catch {
    return url.startsWith("/");
  }
};

const getYoutubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    return null;
  } catch {
    return null;
  }
};

export default function ProductCarousel({ product }: { product: any }) {
  const media = [
    ...(product.images && product.images.length > 0
      ? product.images
      : ["/item_placeholder.webp"]),
    ...(product.video ? [product.video] : []),
  ];

  return (
    <div className="relative w-full h-40 mb-4 overflow-hidden rounded-xl">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true} // ✅ Infinite loop
        className="w-full h-full"
      >
        {media.map((item: string, index: number) => {
          const youtubeEmbed = getYoutubeEmbedUrl(item);

          return (
            <SwiperSlide key={index}>
              {item.endsWith(".mp4") ? (
                <video
                  src={item}
                  controls
                  className="w-full h-full object-contain bg-black"
                />
              ) : youtubeEmbed ? (
                <iframe
                  src={youtubeEmbed}
                  className="w-full h-full bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <Image
                  src={isValidUrl(item) ? item : "/placeholder.png"}
                  alt={product.name || "Product image"}
                  fill
                  className="object-contain bg-white"
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom styling for arrows */}
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: #2563eb; /* Tailwind blue-600 */
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
