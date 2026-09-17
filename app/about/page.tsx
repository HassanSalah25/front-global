import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { getSeoData, buildMetadata } from "../lib/seo";
import StructuredData from "../components/StructuredData";

const FALLBACK = {
  title: "About Us | Untold Agency",
  description: "Learn about our team, story, and values.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData("page", "about");
  return buildMetadata(seo, "/about", FALLBACK);
}

export default async function Page() {
  const seo = await getSeoData("page", "about");

  return (
    <>
      <StructuredData data={seo?.structuredData} />
      <AboutClient />
    </>
  );
}
