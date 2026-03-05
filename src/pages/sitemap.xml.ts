import type { APIRoute } from "astro";

const base = "https://belgotours.com";

export const GET: APIRoute = async () => {

const urls = [

/* HOME idiomas */
`${base}/es/`,
`${base}/en/`,
`${base}/it/`,
`${base}/fr/`,
`${base}/pt/`,

/* TOURS ES */
`${base}/es/tours/free-tour-bruselas`,
`${base}/es/tours/free-tour-brujas`,
`${base}/es/tours/tour-chocolate-cerveza-bruselas`,
`${base}/es/tours/tour-privado-bruselas`,
`${base}/es/tours/tour-privado-brujas`,

/* TOURS EN */
`${base}/en/tours/free-tour-brussels`,
`${base}/en/tours/private-tour-brussels`,

/* TOURS IT */
`${base}/it/tours/free-tour-bruxelles`,
`${base}/it/tours/tour-privato-bruxelles`,

/* TOURS FR */
`${base}/fr/tours/tour-prive-bruxelles`

];

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
.map(
(url) => `
<url>
<loc>${url}</loc>
</url>`
)
.join("")}
</urlset>`;

return new Response(body, {
headers: {
"Content-Type": "application/xml",
},
});

};