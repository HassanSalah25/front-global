import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import { getSeoData, buildMetadata } from "../lib/seo";
import StructuredData from "../components/StructuredData";

const FALLBACK = {
  title: "Blog | Untold Agency",
  description: "Insights, case studies, and news from our team.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData("page", "blog");
  return buildMetadata(seo, "/blog", FALLBACK);
}

export default async function Page() {
  const seo = await getSeoData("page", "blog");

  return (
    <>
      <StructuredData data={seo?.structuredData} />
      <BlogClient />
    </>
  );
}
