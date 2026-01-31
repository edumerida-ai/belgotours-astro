// src/lib/api.js

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;


/**
 * =====================================================
 * 📦 Obtiene un tour por slug e idioma (endpoint público)
 * GET /api/public/tour/:slug?locale=es
 * =====================================================
 */
export async function getTourBySlug(slug, locale = 'es') {
  if (!slug) return null;

  const base = STRAPI_URL.replace(/\/$/, '');
  const params = new URLSearchParams();

  if (locale) params.set('locale', locale);

  const url = `${base}/public/tour/${encodeURIComponent(slug)}?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Error getTourBySlug', res.status, errorText);
    return null; // ⚠️ IMPORTANTE: no lanzar error para no romper Astro
  }

  const json = await res.json();

  // publicFindOne devuelve un objeto plano ya sanitizado
  return json ?? null;
}

/**
 * =====================================================
 * 📦 Obtiene todos los slugs de un idioma (endpoint público)
 * GET /api/public/tours?locale=es
 * =====================================================
 */
export async function getTourSlugs(locale = 'es') {
  const base = STRAPI_URL.replace(/\/$/, '');
  const params = new URLSearchParams();

  if (locale) params.set('locale', locale);

  const url = `${base}/public/tours?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    console.error('❌ Error getTourSlugs', res.status, await res.text());
    return [];
  }

  const json = await res.json();

  if (!Array.isArray(json)) return [];

  return json
    .map((item) => item?.slug)
    .filter(Boolean);
}

export { STRAPI_URL };
