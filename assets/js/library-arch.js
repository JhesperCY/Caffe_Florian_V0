// Pinned image mask reveal - seccion "Preparados con Pasion"
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP/ScrollTrigger not loaded - arch animation skipped");
    return;
  }

  const section = document.querySelector(".arch-section");
  if (!section) return;

  // Se registra aqui tambien por si Lenis no arranco
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");
  const leftItems = gsap.utils.toArray(".arch__left .arch__info");
  const wrappers = gsap.utils.toArray(".arch__right .img-wrapper");
  const imgs = gsap.utils.toArray(".arch__right .img-wrapper img");

  // Un color de fondo por producto: espresso, latte, cold brew, cheesecake
  const bgColors = ["#fbf7f1", "#f3e6d6", "#e4eef2", "#f8e4dc"];

  // Accesibilidad: con "reducir movimiento" activado
  // se mantiene la cortina, pero sin el desplazamiento parallax de las fotos
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Altura real del header sticky
  const altoHeader = () => (header ? header.offsetHeight : 0);
  const aplicarOffset = () => section.style.setProperty("--arch-offset", `${altoHeader()}px`);
  aplicarOffset();
  // Antes de cada recalculo (resize) se vuelve a medir el header
  ScrollTrigger.addEventListener("refreshInit", aplicarOffset);

  wrappers.forEach((el) => {
    el.style.zIndex = el.dataset.index;
  });

  const mm = gsap.matchMedia();

  // ESCRITORIO: pin + cortina con clip-path
  mm.add("(min-width: 768px)", () => {
    gsap.set(imgs, { clipPath: "inset(0% 0% 0% 0%)", objectPosition: "50% 0%" });

    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".arch",
        start: () => `top top+=${altoHeader()}`, // se fija debajo del navbar
        end: "bottom bottom",
        pin: ".arch__right",
        pinSpacing: false, // la columna izquierda ya aporta la altura de scroll
        scrub: true,
        invalidateOnRefresh: true
        // markers: true, // descomenta para ver start/end mientras pruebas
      }
    });

    imgs.forEach((currentImage, index) => {
      const nextImage = imgs[index + 1];
      if (!nextImage) return; // la ultima imagen no tiene a quien revelar

      const sectionTimeline = gsap.timeline()
        .to(section, { backgroundColor: bgColors[index + 1], duration: 1.5, ease: "power2.inOut" }, 0)
        .to(currentImage, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.5, ease: "none" }, 0);

      if (!reduceMotion) {
        sectionTimeline
          .to(currentImage, { objectPosition: "50% 60%", duration: 1.5, ease: "none" }, 0)
          .to(nextImage, { objectPosition: "50% 40%", duration: 1.5, ease: "none" }, 0);
      }

      mainTimeline.add(sectionTimeline); // se encadenan una tras otra
    });
  });

  // MOVIL: intercalar texto/imagen + parallax suave
  mm.add("(max-width: 767.98px)", () => {
    leftItems.forEach((item, i) => (item.style.order = i * 2));     // 0, 2, 4, 6
    wrappers.forEach((item, i) => (item.style.order = i * 2 + 1));  // 1, 3, 5, 7

    imgs.forEach((img) => {
      if (reduceMotion) return; // sin parallax
      gsap.fromTo(img,
        { objectPosition: "50% 70%" },
        {
          objectPosition: "50% 30%",
          ease: "none",
          scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true }
        }
      );
    });

    // Un solo timeline para el fondo: los colores van en secuencia, sin pisarse
    const bgTimeline = gsap.timeline({
      scrollTrigger: { trigger: ".arch", start: "top center", end: "bottom center", scrub: true }
    });
    bgColors.slice(1).forEach((color) => {
      bgTimeline.to(section, { backgroundColor: color, ease: "none" });
    });

    // Limpieza al volver a escritorio: GSAP revierte sus animaciones solo,
    // pero el "order" lo pusimos nosotros a mano, asi que lo quitamos aqui
    return () => {
      [...leftItems, ...wrappers].forEach((item) => (item.style.order = ""));
    };
  });

  // el carrusel cambia de altura en "load" (library-carrusel.js); al moverse
  // el contenido de arriba, ScrollTrigger debe recalcular sus posiciones
  window.addEventListener("load", () => ScrollTrigger.refresh());
});