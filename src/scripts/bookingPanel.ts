// src/scripts/bookingPanel.ts
// Controla abrir/cerrar el booking panel + overlay + swipe-down (mobile)
// Diseñado para no romper SSR: solo corre en navegador y si existen elementos.

function initBookingPanel() {
  const overlay = document.getElementById("bookingOverlay");
  const panel = document.getElementById("bookingPanel");
  const openBtns = document.querySelectorAll<HTMLButtonElement>(
    ".openBookingBtn, .openPrivateRequestBtn"
  );
  const closeBtns = document.querySelectorAll<HTMLButtonElement>(".closeBookingBtn");

    // Si no estamos en una página con booking panel, no hacemos nada.
  if (!overlay || !panel || openBtns.length === 0) return;

  // Aliases NO-null para TS (y para evitar dudas)
  const overlayEl = overlay as HTMLElement;
  const panelEl = panel as HTMLElement;

  let isOpen = false;

  function openPanel() {
    if (isOpen) return;
    isOpen = true;

    overlayEl.classList.remove("hidden");
    requestAnimationFrame(() => overlayEl.classList.add("open"));

    panelEl.classList.add("open", "bounce");
    document.body.classList.add("no-scroll");

    openBtns.forEach((b) => b.setAttribute("aria-expanded", "true"));
    setTimeout(() => panelEl.classList.remove("bounce"), 320);
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;

    overlayEl.classList.remove("open");
    panelEl.classList.remove("open");
    document.body.classList.remove("no-scroll");

    openBtns.forEach((b) => b.setAttribute("aria-expanded", "false"));

    setTimeout(() => {
      if (!isOpen) overlayEl.classList.add("hidden");
    }, 300);
  }

  // Click open
  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openPanel();
    });
  });

  // Click close
  closeBtns.forEach((btn) => btn.addEventListener("click", closePanel));
  overlayEl.addEventListener("click", closePanel);

  // Swipe-down close (mobile)
  const grabber = panelEl.querySelector<HTMLElement>(".panel-grabber");
  const content = panelEl.querySelector<HTMLElement>(".panel-content");

  if (!grabber || !content) return;

  let startY = 0;
  let currentY = 0;
  let dragging = false;

  const startDrag = (clientY: number) => {
    dragging = true;
    startY = clientY;
    currentY = 0;
    panelEl.style.transition = "none";
  };

  const moveDrag = (clientY: number) => {
    if (!dragging) return;
    const delta = clientY - startY;
    if (delta < 0) return;

    currentY = Math.min(delta, window.innerHeight);
    panelEl.style.transform = `translateY(${currentY}px)`;

    // efecto overlay suave
    const opacity = Math.max(0, 1 - currentY / 300) * 0.35;
    overlayEl.style.opacity = String(opacity);
  };

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;

    panelEl.style.transition = "transform 300ms cubic-bezier(.2,.8,.2,1)";

    if (currentY > 80) {
      closePanel();
      setTimeout(() => {
        panelEl.style.transform = "";
      }, 310);
    } else {
      panelEl.classList.add("bounce");
      panelEl.style.transform = "translateY(0)";
      setTimeout(() => panelEl.classList.remove("bounce"), 320);
      overlayEl.style.opacity = "";
    }
  };

  // Touch
  grabber.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      startDrag(touch.clientY);
    },
    { passive: true }
  );

  grabber.addEventListener(
    "touchmove",
    (e) => {
      const touch = e.touches[0];
      moveDrag(touch.clientY);
      e.preventDefault();
    },
    { passive: false }
  );

  grabber.addEventListener("touchend", endDrag);

  // Mouse (desktop drag, opcional)
  grabber.addEventListener("mousedown", (e) => {
    startDrag((e as MouseEvent).clientY);
  });

  window.addEventListener("mousemove", (e) => {
    moveDrag((e as MouseEvent).clientY);
  });

  window.addEventListener("mouseup", endDrag);
}

// Inicialización robusta (sin depender de timing)
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBookingPanel);
  } else {
    initBookingPanel();
  }
}