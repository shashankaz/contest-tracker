import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private/"],
      },
    ],
    sitemap: "https://contest-tracker-hub.vercel.app/sitemap.xml",
  };
}
