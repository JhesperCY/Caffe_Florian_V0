(() => {
  // Si Lenis no cargo, la pagina sigue con el scroll nativo
  if (typeof Lenis === "undefined") {
    console.warn("Lenis not loaded - smooth scroll skipped");
    return;
  }

  // Accesibilidad: respetar "reducir movimiento" del sistema operativo
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const header = document.querySelector("header");

  // ScrollTrigger solo existe en index.html; en las otras paginas Lenis sigue como antes
  const hayScrollTrigger = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  const lenis = new Lenis({
    lerp: 0.07,
    autoRaf: !hayScrollTrigger, // si hay ScrollTrigger, el reloj lo pone GSAP
    anchors: {
      offset: header ? -header.offsetHeight : 0
    }
  });

  if (hayScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on("scroll", ScrollTrigger.update);          // Lenis avisa a ScrollTrigger
    gsap.ticker.add((time) => lenis.raf(time * 1000));  // un solo reloj: el de GSAP
    gsap.ticker.lagSmoothing(0);
  }

  // Pausar el scroll de la pagina mientras haya un carrito (offcanvas) o un modal abierto.
  // Los eventos de Bootstrap burbujean hasta document, asi cubrimos todos los modales.
  ["show.bs.offcanvas", "show.bs.modal"].forEach(evento => {
    document.addEventListener(evento, () => lenis.stop());
  });
  ["hidden.bs.offcanvas", "hidden.bs.modal"].forEach(evento => {
    document.addEventListener(evento, () => lenis.start());
  });
})();
