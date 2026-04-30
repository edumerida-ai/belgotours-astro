import type { APIRoute } from "astro";

const base = "https://belgotours.com";
const today = new Date().toISOString().split("T")[0];

export const GET: APIRoute = async () => {
  const urls = [
    // HOME — máxima prioridad
    { loc: `${base}/es/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${base}/en/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${base}/it/`, priority: "0.9", changefreq: "weekly" },
    { loc: `${base}/fr/`, priority: "0.9", changefreq: "weekly" },
    { loc: `${base}/pt/`, priority: "0.7", changefreq: "weekly" },

    // TOURS ES — alta prioridad
    { loc: `${base}/es/tours/free-tour-bruselas`, priority: "1.0", changefreq: "daily" },
    { loc: `${base}/es/tours/free-tour-brujas`, priority: "0.9", changefreq: "daily" },
    { loc: `${base}/es/tours/tour-chocolate-cerveza-bruselas`, priority: "0.8", changefreq: "weekly" },
    { loc: `${base}/es/tours/tour-privado-bruselas`, priority: "0.8", changefreq: "weekly" },
    { loc: `${base}/es/tours/tour-privado-brujas`, priority: "0.7", changefreq: "weekly" },

    // TOURS EN
    { loc: `${base}/en/tours/free-tour-brussels`, priority: "1.0", changefreq: "daily" },
    { loc: `${base}/en/tours/private-tour-brussels`, priority: "0.8", changefreq: "weekly" },

    // TOURS IT
    { loc: `${base}/it/tours/free-tour-bruxelles`, priority: "0.9", changefreq: "daily" },
    { loc: `${base}/it/tours/tour-privato-bruxelles`, priority: "0.7", changefreq: "weekly" },

    // TOURS FR
    { loc: `${base}/fr/tours/tour-prive-bruxelles`, priority: "0.8", changefreq: "weekly" },

    // BLOG ES
    { loc: `${base}/es/blog/`, priority: "0.7", changefreq: "weekly" },
    { loc: `${base}/es/blog/que-ver-en-bruselas`, priority: "0.7", changefreq: "monthly" },
    { loc: `${base}/es/blog/free-tour-bruselas-guia-completa`, priority: "0.8", changefreq: "monthly" },
    { loc: `${base}/es/blog/que-ver-en-brujas-en-un-dia`, priority: "0.6", changefreq: "monthly" },

    // BLOG EN
    { loc: `${base}/en/blog/`, priority: "0.7", changefreq: "weekly" },
    { loc: `${base}/en/blog/things-to-do-in-brussels`, priority: "0.7", changefreq: "monthly" },
    { loc: `${base}/en/blog/free-walking-tour-brussels-guide`, priority: "0.8", changefreq: "monthly" },

    // B2B
    { loc: `${base}/es/b2b-collaboration-belgium`, priority: "0.5", changefreq: "monthly" },
    { loc: `${base}/en/b2b-collaboration-belgium`, priority: "0.5", changefreq: "monthly" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};
