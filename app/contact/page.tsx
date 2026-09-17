import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getSeoData, buildMetadata } from "../lib/seo";
import StructuredData from "../components/StructuredData";

const FALLBACK = {
  title: "Contact Us | Untold Agency",
  description: "Get in touch with our team for your next project.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData("page", "contact");
  return buildMetadata(seo, "/contact", FALLBACK);
}

export default async function Page() {
  const seo = await getSeoData("page", "contact");

  return (
    <>
      <StructuredData data={seo?.structuredData} />
      <ContactClient />
    </>
  );
}
