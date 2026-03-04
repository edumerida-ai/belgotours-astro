// ================================
// Tipos
// ================================
export type TourLang = "es" | "en" | "it" | "fr";
export type SiteLang = "es" | "en" | "it" | "fr" | "pt";

export type City = "brussels" | "bruges" | "antwerp" | "leuven";
export type TourKind = "free" | "private" | "special";

export interface SearchboxTour {
  name: string;
  duration: string;
  price: string;
  tourLang: TourLang;  // idioma real del tour
  city: City;          // ciudad (escalable)
  kind: TourKind;      // tipo (NO es paso, solo metadata)
  url: string;         // URL final del funnel (no se rompe)
}

// ================================
// Base de tours (FUENTE ÚNICA)
// ================================
const TOURS: SearchboxTour[] = [
  // BRUSSELS - FREE
  {
    name: "Free Tour Bruselas en Español",
    duration: "2 h 15 min",
    price: "Pago libre",
    tourLang: "es",
    city: "brussels",
    kind: "free",
    url: "/es/tours/free-tour-bruselas",
  },
  {
    name: "Free Tour Brussels in English",
    duration: "2 h 15 min",
    price: "Tip-based",
    tourLang: "en",
    city: "brussels",
    kind: "free",
    url: "/en/tours/free-tour-brussels",
  },
  {
    name: "Free Tour Bruxelles in Italiano",
    duration: "2 h 15 min",
    price: "Prezzo libero",
    tourLang: "it",
    city: "brussels",
    kind: "free",
    url: "/it/tours/free-tour-bruxelles",
  },

  // BRUGES - FREE (solo ES)
  {
    name: "Free Tour Brujas en Español",
    duration: "2 h 15 min",
    price: "Pago libre",
    tourLang: "es",
    city: "bruges",
    kind: "free",
    url: "/es/tours/free-tour-brujas",
  },

  // BRUSSELS - SPECIAL (solo ES)
  {
    name: "Tour de Chocolate y Cerveza en Bruselas",
    duration: "2 h 30 min",
    price: "39€ por persona",
    tourLang: "es",
    city: "brussels",
    kind: "special",
    url: "/es/tours/tour-chocolate-cerveza-bruselas",
  },

  // BRUSSELS - PRIVATE (ES/EN/IT/FR)
  {
    name: "Tour Privado Bruselas en Español",
    duration: "2 h 15 min",
    price: "Presupuesto",
    tourLang: "es",
    city: "brussels",
    kind: "private",
    url: "/es/tours/tour-privado-bruselas",
  },
  {
    name: "Private Tour Brussels in English",
    duration: "2 h 15 min",
    price: "Quote",
    tourLang: "en",
    city: "brussels",
    kind: "private",
    url: "/en/tours/private-tour-brussels",
  },
  {
    name: "Tour Privato Bruxelles in Italiano",
    duration: "2 h 15 min",
    price: "Preventivo",
    tourLang: "it",
    city: "brussels",
    kind: "private",
    url: "/it/tours/tour-privato-bruxelles",
  },
  {
    name: "Tour Privé Bruxelles (Français)",
    duration: "2 h 15 min",
    price: "Devis",
    tourLang: "fr",
    city: "brussels",
    kind: "private",
    url: "/fr/tours/tour-prive-bruxelles",
  },

  // BRUGES - PRIVATE (solo ES)
  {
    name: "Tour Privado Brujas en Español",
    duration: "2 h 15 min",
    price: "Presupuesto",
    tourLang: "es",
    city: "bruges",
    kind: "private",
    url: "/es/tours/tour-privado-brujas",
  },
];

// ================================
// EXPORTS PÚBLICOS
// ================================
export const SEARCHBOX_TOURS: SearchboxTour[] = TOURS;

export function getSearchboxTours(siteLang: SiteLang): SearchboxTour[] {
  // /pt/ muestra TODO (pero la UI filtra por lo que el usuario elija)
  if (siteLang === "pt") return TOURS;

  // otros idiomas: por defecto solo tours del idioma del site
  return TOURS.filter((t) => t.tourLang === siteLang);
}