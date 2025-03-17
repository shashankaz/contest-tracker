import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://contest-tracker-tau.vercel.app",
      lastModified: new Date(),
    },
  ];
}
