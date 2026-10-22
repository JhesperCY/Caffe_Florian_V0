document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded - nav animation skipped");
    return;
  }

  gsap.from(".nav-link", {
    y: -30,
    opacity: 0,
    ease: "power3.out",
    duration: 0.8,
    stagger: 0.1,
    delay: 0.2
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
      gsap.to(link, { scale: 1.05, duration: 0.2, ease: "power2.out" });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(link, { scale: 1, duration: 0.2, ease: "power2.out" });
    });
    link.addEventListener("mousedown", () => {
      gsap.to(link, { scale: 0.95, duration: 0.1, ease: "power2.in" });
    });
    link.addEventListener("mouseup", () => {
      gsap.to(link, { scale: 1.05, duration: 0.1, ease: "power2.out" });
    });
  });

  gsap.from(".navbar-brand", {
    y: -30,
    opacity: 0,
    ease: "power3.out",
    duration: 0.8,
    stagger: 0.1,
    delay: 0.2
  })

  const navbarBrand = document.querySelector(".navbar-brand");
  if (navbarBrand) {
    navbarBrand.addEventListener("mouseenter", () => {
      gsap.to(navbarBrand, { scale: 1.05, duration: 0.2, ease: "power3.out" });
    });
    navbarBrand.addEventListener("mouseleave", () => {
      gsap.to(navbarBrand, { scale: 1, duration: 0.2, ease: "power3.out" });
    });
    navbarBrand.addEventListener("mousedown", () => {
      gsap.to(navbarBrand, { scale: 0.95, duration: 0.1, ease: "power3.in" });
    });
    navbarBrand.addEventListener("mouseup", () => {
      gsap.to(navbarBrand, { scale: 1.05, duration: 0.1, ease: "power3.out" });
    });
  }

  gsap.from(".btn-dark", {
    y: -30,
    opacity: 0,
    ease: "power3.out",
    duration: 0.8,
    stagger: 0.1,
    delay: 0.2
  });

  const hamburger = document.querySelector(".hamburger");
  const topLine = document.querySelector(".hamburger-line.top");
  const midLine = document.querySelector(".hamburger-line.mid");
  const bottomLine = document.querySelector(".hamburger-line.bottom");

  let isOpen = false;

  if (hamburger && topLine && midLine && bottomLine) {
    const animateHamburger = (open) => {
      if (open) {
        gsap.to(topLine, {
          rotation: 45,
          y: 8.5,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(bottomLine, {
          rotation: -45,
          y: -8.5,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(midLine, { opacity: 0, duration: 0.2 });
      } else {
        gsap.to(topLine, {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(bottomLine, {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power3.out"
        });
        gsap.to(midLine, { opacity: 1, duration: 0.2, delay: 0.1 });
      }
    };

    hamburger.addEventListener("click", () => {
      isOpen = !isOpen;
      animateHamburger(isOpen);
    });

    const navbarCollapse = document.querySelector("#navbarNav");
    if (navbarCollapse) {
      navbarCollapse.addEventListener("hidden.bs.collapse", () => {
        isOpen = false;
        animateHamburger(false);
      });
      navbarCollapse.addEventListener("shown.bs.collapse", () => {
        isOpen = true;
        animateHamburger(true);
      });
    }
  }
});