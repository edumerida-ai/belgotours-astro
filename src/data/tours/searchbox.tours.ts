// ================================
// Tipos
// ================================
export type TourLang = "es" | "en" | "it" | "fr";
export type SiteLang = "es" | "en" | "it" | "fr" | "pt";

export interface SearchboxTour {
  name: string;
  duration: string;
  price: string;
  tourLang: TourLang; // idioma real del tour
  url: string;        // URL final
}

// ================================
// Base de tours (FUENTE ÚNICA)
// ================================
const TOURS: SearchboxTour[] = [
  // ✅ FREE TOUR BRUSELAS
  {
    name: "Free Tour Bruselas en Español",
    duration: "2 h 15 min",
    price: "Pago libre",
    tourLang: "es",
    url: "/es/tours/free-tour-bruselas",
  },
  {
    name: "Free Tour Brussels in English",
    duration: "2 h 15 min",
    price: "Tip-based",
    tourLang: "en",
    url: "/en/tours/free-tour-brussels",
  },
  {
    name: "Free Tour Bruxelles in Italiano",
    duration: "2 h 15 min",
    price: "Prezzo libero",
    tourLang: "it",
    url: "/it/tours/free-tour-bruxelles",
  },

  // ✅ FREE TOUR BRUJAS (solo ES)
  {
    name: "Free Tour Brujas en Español",
    duration: "2 h 15 min",
    price: "Pago libre",
    tourLang: "es",
    url: "/es/tours/free-tour-brujas",
  },

  // ✅ TOUR ESPECIAL CHOCOLATE (solo ES)
  {
    name: "Tour de Chocolate y Cerveza en Bruselas",
    duration: "2 h 30 min",
    price: "39€ por persona",
    tourLang: "es",
    url: "/es/tours/tour-chocolate-cerveza-bruselas",
  },

  // ✅ PRIVADO BRUSELAS (ES / EN / IT / FR)
  {
    name: "Tour Privado Bruselas en Español",
    duration: "2 h 15 min",
    price: "120€ por grupo",
    tourLang: "es",
    url: "/es/tours/tour-privado-bruselas",
  },
  {
    name: "Private Tour Brussels in English",
    duration: "2 h 15 min",
    price: "120€ per group",
    tourLang: "en",
    url: "/en/tours/private-tour-brussels",
  },
  {
    name: "Tour Privato Bruxelles in Italiano",
    duration: "2 h 15 min",
    price: "120€ per gruppo",
    tourLang: "it",
    url: "/it/tours/tour-privato-bruxelles",
  },
  {
    name: "Tour Privé Bruxelles (Français)",
    duration: "2 h 15 min",
    price: "120€ par groupe",
    tourLang: "fr",
    url: "fr/tours/tour-prive-bruxelles",
  },

  // ✅ PRIVADO BRUJAS (solo ES)
  {
    name: "Tour Privado Brujas en Español",
    duration: "2 h 15 min",
    price: "120€ por grupo",
    tourLang: "es",
    url: "/es/tours/tour-privado-brujas",
  },
];

// ================================
// EXPORTS PÚBLICOS
// ================================

// 👉 USAR ESTE EN EL SearchBox DEL HOME
export const SEARCHBOX_TOURS: SearchboxTour[] = TOURS;

// 👉 Helper opcional para listados por idioma / futuro
export function getSearchboxTours(siteLang: SiteLang): SearchboxTour[] {
  // /pt/ muestra TODO
  if (siteLang === "pt") return TOURS;

  // otros idiomas: solo tours del mismo idioma
  return TOURS.filter((t) => t.tourLang === siteLang);
}
