
 
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";



 
 if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    
    console.log("🚀 Inicializando BookingForm 2030...");

    const root = document.getElementById("bookingForm");
// 📱 Inicializar teléfono internacional
const phoneInput = document.getElementById("customerPhone") as HTMLInputElement | null;

let iti: ReturnType<typeof intlTelInput> | null = null;

if (phoneInput) {
  iti = intlTelInput(phoneInput, {
    initialCountry: "auto",
    separateDialCode: true,
    autoPlaceholder: "polite",
    geoIpLookup: (callback: (countryCode: string) => void) => {
      fetch("https://ipapi.co/json")
        .then((res) => res.json())
        .then((data) => callback(data.country_code))
        .catch(() => callback("es"));
    }
  } as any);

  phoneInput.addEventListener("blur", () => {
    const errorEl = document.getElementById("phoneError");

    if (iti && !iti.isValidNumber()) {
      errorEl?.classList.remove("hidden");
      phoneInput.classList.add("border-red-500", "ring-2", "ring-red-200");
    } else {
      errorEl?.classList.add("hidden");
      phoneInput.classList.remove("border-red-500", "ring-2", "ring-red-200");
    }
  });
}

if (!root) return;

const bookingRoot = root;


// Helpers tipados
function getInput(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null;
}

function getSelect(id: string): HTMLSelectElement | null {
  return document.getElementById(id) as HTMLSelectElement | null;
}

function getButton(id: string): HTMLButtonElement | null {
  return document.getElementById(id) as HTMLButtonElement | null;
}


// 🌍 Idioma y API
const lang =
  bookingRoot.dataset.lang ||
  document.documentElement.getAttribute("lang") ||
  "es";

const apiBase =
  bookingRoot.dataset.api || "http://localhost:1337/api";


// Steps
const steps = [
  document.getElementById("step1"),
  document.getElementById("step2"),
  document.getElementById("step3"),
];

const successView = document.getElementById("bookingSuccess");
const navBar = document.getElementById("bookingNav");

const prevBtn = getButton("prevStep");
const nextBtn = getButton("nextStep");
const confirmBtn = getButton("confirmBooking");
const newBookingBtn = document.getElementById("newBooking");
const terms = document.getElementById("agreeToTerms");

const emailInput = getInput("customerEmail");
const emailConfirmInput = getInput("customerEmailConfirm");
const emailMismatch = document.getElementById("emailMismatch");

const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");
const summaryParticipants = document.getElementById("summaryParticipants");

let currentStep = 1;
let isSubmitting = false;


// Tracking UTM
const urlParams = new URLSearchParams(window.location.search);

const tracking: Record<string, string | undefined> = {
  utm_source: urlParams.get("utm_source") || undefined,
  utm_medium: urlParams.get("utm_medium") || undefined,
  utm_campaign: urlParams.get("utm_campaign") || undefined,
  utm_content: urlParams.get("utm_content") || undefined,
  gclid: urlParams.get("gclid") || undefined,
  referrer: document.referrer || undefined,
};


// 🔐 Inicializar bookingState seguro
window.bookingState = window.bookingState || {};

if (!window.bookingState.participants) {
  window.bookingState.participants = {
    adults: 1,
    children: 0,
  };
}

window.bookingState.tracking = tracking;

