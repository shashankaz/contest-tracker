import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://contest-tracker-hub.vercel.app",
      lastModified: new Date(),
    },
  ];
}
