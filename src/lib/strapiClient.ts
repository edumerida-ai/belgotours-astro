// -------------------------------------------------------------
//  STRAPI CLIENT v2026 — BelgoTours
//  Cliente moderno universal para Strapi v5 (REST)
//  Usado por Homepage Premium 2026 + Tours + Reviews
// -------------------------------------------------------------

const STRAPI_URL =
  import.meta.env.PUBLIC_STRAPI_URL || "http://168.119.183.247:1337/api";

// -------------------------------------------------------------
// Utilidad fetch segura
// -------------------------------------------------------------
async function safeFetch(path: string, params: Record<string, any> = {}) {
  const url = new URL(path, STRAPI_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Strapi Error:", res.status, text);
    throw new Error(`Strapi error ${res.status}: ${text}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// Tipos mínimos para autocompletado
// -------------------------------------------------------------
export interface TourHero {
  imagen?: {
    url: string;
    alternativeText?: string;
  };
  video?: string;
  badges?: string;
}

export interface Tour {
  titulo: string;
  slug: string;
  duracion: number;
  ciudad: "bruselas" | "brujas";
  tipo_tour: "free" | "privado";
  pago_libre: boolean;
  precio_base?: number;
  rating: number;
  hero?: TourHero;
}

// -------------------------------------------------------------
// ENDPOINTS PÚBLICOS
// -------------------------------------------------------------

// 🟦 HOME PAGE (SingleType, público, i18n)
// Compatible con controller custom (objeto plano) y Strapi estándar
export async function getHomePage(locale = "es") {
  try {
    const res = await safeFetch("/home-page", {
      locale,
      populate: "deep",
    });

    // CASO 1: Controller custom → objeto plano
    if (res && typeof res === "object" && !res.data) {
      return res;
    }

    // CASO 2: Strapi estándar → data.attributes
    if (res?.data?.attributes) {
      return {
        id: res.data.id,
        ...res.data.attributes,
      };
    }

    console.warn("⚠️ Home Page formato inesperado", res);
    return null;
  } catch (error) {
    console.warn(`⚠️ Home Page no disponible para locale=${locale}`);
    return null;
  }
}


// 🟦 Obtener tours para el home (público + localizado)
export async function getPublicTours(locale = "es"): Promise<Tour[]> {
  return safeFetch("/public/tours", { locale });
}

// 🟦 Obtener un tour específico por slug
export async function getPublicTour(slug: string, locale = "es") {
  return safeFetch(`/public/tour/${slug}`, { locale });
}

// 🟦 Obtener slugs públicos por idioma
export async function getPublicTourSlugs(locale = "es") {
  return safeFetch("/public/tours", { locale }).then((tours: any[]) =>
    tours.map((t) => t.slug)
  );
}

// 🟦 Obtener reseñas públicas por tour
export async function getPublicReviews(tourId: number, locale = "es") {
  return safeFetch("/public/reviews", { tourId, locale });
}

// 🟦 Idiomas disponibles
export const AVAILABLE_LANGS = ["es", "en", "it", "fr", "pt"];

// -------------------------------------------------------------
// Export base URL
// -------------------------------------------------------------
export { STRAPI_URL };