// 🔥 Limpiar errores visuales al escribir (solo una vez)
bookingRoot.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("border-red-500", "ring-2", "ring-red-200");
  });
});

    function showStep(stepNumber: number) {
  steps.forEach((s, i) => {
    if (!s) return;
    const idx = i + 1;

    if (idx === stepNumber) {
      s.classList.remove("hidden");
      s.classList.add("active");
    } else {
      s.classList.remove("active");
      s.classList.add("hidden");
    }
  });

  if (successView) successView.classList.add("hidden");

  currentStep = stepNumber;
  updateNavigation();

  if (stepNumber === 3) {
    updateSummary();
  }

  // ✅ Solo hacer scroll cuando NO es el paso inicial
  if (stepNumber !== 1) {
    bookingRoot.scrollIntoView({
  behavior: "smooth",
  block: "start",
});
  }
}

    function showSuccess() {
      steps.forEach((s) => {
        if (!s) return;
        s.classList.remove("active");
        s.classList.add("hidden");
      });
      if (navBar) navBar.classList.add("hidden");
      if (successView) successView.classList.remove("hidden");
    }

    function markFieldError(element: HTMLElement | null) {
  if (!element) return;

  element.classList.add("border-red-500", "ring-2", "ring-red-200");

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  element.focus();

  element.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(0)" },
    ],
    {
      duration: 250,
    }
  );
}

 
function validateStep1(showUI = false) {
  window.bookingState = window.bookingState || {};
  window.bookingState.participants =
    window.bookingState.participants || {
      adults: 1,
      children: 0,
    };

  const state = window.bookingState;

  const hasDate = !!state.selectedDate;
  const hasTime = !!state.selectedTime;

  const adults = Number(state.participants?.adults ?? 1);
  const hasParticipants = adults >= 1;

  const ok =
  hasDate &&
  hasTime &&
  hasParticipants &&
  typeof state.horarioId === "number";

  if (!ok && showUI) {
    if (!hasDate) {
      const calendar = document.querySelector(".calendar-2026") as HTMLElement | null;
      markFieldError(calendar);
      return false;
    }

    if (!hasTime) {
      const timeBlock = document.querySelector(".time-slot") as HTMLElement | null;
      markFieldError(timeBlock);
      return false;
    }

    if (!hasParticipants) {
      const counter = document.querySelector(".participant-counter") as HTMLElement | null;
      markFieldError(counter);
      return false;
    }
  }

  return ok;
}

 // 🔥 URGENCIA INTELIGENTE
function updateUrgency() {
  const state = window.bookingState || {};
  const urgencyBox = document.getElementById("urgencyBox");
  const urgencyText = document.getElementById("urgencyText");

  if (!urgencyBox || !urgencyText) return;
  if (!state.horarioId) {
    urgencyBox.classList.add("hidden");
    return;
  }

  // Aquí puedes conectar luego con cupos reales desde Strapi
  const remainingSpots = Math.floor(Math.random() * 6); // demo 0–5

  if (remainingSpots > 0 && remainingSpots <= 5) {
    urgencyText.textContent =
      lang === "es"
        ? `⚠️ Últimas ${remainingSpots} plazas disponibles para este horario`
        : lang === "en"
        ? `⚠️ Only ${remainingSpots} spots left for this time`
        : lang === "it"
        ? `⚠️ Ultimi ${remainingSpots} posti disponibili`
        : `⚠️ Dernières ${remainingSpots} places disponibles`;

    urgencyBox.classList.remove("hidden");
  } else {
    urgencyBox.classList.add("hidden");
  }
}



    function validateStep2(showUI = false) {
  const requiredFields = [
    "firstName",
    "lastName",
    "customerCity",
    "customerCountry",
    "customerPhone",
    "customerEmail",
    "customerEmailConfirm",
  ];

  
  for (const id of requiredFields) {
  const el = document.getElementById(id) as
    | HTMLInputElement
    | HTMLSelectElement
    | null;

  if (!el || !el.value.trim()) {
    if (showUI) markFieldError(el);
    return false;
  }
}

  const email = emailInput?.value.trim();
  if (iti && !iti.isValidNumber()) {
  if (showUI) markFieldError(phoneInput);
  return false;
}
  const emailConfirm = emailConfirmInput?.value.trim();

  if (email !== emailConfirm) {
    if (emailMismatch) emailMismatch.classList.remove("hidden");
    if (showUI) markFieldError(emailConfirmInput);
    return false;
  }

  if (emailMismatch) emailMismatch.classList.add("hidden");

  return true;
}

    function validateStep3(showUI = false) {
  const checked = (terms as HTMLInputElement | null)?.checked ?? false;

  if (!checked && showUI) {
    markFieldError(terms);
  }

  return checked;
}

    function updateNavigation() {
      if (!prevBtn || !nextBtn) return;

      prevBtn.disabled = currentStep === 1;
      nextBtn.disabled = false;

      if (currentStep === 1) {
        nextBtn.disabled = !validateStep1(false);
      } else if (currentStep === 2) {
        nextBtn.disabled = !validateStep2(false);
      }

      if (currentStep === 3) {
        nextBtn.classList.add("hidden");
        if (confirmBtn) {
          confirmBtn.disabled = !validateStep3(false) || isSubmitting;
        }
      } else {
        nextBtn.classList.remove("hidden");
        if (confirmBtn) {
               confirmBtn.disabled = true;
              }
      }
    }

    // 🔥 Exponer función global correctamente
