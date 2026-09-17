import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";
import { getSeoData, buildMetadata } from "../lib/seo";
import StructuredData from "../components/StructuredData";

const FALLBACK = {
  title: "Portfolio | Untold Agency",
  description: "Explore our recent campaigns and creative work.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData("page", "portfolio");
  return buildMetadata(seo, "/portfolio", FALLBACK);
}

export default async function Page() {
  const seo = await getSeoData("page", "portfolio");

  return (
    <>
      <StructuredData data={seo?.structuredData} />
      <PortfolioClient />
    </>
  );
}
