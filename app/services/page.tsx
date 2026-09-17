import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { getSeoData, buildMetadata } from "../lib/seo";
import StructuredData from "../components/StructuredData";

const FALLBACK = {
  title: "Our Services | Untold Agency",
  description: "Explore our advertising, branding, and production services.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData("page", "services");
  return buildMetadata(seo, "/services", FALLBACK);
}

export default async function Page() {
  const seo = await getSeoData("page", "services");

  return (
    <>
      <StructuredData data={seo?.structuredData} />
      <ServicesClient />
    </>
  );
}
