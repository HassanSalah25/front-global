"use client";

import Image from "next/image";
import { getServiceImageUrl } from "../lib/serviceImages";

type ServiceCardMediaProps = {
  imageUrl?: string;
  serviceId?: string;
  icon: string;
  title: string;
  hovered?: boolean;
  variant?: "home" | "page";
};

export default function ServiceCardMedia({
  imageUrl,
  serviceId,
  icon,
  title,
  hovered = false,
  variant = "page",
}: ServiceCardMediaProps) {
  const resolvedImageUrl = getServiceImageUrl(serviceId ?? "", imageUrl);

  if (resolvedImageUrl) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "800 / 540",
          borderRadius: 0,
          overflow: "hidden",
          marginBottom: variant === "page" ? 20 : 16,
          position: "relative",
          background: "#111",
        }}
      >
        <Image
          src={resolvedImageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  const size = variant === "page" ? 64 : 60;

  return (
    <div
      style={{
        width: size,
        height: size,
        background: hovered ? "rgba(255,255,255,0.2)" : "var(--primary-light)",
        borderRadius: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: variant === "page" ? 32 : 30,
        marginBottom: variant === "page" ? 20 : 0,
        transition: "all 0.3s ease",
        color: hovered ? "#fff" : "var(--primary)",
        boxShadow: hovered ? "0 4px 16px rgba(255,255,255,0.2)" : "none",
      }}
    >
      {icon}
    </div>
  );
}