(window as any).updateBookingNavigation = updateNavigation;

    // 👇 AGREGA ESTO
      

    function updateSummary() {
      const localeMap = {
        es: "es-ES",
        en: "en-GB",
        it: "it-IT",
        fr: "fr-FR",
      };
      const locale = localeMap[lang as keyof typeof localeMap] || "es-ES";

      const state = window.bookingState || {};
      if (summaryDate && state.selectedDate) {
        const date = new Date(state.selectedDate);
        summaryDate.textContent = date.toLocaleDateString(locale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
      if (summaryTime && state.selectedTime) {
        summaryTime.textContent = state.selectedTime;
      }
      if (summaryParticipants && state.participants) {
        summaryParticipants.textContent = `${state.participants.adults} adultos, ${state.participants.children} niños`;
      }

         const step2SummaryDate = document.getElementById("step2SummaryDate");
         const step2SummaryTime = document.getElementById("step2SummaryTime");
         const step2SummaryParticipants = document.getElementById("step2SummaryParticipants");

         if (step2SummaryDate && state.selectedDate) {
         const date = new Date(state.selectedDate);
         step2SummaryDate.textContent = date.toLocaleDateString(locale);
        }

        if (step2SummaryTime && state.selectedTime) {
        step2SummaryTime.textContent = state.selectedTime;
        }

        if (step2SummaryParticipants && state.participants) {
        step2SummaryParticipants.textContent =
        `${state.participants.adults + state.participants.children}`;
       }
       }

    window.addEventListener("dateSelected", () => {
      updateNavigation();
      setTimeout(updateNavigation, 150);
    });

    window.addEventListener("timeSelected", () => {
      updateNavigation();
      updateUrgency();   // 🔥 activar urgencia cuando se selecciona horario
    });

    document.addEventListener("participantsUpdated", () => {
      updateNavigation();
    });

    // 🔥 Activar navegación dinámica en Step 2
const step2Inputs = bookingRoot.querySelectorAll(
  "#step2 input, #step2 select, #step2 textarea"
);

step2Inputs.forEach((input) => {
  input.addEventListener("input", () => {
    updateNavigation();
  });

  input.addEventListener("change", () => {
    updateNavigation();
  });
});

    emailInput?.addEventListener("input", () => validateStep2(false));
    emailConfirmInput?.addEventListener("input", () => {
      validateStep2(false);
      updateNavigation();
    });

    terms?.addEventListener("change", () => {
      if (currentStep === 3 && confirmBtn) {
        confirmBtn.disabled = !validateStep3(false) || isSubmitting;
      }
    });

    prevBtn?.addEventListener("click", () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });

    nextBtn?.addEventListener("click", async () => {
      if (currentStep === 1) {
        if (!validateStep1(true)) return;
        showStep(2);
        return;
      }
      if (currentStep === 2) {
        if (!validateStep2(true)) return;
        showStep(3);
        return;
      }
    });

    newBookingBtn?.addEventListener("click", () => {
      window.location.reload();
    });

    confirmBtn?.addEventListener("click", submitBooking);

    function setConfirmButtonTextDefault() {
      if (!confirmBtn) return;
      if (lang === "es")
        confirmBtn.textContent = "✅ Confirmar reserva gratis";
      else if (lang === "en")
        confirmBtn.textContent = "✅ Confirm free booking";
      else if (lang === "it")
        confirmBtn.textContent =
          "✅ Conferma la prenotazione gratuita";
      else if (lang === "fr")
        confirmBtn.textContent =
          "✅ Confirmer la réservation gratuite";
      else confirmBtn.textContent = "✅ Confirm booking";
    }

    async function submitBooking() {
      if (isSubmitting) return;
      if (!validateStep3(true)) return;

      const state = window.bookingState || {};
      const horarioId = state.horarioId;
      if (!horarioId) {
        alert(
          "Ha ocurrido un problema con el horario seleccionado. Vuelve al paso 1 y elige de nuevo."
        );

        showStep(1);
        return;
      }

const firstName = getInput("firstName")?.value.trim();
const lastName = getInput("lastName")?.value.trim();
const city = getInput("customerCity")?.value.trim();
const country = getInput("customerCountry")?.value.trim();

const phone = getInput("customerPhone")?.value.trim();
const email = getInput("customerEmail")?.value.trim();
const emailConfirm = getInput("customerEmailConfirm")?.value.trim();
const comments = getInput("customerComments")?.value.trim() || "";
const howHeard = getSelect("howHeard")?.value || "";
const marketingConsent = getInput("marketingConsent")?.checked || false;
      const adultos = Number(state.participants?.adults || 1);
      const ninos = Number(state.participants?.children || 0);

      if (
        !firstName ||
        !lastName ||
        !city ||
        !country ||
    
        !phone ||
        !email ||
        !emailConfirm
      ) {
        alert(
          "Faltan datos obligatorios. Vuelve al paso anterior."
        );
        showStep(2);
        return;
      }

      if (email !== emailConfirm) {
        alert("Los correos no coinciden.");
        showStep(2);
        return;
      }

      isSubmitting = true;
      if (confirmBtn) {
        if (confirmBtn) {
             confirmBtn.disabled = true;
               }
        confirmBtn.textContent = "⏳ Procesando...";
      }

      try {
        // 1️⃣ PAYLOAD para /reservas/confirmar (Strapi v5)
        const confirmarPayload = {
          horarioId,
          nombre: firstName,
          apellidos: lastName,
          email,
          telefono: iti ? iti.getNumber() : phone,
          ciudad: city,
          pais: country,
          adultos,
          ninos,
          idioma_cliente: lang,
          comentarios_cliente: comments || undefined,
          como_nos_conociste: howHeard || undefined,
          marketing_consent: marketingConsent,
          ...tracking,
        };

        // 2️⃣ Llamar a /reservas/confirmar
        const resConfirm = await fetch(
          `${apiBase}/reservas/confirmar`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(confirmarPayload),
          }
        );

        if (!resConfirm.ok) {
          const errJson = await resConfirm
            .json()
            .catch(() => ({}));
          console.error("❌ Error en /reservas/confirmar:", errJson);

          const msg =
            errJson?.error?.message ||
            errJson?.message ||
            `Error ${resConfirm.status}`;

          alert(
            lang === "es"
              ? `No se pudo confirmar la reserva: ${msg}`
              : `Could not confirm booking: ${msg}`
          );

          isSubmitting = false;
          if (confirmBtn) {
            confirmBtn.disabled = !validateStep3(false);
            setConfirmButtonTextDefault();
          }
          return;
        }

        const dataConfirm = await resConfirm.json().catch(() => ({}));
        console.log("✅ Respuesta confirmar:", dataConfirm);

        const confirmarToken =
          dataConfirm?.confirmarToken ||
          dataConfirm?.token ||
          dataConfirm?.checkoutToken;

        if (!confirmarToken) {
          console.error(
            "❌ No se obtuvo confirmarToken en la respuesta:",
            dataConfirm
          );
          alert(
            lang === "es"
              ? "Error interno: no se pudo generar el token de confirmación."
              : "Internal error: could not generate confirmation token."
          );
          isSubmitting = false;
          if (confirmBtn) {
            confirmBtn.disabled = !validateStep3(false);
            setConfirmButtonTextDefault();
          }
          return;
        }

        // 3️⃣ Llamar a /reservas/finalizar con el token
        const resFinal = await fetch(`${apiBase}/reservas/finalizar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: confirmarToken }),
        });

        if (!resFinal.ok) {
          const errJson = await resFinal.json().catch(() => ({}));
          console.error("❌ Error en /reservas/finalizar:", errJson);

          const msg =
            errJson?.error?.message ||
            errJson?.message ||
            `Error ${resFinal.status}`;

          alert(
            lang === "es"
              ? `No se pudo finalizar la reserva: ${msg}`
              : `Could not complete booking: ${msg}`
          );

          isSubmitting = false;
          if (confirmBtn) {
            confirmBtn.disabled = !validateStep3(false);
            setConfirmButtonTextDefault();
          }
          return;
        }

        const dataFinal = await resFinal.json().catch(() => ({}));
        console.log("🎉 Reserva finalizada:", dataFinal);

        const reservaId =
          dataFinal?.reservaId ||
          dataFinal?.id ||
          dataFinal?.data?.id ||
          null;

        const safeLang = ["es", "en", "it", "fr"].includes(lang)
          ? lang
          : "es";

        if (reservaId) {
          // Redireccionamos a la página de éxito con el ID real
          window.location.href = `/${safeLang}/booking-success?id=${encodeURIComponent(
            reservaId
          )}`;
          return;
        }

        // Fallback: mostrar pantalla de éxito sin ID
        showSuccess();
        isSubmitting = false;
      } catch (e) {
        console.error("❌ Excepción en submitBooking:", e);
        alert(
          "❌ No se pudo completar la reserva. Revisa la API de Strapi (/reservas/confirmar y /reservas/finalizar) y los permisos de CORS/public."
        );
        isSubmitting = false;
        if (confirmBtn) {
          confirmBtn.disabled = !validateStep3(false);
          setConfirmButtonTextDefault();
        }
      }
    }

    // 🌍 AUTOCOMPLETE COUNTRY + CITY
function setupAutocomplete(
  inputId: string,
  suggestionId: string,
  type: "country" | "city"
) {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  const suggestionBox = document.getElementById(suggestionId);

  if (!input || !suggestionBox) return;

  let debounceTimeout: ReturnType<typeof setTimeout>;

  input.addEventListener("input", () => {
    const query = input.value.trim();
    suggestionBox.innerHTML = "";
    suggestionBox.classList.add("hidden");

    if (query.length < 2) return;

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {
      try {
        const url =
          type === "country"
            ? `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
            : `https://nominatim.openstreetmap.org/search?format=json&limit=5&city=${encodeURIComponent(query)}`;

        const res = await fetch(url, {
          headers: { "Accept-Language": lang },
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!Array.isArray(data)) return;

        data.forEach((item) => {
          const option = document.createElement("div");
          option.className = "px-3 py-2 cursor-pointer hover:bg-gray-100 transition";
          option.textContent = item.display_name.split(",")[0];

          option.addEventListener("click", () => {
            input.value = option.textContent || "";
            suggestionBox.classList.add("hidden");
            updateNavigation();
          });

          suggestionBox.appendChild(option);
        });

        if (data.length > 0) {
          suggestionBox.classList.remove("hidden");
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 300);
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target as Node)) {
      suggestionBox.classList.add("hidden");
    }
  });
}

// Inicializar autocomplete
setupAutocomplete("customerCountry", "countrySuggestions", "country");
setupAutocomplete("customerCity", "citySuggestions", "city");

   
  showStep(1);
  updateNavigation();
  });
}
// 🔥 Exponer función global inmediatamente
