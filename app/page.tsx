import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getSeoData, buildMetadata } from "./lib/seo";
import StructuredData from "./components/StructuredData";

const FALLBACK = {
  title: "Untold Agency | Premium Advertising & Marketing Agency",
  description:
    "Professional marketing and advertising agency delivering measurable results.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData("page", "home");
  return buildMetadata(seo, "/", FALLBACK);
}

export default async function Page() {
  const seo = await getSeoData("page", "home");

  return (
    <>
      <StructuredData data={seo?.structuredData} />
      <HomeClient />
    </>
  );
}
